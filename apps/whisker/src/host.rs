use std::sync::OnceLock;
use std::time::Instant;

static CLOCK_ORIGIN: OnceLock<Instant> = OnceLock::new();

pub fn now() -> f64 {
    CLOCK_ORIGIN.get_or_init(Instant::now).elapsed().as_secs_f64() * 1000.0
}

pub struct Launch {
    pub url: Option<String>,
    pub inset_top_dp: f32,
    pub inset_bottom_dp: f32,
    pub screen_width_dp: Option<f32>,
}

#[cfg(target_os = "android")]
mod android {
    use std::ffi::{CStr, CString, c_char, c_int, c_void};
    use std::ptr::{null, null_mut};

    use jni_sys::{JNI_OK, JNI_VERSION_1_6, JNIEnv, JavaVM, jobject, jsize};

    use super::Launch;

    #[link(name = "log")]
    unsafe extern "C" {
        fn __android_log_write(prio: c_int, tag: *const c_char, text: *const c_char) -> c_int;
    }

    unsafe extern "C" {
        fn __system_property_get(name: *const c_char, value: *mut c_char) -> c_int;
        fn dlopen(filename: *const c_char, flag: c_int) -> *mut c_void;
        fn dlsym(handle: *mut c_void, symbol: *const c_char) -> *mut c_void;
    }

    const ANDROID_LOG_INFO: c_int = 4;
    const RTLD_NOW: c_int = 2;
    const LOCAL_FRAME_CAPACITY: i32 = 32;

    pub fn log(line: &str) {
        let text = CString::new(line.replace('\0', " ")).unwrap_or_default();
        unsafe { __android_log_write(ANDROID_LOG_INFO, c"xplatbench".as_ptr(), text.as_ptr()) };
    }

    fn system_property(name: &CStr) -> String {
        let mut value = [0 as c_char; 92];
        unsafe { __system_property_get(name.as_ptr(), value.as_mut_ptr()) };
        unsafe { CStr::from_ptr(value.as_ptr()) }.to_string_lossy().into_owned()
    }

    pub fn os_version() -> String {
        system_property(c"ro.build.version.release")
    }

    pub fn device_model() -> String {
        format!("{} {}", system_property(c"ro.product.manufacturer"), system_property(c"ro.product.model"))
    }

    type GetCreatedJavaVms = unsafe extern "system" fn(*mut *mut JavaVM, jsize, *mut jsize) -> i32;

    struct Jni(*mut JNIEnv);

    impl Jni {
        // Whisker keeps its JavaVM private, so it is looked up through libnativehelper (exported from API 31).
        unsafe fn for_attached_thread() -> Result<Jni, String> {
            let lib = unsafe { dlopen(c"libnativehelper.so".as_ptr(), RTLD_NOW) };
            let sym = if lib.is_null() { null_mut() } else { unsafe { dlsym(lib, c"JNI_GetCreatedJavaVMs".as_ptr()) } };
            if sym.is_null() {
                return Err("JNI_GetCreatedJavaVMs unavailable (needs Android 12+)".into());
            }
            let get_vms: GetCreatedJavaVms = unsafe { std::mem::transmute(sym) };
            let (mut vm, mut count): (*mut JavaVM, jsize) = (null_mut(), 0);
            if unsafe { get_vms(&mut vm, 1, &mut count) } != JNI_OK || count < 1 {
                return Err("no JavaVM".into());
            }
            let mut env: *mut c_void = null_mut();
            if unsafe { ((**vm).GetEnv.unwrap())(vm, &mut env, JNI_VERSION_1_6) } != JNI_OK {
                return Err("thread is not attached to the JavaVM".into());
            }
            Ok(Jni(env.cast()))
        }

        unsafe fn checked<T>(&self, what: &CStr, value: T) -> Result<T, String> {
            let f = unsafe { &**self.0 };
            if unsafe { (f.ExceptionCheck.unwrap())(self.0) } != 0 {
                unsafe { (f.ExceptionClear.unwrap())(self.0) };
                return Err(format!("JNI {what:?} threw"));
            }
            Ok(value)
        }

        unsafe fn method(&self, obj: jobject, name: &CStr, sig: &CStr) -> Result<jni_sys::jmethodID, String> {
            let f = unsafe { &**self.0 };
            let class = unsafe { (f.GetObjectClass.unwrap())(self.0, obj) };
            let id = unsafe { (f.GetMethodID.unwrap())(self.0, class, name.as_ptr(), sig.as_ptr()) };
            unsafe { self.checked(name, id) }
        }

        unsafe fn object(&self, obj: jobject, name: &CStr, sig: &CStr) -> Result<jobject, String> {
            if obj.is_null() {
                return Err(format!("JNI {name:?} on null"));
            }
            let id = unsafe { self.method(obj, name, sig)? };
            let value = unsafe { ((**self.0).CallObjectMethodA.unwrap())(self.0, obj, id, null()) };
            unsafe { self.checked(name, value) }
        }

        unsafe fn int(&self, obj: jobject, name: &CStr) -> Result<i32, String> {
            let id = unsafe { self.method(obj, name, c"()I")? };
            let value = unsafe { ((**self.0).CallIntMethodA.unwrap())(self.0, obj, id, null()) };
            unsafe { self.checked(name, value) }
        }

        unsafe fn float_field(&self, obj: jobject, name: &CStr) -> Result<f32, String> {
            let f = unsafe { &**self.0 };
            let class = unsafe { (f.GetObjectClass.unwrap())(self.0, obj) };
            let id = unsafe { (f.GetFieldID.unwrap())(self.0, class, name.as_ptr(), c"F".as_ptr()) };
            let id = unsafe { self.checked(name, id)? };
            Ok(unsafe { (f.GetFloatField.unwrap())(self.0, obj, id) })
        }

        unsafe fn int_field(&self, obj: jobject, name: &CStr) -> Result<i32, String> {
            let f = unsafe { &**self.0 };
            let class = unsafe { (f.GetObjectClass.unwrap())(self.0, obj) };
            let id = unsafe { (f.GetFieldID.unwrap())(self.0, class, name.as_ptr(), c"I".as_ptr()) };
            let id = unsafe { self.checked(name, id)? };
            Ok(unsafe { (f.GetIntField.unwrap())(self.0, obj, id) })
        }

        unsafe fn string(&self, s: jobject) -> String {
            let f = unsafe { &**self.0 };
            let chars = unsafe { (f.GetStringUTFChars.unwrap())(self.0, s, null_mut()) };
            let out = unsafe { CStr::from_ptr(chars) }.to_string_lossy().into_owned();
            unsafe { (f.ReleaseStringUTFChars.unwrap())(self.0, s, chars) };
            out
        }
    }

    // The generated MainActivity hands the intent only to Kotlin deep-link listeners, so the
    // launch URL is read from the activity over JNI.
    pub fn launch_on_ui_thread() -> Result<Launch, String> {
        unsafe {
            let jni = Jni::for_attached_thread()?;
            let f = &**jni.0;
            if (f.PushLocalFrame.unwrap())(jni.0, LOCAL_FRAME_CAPACITY) != JNI_OK {
                return Err("JNI PushLocalFrame failed".into());
            }
            let launch = read_launch(&jni);
            (f.PopLocalFrame.unwrap())(jni.0, null_mut());
            launch
        }
    }

    unsafe fn read_launch(jni: &Jni) -> Result<Launch, String> {
        unsafe {
            let f = &**jni.0;
            let class = (f.FindClass.unwrap())(jni.0, c"rs/whisker/runtime/WhiskerAppContext".as_ptr());
            let class = jni.checked(c"WhiskerAppContext", class)?;
            let id = (f.GetStaticMethodID.unwrap())(jni.0, class, c"getShared".as_ptr(), c"()Lrs/whisker/runtime/WhiskerAppContext;".as_ptr());
            let id = jni.checked(c"getShared", id)?;
            let shared = (f.CallStaticObjectMethodA.unwrap())(jni.0, class, id, null());
            let activity = jni.object(shared, c"getCurrentActivity", c"()Landroid/app/Activity;")?;
            let intent = jni.object(activity, c"getIntent", c"()Landroid/content/Intent;")?;
            let data = jni.object(intent, c"getDataString", c"()Ljava/lang/String;")?;
            let url = (!data.is_null()).then(|| jni.string(data));
            let window = jni.object(activity, c"getWindow", c"()Landroid/view/Window;")?;
            let decor = jni.object(window, c"getDecorView", c"()Landroid/view/View;")?;
            let insets = jni.object(decor, c"getRootWindowInsets", c"()Landroid/view/WindowInsets;")?;
            let resources = jni.object(activity, c"getResources", c"()Landroid/content/res/Resources;")?;
            let metrics = jni.object(resources, c"getDisplayMetrics", c"()Landroid/util/DisplayMetrics;")?;
            let density = jni.float_field(metrics, c"density")?;
            let width = jni.int_field(metrics, c"widthPixels")?;
            let (top, bottom) = if insets.is_null() {
                (0, 0)
            } else {
                (jni.int(insets, c"getSystemWindowInsetTop")?, jni.int(insets, c"getSystemWindowInsetBottom")?)
            };
            Ok(Launch {
                url,
                inset_top_dp: top as f32 / density,
                inset_bottom_dp: bottom as f32 / density,
                screen_width_dp: Some(width as f32 / density),
            })
        }
    }
}

#[cfg(target_os = "android")]
pub use android::{device_model, launch_on_ui_thread, log, os_version};

#[cfg(not(target_os = "android"))]
pub fn log(line: &str) {
    println!("{line}");
}

#[cfg(not(target_os = "android"))]
pub fn launch_on_ui_thread() -> Result<Launch, String> {
    Ok(Launch { url: std::env::var("XPLATBENCH_URL").ok(), inset_top_dp: 0.0, inset_bottom_dp: 0.0, screen_width_dp: None })
}

#[cfg(not(target_os = "android"))]
pub fn os_version() -> String {
    std::env::consts::OS.to_string()
}

#[cfg(not(target_os = "android"))]
pub fn device_model() -> String {
    "host".to_string()
}

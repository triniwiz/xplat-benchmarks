plugins {
    id("com.android.application")
    id("kotlin-android")
    // The DartNative Gradle Plugin must be applied after the Android and Kotlin Gradle plugins.
    id("com.dartnative.gradle-plugin")
}

android {
    namespace = "org.xplatbench.xplatbench_dn"
    compileSdk = dartnative.compileSdkVersion
    ndkVersion = dartnative.ndkVersion

    compileOptions {
        sourceCompatibility = JavaVersion.VERSION_17
        targetCompatibility = JavaVersion.VERSION_17
        isCoreLibraryDesugaringEnabled = true
    }

    kotlinOptions {
        jvmTarget = JavaVersion.VERSION_17.toString()
    }

    defaultConfig {
        applicationId = "org.xplatbench.dartnative"
        minSdk = dartnative.minSdkVersion
        targetSdk = dartnative.targetSdkVersion
        versionCode = dartnative.versionCode
        versionName = dartnative.versionName
    }

    buildTypes {
        release {
            signingConfig = signingConfigs.getByName("debug")
        }
    }
}

dartnative {
    source = "../.."
}

dependencies {
    // dartnative MainActivity extends DartNativeActivity (AppCompat-based);
    // com.dartnative.* classes come transitively from the dartnative_android
    // dependency via the plugin auto-inclusion.
    coreLibraryDesugaring("com.android.tools:desugar_jdk_libs:2.1.4")
    implementation("androidx.appcompat:appcompat:1.6.1")
    implementation("androidx.core:core-ktx:1.12.0")
}

import UIKit
import dartnative_ios

@main
@objc class AppDelegate: DartNativeAppDelegate {
  override func application(
    _ application: UIApplication,
    didFinishLaunchingWithOptions launchOptions: [UIApplication.LaunchOptionsKey: Any]?
  ) -> Bool {
    var info = utsname()
    uname(&info)
    let model = withUnsafeBytes(of: &info.machine) { String(decoding: $0.prefix { $0 != 0 }, as: UTF8.self) }
    let url = ProcessInfo.processInfo.environment["XPLATBENCH_URL"] ?? ""
    let file = URL(fileURLWithPath: NSTemporaryDirectory()).appendingPathComponent("xplatbench-launch")
    try? "\(url)\n\(model)".write(to: file, atomically: true, encoding: .utf8)
    return super.application(application, didFinishLaunchingWithOptions: launchOptions)
  }
}

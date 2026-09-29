import UIKit

/**
 * One LynxView inside the safe area. The harness launches iOS apps with the
 * run/show URL in XPLATBENCH_URL (see harness/src/devices/ios.ts); it is
 * handed to the bundle as globalProps.launchUrl, like the Android host.
 */
class ViewController: UIViewController {
  private var lynxView: LynxView?

  override func viewDidLoad() {
    super.viewDidLoad()
    view.backgroundColor = UIColor(red: 0xF5 / 255, green: 0xF6 / 255, blue: 0xFA / 255, alpha: 1)
  }

  override func viewDidLayoutSubviews() {
    super.viewDidLayoutSubviews()
    guard lynxView == nil else { return }
    let frame = view.bounds.inset(by: view.safeAreaInsets)

    let lynxView = LynxView { builder in
      builder.config = LynxConfig(provider: BundleTemplateProvider())
      builder.screenSize = frame.size
      // Text in plain points, like every other app (ignore Dynamic Type).
      builder.fontScale = 1.0
    }
    lynxView.frame = frame
    lynxView.preferredLayoutWidth = frame.size.width
    lynxView.preferredLayoutHeight = frame.size.height
    lynxView.layoutWidthMode = .exact
    lynxView.layoutHeightMode = .exact
    view.addSubview(lynxView)
    self.lynxView = lynxView

    var machine = utsname()
    uname(&machine)
    let model = withUnsafeBytes(of: &machine.machine) { String(decoding: $0.prefix(while: { $0 != 0 }), as: UTF8.self) }
    // Global props go in with the load (updating them before a template has loaded has no effect).
    let meta = LynxLoadMeta()
    meta.url = "main.lynx"
    meta.globalProps = LynxTemplateData(dictionary: [
      "launchUrl": ProcessInfo.processInfo.environment["XPLATBENCH_URL"] ?? "",
      "lynxSdk": "4.1.0",
      "platform": "ios",
      "osVersion": UIDevice.current.systemVersion,
      "deviceModel": model,
    ])
    lynxView.loadTemplate(meta)
  }
}

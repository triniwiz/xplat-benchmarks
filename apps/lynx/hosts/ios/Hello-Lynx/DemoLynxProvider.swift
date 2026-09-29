import Foundation

/** Loads main.lynx.bundle from the app bundle (copied from apps/lynx/bundle/dist by `bench build`). */
class BundleTemplateProvider: NSObject, LynxTemplateProvider {
  func loadTemplate(withUrl url: String!, onComplete callback: LynxTemplateLoadBlock!) {
    guard let path = Bundle.main.path(forResource: url, ofType: "bundle") else {
      callback(nil, NSError(domain: "org.xplatbench.lynx", code: 404, userInfo: [NSLocalizedDescriptionKey: "\(url ?? "") not in bundle"]))
      return
    }
    do {
      callback(try Data(contentsOf: URL(fileURLWithPath: path)), nil)
    } catch {
      callback(nil, error)
    }
  }
}

import Foundation
import YooKassaPayments

@objc public class OnviYooKassaDeepLinkHandler: NSObject {
    @objc public static func handleOpen(url: URL, sourceApplication: String?) -> Bool {
        return YKSdk.shared.handleOpen(url: url, sourceApplication: sourceApplication)
    }
}

import Foundation
import Security

// This helper's stdout contains secret recovery material. Only invoke it from
// the harness, which captures stdout in memory and never forwards it to logs.
let query: [String: Any] = [
    kSecClass as String: kSecClassGenericPassword,
    kSecAttrService as String: "com.blockhead.ethonline2026.test-wallet-recovery",
    kSecAttrAccount as String: "ambire-0x87da912925adf173eaf333e309e9bfcd03ae0d9d",
    kSecReturnData as String: true,
    kSecMatchLimit as String: kSecMatchLimitOne,
    kSecUseAuthenticationUI as String: kSecUseAuthenticationUIFail
]
var result: CFTypeRef?
let status = SecItemCopyMatching(query as CFDictionary, &result)
guard status == errSecSuccess, let data = result as? Data else {
    FileHandle.standardError.write(Data("Keychain recovery unavailable (OSStatus \(status))\n".utf8))
    exit(1)
}
FileHandle.standardOutput.write(data)

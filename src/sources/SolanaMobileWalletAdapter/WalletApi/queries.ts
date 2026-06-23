import type { SourceBinding } from '$/sources/SourceBinding.ts'
import type { SolanaMobileWalletAdapterWalletRequest } from '$/sources/SolanaMobileWalletAdapter/WalletApi/types.ts'
import { walletProviderRequest } from '$/sources/_shared/wire/WalletProvider/client.ts'

export const walletRequest = (
	binding: SourceBinding,
	request: SolanaMobileWalletAdapterWalletRequest
) => (
	walletProviderRequest(binding, request)
)

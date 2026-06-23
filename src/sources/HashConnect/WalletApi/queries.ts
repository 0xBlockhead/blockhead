import type { SourceBinding } from '$/sources/SourceBinding.ts'
import type { HashConnectWalletRequest } from '$/sources/HashConnect/WalletApi/types.ts'
import { walletProviderRequest } from '$/sources/_shared/wire/WalletProvider/client.ts'

export const walletRequest = (
	binding: SourceBinding,
	request: HashConnectWalletRequest
) => (
	walletProviderRequest(binding, request)
)

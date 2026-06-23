import type { SourceBinding } from '$/sources/SourceBinding.ts'
import type { WalletConnectWalletRequest } from '$/sources/WalletConnect/WalletApi/types.ts'
import { walletProviderRequest } from '$/sources/_shared/wire/WalletProvider/client.ts'

export const walletRequest = (
	binding: SourceBinding,
	request: WalletConnectWalletRequest
) => (
	walletProviderRequest(binding, request)
)

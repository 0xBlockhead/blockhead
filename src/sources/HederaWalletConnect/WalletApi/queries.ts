import type { SourceBinding } from '$/sources/SourceBinding.ts'
import type { HederaWalletConnectWalletRequest } from '$/sources/HederaWalletConnect/WalletApi/types.ts'
import { walletProviderRequest } from '$/sources/_shared/wire/WalletProvider/client.ts'

export const walletRequest = (
	binding: SourceBinding,
	request: HederaWalletConnectWalletRequest
) => (
	walletProviderRequest(binding, request)
)

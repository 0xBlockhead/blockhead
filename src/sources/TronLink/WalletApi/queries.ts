import type { SourceBinding } from '$/sources/SourceBinding.ts'
import type { TronLinkWalletRequest } from '$/sources/TronLink/WalletApi/types.ts'
import { walletProviderRequest } from '$/sources/_shared/wire/WalletProvider/client.ts'

export const walletRequest = (
	binding: SourceBinding,
	request: TronLinkWalletRequest
) => (
	walletProviderRequest(binding, request)
)

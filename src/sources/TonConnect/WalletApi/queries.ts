import type { SourceBinding } from '$/sources/SourceBinding.ts'
import type { TonConnectWalletRequest } from '$/sources/TonConnect/WalletApi/types.ts'
import { walletProviderRequest } from '$/sources/_shared/wire/WalletProvider/client.ts'

export const walletRequest = (
	binding: SourceBinding,
	request: TonConnectWalletRequest
) => (
	walletProviderRequest(binding, request)
)

import type { SourceBinding } from '$/sources/SourceBinding.ts'
import type { NearConnectWalletRequest } from '$/sources/NearConnect/WalletApi/types.ts'
import { walletProviderRequest } from '$/sources/_shared/wire/WalletProvider/client.ts'

export const walletRequest = (
	binding: SourceBinding,
	request: NearConnectWalletRequest
) => (
	walletProviderRequest(binding, request)
)

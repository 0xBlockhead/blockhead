import type { SourceBinding } from '$/sources/SourceBinding.ts'
import type { FreighterWalletRequest } from '$/sources/Freighter/WalletApi/types.ts'
import { walletProviderRequest } from '$/sources/_shared/wire/WalletProvider/client.ts'

export const walletRequest = (
	binding: SourceBinding,
	request: FreighterWalletRequest
) => (
	walletProviderRequest(binding, request)
)

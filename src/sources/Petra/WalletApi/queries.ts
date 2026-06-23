import type { SourceBinding } from '$/sources/SourceBinding.ts'
import type { PetraWalletRequest } from '$/sources/Petra/WalletApi/types.ts'
import { walletProviderRequest } from '$/sources/_shared/wire/WalletProvider/client.ts'

export const walletRequest = (
	binding: SourceBinding,
	request: PetraWalletRequest
) => (
	walletProviderRequest(binding, request)
)

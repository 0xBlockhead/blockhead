import type { SourceBinding } from '$/sources/SourceBinding.ts'
import type { PontemWalletRequest } from '$/sources/Pontem/WalletApi/types.ts'
import { walletProviderRequest } from '$/sources/_shared/wire/WalletProvider/client.ts'

export const walletRequest = (
	binding: SourceBinding,
	request: PontemWalletRequest
) => (
	walletProviderRequest(binding, request)
)

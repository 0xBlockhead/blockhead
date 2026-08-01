import type { SourceBinding } from '$/sources/SourceBinding.ts'
import type { WalletProviderRequest } from '$/sources/_shared/wire/WalletProvider/types.ts'
import { walletProviderRequest } from '$/sources/_shared/wire/WalletProvider/client.ts'

export const walletRequest = (
	binding: SourceBinding,
	request: WalletProviderRequest
) => (
	walletProviderRequest(binding, request)
)

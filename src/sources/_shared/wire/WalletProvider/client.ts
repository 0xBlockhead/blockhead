import type { SourceBinding } from '$/sources/SourceBinding.ts'
import type { WalletProviderRequest } from '$/sources/_shared/wire/WalletProvider/types.ts'

export const walletProviderRequest = (
	binding: SourceBinding,
	request: WalletProviderRequest
) => ({
	binding,
	request,
})

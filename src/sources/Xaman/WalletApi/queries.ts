import type { SourceBinding } from '$/sources/SourceBinding.ts'
import type { XamanWalletRequest } from '$/sources/Xaman/WalletApi/types.ts'
import { walletProviderRequest } from '$/sources/_shared/wire/WalletProvider/client.ts'

export const walletRequest = (
	binding: SourceBinding,
	request: XamanWalletRequest
) => (
	walletProviderRequest(binding, request)
)

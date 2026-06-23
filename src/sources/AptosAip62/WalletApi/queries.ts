import type { SourceBinding } from '$/sources/SourceBinding.ts'
import type { AptosAip62WalletRequest } from '$/sources/AptosAip62/WalletApi/types.ts'
import { walletProviderRequest } from '$/sources/_shared/wire/WalletProvider/client.ts'

export const walletRequest = (
	binding: SourceBinding,
	request: AptosAip62WalletRequest
) => (
	walletProviderRequest(binding, request)
)

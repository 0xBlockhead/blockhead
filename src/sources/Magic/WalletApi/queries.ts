import type { SourceBinding } from '$/sources/SourceBinding.ts'
import type { MagicWalletRequest } from '$/sources/Magic/WalletApi/types.ts'
import { walletProviderRequest } from '$/sources/_shared/wire/WalletProvider/client.ts'

export const walletRequest = (
	binding: SourceBinding,
	request: MagicWalletRequest
) => (
	walletProviderRequest(binding, request)
)

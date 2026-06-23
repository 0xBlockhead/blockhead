import type { SourceBinding } from '$/sources/SourceBinding.ts'
import type { TronTip1193WalletRequest } from '$/sources/TronTip1193/WalletApi/types.ts'
import { walletProviderRequest } from '$/sources/_shared/wire/WalletProvider/client.ts'

export const walletRequest = (
	binding: SourceBinding,
	request: TronTip1193WalletRequest
) => (
	walletProviderRequest(binding, request)
)

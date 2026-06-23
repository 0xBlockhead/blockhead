import type { SourceBinding } from '$/sources/SourceBinding.ts'
import type { TronTip6963WalletRequest } from '$/sources/TronTip6963/WalletApi/types.ts'
import { walletProviderRequest } from '$/sources/_shared/wire/WalletProvider/client.ts'

export const walletRequest = (
	binding: SourceBinding,
	request: TronTip6963WalletRequest
) => (
	walletProviderRequest(binding, request)
)

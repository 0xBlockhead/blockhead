import type { SourceBinding } from '$/sources/SourceBinding.ts'
import type { NearWalletSelectorWalletRequest } from '$/sources/NearWalletSelector/WalletApi/types.ts'
import { walletProviderRequest } from '$/sources/_shared/wire/WalletProvider/client.ts'

export const walletRequest = (
	binding: SourceBinding,
	request: NearWalletSelectorWalletRequest
) => (
	walletProviderRequest(binding, request)
)

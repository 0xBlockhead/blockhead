import type { SourceBinding } from '$/sources/SourceBinding.ts'
import type { StoicWalletWalletRequest } from '$/sources/StoicWallet/WalletApi/types.ts'
import { walletProviderRequest } from '$/sources/_shared/wire/WalletProvider/client.ts'

export const walletRequest = (
	binding: SourceBinding,
	request: StoicWalletWalletRequest
) => (
	walletProviderRequest(binding, request)
)

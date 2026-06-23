import type { SourceBinding } from '$/sources/SourceBinding.ts'
import type { AlgorandWalletWalletRequest } from '$/sources/AlgorandWallet/WalletApi/types.ts'
import { walletProviderRequest } from '$/sources/_shared/wire/WalletProvider/client.ts'

export const walletRequest = (
	binding: SourceBinding,
	request: AlgorandWalletWalletRequest
) => (
	walletProviderRequest(binding, request)
)

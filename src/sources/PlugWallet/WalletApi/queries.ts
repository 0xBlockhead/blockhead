import type { SourceBinding } from '$/sources/SourceBinding.ts'
import type { PlugWalletWalletRequest } from '$/sources/PlugWallet/WalletApi/types.ts'
import { walletProviderRequest } from '$/sources/_shared/wire/WalletProvider/client.ts'

export const walletRequest = (
	binding: SourceBinding,
	request: PlugWalletWalletRequest
) => (
	walletProviderRequest(binding, request)
)

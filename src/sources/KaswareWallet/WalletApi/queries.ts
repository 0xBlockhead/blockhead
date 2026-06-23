import type { SourceBinding } from '$/sources/SourceBinding.ts'
import type { KaswareWalletWalletRequest } from '$/sources/KaswareWallet/WalletApi/types.ts'
import { walletProviderRequest } from '$/sources/_shared/wire/WalletProvider/client.ts'

export const walletRequest = (
	binding: SourceBinding,
	request: KaswareWalletWalletRequest
) => (
	walletProviderRequest(binding, request)
)

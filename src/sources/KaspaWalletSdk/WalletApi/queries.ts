import type { SourceBinding } from '$/sources/SourceBinding.ts'
import type { KaspaWalletSdkWalletRequest } from '$/sources/KaspaWalletSdk/WalletApi/types.ts'
import { walletProviderRequest } from '$/sources/_shared/wire/WalletProvider/client.ts'

export const walletRequest = (
	binding: SourceBinding,
	request: KaspaWalletSdkWalletRequest
) => (
	walletProviderRequest(binding, request)
)

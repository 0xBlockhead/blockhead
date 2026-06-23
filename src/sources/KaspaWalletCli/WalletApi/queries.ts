import type { SourceBinding } from '$/sources/SourceBinding.ts'
import type { KaspaWalletCliWalletRequest } from '$/sources/KaspaWalletCli/WalletApi/types.ts'
import { walletProviderRequest } from '$/sources/_shared/wire/WalletProvider/client.ts'

export const walletRequest = (
	binding: SourceBinding,
	request: KaspaWalletCliWalletRequest
) => (
	walletProviderRequest(binding, request)
)

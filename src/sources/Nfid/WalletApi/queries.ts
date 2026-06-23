import type { SourceBinding } from '$/sources/SourceBinding.ts'
import type { NfidWalletRequest } from '$/sources/Nfid/WalletApi/types.ts'
import { walletProviderRequest } from '$/sources/_shared/wire/WalletProvider/client.ts'

export const walletRequest = (
	binding: SourceBinding,
	request: NfidWalletRequest
) => (
	walletProviderRequest(binding, request)
)

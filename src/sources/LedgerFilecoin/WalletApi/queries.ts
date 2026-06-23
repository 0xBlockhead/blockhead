import type { SourceBinding } from '$/sources/SourceBinding.ts'
import type { LedgerFilecoinWalletRequest } from '$/sources/LedgerFilecoin/WalletApi/types.ts'
import { walletProviderRequest } from '$/sources/_shared/wire/WalletProvider/client.ts'

export const walletRequest = (
	binding: SourceBinding,
	request: LedgerFilecoinWalletRequest
) => (
	walletProviderRequest(binding, request)
)

import type { SourceBinding } from '$/sources/SourceBinding.ts'
import type { MartianWalletRequest } from '$/sources/Martian/WalletApi/types.ts'
import { walletProviderRequest } from '$/sources/_shared/wire/WalletProvider/client.ts'

export const walletRequest = (
	binding: SourceBinding,
	request: MartianWalletRequest
) => (
	walletProviderRequest(binding, request)
)

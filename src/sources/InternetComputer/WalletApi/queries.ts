import type { SourceBinding } from '$/sources/SourceBinding.ts'
import type { InternetComputerWalletRequest } from '$/sources/InternetComputer/WalletApi/types.ts'
import { walletProviderRequest } from '$/sources/_shared/wire/WalletProvider/client.ts'

export const walletRequest = (
	binding: SourceBinding,
	request: InternetComputerWalletRequest
) => (
	walletProviderRequest(binding, request)
)

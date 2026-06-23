import type { SourceBinding } from '$/sources/SourceBinding.ts'
import type { InternetIdentityDelegationRequest } from '$/sources/InternetIdentity/WalletApi/types.ts'
import { walletProviderRequest } from '$/sources/_shared/wire/WalletProvider/client.ts'

export const delegationRequest = (
	binding: SourceBinding,
	request: InternetIdentityDelegationRequest
) => (
	walletProviderRequest(binding, request)
)

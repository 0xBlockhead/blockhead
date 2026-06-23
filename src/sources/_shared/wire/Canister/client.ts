import type { SourceBinding } from '$/sources/SourceBinding.ts'
import type { CanisterRequest } from '$/sources/_shared/wire/Canister/types.ts'

export const canisterRequest = (
	binding: SourceBinding,
	request: CanisterRequest
) => ({
	binding,
	request,
})

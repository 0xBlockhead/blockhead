import type { SourceBinding } from '$/sources/SourceBinding.ts'
import type { CanisterRequest } from '$/sources/_shared/wire/Canister/types.ts'
import { canisterRequest as sourceCanisterRequest } from '$/sources/_shared/wire/Canister/client.ts'

export const canisterRequest = (
	binding: SourceBinding,
	request: CanisterRequest
) => (
	sourceCanisterRequest(binding, request)
)

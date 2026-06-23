import type { SourceBinding } from '$/sources/SourceBinding.ts'
import type { InternetComputerCanisterRequest } from '$/sources/InternetComputer/Canister/types.ts'
import { canisterRequest as sourceCanisterRequest } from '$/sources/_shared/wire/Canister/client.ts'

export const canisterRequest = (
	binding: SourceBinding,
	request: InternetComputerCanisterRequest
) => (
	sourceCanisterRequest(binding, request)
)

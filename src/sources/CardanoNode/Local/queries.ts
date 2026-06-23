import type { SourceBinding } from '$/sources/SourceBinding.ts'
import type { CardanoLocalStateQueryRequest } from '$/sources/CardanoNode/Local/types.ts'
import { inProcessRequest } from '$/sources/_shared/wire/InProcess/client.ts'

export const localStateQuery = (
	binding: SourceBinding,
	request: CardanoLocalStateQueryRequest
) => (
	inProcessRequest(binding, request)
)

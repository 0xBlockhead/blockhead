import type { SourceBinding } from '$/sources/SourceBinding.ts'
import type { InProcessRequest } from '$/sources/_shared/wire/InProcess/types.ts'
import { inProcessRequest } from '$/sources/_shared/wire/InProcess/client.ts'

export const torrentRequest = (
	binding: SourceBinding,
	request: InProcessRequest
) => (
	inProcessRequest(binding, request)
)

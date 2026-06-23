import type { SourceBinding } from '$/sources/SourceBinding.ts'
import type { InProcessRequest } from '$/sources/_shared/wire/InProcess/types.ts'

export const inProcessRequest = (
	binding: SourceBinding,
	request: InProcessRequest
) => ({
	binding,
	request,
})

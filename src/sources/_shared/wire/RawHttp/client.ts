import type { SourceBinding } from '$/sources/SourceBinding.ts'
import type { RawHttpRequest } from '$/sources/_shared/wire/RawHttp/types.ts'

export const rawHttpRequest = (
	binding: SourceBinding,
	request: RawHttpRequest
) => ({
	binding,
	request,
})

import type { SourceBinding } from '$/sources/SourceBinding.ts'
import type { UriRequest } from '$/sources/_shared/wire/Uri/types.ts'

export const uriRequest = (
	binding: SourceBinding,
	request: UriRequest
) => ({
	binding,
	request,
})

import type { SourceBinding } from '$/sources/SourceBinding.ts'
import type { LocalFileRequest } from '$/sources/_shared/wire/LocalFile/types.ts'

export const localFileRequest = (
	binding: SourceBinding,
	request: LocalFileRequest
) => ({
	binding,
	request,
})

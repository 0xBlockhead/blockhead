import type { SourceBinding } from '$/sources/SourceBinding.ts'
import type { LocalFileRequest } from '$/sources/_shared/wire/LocalFile/types.ts'
import { localFileRequest } from '$/sources/_shared/wire/LocalFile/client.ts'

export const localStateRequest = (
	binding: SourceBinding,
	request: LocalFileRequest
) => (
	localFileRequest(binding, request)
)

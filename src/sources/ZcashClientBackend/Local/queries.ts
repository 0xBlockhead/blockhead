import type { SourceBinding } from '$/sources/SourceBinding.ts'
import type { ZcashClientBackendRequest } from '$/sources/ZcashClientBackend/Local/types.ts'
import { localFileRequest } from '$/sources/_shared/wire/LocalFile/client.ts'

export const localStateRequest = (
	binding: SourceBinding,
	request: ZcashClientBackendRequest
) => (
	localFileRequest(binding, request)
)

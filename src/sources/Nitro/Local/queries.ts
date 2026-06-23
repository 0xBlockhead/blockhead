import type { SourceBinding } from '$/sources/SourceBinding.ts'
import type { NitroClientStoreRequest } from '$/sources/Nitro/Local/types.ts'
import { inProcessRequest } from '$/sources/_shared/wire/InProcess/client.ts'

export const clientStoreRequest = (
	binding: SourceBinding,
	request: NitroClientStoreRequest
) => (
	inProcessRequest(binding, request)
)

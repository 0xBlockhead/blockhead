import type { SourceBinding } from '$/sources/SourceBinding.ts'
import type { RawHttpRequest } from '$/sources/_shared/wire/RawHttp/types.ts'
import { rawHttpRequest } from '$/sources/_shared/wire/RawHttp/client.ts'

export const sdkRequest = (
	binding: SourceBinding,
	request: RawHttpRequest
) => (
	rawHttpRequest(binding, request)
)

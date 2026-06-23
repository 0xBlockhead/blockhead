import type { SourceBinding } from '$/sources/SourceBinding.ts'
import type { XmtpSdkRequest } from '$/sources/Xmtp/Sdk/types.ts'
import { rawHttpRequest } from '$/sources/_shared/wire/RawHttp/client.ts'

export const sdkRequest = (
	binding: SourceBinding,
	request: XmtpSdkRequest
) => (
	rawHttpRequest(binding, request)
)

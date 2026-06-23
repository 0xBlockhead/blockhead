import type { SourceBinding } from '$/sources/SourceBinding.ts'
import type { TonLiteServerRequest } from '$/sources/TonLiteServer/Adnl/types.ts'
import { adnlRequest } from '$/sources/_shared/wire/Adnl/client.ts'

export const request = (
	binding: SourceBinding,
	message: TonLiteServerRequest
) => (
	adnlRequest(binding, message)
)

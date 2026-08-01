import type { SourceBinding } from '$/sources/SourceBinding.ts'
import type { AdnlRequest } from '$/sources/_shared/wire/Adnl/types.ts'
import { adnlRequest } from '$/sources/_shared/wire/Adnl/client.ts'

export const request = (
	binding: SourceBinding,
	message: AdnlRequest
) => (
	adnlRequest(binding, message)
)

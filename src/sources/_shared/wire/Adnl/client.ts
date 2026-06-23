import type { SourceBinding } from '$/sources/SourceBinding.ts'
import type { AdnlRequest } from '$/sources/_shared/wire/Adnl/types.ts'

export const adnlRequest = (
	binding: SourceBinding,
	request: AdnlRequest
) => ({
	binding,
	request,
})

import type { SourceBinding } from '$/sources/SourceBinding.ts'

export const catalogRowsRequest = (binding: SourceBinding) => ({
	binding,
})

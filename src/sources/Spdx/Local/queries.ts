import type { SpdxDocument } from '$/sources/Spdx/Local/types.ts'

export const parseDocument = (text: string): SpdxDocument => (
	JSON.parse(text)
)

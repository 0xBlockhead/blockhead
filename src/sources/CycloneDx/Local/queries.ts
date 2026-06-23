import type { CycloneDxDocument } from '$/sources/CycloneDx/Local/types.ts'

export const parseDocument = (text: string): CycloneDxDocument => (
	JSON.parse(text)
)

import type { CroissantDocument } from '$/sources/MlCommons/Local/types.ts'

export const parseDocument = (text: string): CroissantDocument => (
	JSON.parse(text)
)

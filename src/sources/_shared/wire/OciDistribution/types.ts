import type { JsonValue } from '$/typescript/JsonValue.ts'

export type OciDistributionJson = JsonValue

export type OciImageReference = {
	registry?: string
	repository: string
	reference: string
}

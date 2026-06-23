import type { JsonValue } from '$/typescript/JsonValue.ts'

export type AwsBedrockJson = JsonValue

export type AwsBedrockAiCatalogRequest = {
	region: string
	path: string
	query?: string
	operationKind: 'model-catalog' | 'provider-operation-catalog'
}

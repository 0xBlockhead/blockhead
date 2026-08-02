export type AwsBedrockAiCatalogRequest = {
	region: string
	path: string
	query?: string
	operationKind: 'model-catalog' | 'provider-operation-catalog'
}

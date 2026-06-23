import type { AwsBedrockAiCatalogRequest } from '$/sources/AwsBedrock/Rest/types.ts'

const describeAiCatalogRequest = ({
	region,
	path,
	query,
	operationKind,
}: AwsBedrockAiCatalogRequest) => ({
	url: `https://bedrock.${region}.amazonaws.com${path}${
		query == null || query === '' ?
			''
		:
			`?${query}`
	}`,
	region,
	service: 'bedrock',
	method: 'GET',
	operationKind,
})

export const describeFoundationModelsCatalogRequest = ({
	region,
	byCustomizationType,
	byInferenceType,
	byOutputModality,
	byProvider,
}: {
	region: string
	byCustomizationType?: string
	byInferenceType?: string
	byOutputModality?: string
	byProvider?: string
}) => describeAiCatalogRequest({
	region,
	path: '/foundation-models',
	query: new URLSearchParams({
		...(byCustomizationType != null && { byCustomizationType }),
		...(byInferenceType != null && { byInferenceType }),
		...(byOutputModality != null && { byOutputModality }),
		...(byProvider != null && { byProvider }),
	}).toString(),
	operationKind: 'model-catalog',
})

export const describeFoundationModelOperationRequest = ({
	region,
	modelIdentifier,
}: {
	region: string
	modelIdentifier: string
}) => describeAiCatalogRequest({
	region,
	path: `/foundation-models/${encodeURIComponent(modelIdentifier)}`,
	operationKind: 'provider-operation-catalog',
})

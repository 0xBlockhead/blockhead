import { Source } from '$/sources/Source.ts'
import { SourceProvider } from '$/sources/SourceProvider.ts'
import {
	ApiFamily,
	SourceCredentialScope,
	SourceDelivery,
	SourceEndpointKind,
	SourceOperationGroup,
	SourceTargetKind,
	WireProtocol,
	type SourceBinding,
} from '$/sources/SourceBinding.ts'

export const awsBedrockBindings = [
	{
		provider: SourceProvider.AwsBedrock,
		source: Source.AwsBedrock_Rest,
		target: {
			kind: SourceTargetKind.Global,
			key: 'aws-bedrock',
		},
		endpoints: [
			{
				endpointKind: SourceEndpointKind.HttpUrl,
				locator: 'env:AWS_BEDROCK_ENDPOINT',
			},
		],
		wireProtocol: WireProtocol.HttpRest,
		apiFamily: ApiFamily.RestJson,
		operationGroups: [
			SourceOperationGroup.AiModelCatalog,
			SourceOperationGroup.AiProviderOperationCatalog,
		],
		delivery: SourceDelivery.RemoteQuery,
		credentials: [
			{
				scope: SourceCredentialScope.RuntimeSecret,
				keys: [
					'AWS_ACCESS_KEY_ID',
					'AWS_SECRET_ACCESS_KEY',
					'AWS_BEDROCK_REGION',
				],
			},
		],
	},
] as const satisfies readonly SourceBinding[]

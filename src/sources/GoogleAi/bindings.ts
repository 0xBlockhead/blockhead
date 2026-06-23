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

const googleAiOrigin = 'https://generativelanguage.googleapis.com' as const

export const googleAiBindings = [
	{
		provider: SourceProvider.GoogleAi,
		source: Source.GoogleAi_Rest,
		target: {
			kind: SourceTargetKind.Global,
			key: 'google-ai-api',
		},
		endpoints: [
			{
				endpointKind: SourceEndpointKind.HttpUrl,
				locator: googleAiOrigin,
				origin: googleAiOrigin,
				corsEnabled: false,
			},
		],
		wireProtocol: WireProtocol.HttpRest,
		apiFamily: ApiFamily.RestJson,
		operationGroups: [
			SourceOperationGroup.AiModelCatalog,
			SourceOperationGroup.AiProviderOperationCatalog,
			SourceOperationGroup.GenericRead,
		],
		delivery: SourceDelivery.RemoteQuery,
		credentials: [
			{
				scope: SourceCredentialScope.RuntimeSecret,
				keys: [
					'GOOGLE_AI_API_KEY',
				],
			},
		],
	},
] as const satisfies readonly SourceBinding[]

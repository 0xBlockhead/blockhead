// Generated from APP.ts. Do not edit by hand.

import { Source } from '$/sources/Source.ts'
import { ApiFamily, SourceCredentialScope, SourceDelivery, SourceEndpointKind, SourceOperationGroup, SourceTargetKind, WireProtocol, type SourceBindingIndex } from '$/sources/SourceBinding.ts'

export default {
	[Source.AzureAiFoundry_Rest]: {
		source: Source.AzureAiFoundry_Rest,
		target: {
			kind: SourceTargetKind.Global,
			key: 'azure-ai-foundry',
		},
		endpoints: [
			{
				endpointKind: SourceEndpointKind.HttpUrl,
				locator: 'env:AZURE_AI_FOUNDRY_ENDPOINT',
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
					'AZURE_AI_FOUNDRY_API_KEY',
				],
			},
		],
	},
} as const satisfies SourceBindingIndex

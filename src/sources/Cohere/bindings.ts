// Generated from APP.ts. Do not edit by hand.

import { Source } from '$/sources/Source.ts'
import { ApiFamily, SourceCredentialScope, SourceDelivery, SourceEndpointKind, SourceOperationGroup, SourceTargetKind, WireProtocol, type SourceBindingIndex } from '$/sources/SourceBinding.ts'

export default {
	[Source.Cohere_Rest]: {
		source: Source.Cohere_Rest,
		target: {
			kind: SourceTargetKind.Global,
			key: 'cohere-api',
		},
		endpoints: [
			{
				endpointKind: SourceEndpointKind.HttpUrl,
				locator: 'https://api.cohere.com',
				origin: 'https://api.cohere.com',
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
					'COHERE_API_KEY',
				],
			},
		],
	},
} as const satisfies SourceBindingIndex

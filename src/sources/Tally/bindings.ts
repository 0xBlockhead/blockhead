// Generated from APP.ts. Do not edit by hand.

import { Source } from '$/sources/Source.ts'
import { ApiFamily, SourceArtifactKind, SourceCredentialScope, SourceDelivery, SourceEndpointKind, SourceOperationGroup, SourceTargetKind, WireProtocol, type SourceBindingIndex } from '$/sources/SourceBinding.ts'

export default {
	[Source.Tally_Graphql]: {
		source: Source.Tally_Graphql,
		target: {
			kind: SourceTargetKind.Global,
			key: 'tally-api',
		},
		endpoints: [
			{
				endpointKind: SourceEndpointKind.HttpUrl,
				locator: 'https://api.tally.xyz/query',
				origin: 'https://api.tally.xyz',
				corsEnabled: false,
			},
		],
		wireProtocol: WireProtocol.Graphql,
		apiFamily: ApiFamily.GraphqlHttp,
		operationGroups: [
			SourceOperationGroup.GenericRead,
		],
		delivery: SourceDelivery.HttpProxy,
		credentials: [
			{
				scope: SourceCredentialScope.RuntimeSecret,
			},
		],
		proxyId: '["Tally_Graphql","Global","tally-api","HttpProxy","GraphqlHttp"]',
		serverCredentialId: '["Tally_Graphql","Global","tally-api","HttpProxy","GraphqlHttp"]',
		artifacts: [
			{
				kind: SourceArtifactKind.HandwrittenTypes,
				path: 'src/sources/Tally/Graphql/types.ts',
				generated: false,
			},
		],
	},
} as const satisfies SourceBindingIndex

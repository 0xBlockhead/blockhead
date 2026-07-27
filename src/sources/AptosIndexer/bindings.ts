// Generated from APP.ts. Do not edit by hand.

import { Source } from '$/sources/Source.ts'
import { ApiFamily, SourceArtifactKind, SourceCredentialScope, SourceDelivery, SourceEndpointKind, SourceOperationGroup, SourceTargetKind, WireProtocol, type SourceBindingIndex } from '$/sources/SourceBinding.ts'

export default {
	[Source.AptosIndexer_Graphql]: {
		source: Source.AptosIndexer_Graphql,
		target: {
			kind: SourceTargetKind.Caip2Network,
			key: 'aptos:1',
		},
		endpoints: [
			{
				endpointKind: SourceEndpointKind.HttpUrl,
				locator: 'https://api.mainnet.aptoslabs.com/v1/graphql',
				origin: 'https://api.mainnet.aptoslabs.com',
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
				scope: SourceCredentialScope.None,
			},
		],
		proxyId: '["AptosIndexer_Graphql","Caip2Network","aptos:1","HttpProxy","GraphqlHttp"]',
		artifacts: [
			{
				kind: SourceArtifactKind.GraphqlSchema,
				path: 'src/sources/AptosIndexer/Graphql/schema.graphql',
				generated: true,
				officialUrl: 'https://api.mainnet.aptoslabs.com/v1/graphql',
			},
			{
				kind: SourceArtifactKind.GenerationManifest,
				path: 'src/sources/AptosIndexer/Graphql/schema-source.ts',
				generated: false,
			},
			{
				kind: SourceArtifactKind.GraphqlTypes,
				path: 'src/sources/AptosIndexer/Graphql/graphql-env.d.ts',
				generated: true,
			},
		],
	},
} as const satisfies SourceBindingIndex

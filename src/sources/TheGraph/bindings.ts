// Generated from APP.ts. Do not edit by hand.

import { Source } from '$/sources/Source.ts'
import { ApiFamily, SourceArtifactKind, SourceCredentialScope, SourceDelivery, SourceEndpointKind, SourceOperationGroup, SourceTargetKind, WireProtocol, type SourceBindingIndex } from '$/sources/SourceBinding.ts'
import { type as arktype } from 'arktype'

export default {
	[Source.TheGraph_Graphql]: {
		source: Source.TheGraph_Graphql,
		target: {
			kind: SourceTargetKind.Global,
			key: 'ens-subgraph',
		},
		endpoints: [
			{
				endpointKind: SourceEndpointKind.HttpUrl,
				locator: 'https://gateway.thegraph.com/api/subgraphs/id/5XqPmWe6gjyrJtFn9cLy237i4cWw2j9HcUJEXsP5qGtH',
				origin: 'https://gateway.thegraph.com',
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
				scope: SourceCredentialScope.PublicConfig,
				env: arktype({
					'PUBLIC_THEGRAPH_API_KEY': 'string',
				}),
				keys: [
					'PUBLIC_THEGRAPH_API_KEY',
				],
			},
		],
		proxyId: '["TheGraph_Graphql","Global","ens-subgraph","HttpProxy","GraphqlHttp"]',
		artifacts: [
			{
				kind: SourceArtifactKind.GraphqlSchema,
				path: 'src/sources/TheGraph/Graphql/Ens/schema.graphql',
				generated: false,
			},
			{
				kind: SourceArtifactKind.GraphqlSchema,
				path: 'src/sources/TheGraph/Graphql/Ens/schema.patch.graphql',
				generated: false,
			},
			{
				kind: SourceArtifactKind.GenerationManifest,
				path: 'src/sources/TheGraph/Graphql/Ens/schema-source.ts',
				generated: false,
			},
			{
				kind: SourceArtifactKind.GraphqlTypes,
				path: 'src/sources/TheGraph/Graphql/Ens/graphql-env.d.ts',
				generated: true,
			},
		],
	},
} as const satisfies SourceBindingIndex

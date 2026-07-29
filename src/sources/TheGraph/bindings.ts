// Generated from APP.ts. Do not edit by hand.

import { Source } from '$/sources/Source.ts'
import { ApiFamily, indexSourceBindings, SourceArtifactKind, SourceCredentialScope, SourceDelivery, SourceEndpointKind, SourceOperationGroup, SourceTargetKind, WireProtocol, type SourceBinding } from '$/sources/SourceBinding.ts'
import { type as arktype } from 'arktype'

const bindings = [
	{
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
] as const satisfies readonly SourceBinding[]

export default indexSourceBindings<{ readonly [Source.TheGraph_Graphql]: typeof bindings[0] }>(bindings)

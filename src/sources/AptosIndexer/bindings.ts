// Generated from APP.ts. Do not edit by hand.

import { Source } from '$/sources/Source.ts'
import { ApiFamily, indexSourceBindings, SourceArtifactKind, SourceDelivery, SourceEndpointKind, SourceOperationGroup, SourceTargetKind, WireProtocol, type SourceBinding } from '$/sources/SourceBinding.ts'

const bindings = [
	{
		source: Source.AptosIndexer_Graphql,
		target: {
			kind: SourceTargetKind.Caip2Network,
			key: 'aptos:1',
		},
		endpoints: [
			{
				endpointKind: SourceEndpointKind.HttpUrl,
				locator: 'https://api.mainnet.aptoslabs.com/v1/graphql',
				corsEnabled: false,
			},
		],
		wireProtocol: WireProtocol.Graphql,
		apiFamily: ApiFamily.GraphqlHttp,
		operationGroups: [
			SourceOperationGroup.GenericRead,
		],
		delivery: SourceDelivery.HttpProxy,
		credentials: [],
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
			},
			{
				kind: SourceArtifactKind.GraphqlTypes,
				path: 'src/sources/AptosIndexer/Graphql/graphql-env.d.ts',
				generated: true,
			},
		],
	},
] as const satisfies readonly SourceBinding[]

export default indexSourceBindings(bindings)

// Generated from APP.ts.

import { Source } from '$/sources/Source.ts'
import {
	ApiFamily,
	genericReadOperationGroups,
	indexSourceBindings,
	SourceArtifactKind,
	SourceDelivery,
	SourceEndpointKind,
	SourceTargetKind,
	WireProtocol,
	type SourceBinding,
} from '$/sources/SourceBinding.ts'

export default indexSourceBindings([
	{
		source: Source.Sui,
		target: {
			kind: SourceTargetKind.NetworkSlug,
			key: 'sui',
		},
		endpoints: [
			{
				endpointKind: SourceEndpointKind.HttpUrl,
				locator: 'https://graphql.mainnet.sui.io/graphql',
				corsEnabled: false,
			},
		],
		wireProtocol: WireProtocol.Graphql,
		apiFamily: ApiFamily.GraphqlHttp,
		operationGroups: genericReadOperationGroups,
		delivery: SourceDelivery.RemoteQuery,
		credentials: [],
		artifacts: [
			{
				kind: SourceArtifactKind.GenerationManifest,
				path: 'src/sources/Sui/Graphql/schema-source.ts',
			},
			{
				kind: SourceArtifactKind.GraphqlSchema,
				path: 'src/sources/Sui/Graphql/schema.graphql',
				generated: true,
				officialUrl: 'https://graphql.mainnet.sui.io/graphql',
			},
			{
				kind: SourceArtifactKind.GraphqlTypes,
				path: 'src/sources/Sui/Graphql/graphql-env.d.ts',
				generated: true,
			},
		],
	},
	{
		source: Source.Sui,
		target: {
			kind: SourceTargetKind.NetworkSlug,
			key: 'sui',
		},
		endpoints: [
			{
				endpointKind: SourceEndpointKind.HttpUrl,
				locator: 'https://fullnode.mainnet.sui.io:443',
				corsEnabled: false,
			},
		],
		wireProtocol: WireProtocol.Grpc,
		apiFamily: ApiFamily.GrpcService,
		operationGroups: genericReadOperationGroups,
		delivery: SourceDelivery.ServerOnly,
		credentials: [],
	},
] as const satisfies readonly SourceBinding[])

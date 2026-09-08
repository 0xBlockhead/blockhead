// Generated from APP.ts.

import { Source } from '$/sources/Source.ts'
import {
	ApiFamily,
	indexSourceBindings,
	SourceArtifactKind,
	SourceDelivery,
	SourceEndpointKind,
	SourceOperationGroup,
	SourceTargetKind,
	WireProtocol,
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
		operationGroups: [
			SourceOperationGroup.GenericRead,
		],
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
		operationGroups: [
			SourceOperationGroup.GenericRead,
		],
		delivery: SourceDelivery.ServerOnly,
		credentials: [],
	},
])

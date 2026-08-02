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
	type SourceBinding,
} from '$/sources/SourceBinding.ts'

const suiGenericReadOperationGroups = [
	SourceOperationGroup.GenericRead,
] as const

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
		operationGroups: suiGenericReadOperationGroups,
		delivery: SourceDelivery.RemoteQuery,
		credentials: [],
		artifacts: [
			{
				kind: SourceArtifactKind.GraphqlSchema,
				path: 'src/sources/Sui/Graphql/schema.graphql',
				generated: true,
				officialUrl: 'https://graphql.mainnet.sui.io/graphql',
			},
			{
				kind: SourceArtifactKind.GenerationManifest,
				path: 'src/sources/Sui/Graphql/schema-source.ts',
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
		operationGroups: suiGenericReadOperationGroups,
		delivery: SourceDelivery.ServerOnly,
		credentials: [],
	},
] as const satisfies readonly SourceBinding[])

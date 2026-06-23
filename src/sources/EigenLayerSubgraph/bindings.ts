import { Source } from '$/sources/Source.ts'
import { SourceProvider } from '$/sources/SourceProvider.ts'
import {
	ApiFamily,
	SourceArtifactKind,
	SourceCredentialScope,
	SourceDelivery,
	SourceEndpointKind,
	SourceOperationGroup,
	SourceTargetKind,
	WireProtocol,
	type SourceBinding,
} from '$/sources/SourceBinding.ts'

export const eigenLayerSubgraphBindings = [
	{
		provider: SourceProvider.EigenLayerSubgraph,
		source: Source.EigenLayerSubgraph_Graphql,
		target: {
			kind: SourceTargetKind.Global,
			key: 'eigenlayer-subgraph',
		},
		endpoints: [
			{
				endpointKind: SourceEndpointKind.HttpUrl,
				locator: 'https://{eigenlayer-subgraph-host}',
				origin: 'https://{eigenlayer-subgraph-host}',
				corsEnabled: false,
			},
		],
		wireProtocol: WireProtocol.Graphql,
		apiFamily: ApiFamily.GraphqlHttp,
		operationGroups: [
			SourceOperationGroup.GenericRead,
		],
		delivery: SourceDelivery.RemoteQuery,
		credentials: [
			{
				scope: SourceCredentialScope.None,
			},
		],
		artifacts: [
			{
				kind: SourceArtifactKind.HandwrittenTypes,
				path: 'src/sources/EigenLayerSubgraph/Graphql/types.ts',
				generated: false,
			},
		],
	},
] as const satisfies readonly SourceBinding[]

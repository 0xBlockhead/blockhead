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
		source: Source.Pathfinder,
		target: {
			kind: SourceTargetKind.NetworkSlug,
			key: 'starknet',
		},
		endpoints: [
			{
				endpointKind: SourceEndpointKind.HttpUrl,
				locator: 'http://127.0.0.1:9545/rpc/v0_10',
				corsEnabled: false,
			},
		],
		wireProtocol: WireProtocol.JsonRpc2,
		apiFamily: ApiFamily.StarknetJsonRpc,
		operationGroups: [
			SourceOperationGroup.GenericRead,
		],
		delivery: SourceDelivery.LocalOnly,
		credentials: [],
		artifacts: [
			{
				kind: SourceArtifactKind.GenerationManifest,
				path: 'src/sources/_shared/interfaces/StarknetJsonRpc/OpenRpc/schema-source.ts',
			},
			{
				kind: SourceArtifactKind.HandwrittenTypes,
				path: 'src/sources/Pathfinder/JsonRpc/types.ts',
			},
			{
				kind: SourceArtifactKind.OpenRpcSpec,
				path: 'src/sources/_shared/interfaces/StarknetJsonRpc/OpenRpc/openrpc.json',
			},
			{
				kind: SourceArtifactKind.OpenRpcTypes,
				path: 'src/sources/_shared/interfaces/StarknetJsonRpc/OpenRpc/openrpc.d.ts',
				generated: true,
			},
		],
	},
])

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
		source: Source.ZcashLightwalletd_Grpc,
		target: {
			kind: SourceTargetKind.Caip2Network,
			key: 'bip122:00040fe8ec8471911baa1db1266ea15',
		},
		endpoints: [
			{
				endpointKind: SourceEndpointKind.TcpAddress,
				locator: 'env:ZCASH_LIGHTWALLETD_GRPC_ENDPOINT',
			},
		],
		wireProtocol: WireProtocol.Grpc,
		apiFamily: ApiFamily.GrpcService,
		operationGroups: genericReadOperationGroups,
		delivery: SourceDelivery.ServerOnly,
		credentials: [],
		artifacts: [
			{
				kind: SourceArtifactKind.GenerationManifest,
				path: 'src/sources/ZcashLightwalletd/Grpc/schema-source.ts',
			},
			{
				kind: SourceArtifactKind.Proto,
				path: 'src/sources/ZcashLightwalletd/Grpc/proto',
			},
		],
	},
] as const satisfies readonly SourceBinding[])

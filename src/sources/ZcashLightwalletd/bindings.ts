// Generated from APP.ts. Do not edit by hand.

import { Source } from '$/sources/Source.ts'
import { ApiFamily, SourceArtifactKind, SourceCredentialScope, SourceDelivery, SourceEndpointKind, SourceOperationGroup, SourceTargetKind, WireProtocol, type SourceBindingIndex } from '$/sources/SourceBinding.ts'

export default {
	[Source.ZcashLightwalletd_Grpc]: {
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
		operationGroups: [
			SourceOperationGroup.GenericRead,
		],
		delivery: SourceDelivery.ServerOnly,
		credentials: [
			{
				scope: SourceCredentialScope.None,
			},
		],
		artifacts: [
			{
				kind: SourceArtifactKind.Proto,
				path: 'src/sources/ZcashLightwalletd/Grpc/proto',
				generated: false,
			},
			{
				kind: SourceArtifactKind.GenerationManifest,
				path: 'src/sources/ZcashLightwalletd/Grpc/schema-source.ts',
				generated: false,
			},
		],
	},
} as const satisfies SourceBindingIndex

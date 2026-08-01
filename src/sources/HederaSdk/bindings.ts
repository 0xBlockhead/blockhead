// Generated from APP.ts. Do not edit by hand.

import { Source } from '$/sources/Source.ts'
import { ApiFamily, indexSourceBindings, SourceArtifactKind, SourceDelivery, SourceEndpointKind, SourceOperationGroup, SourceTargetKind, WireProtocol, type SourceBinding } from '$/sources/SourceBinding.ts'

const bindings = [
	{
		source: Source.HederaSdk_Grpc,
		target: {
			kind: SourceTargetKind.Caip2Network,
			key: 'hedera:mainnet',
		},
		endpoints: [
			{
				endpointKind: SourceEndpointKind.TcpAddress,
				locator: 'env:HEDERA_SDK_GRPC_ENDPOINT',
			},
		],
		wireProtocol: WireProtocol.Grpc,
		apiFamily: ApiFamily.GrpcService,
		operationGroups: [
			SourceOperationGroup.GenericRead,
		],
		delivery: SourceDelivery.ServerOnly,
		credentials: [],
		artifacts: [
			{
				kind: SourceArtifactKind.Proto,
				path: 'src/sources/HederaSdk/Grpc/proto',
			},
			{
				kind: SourceArtifactKind.GenerationManifest,
				path: 'src/sources/HederaSdk/Grpc/schema-source.ts',
			},
		],
	},
] as const satisfies readonly SourceBinding[]

export default indexSourceBindings(bindings)

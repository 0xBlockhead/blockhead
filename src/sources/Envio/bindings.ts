// Generated from APP.ts. Do not edit by hand.

import { Source } from '$/sources/Source.ts'
import { ApiFamily, indexSourceBindings, SourceArtifactKind, SourceCredentialScope, SourceDelivery, SourceEndpointKind, SourceOperationGroup, SourceTargetKind, WireProtocol, type SourceBinding } from '$/sources/SourceBinding.ts'

const envio1Credentials = [
	{
		scope: SourceCredentialScope.RuntimeSecret,
	},
] as const

const bindings = [
	{
		source: Source.EnvioHyperRpc_JsonRpc,
		target: {
			kind: SourceTargetKind.Eip155Chain,
			key: '1',
		},
		endpoints: [
			{
				endpointKind: SourceEndpointKind.HttpUrl,
				locator: 'https://eth.rpc.hypersync.xyz/{ENVIO_API_TOKEN}',
				corsEnabled: false,
			},
		],
		wireProtocol: WireProtocol.JsonRpc2,
		apiFamily: ApiFamily.EvmExecutionJsonRpc,
		operationGroups: [
			SourceOperationGroup.EvmRpcCore,
		],
		delivery: SourceDelivery.HttpProxy,
		credentials: envio1Credentials,
		artifacts: [
			{
				kind: SourceArtifactKind.OpenRpcSpec,
				path: 'src/sources/_shared/interfaces/EvmExecutionJsonRpc/OpenRpc/src',
			},
			{
				kind: SourceArtifactKind.GenerationManifest,
				path: 'src/sources/_shared/interfaces/EvmExecutionJsonRpc/OpenRpc/schema-source.ts',
			},
		],
	},
	{
		source: Source.EnvioHyperSync_RawHttp,
		target: {
			kind: SourceTargetKind.Eip155Chain,
			key: '1',
		},
		endpoints: [
			{
				endpointKind: SourceEndpointKind.HttpUrl,
				locator: 'https://eth.hypersync.xyz',
				corsEnabled: false,
			},
		],
		wireProtocol: WireProtocol.RawHttp,
		apiFamily: ApiFamily.EnvioHyperSyncApi,
		operationGroups: [
			SourceOperationGroup.GenericRead,
		],
		delivery: SourceDelivery.HttpProxy,
		credentials: envio1Credentials,
		artifacts: [
			{
				kind: SourceArtifactKind.HandwrittenTypes,
				path: 'src/sources/Envio/HyperSync/types.ts',
				referenceUrl: 'https://docs.envio.dev/docs/HyperSync/overview',
			},
		],
	},
] as const satisfies readonly SourceBinding[]

export default indexSourceBindings(bindings)

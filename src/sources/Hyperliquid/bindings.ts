// Generated from APP.ts. Do not edit by hand.

import { Source } from '$/sources/Source.ts'
import { ApiFamily, indexSourceBindings, SourceArtifactKind, SourceCredentialScope, SourceDelivery, SourceEndpointKind, SourceOperationGroup, SourceTargetKind, WireProtocol, type SourceBinding } from '$/sources/SourceBinding.ts'

const bindings = [
	{
		source: Source.Hyperliquid_Rest,
		target: {
			kind: SourceTargetKind.NetworkSlug,
			key: 'hyperliquid',
		},
		endpoints: [
			{
				endpointKind: SourceEndpointKind.HttpUrl,
				locator: 'https://api.hyperliquid.xyz/info',
				origin: 'https://api.hyperliquid.xyz',
				corsEnabled: true,
			},
		],
		wireProtocol: WireProtocol.HttpRest,
		apiFamily: ApiFamily.RestJson,
		operationGroups: [
			SourceOperationGroup.GenericRead,
		],
		delivery: SourceDelivery.BrowserDirect,
		credentials: [
			{
				scope: SourceCredentialScope.None,
			},
		],
		artifacts: [
			{
				kind: SourceArtifactKind.HandwrittenTypes,
				path: 'src/sources/Hyperliquid/Rest/types.ts',
				generated: false,
			},
		],
	},
	{
		source: Source.Hyperliquid_JsonRpc,
		target: {
			kind: SourceTargetKind.Eip155Chain,
			key: '999',
		},
		endpoints: [
			{
				endpointKind: SourceEndpointKind.HttpUrl,
				locator: 'https://rpc.hyperliquid.xyz/evm',
				origin: 'https://rpc.hyperliquid.xyz',
				corsEnabled: true,
			},
		],
		wireProtocol: WireProtocol.JsonRpc2,
		apiFamily: ApiFamily.EvmExecutionJsonRpc,
		operationGroups: [
			SourceOperationGroup.EvmRpcCore,
		],
		delivery: SourceDelivery.BrowserDirect,
		credentials: [
			{
				scope: SourceCredentialScope.None,
			},
		],
		artifacts: [
			{
				kind: SourceArtifactKind.OpenRpcSpec,
				path: 'src/sources/_shared/interfaces/EvmExecutionJsonRpc/OpenRpc/src',
				generated: false,
			},
			{
				kind: SourceArtifactKind.GenerationManifest,
				path: 'src/sources/_shared/interfaces/EvmExecutionJsonRpc/OpenRpc/schema-source.ts',
				generated: false,
			},
		],
	},
] as const satisfies readonly SourceBinding[]

export default indexSourceBindings<{
	readonly [Source.Hyperliquid_Rest]: typeof bindings[0]
	readonly [Source.Hyperliquid_JsonRpc]: typeof bindings[1]
}>(bindings)

// Generated from APP.ts. Do not edit by hand.

import { Source } from '$/sources/Source.ts'
import { ApiFamily, indexSourceBindings, SourceArtifactKind, SourceCredentialScope, SourceDelivery, SourceEndpointKind, SourceOperationGroup, SourceTargetKind, WireProtocol, type SourceBinding } from '$/sources/SourceBinding.ts'

const solanaJsonRpcCredentials = [
	{
		scope: SourceCredentialScope.None,
	},
] as const
const solanaJsonRpcArtifacts = [
	{
		kind: SourceArtifactKind.HandwrittenTypes,
		path: 'src/sources/Solana/JsonRpc/types.ts',
		generated: false,
	},
] as const

const bindings = [
	{
		source: Source.Solana_JsonRpc,
		target: {
			kind: SourceTargetKind.Caip2Network,
			key: 'solana:5eykt4UsFv8P8NJdTREpY1vzqKqZKvdp',
		},
		endpoints: [
			{
				endpointKind: SourceEndpointKind.HttpUrl,
				locator: 'https://solana-rpc.publicnode.com',
				origin: 'https://solana-rpc.publicnode.com',
				corsEnabled: false,
			},
		],
		wireProtocol: WireProtocol.JsonRpc2,
		apiFamily: ApiFamily.SolanaJsonRpc,
		operationGroups: [
			SourceOperationGroup.GenericRead,
		],
		delivery: SourceDelivery.HttpProxy,
		credentials: solanaJsonRpcCredentials,
		artifacts: solanaJsonRpcArtifacts,
	},
	{
		source: Source.Solana_JsonRpc,
		target: {
			kind: SourceTargetKind.Caip2Network,
			key: 'solana:5eykt4UsFv8P8NJdTREpY1vzqKqZKvdp',
		},
		endpoints: [
			{
				endpointKind: SourceEndpointKind.WebSocketUrl,
				locator: 'wss://solana-rpc.publicnode.com',
			},
		],
		wireProtocol: WireProtocol.JsonRpc2,
		apiFamily: ApiFamily.SolanaJsonRpc,
		operationGroups: [
			SourceOperationGroup.GenericSubscribe,
		],
		delivery: SourceDelivery.RemoteLive,
		credentials: solanaJsonRpcCredentials,
		artifacts: solanaJsonRpcArtifacts,
	},
] as const satisfies readonly SourceBinding[]

export default indexSourceBindings<{ readonly [Source.Solana_JsonRpc]: readonly [typeof bindings[0], typeof bindings[1]] }>(bindings)

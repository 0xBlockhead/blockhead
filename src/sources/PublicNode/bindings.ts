// Generated from APP.ts. Do not edit by hand.

import { Source } from '$/sources/Source.ts'
import { ApiFamily, SourceArtifactKind, SourceCredentialScope, SourceDelivery, SourceEndpointKind, SourceOperationGroup, SourceTargetKind, WireProtocol, type SourceBindingIndex } from '$/sources/SourceBinding.ts'

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

export default {
	[Source.Solana_JsonRpc]: [
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
			proxyId: '["Solana_JsonRpc","Caip2Network","solana:5eykt4UsFv8P8NJdTREpY1vzqKqZKvdp","HttpProxy","SolanaJsonRpc"]',
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
	],
} as const satisfies SourceBindingIndex

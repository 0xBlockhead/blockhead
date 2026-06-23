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

const solanaMainnetHttpUrl = 'https://api.mainnet.solana.com' as const
const solanaMainnetWebSocketUrl = 'wss://api.mainnet.solana.com' as const

export const solanaBindings: readonly SourceBinding[] = [
	{
		provider: SourceProvider.Solana,
		source: Source.Solana_JsonRpc,
		target: {
			kind: SourceTargetKind.Caip2Network,
			key: 'solana:mainnet',
		},
		endpoints: [
			{
				endpointKind: SourceEndpointKind.HttpUrl,
				locator: solanaMainnetHttpUrl,
				origin: solanaMainnetHttpUrl,
				corsEnabled: false,
			},
		],
		wireProtocol: WireProtocol.JsonRpc2,
		apiFamily: ApiFamily.SolanaJsonRpc,
		operationGroups: [
			SourceOperationGroup.GenericRead,
		],
		delivery: SourceDelivery.HttpProxy,
		credentials: [
			{
				scope: SourceCredentialScope.None,
			},
		],
		artifacts: [
			{
				kind: SourceArtifactKind.HandwrittenTypes,
				path: 'src/sources/Solana/JsonRpc/types.ts',
				generated: false,
			},
		],
	},
	{
		provider: SourceProvider.Solana,
		source: Source.Solana_JsonRpc,
		target: {
			kind: SourceTargetKind.Caip2Network,
			key: 'solana:mainnet',
		},
		endpoints: [
			{
				endpointKind: SourceEndpointKind.WebSocketUrl,
				locator: solanaMainnetWebSocketUrl,
			},
		],
		wireProtocol: WireProtocol.JsonRpc2,
		apiFamily: ApiFamily.SolanaJsonRpc,
		operationGroups: [
			SourceOperationGroup.GenericSubscribe,
		],
		delivery: SourceDelivery.RemoteLive,
		credentials: [
			{
				scope: SourceCredentialScope.None,
			},
		],
		artifacts: [
			{
				kind: SourceArtifactKind.HandwrittenTypes,
				path: 'src/sources/Solana/JsonRpc/types.ts',
				generated: false,
			},
		],
	},
]

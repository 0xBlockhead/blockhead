// Generated from APP.ts. Do not edit by hand.

import { Source } from '$/sources/Source.ts'
import { ApiFamily, indexSourceBindings, SourceArtifactKind, SourceCredentialScope, SourceDelivery, SourceEndpointKind, SourceOperationGroup, SourceTargetKind, WireProtocol, type SourceBinding } from '$/sources/SourceBinding.ts'

const voltaireJsonRpcEvmRpcSubscribeOperationGroups = [
	SourceOperationGroup.EvmRpcSubscribe,
] as const
const voltaireJsonRpcEvmRpcCoreEvmRpcTraceEvmRpcTxpoolOperationGroups = [
	SourceOperationGroup.EvmRpcCore,
	SourceOperationGroup.EvmRpcTrace,
	SourceOperationGroup.EvmRpcTxpool,
] as const
const voltaireJsonRpcCredentials = [
	{
		scope: SourceCredentialScope.None,
	},
] as const
const voltaireJsonRpcArtifacts = [
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
] as const

const bindings = [
	{
		source: Source.Voltaire_JsonRpc,
		target: {
			kind: SourceTargetKind.Eip155Chain,
			key: '1',
		},
		endpoints: [
			{
				endpointKind: SourceEndpointKind.HttpUrl,
				locator: 'https://ethereum.publicnode.com',
				origin: 'https://ethereum.publicnode.com',
				corsEnabled: false,
			},
			{
				endpointKind: SourceEndpointKind.HttpUrl,
				locator: 'https://eth.drpc.org',
				origin: 'https://eth.drpc.org',
				corsEnabled: true,
			},
			{
				endpointKind: SourceEndpointKind.HttpUrl,
				locator: 'https://eth.llamarpc.com',
				origin: 'https://eth.llamarpc.com',
				corsEnabled: false,
			},
			{
				endpointKind: SourceEndpointKind.HttpUrl,
				locator: 'https://mainnet.rpc.buidlguidl.com',
				origin: 'https://mainnet.rpc.buidlguidl.com',
				corsEnabled: false,
			},
			{
				endpointKind: SourceEndpointKind.HttpUrl,
				locator: 'https://evm.stupidtech.net',
				origin: 'https://evm.stupidtech.net',
				corsEnabled: false,
			},
		],
		wireProtocol: WireProtocol.JsonRpc2,
		apiFamily: ApiFamily.EvmExecutionJsonRpc,
		operationGroups: [
			SourceOperationGroup.EvmRpcCore,
			SourceOperationGroup.EvmRpcTrace,
		],
		delivery: SourceDelivery.HttpProxy,
		credentials: voltaireJsonRpcCredentials,
		artifacts: voltaireJsonRpcArtifacts,
	},
	{
		source: Source.Voltaire_JsonRpc,
		target: {
			kind: SourceTargetKind.Eip155Chain,
			key: '1',
		},
		endpoints: [
			{
				endpointKind: SourceEndpointKind.WebSocketUrl,
				locator: 'wss://ethereum.publicnode.com',
			},
			{
				endpointKind: SourceEndpointKind.WebSocketUrl,
				locator: 'ws://localhost:8545',
			},
			{
				endpointKind: SourceEndpointKind.WebSocketUrl,
				locator: 'wss://eth.llamarpc.com',
			},
			{
				endpointKind: SourceEndpointKind.WebSocketUrl,
				locator: 'wss://mainnet.rpc.buidlguidl.com',
			},
		],
		wireProtocol: WireProtocol.JsonRpc2,
		apiFamily: ApiFamily.EvmExecutionJsonRpc,
		operationGroups: voltaireJsonRpcEvmRpcSubscribeOperationGroups,
		delivery: SourceDelivery.RemoteLive,
		credentials: voltaireJsonRpcCredentials,
		artifacts: voltaireJsonRpcArtifacts,
	},
	{
		source: Source.Voltaire_JsonRpc,
		target: {
			kind: SourceTargetKind.Eip155Chain,
			key: '10',
		},
		endpoints: [
			{
				endpointKind: SourceEndpointKind.HttpUrl,
				locator: 'https://mainnet.optimism.io',
				origin: 'https://mainnet.optimism.io',
				corsEnabled: false,
			},
		],
		wireProtocol: WireProtocol.JsonRpc2,
		apiFamily: ApiFamily.EvmExecutionJsonRpc,
		operationGroups: voltaireJsonRpcEvmRpcCoreEvmRpcTraceEvmRpcTxpoolOperationGroups,
		delivery: SourceDelivery.HttpProxy,
		credentials: voltaireJsonRpcCredentials,
		artifacts: voltaireJsonRpcArtifacts,
	},
	{
		source: Source.Voltaire_JsonRpc,
		target: {
			kind: SourceTargetKind.Eip155Chain,
			key: '10',
		},
		endpoints: [
			{
				endpointKind: SourceEndpointKind.WebSocketUrl,
				locator: 'wss://mainnet.optimism.io',
			},
		],
		wireProtocol: WireProtocol.JsonRpc2,
		apiFamily: ApiFamily.EvmExecutionJsonRpc,
		operationGroups: voltaireJsonRpcEvmRpcSubscribeOperationGroups,
		delivery: SourceDelivery.RemoteLive,
		credentials: voltaireJsonRpcCredentials,
		artifacts: voltaireJsonRpcArtifacts,
	},
	{
		source: Source.Voltaire_JsonRpc,
		target: {
			kind: SourceTargetKind.Eip155Chain,
			key: '50',
		},
		endpoints: [
			{
				endpointKind: SourceEndpointKind.HttpUrl,
				locator: 'https://erpc.xinfin.network',
				origin: 'https://erpc.xinfin.network',
				corsEnabled: false,
			},
		],
		wireProtocol: WireProtocol.JsonRpc2,
		apiFamily: ApiFamily.EvmExecutionJsonRpc,
		operationGroups: voltaireJsonRpcEvmRpcCoreEvmRpcTraceEvmRpcTxpoolOperationGroups,
		delivery: SourceDelivery.HttpProxy,
		credentials: voltaireJsonRpcCredentials,
		artifacts: voltaireJsonRpcArtifacts,
	},
	{
		source: Source.Voltaire_JsonRpc,
		target: {
			kind: SourceTargetKind.Eip155Chain,
			key: '50',
		},
		endpoints: [
			{
				endpointKind: SourceEndpointKind.WebSocketUrl,
				locator: 'wss://erpc.xinfin.network',
			},
		],
		wireProtocol: WireProtocol.JsonRpc2,
		apiFamily: ApiFamily.EvmExecutionJsonRpc,
		operationGroups: voltaireJsonRpcEvmRpcSubscribeOperationGroups,
		delivery: SourceDelivery.RemoteLive,
		credentials: voltaireJsonRpcCredentials,
		artifacts: voltaireJsonRpcArtifacts,
	},
	{
		source: Source.Voltaire_JsonRpc,
		target: {
			kind: SourceTargetKind.Eip155Chain,
			key: '51',
		},
		endpoints: [
			{
				endpointKind: SourceEndpointKind.HttpUrl,
				locator: 'https://rpc.apothem.network',
				origin: 'https://rpc.apothem.network',
				corsEnabled: false,
			},
		],
		wireProtocol: WireProtocol.JsonRpc2,
		apiFamily: ApiFamily.EvmExecutionJsonRpc,
		operationGroups: voltaireJsonRpcEvmRpcCoreEvmRpcTraceEvmRpcTxpoolOperationGroups,
		delivery: SourceDelivery.HttpProxy,
		credentials: voltaireJsonRpcCredentials,
		artifacts: voltaireJsonRpcArtifacts,
	},
	{
		source: Source.Voltaire_JsonRpc,
		target: {
			kind: SourceTargetKind.Eip155Chain,
			key: '51',
		},
		endpoints: [
			{
				endpointKind: SourceEndpointKind.WebSocketUrl,
				locator: 'wss://rpc.apothem.network',
			},
		],
		wireProtocol: WireProtocol.JsonRpc2,
		apiFamily: ApiFamily.EvmExecutionJsonRpc,
		operationGroups: voltaireJsonRpcEvmRpcSubscribeOperationGroups,
		delivery: SourceDelivery.RemoteLive,
		credentials: voltaireJsonRpcCredentials,
		artifacts: voltaireJsonRpcArtifacts,
	},
	{
		source: Source.Voltaire_JsonRpc,
		target: {
			kind: SourceTargetKind.Eip155Chain,
			key: '56',
		},
		endpoints: [
			{
				endpointKind: SourceEndpointKind.HttpUrl,
				locator: 'https://binance.llamarpc.com',
				origin: 'https://binance.llamarpc.com',
				corsEnabled: false,
			},
		],
		wireProtocol: WireProtocol.JsonRpc2,
		apiFamily: ApiFamily.EvmExecutionJsonRpc,
		operationGroups: voltaireJsonRpcEvmRpcCoreEvmRpcTraceEvmRpcTxpoolOperationGroups,
		delivery: SourceDelivery.HttpProxy,
		credentials: voltaireJsonRpcCredentials,
		artifacts: voltaireJsonRpcArtifacts,
	},
	{
		source: Source.Voltaire_JsonRpc,
		target: {
			kind: SourceTargetKind.Eip155Chain,
			key: '56',
		},
		endpoints: [
			{
				endpointKind: SourceEndpointKind.WebSocketUrl,
				locator: 'wss://binance.llamarpc.com',
			},
		],
		wireProtocol: WireProtocol.JsonRpc2,
		apiFamily: ApiFamily.EvmExecutionJsonRpc,
		operationGroups: voltaireJsonRpcEvmRpcSubscribeOperationGroups,
		delivery: SourceDelivery.RemoteLive,
		credentials: voltaireJsonRpcCredentials,
		artifacts: voltaireJsonRpcArtifacts,
	},
	{
		source: Source.Voltaire_JsonRpc,
		target: {
			kind: SourceTargetKind.Eip155Chain,
			key: '130',
		},
		endpoints: [
			{
				endpointKind: SourceEndpointKind.HttpUrl,
				locator: 'https://unichain-rpc.publicnode.com',
				origin: 'https://unichain-rpc.publicnode.com',
				corsEnabled: false,
			},
		],
		wireProtocol: WireProtocol.JsonRpc2,
		apiFamily: ApiFamily.EvmExecutionJsonRpc,
		operationGroups: voltaireJsonRpcEvmRpcCoreEvmRpcTraceEvmRpcTxpoolOperationGroups,
		delivery: SourceDelivery.HttpProxy,
		credentials: voltaireJsonRpcCredentials,
		artifacts: voltaireJsonRpcArtifacts,
	},
	{
		source: Source.Voltaire_JsonRpc,
		target: {
			kind: SourceTargetKind.Eip155Chain,
			key: '130',
		},
		endpoints: [
			{
				endpointKind: SourceEndpointKind.WebSocketUrl,
				locator: 'wss://unichain-rpc.publicnode.com',
			},
		],
		wireProtocol: WireProtocol.JsonRpc2,
		apiFamily: ApiFamily.EvmExecutionJsonRpc,
		operationGroups: voltaireJsonRpcEvmRpcSubscribeOperationGroups,
		delivery: SourceDelivery.RemoteLive,
		credentials: voltaireJsonRpcCredentials,
		artifacts: voltaireJsonRpcArtifacts,
	},
	{
		source: Source.Voltaire_JsonRpc,
		target: {
			kind: SourceTargetKind.Eip155Chain,
			key: '137',
		},
		endpoints: [
			{
				endpointKind: SourceEndpointKind.HttpUrl,
				locator: 'https://polygon-rpc.com',
				origin: 'https://polygon-rpc.com',
				corsEnabled: false,
			},
		],
		wireProtocol: WireProtocol.JsonRpc2,
		apiFamily: ApiFamily.EvmExecutionJsonRpc,
		operationGroups: voltaireJsonRpcEvmRpcCoreEvmRpcTraceEvmRpcTxpoolOperationGroups,
		delivery: SourceDelivery.HttpProxy,
		credentials: voltaireJsonRpcCredentials,
		artifacts: voltaireJsonRpcArtifacts,
	},
	{
		source: Source.Voltaire_JsonRpc,
		target: {
			kind: SourceTargetKind.Eip155Chain,
			key: '137',
		},
		endpoints: [
			{
				endpointKind: SourceEndpointKind.WebSocketUrl,
				locator: 'wss://polygon-rpc.com',
			},
		],
		wireProtocol: WireProtocol.JsonRpc2,
		apiFamily: ApiFamily.EvmExecutionJsonRpc,
		operationGroups: voltaireJsonRpcEvmRpcSubscribeOperationGroups,
		delivery: SourceDelivery.RemoteLive,
		credentials: voltaireJsonRpcCredentials,
		artifacts: voltaireJsonRpcArtifacts,
	},
	{
		source: Source.Voltaire_JsonRpc,
		target: {
			kind: SourceTargetKind.Eip155Chain,
			key: '143',
		},
		endpoints: [
			{
				endpointKind: SourceEndpointKind.HttpUrl,
				locator: 'https://rpc.monad.xyz',
				origin: 'https://rpc.monad.xyz',
				corsEnabled: false,
			},
		],
		wireProtocol: WireProtocol.JsonRpc2,
		apiFamily: ApiFamily.EvmExecutionJsonRpc,
		operationGroups: voltaireJsonRpcEvmRpcCoreEvmRpcTraceEvmRpcTxpoolOperationGroups,
		delivery: SourceDelivery.HttpProxy,
		credentials: voltaireJsonRpcCredentials,
		artifacts: voltaireJsonRpcArtifacts,
	},
	{
		source: Source.Voltaire_JsonRpc,
		target: {
			kind: SourceTargetKind.Eip155Chain,
			key: '143',
		},
		endpoints: [
			{
				endpointKind: SourceEndpointKind.WebSocketUrl,
				locator: 'wss://rpc.monad.xyz',
			},
		],
		wireProtocol: WireProtocol.JsonRpc2,
		apiFamily: ApiFamily.EvmExecutionJsonRpc,
		operationGroups: voltaireJsonRpcEvmRpcSubscribeOperationGroups,
		delivery: SourceDelivery.RemoteLive,
		credentials: voltaireJsonRpcCredentials,
		artifacts: voltaireJsonRpcArtifacts,
	},
	{
		source: Source.Voltaire_JsonRpc,
		target: {
			kind: SourceTargetKind.Eip155Chain,
			key: '146',
		},
		endpoints: [
			{
				endpointKind: SourceEndpointKind.HttpUrl,
				locator: 'https://rpc.soniclabs.com',
				origin: 'https://rpc.soniclabs.com',
				corsEnabled: false,
			},
		],
		wireProtocol: WireProtocol.JsonRpc2,
		apiFamily: ApiFamily.EvmExecutionJsonRpc,
		operationGroups: voltaireJsonRpcEvmRpcCoreEvmRpcTraceEvmRpcTxpoolOperationGroups,
		delivery: SourceDelivery.HttpProxy,
		credentials: voltaireJsonRpcCredentials,
		artifacts: voltaireJsonRpcArtifacts,
	},
	{
		source: Source.Voltaire_JsonRpc,
		target: {
			kind: SourceTargetKind.Eip155Chain,
			key: '146',
		},
		endpoints: [
			{
				endpointKind: SourceEndpointKind.WebSocketUrl,
				locator: 'wss://rpc.soniclabs.com',
			},
		],
		wireProtocol: WireProtocol.JsonRpc2,
		apiFamily: ApiFamily.EvmExecutionJsonRpc,
		operationGroups: voltaireJsonRpcEvmRpcSubscribeOperationGroups,
		delivery: SourceDelivery.RemoteLive,
		credentials: voltaireJsonRpcCredentials,
		artifacts: voltaireJsonRpcArtifacts,
	},
	{
		source: Source.Voltaire_JsonRpc,
		target: {
			kind: SourceTargetKind.Eip155Chain,
			key: '300',
		},
		endpoints: [
			{
				endpointKind: SourceEndpointKind.HttpUrl,
				locator: 'https://sepolia.era.zksync.dev',
				origin: 'https://sepolia.era.zksync.dev',
				corsEnabled: false,
			},
		],
		wireProtocol: WireProtocol.JsonRpc2,
		apiFamily: ApiFamily.EvmExecutionJsonRpc,
		operationGroups: voltaireJsonRpcEvmRpcCoreEvmRpcTraceEvmRpcTxpoolOperationGroups,
		delivery: SourceDelivery.HttpProxy,
		credentials: voltaireJsonRpcCredentials,
		artifacts: voltaireJsonRpcArtifacts,
	},
	{
		source: Source.Voltaire_JsonRpc,
		target: {
			kind: SourceTargetKind.Eip155Chain,
			key: '300',
		},
		endpoints: [
			{
				endpointKind: SourceEndpointKind.WebSocketUrl,
				locator: 'wss://sepolia.era.zksync.dev',
			},
		],
		wireProtocol: WireProtocol.JsonRpc2,
		apiFamily: ApiFamily.EvmExecutionJsonRpc,
		operationGroups: voltaireJsonRpcEvmRpcSubscribeOperationGroups,
		delivery: SourceDelivery.RemoteLive,
		credentials: voltaireJsonRpcCredentials,
		artifacts: voltaireJsonRpcArtifacts,
	},
	{
		source: Source.Voltaire_JsonRpc,
		target: {
			kind: SourceTargetKind.Eip155Chain,
			key: '324',
		},
		endpoints: [
			{
				endpointKind: SourceEndpointKind.HttpUrl,
				locator: 'https://mainnet.era.zksync.io',
				origin: 'https://mainnet.era.zksync.io',
				corsEnabled: false,
			},
		],
		wireProtocol: WireProtocol.JsonRpc2,
		apiFamily: ApiFamily.EvmExecutionJsonRpc,
		operationGroups: voltaireJsonRpcEvmRpcCoreEvmRpcTraceEvmRpcTxpoolOperationGroups,
		delivery: SourceDelivery.HttpProxy,
		credentials: voltaireJsonRpcCredentials,
		artifacts: voltaireJsonRpcArtifacts,
	},
	{
		source: Source.Voltaire_JsonRpc,
		target: {
			kind: SourceTargetKind.Eip155Chain,
			key: '324',
		},
		endpoints: [
			{
				endpointKind: SourceEndpointKind.WebSocketUrl,
				locator: 'wss://mainnet.era.zksync.io',
			},
		],
		wireProtocol: WireProtocol.JsonRpc2,
		apiFamily: ApiFamily.EvmExecutionJsonRpc,
		operationGroups: voltaireJsonRpcEvmRpcSubscribeOperationGroups,
		delivery: SourceDelivery.RemoteLive,
		credentials: voltaireJsonRpcCredentials,
		artifacts: voltaireJsonRpcArtifacts,
	},
	{
		source: Source.Voltaire_JsonRpc,
		target: {
			kind: SourceTargetKind.Eip155Chain,
			key: '480',
		},
		endpoints: [
			{
				endpointKind: SourceEndpointKind.HttpUrl,
				locator: 'https://worldchain-mainnet.g.alchemy.com/public',
				origin: 'https://worldchain-mainnet.g.alchemy.com',
				corsEnabled: false,
			},
		],
		wireProtocol: WireProtocol.JsonRpc2,
		apiFamily: ApiFamily.EvmExecutionJsonRpc,
		operationGroups: voltaireJsonRpcEvmRpcCoreEvmRpcTraceEvmRpcTxpoolOperationGroups,
		delivery: SourceDelivery.HttpProxy,
		credentials: voltaireJsonRpcCredentials,
		artifacts: voltaireJsonRpcArtifacts,
	},
	{
		source: Source.Voltaire_JsonRpc,
		target: {
			kind: SourceTargetKind.Eip155Chain,
			key: '480',
		},
		endpoints: [
			{
				endpointKind: SourceEndpointKind.WebSocketUrl,
				locator: 'wss://worldchain-mainnet.g.alchemy.com/public',
			},
		],
		wireProtocol: WireProtocol.JsonRpc2,
		apiFamily: ApiFamily.EvmExecutionJsonRpc,
		operationGroups: voltaireJsonRpcEvmRpcSubscribeOperationGroups,
		delivery: SourceDelivery.RemoteLive,
		credentials: voltaireJsonRpcCredentials,
		artifacts: voltaireJsonRpcArtifacts,
	},
	{
		source: Source.Voltaire_JsonRpc,
		target: {
			kind: SourceTargetKind.Eip155Chain,
			key: '998',
		},
		endpoints: [
			{
				endpointKind: SourceEndpointKind.HttpUrl,
				locator: 'https://hyperliquid-testnet.drpc.org',
				origin: 'https://hyperliquid-testnet.drpc.org',
				corsEnabled: true,
			},
		],
		wireProtocol: WireProtocol.JsonRpc2,
		apiFamily: ApiFamily.EvmExecutionJsonRpc,
		operationGroups: voltaireJsonRpcEvmRpcCoreEvmRpcTraceEvmRpcTxpoolOperationGroups,
		delivery: SourceDelivery.BrowserDirect,
		credentials: voltaireJsonRpcCredentials,
		artifacts: voltaireJsonRpcArtifacts,
	},
	{
		source: Source.Voltaire_JsonRpc,
		target: {
			kind: SourceTargetKind.Eip155Chain,
			key: '998',
		},
		endpoints: [
			{
				endpointKind: SourceEndpointKind.WebSocketUrl,
				locator: 'wss://hyperliquid-testnet.drpc.org',
			},
		],
		wireProtocol: WireProtocol.JsonRpc2,
		apiFamily: ApiFamily.EvmExecutionJsonRpc,
		operationGroups: voltaireJsonRpcEvmRpcSubscribeOperationGroups,
		delivery: SourceDelivery.RemoteLive,
		credentials: voltaireJsonRpcCredentials,
		artifacts: voltaireJsonRpcArtifacts,
	},
	{
		source: Source.Voltaire_JsonRpc,
		target: {
			kind: SourceTargetKind.Eip155Chain,
			key: '999',
		},
		endpoints: [
			{
				endpointKind: SourceEndpointKind.HttpUrl,
				locator: 'https://hyperliquid.drpc.org',
				origin: 'https://hyperliquid.drpc.org',
				corsEnabled: true,
			},
		],
		wireProtocol: WireProtocol.JsonRpc2,
		apiFamily: ApiFamily.EvmExecutionJsonRpc,
		operationGroups: voltaireJsonRpcEvmRpcCoreEvmRpcTraceEvmRpcTxpoolOperationGroups,
		delivery: SourceDelivery.BrowserDirect,
		credentials: voltaireJsonRpcCredentials,
		artifacts: voltaireJsonRpcArtifacts,
	},
	{
		source: Source.Voltaire_JsonRpc,
		target: {
			kind: SourceTargetKind.Eip155Chain,
			key: '999',
		},
		endpoints: [
			{
				endpointKind: SourceEndpointKind.WebSocketUrl,
				locator: 'wss://hyperliquid.drpc.org',
			},
		],
		wireProtocol: WireProtocol.JsonRpc2,
		apiFamily: ApiFamily.EvmExecutionJsonRpc,
		operationGroups: voltaireJsonRpcEvmRpcSubscribeOperationGroups,
		delivery: SourceDelivery.RemoteLive,
		credentials: voltaireJsonRpcCredentials,
		artifacts: voltaireJsonRpcArtifacts,
	},
	{
		source: Source.Voltaire_JsonRpc,
		target: {
			kind: SourceTargetKind.Eip155Chain,
			key: '1301',
		},
		endpoints: [
			{
				endpointKind: SourceEndpointKind.HttpUrl,
				locator: 'https://sepolia.unichain.org',
				origin: 'https://sepolia.unichain.org',
				corsEnabled: false,
			},
		],
		wireProtocol: WireProtocol.JsonRpc2,
		apiFamily: ApiFamily.EvmExecutionJsonRpc,
		operationGroups: voltaireJsonRpcEvmRpcCoreEvmRpcTraceEvmRpcTxpoolOperationGroups,
		delivery: SourceDelivery.HttpProxy,
		credentials: voltaireJsonRpcCredentials,
		artifacts: voltaireJsonRpcArtifacts,
	},
	{
		source: Source.Voltaire_JsonRpc,
		target: {
			kind: SourceTargetKind.Eip155Chain,
			key: '1301',
		},
		endpoints: [
			{
				endpointKind: SourceEndpointKind.WebSocketUrl,
				locator: 'wss://sepolia.unichain.org',
			},
		],
		wireProtocol: WireProtocol.JsonRpc2,
		apiFamily: ApiFamily.EvmExecutionJsonRpc,
		operationGroups: voltaireJsonRpcEvmRpcSubscribeOperationGroups,
		delivery: SourceDelivery.RemoteLive,
		credentials: voltaireJsonRpcCredentials,
		artifacts: voltaireJsonRpcArtifacts,
	},
	{
		source: Source.Voltaire_JsonRpc,
		target: {
			kind: SourceTargetKind.Eip155Chain,
			key: '1328',
		},
		endpoints: [
			{
				endpointKind: SourceEndpointKind.HttpUrl,
				locator: 'https://evm-rpc-testnet.sei-apis.com',
				origin: 'https://evm-rpc-testnet.sei-apis.com',
				corsEnabled: false,
			},
		],
		wireProtocol: WireProtocol.JsonRpc2,
		apiFamily: ApiFamily.EvmExecutionJsonRpc,
		operationGroups: voltaireJsonRpcEvmRpcCoreEvmRpcTraceEvmRpcTxpoolOperationGroups,
		delivery: SourceDelivery.HttpProxy,
		credentials: voltaireJsonRpcCredentials,
		artifacts: voltaireJsonRpcArtifacts,
	},
	{
		source: Source.Voltaire_JsonRpc,
		target: {
			kind: SourceTargetKind.Eip155Chain,
			key: '1328',
		},
		endpoints: [
			{
				endpointKind: SourceEndpointKind.WebSocketUrl,
				locator: 'wss://evm-rpc-testnet.sei-apis.com',
			},
		],
		wireProtocol: WireProtocol.JsonRpc2,
		apiFamily: ApiFamily.EvmExecutionJsonRpc,
		operationGroups: voltaireJsonRpcEvmRpcSubscribeOperationGroups,
		delivery: SourceDelivery.RemoteLive,
		credentials: voltaireJsonRpcCredentials,
		artifacts: voltaireJsonRpcArtifacts,
	},
	{
		source: Source.Voltaire_JsonRpc,
		target: {
			kind: SourceTargetKind.Eip155Chain,
			key: '1329',
		},
		endpoints: [
			{
				endpointKind: SourceEndpointKind.HttpUrl,
				locator: 'https://evm-rpc.sei-apis.com',
				origin: 'https://evm-rpc.sei-apis.com',
				corsEnabled: false,
			},
		],
		wireProtocol: WireProtocol.JsonRpc2,
		apiFamily: ApiFamily.EvmExecutionJsonRpc,
		operationGroups: voltaireJsonRpcEvmRpcCoreEvmRpcTraceEvmRpcTxpoolOperationGroups,
		delivery: SourceDelivery.HttpProxy,
		credentials: voltaireJsonRpcCredentials,
		artifacts: voltaireJsonRpcArtifacts,
	},
	{
		source: Source.Voltaire_JsonRpc,
		target: {
			kind: SourceTargetKind.Eip155Chain,
			key: '1329',
		},
		endpoints: [
			{
				endpointKind: SourceEndpointKind.WebSocketUrl,
				locator: 'wss://evm-rpc.sei-apis.com',
			},
		],
		wireProtocol: WireProtocol.JsonRpc2,
		apiFamily: ApiFamily.EvmExecutionJsonRpc,
		operationGroups: voltaireJsonRpcEvmRpcSubscribeOperationGroups,
		delivery: SourceDelivery.RemoteLive,
		credentials: voltaireJsonRpcCredentials,
		artifacts: voltaireJsonRpcArtifacts,
	},
	{
		source: Source.Voltaire_JsonRpc,
		target: {
			kind: SourceTargetKind.Eip155Chain,
			key: '4801',
		},
		endpoints: [
			{
				endpointKind: SourceEndpointKind.HttpUrl,
				locator: 'https://worldchain-sepolia.g.alchemy.com/public',
				origin: 'https://worldchain-sepolia.g.alchemy.com',
				corsEnabled: false,
			},
		],
		wireProtocol: WireProtocol.JsonRpc2,
		apiFamily: ApiFamily.EvmExecutionJsonRpc,
		operationGroups: voltaireJsonRpcEvmRpcCoreEvmRpcTraceEvmRpcTxpoolOperationGroups,
		delivery: SourceDelivery.HttpProxy,
		credentials: voltaireJsonRpcCredentials,
		artifacts: voltaireJsonRpcArtifacts,
	},
	{
		source: Source.Voltaire_JsonRpc,
		target: {
			kind: SourceTargetKind.Eip155Chain,
			key: '4801',
		},
		endpoints: [
			{
				endpointKind: SourceEndpointKind.WebSocketUrl,
				locator: 'wss://worldchain-sepolia.g.alchemy.com/public',
			},
		],
		wireProtocol: WireProtocol.JsonRpc2,
		apiFamily: ApiFamily.EvmExecutionJsonRpc,
		operationGroups: voltaireJsonRpcEvmRpcSubscribeOperationGroups,
		delivery: SourceDelivery.RemoteLive,
		credentials: voltaireJsonRpcCredentials,
		artifacts: voltaireJsonRpcArtifacts,
	},
	{
		source: Source.Voltaire_JsonRpc,
		target: {
			kind: SourceTargetKind.Eip155Chain,
			key: '8453',
		},
		endpoints: [
			{
				endpointKind: SourceEndpointKind.HttpUrl,
				locator: 'https://mainnet.base.org',
				origin: 'https://mainnet.base.org',
				corsEnabled: false,
			},
			{
				endpointKind: SourceEndpointKind.HttpUrl,
				locator: 'https://base.llamarpc.com',
				origin: 'https://base.llamarpc.com',
				corsEnabled: false,
			},
		],
		wireProtocol: WireProtocol.JsonRpc2,
		apiFamily: ApiFamily.EvmExecutionJsonRpc,
		operationGroups: voltaireJsonRpcEvmRpcCoreEvmRpcTraceEvmRpcTxpoolOperationGroups,
		delivery: SourceDelivery.HttpProxy,
		credentials: voltaireJsonRpcCredentials,
		artifacts: voltaireJsonRpcArtifacts,
	},
	{
		source: Source.Voltaire_JsonRpc,
		target: {
			kind: SourceTargetKind.Eip155Chain,
			key: '8453',
		},
		endpoints: [
			{
				endpointKind: SourceEndpointKind.WebSocketUrl,
				locator: 'wss://mainnet.base.org',
			},
			{
				endpointKind: SourceEndpointKind.WebSocketUrl,
				locator: 'wss://base.llamarpc.com',
			},
		],
		wireProtocol: WireProtocol.JsonRpc2,
		apiFamily: ApiFamily.EvmExecutionJsonRpc,
		operationGroups: voltaireJsonRpcEvmRpcSubscribeOperationGroups,
		delivery: SourceDelivery.RemoteLive,
		credentials: voltaireJsonRpcCredentials,
		artifacts: voltaireJsonRpcArtifacts,
	},
	{
		source: Source.Voltaire_JsonRpc,
		target: {
			kind: SourceTargetKind.Eip155Chain,
			key: '10143',
		},
		endpoints: [
			{
				endpointKind: SourceEndpointKind.HttpUrl,
				locator: 'https://testnet-rpc.monad.xyz',
				origin: 'https://testnet-rpc.monad.xyz',
				corsEnabled: false,
			},
		],
		wireProtocol: WireProtocol.JsonRpc2,
		apiFamily: ApiFamily.EvmExecutionJsonRpc,
		operationGroups: voltaireJsonRpcEvmRpcCoreEvmRpcTraceEvmRpcTxpoolOperationGroups,
		delivery: SourceDelivery.HttpProxy,
		credentials: voltaireJsonRpcCredentials,
		artifacts: voltaireJsonRpcArtifacts,
	},
	{
		source: Source.Voltaire_JsonRpc,
		target: {
			kind: SourceTargetKind.Eip155Chain,
			key: '10143',
		},
		endpoints: [
			{
				endpointKind: SourceEndpointKind.WebSocketUrl,
				locator: 'wss://testnet-rpc.monad.xyz',
			},
		],
		wireProtocol: WireProtocol.JsonRpc2,
		apiFamily: ApiFamily.EvmExecutionJsonRpc,
		operationGroups: voltaireJsonRpcEvmRpcSubscribeOperationGroups,
		delivery: SourceDelivery.RemoteLive,
		credentials: voltaireJsonRpcCredentials,
		artifacts: voltaireJsonRpcArtifacts,
	},
	{
		source: Source.Voltaire_JsonRpc,
		target: {
			kind: SourceTargetKind.Eip155Chain,
			key: '14601',
		},
		endpoints: [
			{
				endpointKind: SourceEndpointKind.HttpUrl,
				locator: 'https://rpc.testnet.soniclabs.com',
				origin: 'https://rpc.testnet.soniclabs.com',
				corsEnabled: false,
			},
		],
		wireProtocol: WireProtocol.JsonRpc2,
		apiFamily: ApiFamily.EvmExecutionJsonRpc,
		operationGroups: voltaireJsonRpcEvmRpcCoreEvmRpcTraceEvmRpcTxpoolOperationGroups,
		delivery: SourceDelivery.HttpProxy,
		credentials: voltaireJsonRpcCredentials,
		artifacts: voltaireJsonRpcArtifacts,
	},
	{
		source: Source.Voltaire_JsonRpc,
		target: {
			kind: SourceTargetKind.Eip155Chain,
			key: '14601',
		},
		endpoints: [
			{
				endpointKind: SourceEndpointKind.WebSocketUrl,
				locator: 'wss://rpc.testnet.soniclabs.com',
			},
		],
		wireProtocol: WireProtocol.JsonRpc2,
		apiFamily: ApiFamily.EvmExecutionJsonRpc,
		operationGroups: voltaireJsonRpcEvmRpcSubscribeOperationGroups,
		delivery: SourceDelivery.RemoteLive,
		credentials: voltaireJsonRpcCredentials,
		artifacts: voltaireJsonRpcArtifacts,
	},
	{
		source: Source.Voltaire_JsonRpc,
		target: {
			kind: SourceTargetKind.Eip155Chain,
			key: '42161',
		},
		endpoints: [
			{
				endpointKind: SourceEndpointKind.HttpUrl,
				locator: 'https://arb1.arbitrum.io/rpc',
				origin: 'https://arb1.arbitrum.io',
				corsEnabled: false,
			},
		],
		wireProtocol: WireProtocol.JsonRpc2,
		apiFamily: ApiFamily.EvmExecutionJsonRpc,
		operationGroups: voltaireJsonRpcEvmRpcCoreEvmRpcTraceEvmRpcTxpoolOperationGroups,
		delivery: SourceDelivery.HttpProxy,
		credentials: voltaireJsonRpcCredentials,
		artifacts: voltaireJsonRpcArtifacts,
	},
	{
		source: Source.Voltaire_JsonRpc,
		target: {
			kind: SourceTargetKind.Eip155Chain,
			key: '42161',
		},
		endpoints: [
			{
				endpointKind: SourceEndpointKind.WebSocketUrl,
				locator: 'wss://arb1.arbitrum.io/rpc',
			},
		],
		wireProtocol: WireProtocol.JsonRpc2,
		apiFamily: ApiFamily.EvmExecutionJsonRpc,
		operationGroups: voltaireJsonRpcEvmRpcSubscribeOperationGroups,
		delivery: SourceDelivery.RemoteLive,
		credentials: voltaireJsonRpcCredentials,
		artifacts: voltaireJsonRpcArtifacts,
	},
	{
		source: Source.Voltaire_JsonRpc,
		target: {
			kind: SourceTargetKind.Eip155Chain,
			key: '42220',
		},
		endpoints: [
			{
				endpointKind: SourceEndpointKind.HttpUrl,
				locator: 'https://forno.celo.org',
				origin: 'https://forno.celo.org',
				corsEnabled: false,
			},
		],
		wireProtocol: WireProtocol.JsonRpc2,
		apiFamily: ApiFamily.EvmExecutionJsonRpc,
		operationGroups: voltaireJsonRpcEvmRpcCoreEvmRpcTraceEvmRpcTxpoolOperationGroups,
		delivery: SourceDelivery.HttpProxy,
		credentials: voltaireJsonRpcCredentials,
		artifacts: voltaireJsonRpcArtifacts,
	},
	{
		source: Source.Voltaire_JsonRpc,
		target: {
			kind: SourceTargetKind.Eip155Chain,
			key: '42220',
		},
		endpoints: [
			{
				endpointKind: SourceEndpointKind.WebSocketUrl,
				locator: 'wss://forno.celo.org',
			},
		],
		wireProtocol: WireProtocol.JsonRpc2,
		apiFamily: ApiFamily.EvmExecutionJsonRpc,
		operationGroups: voltaireJsonRpcEvmRpcSubscribeOperationGroups,
		delivery: SourceDelivery.RemoteLive,
		credentials: voltaireJsonRpcCredentials,
		artifacts: voltaireJsonRpcArtifacts,
	},
	{
		source: Source.Voltaire_JsonRpc,
		target: {
			kind: SourceTargetKind.Eip155Chain,
			key: '43113',
		},
		endpoints: [
			{
				endpointKind: SourceEndpointKind.HttpUrl,
				locator: 'https://api.avax-test.network/ext/bc/C/rpc',
				origin: 'https://api.avax-test.network',
				corsEnabled: false,
			},
		],
		wireProtocol: WireProtocol.JsonRpc2,
		apiFamily: ApiFamily.EvmExecutionJsonRpc,
		operationGroups: voltaireJsonRpcEvmRpcCoreEvmRpcTraceEvmRpcTxpoolOperationGroups,
		delivery: SourceDelivery.HttpProxy,
		credentials: voltaireJsonRpcCredentials,
		artifacts: voltaireJsonRpcArtifacts,
	},
	{
		source: Source.Voltaire_JsonRpc,
		target: {
			kind: SourceTargetKind.Eip155Chain,
			key: '43113',
		},
		endpoints: [
			{
				endpointKind: SourceEndpointKind.WebSocketUrl,
				locator: 'wss://api.avax-test.network/ext/bc/C/rpc',
			},
		],
		wireProtocol: WireProtocol.JsonRpc2,
		apiFamily: ApiFamily.EvmExecutionJsonRpc,
		operationGroups: voltaireJsonRpcEvmRpcSubscribeOperationGroups,
		delivery: SourceDelivery.RemoteLive,
		credentials: voltaireJsonRpcCredentials,
		artifacts: voltaireJsonRpcArtifacts,
	},
	{
		source: Source.Voltaire_JsonRpc,
		target: {
			kind: SourceTargetKind.Eip155Chain,
			key: '43114',
		},
		endpoints: [
			{
				endpointKind: SourceEndpointKind.HttpUrl,
				locator: 'https://api.avax.network/ext/bc/C/rpc',
				origin: 'https://api.avax.network',
				corsEnabled: false,
			},
		],
		wireProtocol: WireProtocol.JsonRpc2,
		apiFamily: ApiFamily.EvmExecutionJsonRpc,
		operationGroups: voltaireJsonRpcEvmRpcCoreEvmRpcTraceEvmRpcTxpoolOperationGroups,
		delivery: SourceDelivery.HttpProxy,
		credentials: voltaireJsonRpcCredentials,
		artifacts: voltaireJsonRpcArtifacts,
	},
	{
		source: Source.Voltaire_JsonRpc,
		target: {
			kind: SourceTargetKind.Eip155Chain,
			key: '43114',
		},
		endpoints: [
			{
				endpointKind: SourceEndpointKind.WebSocketUrl,
				locator: 'wss://api.avax.network/ext/bc/C/rpc',
			},
		],
		wireProtocol: WireProtocol.JsonRpc2,
		apiFamily: ApiFamily.EvmExecutionJsonRpc,
		operationGroups: voltaireJsonRpcEvmRpcSubscribeOperationGroups,
		delivery: SourceDelivery.RemoteLive,
		credentials: voltaireJsonRpcCredentials,
		artifacts: voltaireJsonRpcArtifacts,
	},
	{
		source: Source.Voltaire_JsonRpc,
		target: {
			kind: SourceTargetKind.Eip155Chain,
			key: '57073',
		},
		endpoints: [
			{
				endpointKind: SourceEndpointKind.HttpUrl,
				locator: 'https://rpc-gel.inkonchain.com',
				origin: 'https://rpc-gel.inkonchain.com',
				corsEnabled: false,
			},
		],
		wireProtocol: WireProtocol.JsonRpc2,
		apiFamily: ApiFamily.EvmExecutionJsonRpc,
		operationGroups: voltaireJsonRpcEvmRpcCoreEvmRpcTraceEvmRpcTxpoolOperationGroups,
		delivery: SourceDelivery.HttpProxy,
		credentials: voltaireJsonRpcCredentials,
		artifacts: voltaireJsonRpcArtifacts,
	},
	{
		source: Source.Voltaire_JsonRpc,
		target: {
			kind: SourceTargetKind.Eip155Chain,
			key: '57073',
		},
		endpoints: [
			{
				endpointKind: SourceEndpointKind.WebSocketUrl,
				locator: 'wss://rpc-gel.inkonchain.com',
			},
		],
		wireProtocol: WireProtocol.JsonRpc2,
		apiFamily: ApiFamily.EvmExecutionJsonRpc,
		operationGroups: voltaireJsonRpcEvmRpcSubscribeOperationGroups,
		delivery: SourceDelivery.RemoteLive,
		credentials: voltaireJsonRpcCredentials,
		artifacts: voltaireJsonRpcArtifacts,
	},
	{
		source: Source.Voltaire_JsonRpc,
		target: {
			kind: SourceTargetKind.Eip155Chain,
			key: '59141',
		},
		endpoints: [
			{
				endpointKind: SourceEndpointKind.HttpUrl,
				locator: 'https://rpc.sepolia.linea.build',
				origin: 'https://rpc.sepolia.linea.build',
				corsEnabled: false,
			},
		],
		wireProtocol: WireProtocol.JsonRpc2,
		apiFamily: ApiFamily.EvmExecutionJsonRpc,
		operationGroups: voltaireJsonRpcEvmRpcCoreEvmRpcTraceEvmRpcTxpoolOperationGroups,
		delivery: SourceDelivery.HttpProxy,
		credentials: voltaireJsonRpcCredentials,
		artifacts: voltaireJsonRpcArtifacts,
	},
	{
		source: Source.Voltaire_JsonRpc,
		target: {
			kind: SourceTargetKind.Eip155Chain,
			key: '59141',
		},
		endpoints: [
			{
				endpointKind: SourceEndpointKind.WebSocketUrl,
				locator: 'wss://rpc.sepolia.linea.build',
			},
		],
		wireProtocol: WireProtocol.JsonRpc2,
		apiFamily: ApiFamily.EvmExecutionJsonRpc,
		operationGroups: voltaireJsonRpcEvmRpcSubscribeOperationGroups,
		delivery: SourceDelivery.RemoteLive,
		credentials: voltaireJsonRpcCredentials,
		artifacts: voltaireJsonRpcArtifacts,
	},
	{
		source: Source.Voltaire_JsonRpc,
		target: {
			kind: SourceTargetKind.Eip155Chain,
			key: '59144',
		},
		endpoints: [
			{
				endpointKind: SourceEndpointKind.HttpUrl,
				locator: 'https://rpc.linea.build',
				origin: 'https://rpc.linea.build',
				corsEnabled: false,
			},
		],
		wireProtocol: WireProtocol.JsonRpc2,
		apiFamily: ApiFamily.EvmExecutionJsonRpc,
		operationGroups: voltaireJsonRpcEvmRpcCoreEvmRpcTraceEvmRpcTxpoolOperationGroups,
		delivery: SourceDelivery.HttpProxy,
		credentials: voltaireJsonRpcCredentials,
		artifacts: voltaireJsonRpcArtifacts,
	},
	{
		source: Source.Voltaire_JsonRpc,
		target: {
			kind: SourceTargetKind.Eip155Chain,
			key: '59144',
		},
		endpoints: [
			{
				endpointKind: SourceEndpointKind.WebSocketUrl,
				locator: 'wss://rpc.linea.build',
			},
		],
		wireProtocol: WireProtocol.JsonRpc2,
		apiFamily: ApiFamily.EvmExecutionJsonRpc,
		operationGroups: voltaireJsonRpcEvmRpcSubscribeOperationGroups,
		delivery: SourceDelivery.RemoteLive,
		credentials: voltaireJsonRpcCredentials,
		artifacts: voltaireJsonRpcArtifacts,
	},
	{
		source: Source.Voltaire_JsonRpc,
		target: {
			kind: SourceTargetKind.Eip155Chain,
			key: '80002',
		},
		endpoints: [
			{
				endpointKind: SourceEndpointKind.HttpUrl,
				locator: 'https://rpc-amoy.polygon.technology',
				origin: 'https://rpc-amoy.polygon.technology',
				corsEnabled: false,
			},
		],
		wireProtocol: WireProtocol.JsonRpc2,
		apiFamily: ApiFamily.EvmExecutionJsonRpc,
		operationGroups: voltaireJsonRpcEvmRpcCoreEvmRpcTraceEvmRpcTxpoolOperationGroups,
		delivery: SourceDelivery.HttpProxy,
		credentials: voltaireJsonRpcCredentials,
		artifacts: voltaireJsonRpcArtifacts,
	},
	{
		source: Source.Voltaire_JsonRpc,
		target: {
			kind: SourceTargetKind.Eip155Chain,
			key: '80002',
		},
		endpoints: [
			{
				endpointKind: SourceEndpointKind.WebSocketUrl,
				locator: 'wss://rpc-amoy.polygon.technology',
			},
		],
		wireProtocol: WireProtocol.JsonRpc2,
		apiFamily: ApiFamily.EvmExecutionJsonRpc,
		operationGroups: voltaireJsonRpcEvmRpcSubscribeOperationGroups,
		delivery: SourceDelivery.RemoteLive,
		credentials: voltaireJsonRpcCredentials,
		artifacts: voltaireJsonRpcArtifacts,
	},
	{
		source: Source.Voltaire_JsonRpc,
		target: {
			kind: SourceTargetKind.Eip155Chain,
			key: '81224',
		},
		endpoints: [
			{
				endpointKind: SourceEndpointKind.HttpUrl,
				locator: 'https://rpc.codex.xyz',
				origin: 'https://rpc.codex.xyz',
				corsEnabled: false,
			},
		],
		wireProtocol: WireProtocol.JsonRpc2,
		apiFamily: ApiFamily.EvmExecutionJsonRpc,
		operationGroups: voltaireJsonRpcEvmRpcCoreEvmRpcTraceEvmRpcTxpoolOperationGroups,
		delivery: SourceDelivery.HttpProxy,
		credentials: voltaireJsonRpcCredentials,
		artifacts: voltaireJsonRpcArtifacts,
	},
	{
		source: Source.Voltaire_JsonRpc,
		target: {
			kind: SourceTargetKind.Eip155Chain,
			key: '81224',
		},
		endpoints: [
			{
				endpointKind: SourceEndpointKind.WebSocketUrl,
				locator: 'wss://rpc.codex.xyz',
			},
		],
		wireProtocol: WireProtocol.JsonRpc2,
		apiFamily: ApiFamily.EvmExecutionJsonRpc,
		operationGroups: voltaireJsonRpcEvmRpcSubscribeOperationGroups,
		delivery: SourceDelivery.RemoteLive,
		credentials: voltaireJsonRpcCredentials,
		artifacts: voltaireJsonRpcArtifacts,
	},
	{
		source: Source.Voltaire_JsonRpc,
		target: {
			kind: SourceTargetKind.Eip155Chain,
			key: '84532',
		},
		endpoints: [
			{
				endpointKind: SourceEndpointKind.HttpUrl,
				locator: 'https://sepolia.base.org',
				origin: 'https://sepolia.base.org',
				corsEnabled: false,
			},
		],
		wireProtocol: WireProtocol.JsonRpc2,
		apiFamily: ApiFamily.EvmExecutionJsonRpc,
		operationGroups: voltaireJsonRpcEvmRpcCoreEvmRpcTraceEvmRpcTxpoolOperationGroups,
		delivery: SourceDelivery.HttpProxy,
		credentials: voltaireJsonRpcCredentials,
		artifacts: voltaireJsonRpcArtifacts,
	},
	{
		source: Source.Voltaire_JsonRpc,
		target: {
			kind: SourceTargetKind.Eip155Chain,
			key: '84532',
		},
		endpoints: [
			{
				endpointKind: SourceEndpointKind.WebSocketUrl,
				locator: 'wss://sepolia.base.org',
			},
		],
		wireProtocol: WireProtocol.JsonRpc2,
		apiFamily: ApiFamily.EvmExecutionJsonRpc,
		operationGroups: voltaireJsonRpcEvmRpcSubscribeOperationGroups,
		delivery: SourceDelivery.RemoteLive,
		credentials: voltaireJsonRpcCredentials,
		artifacts: voltaireJsonRpcArtifacts,
	},
	{
		source: Source.Voltaire_JsonRpc,
		target: {
			kind: SourceTargetKind.Eip155Chain,
			key: '98866',
		},
		endpoints: [
			{
				endpointKind: SourceEndpointKind.HttpUrl,
				locator: 'https://rpc.plume.org',
				origin: 'https://rpc.plume.org',
				corsEnabled: false,
			},
		],
		wireProtocol: WireProtocol.JsonRpc2,
		apiFamily: ApiFamily.EvmExecutionJsonRpc,
		operationGroups: voltaireJsonRpcEvmRpcCoreEvmRpcTraceEvmRpcTxpoolOperationGroups,
		delivery: SourceDelivery.HttpProxy,
		credentials: voltaireJsonRpcCredentials,
		artifacts: voltaireJsonRpcArtifacts,
	},
	{
		source: Source.Voltaire_JsonRpc,
		target: {
			kind: SourceTargetKind.Eip155Chain,
			key: '98866',
		},
		endpoints: [
			{
				endpointKind: SourceEndpointKind.WebSocketUrl,
				locator: 'wss://rpc.plume.org',
			},
		],
		wireProtocol: WireProtocol.JsonRpc2,
		apiFamily: ApiFamily.EvmExecutionJsonRpc,
		operationGroups: voltaireJsonRpcEvmRpcSubscribeOperationGroups,
		delivery: SourceDelivery.RemoteLive,
		credentials: voltaireJsonRpcCredentials,
		artifacts: voltaireJsonRpcArtifacts,
	},
	{
		source: Source.Voltaire_JsonRpc,
		target: {
			kind: SourceTargetKind.Eip155Chain,
			key: '98867',
		},
		endpoints: [
			{
				endpointKind: SourceEndpointKind.HttpUrl,
				locator: 'https://testnet-rpc.plume.org',
				origin: 'https://testnet-rpc.plume.org',
				corsEnabled: false,
			},
		],
		wireProtocol: WireProtocol.JsonRpc2,
		apiFamily: ApiFamily.EvmExecutionJsonRpc,
		operationGroups: voltaireJsonRpcEvmRpcCoreEvmRpcTraceEvmRpcTxpoolOperationGroups,
		delivery: SourceDelivery.HttpProxy,
		credentials: voltaireJsonRpcCredentials,
		artifacts: voltaireJsonRpcArtifacts,
	},
	{
		source: Source.Voltaire_JsonRpc,
		target: {
			kind: SourceTargetKind.Eip155Chain,
			key: '98867',
		},
		endpoints: [
			{
				endpointKind: SourceEndpointKind.WebSocketUrl,
				locator: 'wss://testnet-rpc.plume.org',
			},
		],
		wireProtocol: WireProtocol.JsonRpc2,
		apiFamily: ApiFamily.EvmExecutionJsonRpc,
		operationGroups: voltaireJsonRpcEvmRpcSubscribeOperationGroups,
		delivery: SourceDelivery.RemoteLive,
		credentials: voltaireJsonRpcCredentials,
		artifacts: voltaireJsonRpcArtifacts,
	},
	{
		source: Source.Voltaire_JsonRpc,
		target: {
			kind: SourceTargetKind.Eip155Chain,
			key: '421614',
		},
		endpoints: [
			{
				endpointKind: SourceEndpointKind.HttpUrl,
				locator: 'https://sepolia-rollup.arbitrum.io/rpc',
				origin: 'https://sepolia-rollup.arbitrum.io',
				corsEnabled: false,
			},
		],
		wireProtocol: WireProtocol.JsonRpc2,
		apiFamily: ApiFamily.EvmExecutionJsonRpc,
		operationGroups: voltaireJsonRpcEvmRpcCoreEvmRpcTraceEvmRpcTxpoolOperationGroups,
		delivery: SourceDelivery.HttpProxy,
		credentials: voltaireJsonRpcCredentials,
		artifacts: voltaireJsonRpcArtifacts,
	},
	{
		source: Source.Voltaire_JsonRpc,
		target: {
			kind: SourceTargetKind.Eip155Chain,
			key: '421614',
		},
		endpoints: [
			{
				endpointKind: SourceEndpointKind.WebSocketUrl,
				locator: 'wss://sepolia-rollup.arbitrum.io/rpc',
			},
		],
		wireProtocol: WireProtocol.JsonRpc2,
		apiFamily: ApiFamily.EvmExecutionJsonRpc,
		operationGroups: voltaireJsonRpcEvmRpcSubscribeOperationGroups,
		delivery: SourceDelivery.RemoteLive,
		credentials: voltaireJsonRpcCredentials,
		artifacts: voltaireJsonRpcArtifacts,
	},
	{
		source: Source.Voltaire_JsonRpc,
		target: {
			kind: SourceTargetKind.Eip155Chain,
			key: '763373',
		},
		endpoints: [
			{
				endpointKind: SourceEndpointKind.HttpUrl,
				locator: 'https://rpc-gel-sepolia.inkonchain.com',
				origin: 'https://rpc-gel-sepolia.inkonchain.com',
				corsEnabled: false,
			},
		],
		wireProtocol: WireProtocol.JsonRpc2,
		apiFamily: ApiFamily.EvmExecutionJsonRpc,
		operationGroups: voltaireJsonRpcEvmRpcCoreEvmRpcTraceEvmRpcTxpoolOperationGroups,
		delivery: SourceDelivery.HttpProxy,
		credentials: voltaireJsonRpcCredentials,
		artifacts: voltaireJsonRpcArtifacts,
	},
	{
		source: Source.Voltaire_JsonRpc,
		target: {
			kind: SourceTargetKind.Eip155Chain,
			key: '763373',
		},
		endpoints: [
			{
				endpointKind: SourceEndpointKind.WebSocketUrl,
				locator: 'wss://rpc-gel-sepolia.inkonchain.com',
			},
		],
		wireProtocol: WireProtocol.JsonRpc2,
		apiFamily: ApiFamily.EvmExecutionJsonRpc,
		operationGroups: voltaireJsonRpcEvmRpcSubscribeOperationGroups,
		delivery: SourceDelivery.RemoteLive,
		credentials: voltaireJsonRpcCredentials,
		artifacts: voltaireJsonRpcArtifacts,
	},
	{
		source: Source.Voltaire_JsonRpc,
		target: {
			kind: SourceTargetKind.Eip155Chain,
			key: '812242',
		},
		endpoints: [
			{
				endpointKind: SourceEndpointKind.HttpUrl,
				locator: 'https://rpc.codex-stg.xyz',
				origin: 'https://rpc.codex-stg.xyz',
				corsEnabled: false,
			},
		],
		wireProtocol: WireProtocol.JsonRpc2,
		apiFamily: ApiFamily.EvmExecutionJsonRpc,
		operationGroups: voltaireJsonRpcEvmRpcCoreEvmRpcTraceEvmRpcTxpoolOperationGroups,
		delivery: SourceDelivery.HttpProxy,
		credentials: voltaireJsonRpcCredentials,
		artifacts: voltaireJsonRpcArtifacts,
	},
	{
		source: Source.Voltaire_JsonRpc,
		target: {
			kind: SourceTargetKind.Eip155Chain,
			key: '812242',
		},
		endpoints: [
			{
				endpointKind: SourceEndpointKind.WebSocketUrl,
				locator: 'wss://rpc.codex-stg.xyz',
			},
		],
		wireProtocol: WireProtocol.JsonRpc2,
		apiFamily: ApiFamily.EvmExecutionJsonRpc,
		operationGroups: voltaireJsonRpcEvmRpcSubscribeOperationGroups,
		delivery: SourceDelivery.RemoteLive,
		credentials: voltaireJsonRpcCredentials,
		artifacts: voltaireJsonRpcArtifacts,
	},
	{
		source: Source.Voltaire_JsonRpc,
		target: {
			kind: SourceTargetKind.Eip155Chain,
			key: '5042002',
		},
		endpoints: [
			{
				endpointKind: SourceEndpointKind.HttpUrl,
				locator: 'https://rpc.testnet.arc.network',
				origin: 'https://rpc.testnet.arc.network',
				corsEnabled: false,
			},
		],
		wireProtocol: WireProtocol.JsonRpc2,
		apiFamily: ApiFamily.EvmExecutionJsonRpc,
		operationGroups: voltaireJsonRpcEvmRpcCoreEvmRpcTraceEvmRpcTxpoolOperationGroups,
		delivery: SourceDelivery.HttpProxy,
		credentials: voltaireJsonRpcCredentials,
		artifacts: voltaireJsonRpcArtifacts,
	},
	{
		source: Source.Voltaire_JsonRpc,
		target: {
			kind: SourceTargetKind.Eip155Chain,
			key: '5042002',
		},
		endpoints: [
			{
				endpointKind: SourceEndpointKind.WebSocketUrl,
				locator: 'wss://rpc.testnet.arc.network',
			},
		],
		wireProtocol: WireProtocol.JsonRpc2,
		apiFamily: ApiFamily.EvmExecutionJsonRpc,
		operationGroups: voltaireJsonRpcEvmRpcSubscribeOperationGroups,
		delivery: SourceDelivery.RemoteLive,
		credentials: voltaireJsonRpcCredentials,
		artifacts: voltaireJsonRpcArtifacts,
	},
	{
		source: Source.Voltaire_JsonRpc,
		target: {
			kind: SourceTargetKind.Eip155Chain,
			key: '11142220',
		},
		endpoints: [
			{
				endpointKind: SourceEndpointKind.HttpUrl,
				locator: 'https://forno.celo-sepolia.celo-testnet.org',
				origin: 'https://forno.celo-sepolia.celo-testnet.org',
				corsEnabled: false,
			},
		],
		wireProtocol: WireProtocol.JsonRpc2,
		apiFamily: ApiFamily.EvmExecutionJsonRpc,
		operationGroups: voltaireJsonRpcEvmRpcCoreEvmRpcTraceEvmRpcTxpoolOperationGroups,
		delivery: SourceDelivery.HttpProxy,
		credentials: voltaireJsonRpcCredentials,
		artifacts: voltaireJsonRpcArtifacts,
	},
	{
		source: Source.Voltaire_JsonRpc,
		target: {
			kind: SourceTargetKind.Eip155Chain,
			key: '11142220',
		},
		endpoints: [
			{
				endpointKind: SourceEndpointKind.WebSocketUrl,
				locator: 'wss://forno.celo-sepolia.celo-testnet.org',
			},
		],
		wireProtocol: WireProtocol.JsonRpc2,
		apiFamily: ApiFamily.EvmExecutionJsonRpc,
		operationGroups: voltaireJsonRpcEvmRpcSubscribeOperationGroups,
		delivery: SourceDelivery.RemoteLive,
		credentials: voltaireJsonRpcCredentials,
		artifacts: voltaireJsonRpcArtifacts,
	},
	{
		source: Source.Voltaire_JsonRpc,
		target: {
			kind: SourceTargetKind.Eip155Chain,
			key: '11155111',
		},
		endpoints: [
			{
				endpointKind: SourceEndpointKind.HttpUrl,
				locator: 'https://ethereum-sepolia-rpc.publicnode.com',
				origin: 'https://ethereum-sepolia-rpc.publicnode.com',
				corsEnabled: false,
			},
		],
		wireProtocol: WireProtocol.JsonRpc2,
		apiFamily: ApiFamily.EvmExecutionJsonRpc,
		operationGroups: voltaireJsonRpcEvmRpcCoreEvmRpcTraceEvmRpcTxpoolOperationGroups,
		delivery: SourceDelivery.HttpProxy,
		credentials: voltaireJsonRpcCredentials,
		artifacts: voltaireJsonRpcArtifacts,
	},
	{
		source: Source.Voltaire_JsonRpc,
		target: {
			kind: SourceTargetKind.Eip155Chain,
			key: '11155111',
		},
		endpoints: [
			{
				endpointKind: SourceEndpointKind.WebSocketUrl,
				locator: 'wss://ethereum-sepolia-rpc.publicnode.com',
			},
		],
		wireProtocol: WireProtocol.JsonRpc2,
		apiFamily: ApiFamily.EvmExecutionJsonRpc,
		operationGroups: voltaireJsonRpcEvmRpcSubscribeOperationGroups,
		delivery: SourceDelivery.RemoteLive,
		credentials: voltaireJsonRpcCredentials,
		artifacts: voltaireJsonRpcArtifacts,
	},
	{
		source: Source.Voltaire_JsonRpc,
		target: {
			kind: SourceTargetKind.Eip155Chain,
			key: '11155420',
		},
		endpoints: [
			{
				endpointKind: SourceEndpointKind.HttpUrl,
				locator: 'https://sepolia.optimism.io',
				origin: 'https://sepolia.optimism.io',
				corsEnabled: false,
			},
		],
		wireProtocol: WireProtocol.JsonRpc2,
		apiFamily: ApiFamily.EvmExecutionJsonRpc,
		operationGroups: voltaireJsonRpcEvmRpcCoreEvmRpcTraceEvmRpcTxpoolOperationGroups,
		delivery: SourceDelivery.HttpProxy,
		credentials: voltaireJsonRpcCredentials,
		artifacts: voltaireJsonRpcArtifacts,
	},
	{
		source: Source.Voltaire_JsonRpc,
		target: {
			kind: SourceTargetKind.Eip155Chain,
			key: '11155420',
		},
		endpoints: [
			{
				endpointKind: SourceEndpointKind.WebSocketUrl,
				locator: 'wss://sepolia.optimism.io',
			},
		],
		wireProtocol: WireProtocol.JsonRpc2,
		apiFamily: ApiFamily.EvmExecutionJsonRpc,
		operationGroups: voltaireJsonRpcEvmRpcSubscribeOperationGroups,
		delivery: SourceDelivery.RemoteLive,
		credentials: voltaireJsonRpcCredentials,
		artifacts: voltaireJsonRpcArtifacts,
	},
] as const satisfies readonly SourceBinding[]

export default indexSourceBindings<{ readonly [Source.Voltaire_JsonRpc]: readonly [typeof bindings[0], typeof bindings[1], typeof bindings[2], typeof bindings[3], typeof bindings[4], typeof bindings[5], typeof bindings[6], typeof bindings[7], typeof bindings[8], typeof bindings[9], typeof bindings[10], typeof bindings[11], typeof bindings[12], typeof bindings[13], typeof bindings[14], typeof bindings[15], typeof bindings[16], typeof bindings[17], typeof bindings[18], typeof bindings[19], typeof bindings[20], typeof bindings[21], typeof bindings[22], typeof bindings[23], typeof bindings[24], typeof bindings[25], typeof bindings[26], typeof bindings[27], typeof bindings[28], typeof bindings[29], typeof bindings[30], typeof bindings[31], typeof bindings[32], typeof bindings[33], typeof bindings[34], typeof bindings[35], typeof bindings[36], typeof bindings[37], typeof bindings[38], typeof bindings[39], typeof bindings[40], typeof bindings[41], typeof bindings[42], typeof bindings[43], typeof bindings[44], typeof bindings[45], typeof bindings[46], typeof bindings[47], typeof bindings[48], typeof bindings[49], typeof bindings[50], typeof bindings[51], typeof bindings[52], typeof bindings[53], typeof bindings[54], typeof bindings[55], typeof bindings[56], typeof bindings[57], typeof bindings[58], typeof bindings[59], typeof bindings[60], typeof bindings[61], typeof bindings[62], typeof bindings[63], typeof bindings[64], typeof bindings[65], typeof bindings[66], typeof bindings[67], typeof bindings[68], typeof bindings[69], typeof bindings[70], typeof bindings[71], typeof bindings[72], typeof bindings[73], typeof bindings[74], typeof bindings[75], typeof bindings[76], typeof bindings[77], typeof bindings[78], typeof bindings[79]] }>(bindings)

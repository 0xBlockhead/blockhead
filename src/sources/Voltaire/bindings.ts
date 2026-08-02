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
	type SourceBinding,
} from '$/sources/SourceBinding.ts'

const voltaireJsonRpcEvmRpcCoreEvmRpcTraceEvmRpcTxpoolOperationGroups = [
	SourceOperationGroup.EvmRpcCore,
	SourceOperationGroup.EvmRpcTrace,
	SourceOperationGroup.EvmRpcTxpool,
] as const
const voltaireJsonRpcArtifacts = [
	{
		kind: SourceArtifactKind.OpenRpcSpec,
		path: 'src/sources/_shared/interfaces/EvmExecutionJsonRpc/OpenRpc/src',
	},
	{
		kind: SourceArtifactKind.GenerationManifest,
		path: 'src/sources/_shared/interfaces/EvmExecutionJsonRpc/OpenRpc/schema-source.ts',
	},
] as const

const voltaireJsonRpcRemoteLiveBindingAxes = {
	source: Source.Voltaire_JsonRpc,
	wireProtocol: WireProtocol.JsonRpc2,
	apiFamily: ApiFamily.EvmExecutionJsonRpc,
	operationGroups: [
		SourceOperationGroup.EvmRpcSubscribe,
	],
	delivery: SourceDelivery.RemoteLive,
	credentials: [],
	artifacts: voltaireJsonRpcArtifacts,
} as const
const voltaireJsonRpcHttpProxyBindingAxes = {
	source: Source.Voltaire_JsonRpc,
	wireProtocol: WireProtocol.JsonRpc2,
	apiFamily: ApiFamily.EvmExecutionJsonRpc,
	operationGroups: voltaireJsonRpcEvmRpcCoreEvmRpcTraceEvmRpcTxpoolOperationGroups,
	delivery: SourceDelivery.HttpProxy,
	credentials: [],
	artifacts: voltaireJsonRpcArtifacts,
} as const
const voltaireJsonRpcBrowserDirectBindingAxes = {
	source: Source.Voltaire_JsonRpc,
	wireProtocol: WireProtocol.JsonRpc2,
	apiFamily: ApiFamily.EvmExecutionJsonRpc,
	operationGroups: voltaireJsonRpcEvmRpcCoreEvmRpcTraceEvmRpcTxpoolOperationGroups,
	delivery: SourceDelivery.BrowserDirect,
	credentials: [],
	artifacts: voltaireJsonRpcArtifacts,
} as const

export default indexSourceBindings([
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
				corsEnabled: false,
			},
			{
				endpointKind: SourceEndpointKind.HttpUrl,
				locator: 'https://eth.drpc.org',
				corsEnabled: true,
			},
			{
				endpointKind: SourceEndpointKind.HttpUrl,
				locator: 'https://eth.llamarpc.com',
				corsEnabled: false,
			},
			{
				endpointKind: SourceEndpointKind.HttpUrl,
				locator: 'https://mainnet.rpc.buidlguidl.com',
				corsEnabled: false,
			},
			{
				endpointKind: SourceEndpointKind.HttpUrl,
				locator: 'https://evm.stupidtech.net',
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
		credentials: [],
		artifacts: voltaireJsonRpcArtifacts,
	},
	{
		...voltaireJsonRpcRemoteLiveBindingAxes,
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
	},
	{
		...voltaireJsonRpcHttpProxyBindingAxes,
		target: {
			kind: SourceTargetKind.Eip155Chain,
			key: '10',
		},
		endpoints: [
			{
				endpointKind: SourceEndpointKind.HttpUrl,
				locator: 'https://mainnet.optimism.io',
				corsEnabled: false,
			},
		],
	},
	{
		...voltaireJsonRpcRemoteLiveBindingAxes,
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
	},
	{
		...voltaireJsonRpcHttpProxyBindingAxes,
		target: {
			kind: SourceTargetKind.Eip155Chain,
			key: '50',
		},
		endpoints: [
			{
				endpointKind: SourceEndpointKind.HttpUrl,
				locator: 'https://erpc.xinfin.network',
				corsEnabled: false,
			},
		],
	},
	{
		...voltaireJsonRpcRemoteLiveBindingAxes,
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
	},
	{
		...voltaireJsonRpcHttpProxyBindingAxes,
		target: {
			kind: SourceTargetKind.Eip155Chain,
			key: '51',
		},
		endpoints: [
			{
				endpointKind: SourceEndpointKind.HttpUrl,
				locator: 'https://rpc.apothem.network',
				corsEnabled: false,
			},
		],
	},
	{
		...voltaireJsonRpcRemoteLiveBindingAxes,
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
	},
	{
		...voltaireJsonRpcHttpProxyBindingAxes,
		target: {
			kind: SourceTargetKind.Eip155Chain,
			key: '56',
		},
		endpoints: [
			{
				endpointKind: SourceEndpointKind.HttpUrl,
				locator: 'https://binance.llamarpc.com',
				corsEnabled: false,
			},
		],
	},
	{
		...voltaireJsonRpcRemoteLiveBindingAxes,
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
	},
	{
		...voltaireJsonRpcHttpProxyBindingAxes,
		target: {
			kind: SourceTargetKind.Eip155Chain,
			key: '130',
		},
		endpoints: [
			{
				endpointKind: SourceEndpointKind.HttpUrl,
				locator: 'https://unichain-rpc.publicnode.com',
				corsEnabled: false,
			},
		],
	},
	{
		...voltaireJsonRpcRemoteLiveBindingAxes,
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
	},
	{
		...voltaireJsonRpcHttpProxyBindingAxes,
		target: {
			kind: SourceTargetKind.Eip155Chain,
			key: '137',
		},
		endpoints: [
			{
				endpointKind: SourceEndpointKind.HttpUrl,
				locator: 'https://polygon-rpc.com',
				corsEnabled: false,
			},
		],
	},
	{
		...voltaireJsonRpcRemoteLiveBindingAxes,
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
	},
	{
		...voltaireJsonRpcHttpProxyBindingAxes,
		target: {
			kind: SourceTargetKind.Eip155Chain,
			key: '143',
		},
		endpoints: [
			{
				endpointKind: SourceEndpointKind.HttpUrl,
				locator: 'https://rpc.monad.xyz',
				corsEnabled: false,
			},
		],
	},
	{
		...voltaireJsonRpcRemoteLiveBindingAxes,
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
	},
	{
		...voltaireJsonRpcHttpProxyBindingAxes,
		target: {
			kind: SourceTargetKind.Eip155Chain,
			key: '146',
		},
		endpoints: [
			{
				endpointKind: SourceEndpointKind.HttpUrl,
				locator: 'https://rpc.soniclabs.com',
				corsEnabled: false,
			},
		],
	},
	{
		...voltaireJsonRpcRemoteLiveBindingAxes,
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
	},
	{
		...voltaireJsonRpcHttpProxyBindingAxes,
		target: {
			kind: SourceTargetKind.Eip155Chain,
			key: '300',
		},
		endpoints: [
			{
				endpointKind: SourceEndpointKind.HttpUrl,
				locator: 'https://sepolia.era.zksync.dev',
				corsEnabled: false,
			},
		],
	},
	{
		...voltaireJsonRpcRemoteLiveBindingAxes,
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
	},
	{
		...voltaireJsonRpcHttpProxyBindingAxes,
		target: {
			kind: SourceTargetKind.Eip155Chain,
			key: '324',
		},
		endpoints: [
			{
				endpointKind: SourceEndpointKind.HttpUrl,
				locator: 'https://mainnet.era.zksync.io',
				corsEnabled: false,
			},
		],
	},
	{
		...voltaireJsonRpcRemoteLiveBindingAxes,
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
	},
	{
		...voltaireJsonRpcHttpProxyBindingAxes,
		target: {
			kind: SourceTargetKind.Eip155Chain,
			key: '480',
		},
		endpoints: [
			{
				endpointKind: SourceEndpointKind.HttpUrl,
				locator: 'https://worldchain-mainnet.g.alchemy.com/public',
				corsEnabled: false,
			},
		],
	},
	{
		...voltaireJsonRpcRemoteLiveBindingAxes,
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
	},
	{
		...voltaireJsonRpcBrowserDirectBindingAxes,
		target: {
			kind: SourceTargetKind.Eip155Chain,
			key: '998',
		},
		endpoints: [
			{
				endpointKind: SourceEndpointKind.HttpUrl,
				locator: 'https://hyperliquid-testnet.drpc.org',
				corsEnabled: true,
			},
		],
	},
	{
		...voltaireJsonRpcRemoteLiveBindingAxes,
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
	},
	{
		...voltaireJsonRpcBrowserDirectBindingAxes,
		target: {
			kind: SourceTargetKind.Eip155Chain,
			key: '999',
		},
		endpoints: [
			{
				endpointKind: SourceEndpointKind.HttpUrl,
				locator: 'https://hyperliquid.drpc.org',
				corsEnabled: true,
			},
		],
	},
	{
		...voltaireJsonRpcRemoteLiveBindingAxes,
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
	},
	{
		...voltaireJsonRpcHttpProxyBindingAxes,
		target: {
			kind: SourceTargetKind.Eip155Chain,
			key: '1301',
		},
		endpoints: [
			{
				endpointKind: SourceEndpointKind.HttpUrl,
				locator: 'https://sepolia.unichain.org',
				corsEnabled: false,
			},
		],
	},
	{
		...voltaireJsonRpcRemoteLiveBindingAxes,
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
	},
	{
		...voltaireJsonRpcHttpProxyBindingAxes,
		target: {
			kind: SourceTargetKind.Eip155Chain,
			key: '1328',
		},
		endpoints: [
			{
				endpointKind: SourceEndpointKind.HttpUrl,
				locator: 'https://evm-rpc-testnet.sei-apis.com',
				corsEnabled: false,
			},
		],
	},
	{
		...voltaireJsonRpcRemoteLiveBindingAxes,
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
	},
	{
		...voltaireJsonRpcHttpProxyBindingAxes,
		target: {
			kind: SourceTargetKind.Eip155Chain,
			key: '1329',
		},
		endpoints: [
			{
				endpointKind: SourceEndpointKind.HttpUrl,
				locator: 'https://evm-rpc.sei-apis.com',
				corsEnabled: false,
			},
		],
	},
	{
		...voltaireJsonRpcRemoteLiveBindingAxes,
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
	},
	{
		...voltaireJsonRpcHttpProxyBindingAxes,
		target: {
			kind: SourceTargetKind.Eip155Chain,
			key: '4801',
		},
		endpoints: [
			{
				endpointKind: SourceEndpointKind.HttpUrl,
				locator: 'https://worldchain-sepolia.g.alchemy.com/public',
				corsEnabled: false,
			},
		],
	},
	{
		...voltaireJsonRpcRemoteLiveBindingAxes,
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
	},
	{
		...voltaireJsonRpcHttpProxyBindingAxes,
		target: {
			kind: SourceTargetKind.Eip155Chain,
			key: '8453',
		},
		endpoints: [
			{
				endpointKind: SourceEndpointKind.HttpUrl,
				locator: 'https://mainnet.base.org',
				corsEnabled: false,
			},
			{
				endpointKind: SourceEndpointKind.HttpUrl,
				locator: 'https://base.llamarpc.com',
				corsEnabled: false,
			},
		],
	},
	{
		...voltaireJsonRpcRemoteLiveBindingAxes,
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
	},
	{
		...voltaireJsonRpcHttpProxyBindingAxes,
		target: {
			kind: SourceTargetKind.Eip155Chain,
			key: '10143',
		},
		endpoints: [
			{
				endpointKind: SourceEndpointKind.HttpUrl,
				locator: 'https://testnet-rpc.monad.xyz',
				corsEnabled: false,
			},
		],
	},
	{
		...voltaireJsonRpcRemoteLiveBindingAxes,
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
	},
	{
		...voltaireJsonRpcHttpProxyBindingAxes,
		target: {
			kind: SourceTargetKind.Eip155Chain,
			key: '14601',
		},
		endpoints: [
			{
				endpointKind: SourceEndpointKind.HttpUrl,
				locator: 'https://rpc.testnet.soniclabs.com',
				corsEnabled: false,
			},
		],
	},
	{
		...voltaireJsonRpcRemoteLiveBindingAxes,
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
	},
	{
		...voltaireJsonRpcHttpProxyBindingAxes,
		target: {
			kind: SourceTargetKind.Eip155Chain,
			key: '42161',
		},
		endpoints: [
			{
				endpointKind: SourceEndpointKind.HttpUrl,
				locator: 'https://arb1.arbitrum.io/rpc',
				corsEnabled: false,
			},
		],
	},
	{
		...voltaireJsonRpcRemoteLiveBindingAxes,
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
	},
	{
		...voltaireJsonRpcHttpProxyBindingAxes,
		target: {
			kind: SourceTargetKind.Eip155Chain,
			key: '42220',
		},
		endpoints: [
			{
				endpointKind: SourceEndpointKind.HttpUrl,
				locator: 'https://forno.celo.org',
				corsEnabled: false,
			},
		],
	},
	{
		...voltaireJsonRpcRemoteLiveBindingAxes,
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
	},
	{
		...voltaireJsonRpcHttpProxyBindingAxes,
		target: {
			kind: SourceTargetKind.Eip155Chain,
			key: '43113',
		},
		endpoints: [
			{
				endpointKind: SourceEndpointKind.HttpUrl,
				locator: 'https://api.avax-test.network/ext/bc/C/rpc',
				corsEnabled: false,
			},
		],
	},
	{
		...voltaireJsonRpcRemoteLiveBindingAxes,
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
	},
	{
		...voltaireJsonRpcHttpProxyBindingAxes,
		target: {
			kind: SourceTargetKind.Eip155Chain,
			key: '43114',
		},
		endpoints: [
			{
				endpointKind: SourceEndpointKind.HttpUrl,
				locator: 'https://api.avax.network/ext/bc/C/rpc',
				corsEnabled: false,
			},
		],
	},
	{
		...voltaireJsonRpcRemoteLiveBindingAxes,
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
	},
	{
		...voltaireJsonRpcHttpProxyBindingAxes,
		target: {
			kind: SourceTargetKind.Eip155Chain,
			key: '57073',
		},
		endpoints: [
			{
				endpointKind: SourceEndpointKind.HttpUrl,
				locator: 'https://rpc-gel.inkonchain.com',
				corsEnabled: false,
			},
		],
	},
	{
		...voltaireJsonRpcRemoteLiveBindingAxes,
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
	},
	{
		...voltaireJsonRpcHttpProxyBindingAxes,
		target: {
			kind: SourceTargetKind.Eip155Chain,
			key: '59141',
		},
		endpoints: [
			{
				endpointKind: SourceEndpointKind.HttpUrl,
				locator: 'https://rpc.sepolia.linea.build',
				corsEnabled: false,
			},
		],
	},
	{
		...voltaireJsonRpcRemoteLiveBindingAxes,
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
	},
	{
		...voltaireJsonRpcHttpProxyBindingAxes,
		target: {
			kind: SourceTargetKind.Eip155Chain,
			key: '59144',
		},
		endpoints: [
			{
				endpointKind: SourceEndpointKind.HttpUrl,
				locator: 'https://rpc.linea.build',
				corsEnabled: false,
			},
		],
	},
	{
		...voltaireJsonRpcRemoteLiveBindingAxes,
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
	},
	{
		...voltaireJsonRpcHttpProxyBindingAxes,
		target: {
			kind: SourceTargetKind.Eip155Chain,
			key: '80002',
		},
		endpoints: [
			{
				endpointKind: SourceEndpointKind.HttpUrl,
				locator: 'https://rpc-amoy.polygon.technology',
				corsEnabled: false,
			},
		],
	},
	{
		...voltaireJsonRpcRemoteLiveBindingAxes,
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
	},
	{
		...voltaireJsonRpcHttpProxyBindingAxes,
		target: {
			kind: SourceTargetKind.Eip155Chain,
			key: '81224',
		},
		endpoints: [
			{
				endpointKind: SourceEndpointKind.HttpUrl,
				locator: 'https://rpc.codex.xyz',
				corsEnabled: false,
			},
		],
	},
	{
		...voltaireJsonRpcRemoteLiveBindingAxes,
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
	},
	{
		...voltaireJsonRpcHttpProxyBindingAxes,
		target: {
			kind: SourceTargetKind.Eip155Chain,
			key: '84532',
		},
		endpoints: [
			{
				endpointKind: SourceEndpointKind.HttpUrl,
				locator: 'https://sepolia.base.org',
				corsEnabled: false,
			},
		],
	},
	{
		...voltaireJsonRpcRemoteLiveBindingAxes,
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
	},
	{
		...voltaireJsonRpcHttpProxyBindingAxes,
		target: {
			kind: SourceTargetKind.Eip155Chain,
			key: '98866',
		},
		endpoints: [
			{
				endpointKind: SourceEndpointKind.HttpUrl,
				locator: 'https://rpc.plume.org',
				corsEnabled: false,
			},
		],
	},
	{
		...voltaireJsonRpcRemoteLiveBindingAxes,
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
	},
	{
		...voltaireJsonRpcHttpProxyBindingAxes,
		target: {
			kind: SourceTargetKind.Eip155Chain,
			key: '98867',
		},
		endpoints: [
			{
				endpointKind: SourceEndpointKind.HttpUrl,
				locator: 'https://testnet-rpc.plume.org',
				corsEnabled: false,
			},
		],
	},
	{
		...voltaireJsonRpcRemoteLiveBindingAxes,
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
	},
	{
		...voltaireJsonRpcHttpProxyBindingAxes,
		target: {
			kind: SourceTargetKind.Eip155Chain,
			key: '421614',
		},
		endpoints: [
			{
				endpointKind: SourceEndpointKind.HttpUrl,
				locator: 'https://sepolia-rollup.arbitrum.io/rpc',
				corsEnabled: false,
			},
		],
	},
	{
		...voltaireJsonRpcRemoteLiveBindingAxes,
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
	},
	{
		...voltaireJsonRpcHttpProxyBindingAxes,
		target: {
			kind: SourceTargetKind.Eip155Chain,
			key: '763373',
		},
		endpoints: [
			{
				endpointKind: SourceEndpointKind.HttpUrl,
				locator: 'https://rpc-gel-sepolia.inkonchain.com',
				corsEnabled: false,
			},
		],
	},
	{
		...voltaireJsonRpcRemoteLiveBindingAxes,
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
	},
	{
		...voltaireJsonRpcHttpProxyBindingAxes,
		target: {
			kind: SourceTargetKind.Eip155Chain,
			key: '812242',
		},
		endpoints: [
			{
				endpointKind: SourceEndpointKind.HttpUrl,
				locator: 'https://rpc.codex-stg.xyz',
				corsEnabled: false,
			},
		],
	},
	{
		...voltaireJsonRpcRemoteLiveBindingAxes,
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
	},
	{
		...voltaireJsonRpcHttpProxyBindingAxes,
		target: {
			kind: SourceTargetKind.Eip155Chain,
			key: '5042002',
		},
		endpoints: [
			{
				endpointKind: SourceEndpointKind.HttpUrl,
				locator: 'https://rpc.testnet.arc.network',
				corsEnabled: false,
			},
		],
	},
	{
		...voltaireJsonRpcRemoteLiveBindingAxes,
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
	},
	{
		...voltaireJsonRpcHttpProxyBindingAxes,
		target: {
			kind: SourceTargetKind.Eip155Chain,
			key: '11142220',
		},
		endpoints: [
			{
				endpointKind: SourceEndpointKind.HttpUrl,
				locator: 'https://forno.celo-sepolia.celo-testnet.org',
				corsEnabled: false,
			},
		],
	},
	{
		...voltaireJsonRpcRemoteLiveBindingAxes,
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
	},
	{
		...voltaireJsonRpcHttpProxyBindingAxes,
		target: {
			kind: SourceTargetKind.Eip155Chain,
			key: '11155111',
		},
		endpoints: [
			{
				endpointKind: SourceEndpointKind.HttpUrl,
				locator: 'https://ethereum-sepolia-rpc.publicnode.com',
				corsEnabled: false,
			},
		],
	},
	{
		...voltaireJsonRpcRemoteLiveBindingAxes,
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
	},
	{
		...voltaireJsonRpcHttpProxyBindingAxes,
		target: {
			kind: SourceTargetKind.Eip155Chain,
			key: '11155420',
		},
		endpoints: [
			{
				endpointKind: SourceEndpointKind.HttpUrl,
				locator: 'https://sepolia.optimism.io',
				corsEnabled: false,
			},
		],
	},
	{
		...voltaireJsonRpcRemoteLiveBindingAxes,
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
	},
] as const satisfies readonly SourceBinding[])

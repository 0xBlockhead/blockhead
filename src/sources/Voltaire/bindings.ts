import { Source } from '$/sources/Source.ts'
import {
	ApiFamily,
	flatMapSourceBindings,
	indexSourceBindings,
	SourceArtifactKind,
	SourceDelivery,
	SourceEndpointKind,
	SourceOperationGroup,
	SourceTargetKind,
	WireProtocol,
} from '$/sources/SourceBinding.ts'

const voltaireJsonRpcEvmRpcCoreEvmRpcTraceEvmRpcTxpoolOperationGroups = [
	SourceOperationGroup.EvmRpcCore,
	SourceOperationGroup.EvmRpcTrace,
	SourceOperationGroup.EvmRpcTxpool,
] as const
const voltaireJsonRpcArtifacts = [
	{
		kind: SourceArtifactKind.GenerationManifest,
		path: 'src/sources/_shared/interfaces/EvmExecutionJsonRpc/OpenRpc/schema-source.ts',
	},
	{
		kind: SourceArtifactKind.OpenRpcSpec,
		path: 'src/sources/_shared/interfaces/EvmExecutionJsonRpc/OpenRpc/src',
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
	...flatMapSourceBindings(
		[
			{
				key: '10',
				httpProxyLocator: 'https://mainnet.optimism.io',
				remoteLiveLocator: 'wss://mainnet.optimism.io',
			},
			{
				key: '50',
				httpProxyLocator: 'https://erpc.xinfin.network',
				remoteLiveLocator: 'wss://erpc.xinfin.network',
			},
			{
				key: '51',
				httpProxyLocator: 'https://rpc.apothem.network',
				remoteLiveLocator: 'wss://rpc.apothem.network',
			},
			{
				key: '56',
				httpProxyLocator: 'https://binance.llamarpc.com',
				remoteLiveLocator: 'wss://binance.llamarpc.com',
			},
			{
				key: '130',
				httpProxyLocator: 'https://unichain-rpc.publicnode.com',
				remoteLiveLocator: 'wss://unichain-rpc.publicnode.com',
			},
			{
				key: '137',
				httpProxyLocator: 'https://polygon-rpc.com',
				remoteLiveLocator: 'wss://polygon-rpc.com',
			},
			{
				key: '143',
				httpProxyLocator: 'https://rpc.monad.xyz',
				remoteLiveLocator: 'wss://rpc.monad.xyz',
			},
			{
				key: '146',
				httpProxyLocator: 'https://rpc.soniclabs.com',
				remoteLiveLocator: 'wss://rpc.soniclabs.com',
			},
			{
				key: '300',
				httpProxyLocator: 'https://sepolia.era.zksync.dev',
				remoteLiveLocator: 'wss://sepolia.era.zksync.dev',
			},
			{
				key: '324',
				httpProxyLocator: 'https://mainnet.era.zksync.io',
				remoteLiveLocator: 'wss://mainnet.era.zksync.io',
			},
			{
				key: '480',
				httpProxyLocator: 'https://worldchain-mainnet.g.alchemy.com/public',
				remoteLiveLocator: 'wss://worldchain-mainnet.g.alchemy.com/public',
			},
		] as const,
		({
			key,
			httpProxyLocator,
			remoteLiveLocator,
		}) => ([
			{
				...voltaireJsonRpcHttpProxyBindingAxes,
				target: {
					kind: SourceTargetKind.Eip155Chain,
					key,
				},
				endpoints: [
					{
						endpointKind: SourceEndpointKind.HttpUrl,
						locator: httpProxyLocator,
						corsEnabled: false,
					},
				],
			},
			{
				...voltaireJsonRpcRemoteLiveBindingAxes,
				target: {
					kind: SourceTargetKind.Eip155Chain,
					key,
				},
				endpoints: [
					{
						endpointKind: SourceEndpointKind.WebSocketUrl,
						locator: remoteLiveLocator,
					},
				],
			},
		] as const)
	),
	...flatMapSourceBindings(
		[
			{
				key: '998',
				browserDirectLocator: 'https://hyperliquid-testnet.drpc.org',
				remoteLiveLocator: 'wss://hyperliquid-testnet.drpc.org',
			},
			{
				key: '999',
				browserDirectLocator: 'https://hyperliquid.drpc.org',
				remoteLiveLocator: 'wss://hyperliquid.drpc.org',
			},
		] as const,
		({
			key,
			browserDirectLocator,
			remoteLiveLocator,
		}) => ([
			{
				...voltaireJsonRpcBrowserDirectBindingAxes,
				target: {
					kind: SourceTargetKind.Eip155Chain,
					key,
				},
				endpoints: [
					{
						endpointKind: SourceEndpointKind.HttpUrl,
						locator: browserDirectLocator,
						corsEnabled: true,
					},
				],
			},
			{
				...voltaireJsonRpcRemoteLiveBindingAxes,
				target: {
					kind: SourceTargetKind.Eip155Chain,
					key,
				},
				endpoints: [
					{
						endpointKind: SourceEndpointKind.WebSocketUrl,
						locator: remoteLiveLocator,
					},
				],
			},
		] as const)
	),
	...flatMapSourceBindings(
		[
			{
				key: '1301',
				httpProxyLocator: 'https://sepolia.unichain.org',
				remoteLiveLocator: 'wss://sepolia.unichain.org',
			},
			{
				key: '1328',
				httpProxyLocator: 'https://evm-rpc-testnet.sei-apis.com',
				remoteLiveLocator: 'wss://evm-rpc-testnet.sei-apis.com',
			},
			{
				key: '1329',
				httpProxyLocator: 'https://evm-rpc.sei-apis.com',
				remoteLiveLocator: 'wss://evm-rpc.sei-apis.com',
			},
			{
				key: '4801',
				httpProxyLocator: 'https://worldchain-sepolia.g.alchemy.com/public',
				remoteLiveLocator: 'wss://worldchain-sepolia.g.alchemy.com/public',
			},
		] as const,
		({
			key,
			httpProxyLocator,
			remoteLiveLocator,
		}) => ([
			{
				...voltaireJsonRpcHttpProxyBindingAxes,
				target: {
					kind: SourceTargetKind.Eip155Chain,
					key,
				},
				endpoints: [
					{
						endpointKind: SourceEndpointKind.HttpUrl,
						locator: httpProxyLocator,
						corsEnabled: false,
					},
				],
			},
			{
				...voltaireJsonRpcRemoteLiveBindingAxes,
				target: {
					kind: SourceTargetKind.Eip155Chain,
					key,
				},
				endpoints: [
					{
						endpointKind: SourceEndpointKind.WebSocketUrl,
						locator: remoteLiveLocator,
					},
				],
			},
		] as const)
	),
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
	...flatMapSourceBindings(
		[
			{
				key: '10143',
				httpProxyLocator: 'https://testnet-rpc.monad.xyz',
				remoteLiveLocator: 'wss://testnet-rpc.monad.xyz',
			},
			{
				key: '14601',
				httpProxyLocator: 'https://rpc.testnet.soniclabs.com',
				remoteLiveLocator: 'wss://rpc.testnet.soniclabs.com',
			},
			{
				key: '42161',
				httpProxyLocator: 'https://arb1.arbitrum.io/rpc',
				remoteLiveLocator: 'wss://arb1.arbitrum.io/rpc',
			},
			{
				key: '42220',
				httpProxyLocator: 'https://forno.celo.org',
				remoteLiveLocator: 'wss://forno.celo.org',
			},
			{
				key: '43113',
				httpProxyLocator: 'https://api.avax-test.network/ext/bc/C/rpc',
				remoteLiveLocator: 'wss://api.avax-test.network/ext/bc/C/rpc',
			},
			{
				key: '43114',
				httpProxyLocator: 'https://api.avax.network/ext/bc/C/rpc',
				remoteLiveLocator: 'wss://api.avax.network/ext/bc/C/rpc',
			},
			{
				key: '57073',
				httpProxyLocator: 'https://rpc-gel.inkonchain.com',
				remoteLiveLocator: 'wss://rpc-gel.inkonchain.com',
			},
			{
				key: '59141',
				httpProxyLocator: 'https://rpc.sepolia.linea.build',
				remoteLiveLocator: 'wss://rpc.sepolia.linea.build',
			},
			{
				key: '59144',
				httpProxyLocator: 'https://rpc.linea.build',
				remoteLiveLocator: 'wss://rpc.linea.build',
			},
			{
				key: '80002',
				httpProxyLocator: 'https://rpc-amoy.polygon.technology',
				remoteLiveLocator: 'wss://rpc-amoy.polygon.technology',
			},
			{
				key: '81224',
				httpProxyLocator: 'https://rpc.codex.xyz',
				remoteLiveLocator: 'wss://rpc.codex.xyz',
			},
			{
				key: '84532',
				httpProxyLocator: 'https://sepolia.base.org',
				remoteLiveLocator: 'wss://sepolia.base.org',
			},
			{
				key: '98866',
				httpProxyLocator: 'https://rpc.plume.org',
				remoteLiveLocator: 'wss://rpc.plume.org',
			},
			{
				key: '98867',
				httpProxyLocator: 'https://testnet-rpc.plume.org',
				remoteLiveLocator: 'wss://testnet-rpc.plume.org',
			},
			{
				key: '421614',
				httpProxyLocator: 'https://sepolia-rollup.arbitrum.io/rpc',
				remoteLiveLocator: 'wss://sepolia-rollup.arbitrum.io/rpc',
			},
			{
				key: '763373',
				httpProxyLocator: 'https://rpc-gel-sepolia.inkonchain.com',
				remoteLiveLocator: 'wss://rpc-gel-sepolia.inkonchain.com',
			},
			{
				key: '812242',
				httpProxyLocator: 'https://rpc.codex-stg.xyz',
				remoteLiveLocator: 'wss://rpc.codex-stg.xyz',
			},
			{
				key: '5042002',
				httpProxyLocator: 'https://rpc.testnet.arc.network',
				remoteLiveLocator: 'wss://rpc.testnet.arc.network',
			},
			{
				key: '11142220',
				httpProxyLocator: 'https://forno.celo-sepolia.celo-testnet.org',
				remoteLiveLocator: 'wss://forno.celo-sepolia.celo-testnet.org',
			},
			{
				key: '11155111',
				httpProxyLocator: 'https://ethereum-sepolia-rpc.publicnode.com',
				remoteLiveLocator: 'wss://ethereum-sepolia-rpc.publicnode.com',
			},
			{
				key: '11155420',
				httpProxyLocator: 'https://sepolia.optimism.io',
				remoteLiveLocator: 'wss://sepolia.optimism.io',
			},
		] as const,
		({
			key,
			httpProxyLocator,
			remoteLiveLocator,
		}) => ([
			{
				...voltaireJsonRpcHttpProxyBindingAxes,
				target: {
					kind: SourceTargetKind.Eip155Chain,
					key,
				},
				endpoints: [
					{
						endpointKind: SourceEndpointKind.HttpUrl,
						locator: httpProxyLocator,
						corsEnabled: false,
					},
				],
			},
			{
				...voltaireJsonRpcRemoteLiveBindingAxes,
				target: {
					kind: SourceTargetKind.Eip155Chain,
					key,
				},
				endpoints: [
					{
						endpointKind: SourceEndpointKind.WebSocketUrl,
						locator: remoteLiveLocator,
					},
				],
			},
		] as const)
	),
] as const)

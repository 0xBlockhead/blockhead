import { CoinId } from '$/constants/Coin.ts'
import { ConsensusMechanismId } from '$/constants/ConsensusMechanism.ts'
import { ExecutionEnvironmentId } from '$/constants/ExecutionEnvironment.ts'
import { NetworkNamespace } from '$/constants/Network.ts'
import { NetworkStackId } from '$/constants/NetworkStack.ts'


// Types

type NetworkNamespaceRow = {
	namespace: NetworkNamespace
	nativeAssetCoinId: CoinId | undefined
} & (
	| {
		networkStackId: NetworkStackId
		executionEnvironmentIds: readonly ExecutionEnvironmentId[]
		consensusMechanismIds: readonly ConsensusMechanismId[]
	}
	| {
		networkStackId: undefined
		executionEnvironmentIds: undefined
		consensusMechanismIds: undefined
	}
)


// Constants

const unregisteredNetworkStack = {
	networkStackId: undefined,
	executionEnvironmentIds: undefined,
	consensusMechanismIds: undefined,
} as const

export const networkNamespaces = [
	{
		namespace: NetworkNamespace.Algorand,
		...unregisteredNetworkStack,
		nativeAssetCoinId: CoinId.ALGO,
	},
	{
		namespace: NetworkNamespace.Aptos,
		...unregisteredNetworkStack,
		nativeAssetCoinId: CoinId.APT,
	},
	{
		namespace: NetworkNamespace.Avail,
		...unregisteredNetworkStack,
		nativeAssetCoinId: undefined,
	},
	{
		namespace: NetworkNamespace.Avalanche,
		...unregisteredNetworkStack,
		nativeAssetCoinId: CoinId.AVAX,
	},
	{
		namespace: NetworkNamespace.Arweave,
		...unregisteredNetworkStack,
		nativeAssetCoinId: CoinId.AR,
	},
	{
		namespace: NetworkNamespace.Bittensor,
		networkStackId: NetworkStackId.Bittensor,
		executionEnvironmentIds: [
			ExecutionEnvironmentId.BittensorSubtensorRuntime,
		],
		consensusMechanismIds: [
			ConsensusMechanismId.BittensorYumaConsensus,
		],
		nativeAssetCoinId: CoinId.TAO,
	},
	{
		namespace: NetworkNamespace.Bitcoin,
		networkStackId: NetworkStackId.Bitcoin,
		executionEnvironmentIds: [
			ExecutionEnvironmentId.BitcoinScript,
		],
		consensusMechanismIds: [
			ConsensusMechanismId.NakamotoProofOfWork,
		],
		nativeAssetCoinId: CoinId.BTC,
	},
	{
		namespace: NetworkNamespace.BitcoinCash,
		networkStackId: NetworkStackId.BitcoinCash,
		executionEnvironmentIds: [
			ExecutionEnvironmentId.BitcoinCashScript,
		],
		consensusMechanismIds: [
			ConsensusMechanismId.NakamotoProofOfWork,
		],
		nativeAssetCoinId: CoinId.BCH,
	},
	{
		namespace: NetworkNamespace.Cardano,
		networkStackId: NetworkStackId.Cardano,
		executionEnvironmentIds: [],
		consensusMechanismIds: [],
		nativeAssetCoinId: CoinId.ADA,
	},
	{
		namespace: NetworkNamespace.Celestia,
		...unregisteredNetworkStack,
		nativeAssetCoinId: CoinId.TIA,
	},
	{
		namespace: NetworkNamespace.Cosmos,
		networkStackId: NetworkStackId.CosmosSdkCometBft,
		executionEnvironmentIds: [
			ExecutionEnvironmentId.CosmWasm,
		],
		consensusMechanismIds: [
			ConsensusMechanismId.CometBft,
		],
		nativeAssetCoinId: CoinId.ATOM,
	},
	{
		namespace: NetworkNamespace.Dydx,
		...unregisteredNetworkStack,
		nativeAssetCoinId: CoinId.DYDX,
	},
	{
		namespace: NetworkNamespace.Dogecoin,
		networkStackId: NetworkStackId.Dogecoin,
		executionEnvironmentIds: [
			ExecutionEnvironmentId.BitcoinScript,
		],
		consensusMechanismIds: [
			ConsensusMechanismId.DogecoinAuxProofOfWork,
		],
		nativeAssetCoinId: CoinId.DOGE,
	},
	{
		namespace: NetworkNamespace.Elements,
		networkStackId: NetworkStackId.Elements,
		executionEnvironmentIds: [
			ExecutionEnvironmentId.ElementsScript,
		],
		consensusMechanismIds: [],
		nativeAssetCoinId: CoinId.BTC,
	},
	{
		namespace: NetworkNamespace.Evm,
		networkStackId: NetworkStackId.Ethereum,
		executionEnvironmentIds: [
			ExecutionEnvironmentId.Evm,
		],
		consensusMechanismIds: [
			ConsensusMechanismId.EthereumBeaconProofOfStake,
		],
		nativeAssetCoinId: CoinId.ETH,
	},
	{
		namespace: NetworkNamespace.Filecoin,
		networkStackId: NetworkStackId.Filecoin,
		executionEnvironmentIds: [
			ExecutionEnvironmentId.FilecoinVm,
		],
		consensusMechanismIds: [
			ConsensusMechanismId.FilecoinExpectedConsensus,
		],
		nativeAssetCoinId: CoinId.FIL,
	},
	{
		namespace: NetworkNamespace.Hedera,
		...unregisteredNetworkStack,
		nativeAssetCoinId: CoinId.HBAR,
	},
	{
		namespace: NetworkNamespace.Hyperliquid,
		networkStackId: NetworkStackId.Hyperliquid,
		executionEnvironmentIds: [
			ExecutionEnvironmentId.HyperEvm,
		],
		consensusMechanismIds: [
			ConsensusMechanismId.HyperBft,
		],
		nativeAssetCoinId: CoinId.HYPE,
	},
	{
		namespace: NetworkNamespace.InternetComputer,
		...unregisteredNetworkStack,
		nativeAssetCoinId: CoinId.ICP,
	},
	{
		namespace: NetworkNamespace.Kaspa,
		...unregisteredNetworkStack,
		nativeAssetCoinId: CoinId.KAS,
	},
	{
		namespace: NetworkNamespace.Lightning,
		networkStackId: NetworkStackId.Lightning,
		executionEnvironmentIds: [
			ExecutionEnvironmentId.LightningProtocol,
		],
		consensusMechanismIds: [],
		nativeAssetCoinId: undefined,
	},
	{
		namespace: NetworkNamespace.Litecoin,
		networkStackId: NetworkStackId.Litecoin,
		executionEnvironmentIds: [
			ExecutionEnvironmentId.BitcoinScript,
		],
		consensusMechanismIds: [
			ConsensusMechanismId.NakamotoProofOfWork,
		],
		nativeAssetCoinId: CoinId.LTC,
	},
	{
		namespace: NetworkNamespace.Logos,
		networkStackId: NetworkStackId.Logos,
		executionEnvironmentIds: [
			ExecutionEnvironmentId.LogosBlockchainRuntime,
		],
		consensusMechanismIds: [
			ConsensusMechanismId.LogosBedrock,
		],
		nativeAssetCoinId: undefined,
	},
	{
		namespace: NetworkNamespace.Monero,
		networkStackId: NetworkStackId.Monero,
		executionEnvironmentIds: [],
		consensusMechanismIds: [
			ConsensusMechanismId.MoneroRandomXProofOfWork,
		],
		nativeAssetCoinId: CoinId.XMR,
	},
	{
		namespace: NetworkNamespace.Near,
		networkStackId: NetworkStackId.Near,
		executionEnvironmentIds: [
			ExecutionEnvironmentId.NearRuntime,
		],
		consensusMechanismIds: [
			ConsensusMechanismId.NearNightshade,
		],
		nativeAssetCoinId: CoinId.NEAR,
	},
	{
		namespace: NetworkNamespace.Polkadot,
		networkStackId: NetworkStackId.PolkadotSdk,
		executionEnvironmentIds: [
			ExecutionEnvironmentId.SubstrateRuntime,
		],
		consensusMechanismIds: [
			ConsensusMechanismId.PolkadotNposBabeGrandpa,
		],
		nativeAssetCoinId: CoinId.DOT,
	},
	{
		namespace: NetworkNamespace.Quilibrium,
		networkStackId: NetworkStackId.Quilibrium,
		executionEnvironmentIds: [
			ExecutionEnvironmentId.QuilibriumQcl,
		],
		consensusMechanismIds: [
			ConsensusMechanismId.QuilibriumProofOfMeaningfulWork,
		],
		nativeAssetCoinId: CoinId.QUIL,
	},
	{
		namespace: NetworkNamespace.Solana,
		networkStackId: NetworkStackId.Solana,
		executionEnvironmentIds: [
			ExecutionEnvironmentId.SolanaSvm,
		],
		consensusMechanismIds: [
			ConsensusMechanismId.SolanaProofOfHistoryTowerBft,
		],
		nativeAssetCoinId: CoinId.SOL,
	},
	{
		namespace: NetworkNamespace.Starknet,
		...unregisteredNetworkStack,
		nativeAssetCoinId: CoinId.STRK,
	},
	{
		namespace: NetworkNamespace.Stellar,
		...unregisteredNetworkStack,
		nativeAssetCoinId: CoinId.XLM,
	},
	{
		namespace: NetworkNamespace.Sui,
		...unregisteredNetworkStack,
		nativeAssetCoinId: CoinId.SUI,
	},
	{
		namespace: NetworkNamespace.Tron,
		networkStackId: NetworkStackId.Tron,
		executionEnvironmentIds: [
			ExecutionEnvironmentId.TronTvm,
		],
		consensusMechanismIds: [
			ConsensusMechanismId.TronDpos,
		],
		nativeAssetCoinId: CoinId.TRX,
	},
	{
		namespace: NetworkNamespace.Tezos,
		networkStackId: NetworkStackId.Tezos,
		executionEnvironmentIds: [
			ExecutionEnvironmentId.Michelson,
		],
		consensusMechanismIds: [
			ConsensusMechanismId.TezosLiquidProofOfStake,
		],
		nativeAssetCoinId: CoinId.XTZ,
	},
	{
		namespace: NetworkNamespace.Ton,
		...unregisteredNetworkStack,
		nativeAssetCoinId: CoinId.TON,
	},
	{
		namespace: NetworkNamespace.Xrpl,
		...unregisteredNetworkStack,
		nativeAssetCoinId: CoinId.XRP,
	},
	{
		namespace: NetworkNamespace.Zcash,
		networkStackId: NetworkStackId.Zcash,
		executionEnvironmentIds: [
			ExecutionEnvironmentId.BitcoinScript,
		],
		consensusMechanismIds: [
			ConsensusMechanismId.ZcashProofOfWork,
		],
		nativeAssetCoinId: CoinId.ZEC,
	},
	{
		namespace: NetworkNamespace.ZeroG,
		networkStackId: NetworkStackId.ZeroG,
		executionEnvironmentIds: [
			ExecutionEnvironmentId.ZeroGChainEvm,
			ExecutionEnvironmentId.ZeroGServingFramework,
		],
		consensusMechanismIds: [
			ConsensusMechanismId.ZeroGProofOfStake,
		],
		nativeAssetCoinId: CoinId._0G,
	},
] as const satisfies readonly NetworkNamespaceRow[]


// Lookups

export const networkNamespaceByNamespace = Object.fromEntries(
	networkNamespaces.map((row) => [
		row.namespace,
		row,
	])
)

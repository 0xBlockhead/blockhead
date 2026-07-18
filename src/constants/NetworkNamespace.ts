import { CoinId } from '$/constants/Coin.ts'
import { ConsensusMechanismId } from '$/constants/ConsensusMechanism.ts'
import { ExecutionEnvironmentId } from '$/constants/ExecutionEnvironment.ts'
import { NetworkStackId } from '$/constants/NetworkStack.ts'


export enum NetworkNamespace {
	Bittensor = 'Bittensor',
	Bitcoin = 'Bitcoin',
	BitcoinCash = 'BitcoinCash',
	Cardano = 'Cardano',
	Cosmos = 'Cosmos',
	Dogecoin = 'Dogecoin',
	Elements = 'Elements',
	Evm = 'Evm',
	Filecoin = 'Filecoin',
	Hedera = 'Hedera',
	Hyperliquid = 'Hyperliquid',
	Lightning = 'Lightning',
	Litecoin = 'Litecoin',
	Logos = 'Logos',
	Monero = 'Monero',
	Near = 'Near',
	Polkadot = 'Polkadot',
	Quilibrium = 'Quilibrium',
	Solana = 'Solana',
	Tron = 'Tron',
	Tezos = 'Tezos',
	Xrpl = 'Xrpl',
	Zcash = 'Zcash',
	ZeroG = 'ZeroG',
}


// Constants

const networkNamespaces = [
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
		namespace: NetworkNamespace.Lightning,
		networkStackId: NetworkStackId.Lightning,
		executionEnvironmentIds: [
			ExecutionEnvironmentId.LightningProtocol,
		],
		consensusMechanismIds: [],
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
] as const satisfies readonly {
	namespace: NetworkNamespace
	networkStackId: NetworkStackId
	executionEnvironmentIds: readonly ExecutionEnvironmentId[]
	consensusMechanismIds: readonly ConsensusMechanismId[]
	nativeAssetCoinId?: CoinId
}[]


// Lookups

export const networkNamespaceByNamespace = Object.fromEntries(
	networkNamespaces.map((row) => [
		row.namespace,
		row,
	])
)

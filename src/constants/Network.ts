export enum NetworkNamespace {
	Bittensor = 'Bittensor',
	Bitcoin = 'Bitcoin',
	BitcoinCash = 'BitcoinCash',
	Cosmos = 'Cosmos',
	Dogecoin = 'Dogecoin',
	Elements = 'Elements',
	Evm = 'Evm',
	Filecoin = 'Filecoin',
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
	Zcash = 'Zcash',
	ZeroG = 'ZeroG',
}

export enum Caip2Namespace {
	Bip122 = 'bip122',
	Cosmos = 'cosmos',
	Eip155 = 'eip155',
	Fil = 'fil',
	Monero = 'monero',
	Polkadot = 'polkadot',
	Solana = 'solana',
}

export enum Caip2Reference {
	Arbitrum = '42161',
	Base = '8453',
	Bitcoin = '000000000019d6689c085ae165831e93',
	BitcoinCash = '000000000000000000651ef99cb9fcbe',
	BnbSmartChain = '56',
	CosmosHub = 'cosmoshub-4',
	Dogecoin = '1a91e3dace36e2be3bf030a65679fe82',
	EthereumMainnet = '1',
	Optimism = '10',
	Filecoin = 'f',
	Litecoin = '12a765e31ffd4059bada1e25190f6e98',
	Monero = '418015bb9ae982a1975da7d79277c270',
	Polkadot = '91b171bb158e2d3848fa23a9f1c25182',
	Polygon = '137',
	SolanaMainnet = '5eykt4UsFv8P8NJdTREpY1vzqKqZKvdp',
	Zcash = '00040fe8ec8471911baa1db1266ea15',
}

export enum NetworkEnvironment {
	Mainnet = 'Mainnet',
	Testnet = 'Testnet',
}

export enum NetworkResourceKind {
	BlockExplorer = 'BlockExplorer',
	Faucet = 'Faucet',
}

export enum NetworkLedgerModel {
	Account = 'Account',
	Utxo = 'Utxo',
}

export enum NetworkExecutionModel {
	CosmosSdk = 'CosmosSdk',
	Evm = 'Evm',
	PolkadotRuntime = 'PolkadotRuntime',
	SolanaRuntime = 'SolanaRuntime',
	ZcashShielded = 'ZcashShielded',
}

// Constants

const networkEnvironments = [
	{
		environment: NetworkEnvironment.Mainnet,
		label: 'Mainnet',
	},
	{
		environment: NetworkEnvironment.Testnet,
		label: 'Testnet',
	},
] as const satisfies readonly {
	environment: NetworkEnvironment
	label: string
}[]

export const networks = [
	{
		slug: '0g',
		name: '0G',
		namespace: NetworkNamespace.ZeroG,
		environment: NetworkEnvironment.Mainnet,
		ledgerModels: [],
		executionModels: [],
	},
	{
		slug: 'arbitrum',
		name: 'Arbitrum One',
		caip2: {
			namespace: 'eip155',
			reference: '42161',
		},
		namespace: NetworkNamespace.Evm,
		environment: NetworkEnvironment.Mainnet,
		ledgerModels: [NetworkLedgerModel.Account],
		executionModels: [NetworkExecutionModel.Evm],
	},
	{
		slug: 'base',
		name: 'Base',
		caip2: {
			namespace: 'eip155',
			reference: '8453',
		},
		namespace: NetworkNamespace.Evm,
		environment: NetworkEnvironment.Mainnet,
		ledgerModels: [NetworkLedgerModel.Account],
		executionModels: [NetworkExecutionModel.Evm],
	},
	{
		slug: 'bittensor',
		name: 'Bittensor',
		namespace: NetworkNamespace.Bittensor,
		environment: NetworkEnvironment.Mainnet,
		ledgerModels: [],
		executionModels: [],
	},
	{
		slug: 'bitcoin',
		name: 'Bitcoin',
		caip2: {
			namespace: 'bip122',
			reference: '000000000019d6689c085ae165831e93',
		},
		namespace: NetworkNamespace.Bitcoin,
		environment: NetworkEnvironment.Mainnet,
		ledgerModels: [NetworkLedgerModel.Utxo],
		executionModels: [],
	},
	{
		slug: 'bitcoin-cash',
		name: 'Bitcoin Cash',
		caip2: {
			namespace: 'bip122',
			reference: '000000000000000000651ef99cb9fcbe',
		},
		namespace: NetworkNamespace.BitcoinCash,
		environment: NetworkEnvironment.Mainnet,
		ledgerModels: [NetworkLedgerModel.Utxo],
		executionModels: [],
	},
	{
		slug: 'bnb-smart-chain',
		name: 'BNB Smart Chain',
		caip2: {
			namespace: 'eip155',
			reference: '56',
		},
		namespace: NetworkNamespace.Evm,
		environment: NetworkEnvironment.Mainnet,
		ledgerModels: [NetworkLedgerModel.Account],
		executionModels: [NetworkExecutionModel.Evm],
	},
	{
		slug: 'cosmos',
		name: 'Cosmos Hub',
		caip2: {
			namespace: 'cosmos',
			reference: 'cosmoshub-4',
		},
		namespace: NetworkNamespace.Cosmos,
		environment: NetworkEnvironment.Mainnet,
		ledgerModels: [NetworkLedgerModel.Account],
		executionModels: [NetworkExecutionModel.CosmosSdk],
	},
	{
		slug: 'dogecoin',
		name: 'Dogecoin',
		caip2: {
			namespace: 'bip122',
			reference: '1a91e3dace36e2be3bf030a65679fe82',
		},
		namespace: NetworkNamespace.Dogecoin,
		environment: NetworkEnvironment.Mainnet,
		ledgerModels: [NetworkLedgerModel.Utxo],
		executionModels: [],
	},
	{
		slug: 'liquid',
		name: 'Liquid Network',
		namespace: NetworkNamespace.Elements,
		environment: NetworkEnvironment.Mainnet,
		ledgerModels: [NetworkLedgerModel.Utxo],
		executionModels: [],
	},
	{
		slug: 'ethereum',
		name: 'Ethereum Mainnet',
		caip2: {
			namespace: 'eip155',
			reference: '1',
		},
		namespace: NetworkNamespace.Evm,
		environment: NetworkEnvironment.Mainnet,
		ledgerModels: [NetworkLedgerModel.Account],
		executionModels: [NetworkExecutionModel.Evm],
	},
	{
		slug: 'optimism',
		name: 'Optimism',
		caip2: {
			namespace: 'eip155',
			reference: '10',
		},
		namespace: NetworkNamespace.Evm,
		environment: NetworkEnvironment.Mainnet,
		ledgerModels: [NetworkLedgerModel.Account],
		executionModels: [NetworkExecutionModel.Evm],
	},
	{
		slug: 'polygon',
		name: 'Polygon',
		caip2: {
			namespace: 'eip155',
			reference: '137',
		},
		namespace: NetworkNamespace.Evm,
		environment: NetworkEnvironment.Mainnet,
		ledgerModels: [NetworkLedgerModel.Account],
		executionModels: [NetworkExecutionModel.Evm],
	},
	{
		slug: 'filecoin',
		name: 'Filecoin',
		caip2: {
			namespace: 'fil',
			reference: 'f',
		},
		namespace: NetworkNamespace.Filecoin,
		environment: NetworkEnvironment.Mainnet,
		ledgerModels: [],
		executionModels: [],
	},
	{
		slug: 'hyperliquid',
		name: 'Hyperliquid',
		namespace: NetworkNamespace.Hyperliquid,
		environment: NetworkEnvironment.Mainnet,
		ledgerModels: [NetworkLedgerModel.Account],
		executionModels: [],
	},
	{
		slug: 'lightning',
		name: 'Lightning Network',
		namespace: NetworkNamespace.Lightning,
		environment: NetworkEnvironment.Mainnet,
		ledgerModels: [],
		executionModels: [],
	},
	{
		slug: 'litecoin',
		name: 'Litecoin',
		caip2: {
			namespace: 'bip122',
			reference: '12a765e31ffd4059bada1e25190f6e98',
		},
		namespace: NetworkNamespace.Litecoin,
		environment: NetworkEnvironment.Mainnet,
		ledgerModels: [NetworkLedgerModel.Utxo],
		executionModels: [],
	},
	{
		slug: 'logos-testnet',
		name: 'Logos Testnet',
		namespace: NetworkNamespace.Logos,
		environment: NetworkEnvironment.Testnet,
		ledgerModels: [],
		executionModels: [],
	},
	{
		slug: 'monero',
		name: 'Monero',
		caip2: {
			namespace: 'monero',
			reference: '418015bb9ae982a1975da7d79277c270',
		},
		namespace: NetworkNamespace.Monero,
		environment: NetworkEnvironment.Mainnet,
		ledgerModels: [],
		executionModels: [],
	},
	{
		slug: 'near',
		name: 'NEAR',
		namespace: NetworkNamespace.Near,
		environment: NetworkEnvironment.Mainnet,
		ledgerModels: [NetworkLedgerModel.Account],
		executionModels: [],
	},
	{
		slug: 'polkadot',
		name: 'Polkadot',
		caip2: {
			namespace: 'polkadot',
			reference: '91b171bb158e2d3848fa23a9f1c25182',
		},
		namespace: NetworkNamespace.Polkadot,
		environment: NetworkEnvironment.Mainnet,
		ledgerModels: [NetworkLedgerModel.Account],
		executionModels: [NetworkExecutionModel.PolkadotRuntime],
	},
	{
		slug: 'quilibrium',
		name: 'Quilibrium',
		namespace: NetworkNamespace.Quilibrium,
		environment: NetworkEnvironment.Mainnet,
		ledgerModels: [],
		executionModels: [],
	},
	{
		slug: 'solana',
		name: 'Solana Mainnet',
		caip2: {
			namespace: 'solana',
			reference: '5eykt4UsFv8P8NJdTREpY1vzqKqZKvdp',
		},
		namespace: NetworkNamespace.Solana,
		environment: NetworkEnvironment.Mainnet,
		ledgerModels: [NetworkLedgerModel.Account],
		executionModels: [NetworkExecutionModel.SolanaRuntime],
	},
	{
		slug: 'tron',
		name: 'TRON Mainnet',
		namespace: NetworkNamespace.Tron,
		environment: NetworkEnvironment.Mainnet,
		ledgerModels: [NetworkLedgerModel.Account],
		executionModels: [],
	},
	{
		slug: 'zcash',
		name: 'Zcash',
		caip2: {
			namespace: 'bip122',
			reference: '00040fe8ec8471911baa1db1266ea15',
		},
		namespace: NetworkNamespace.Zcash,
		environment: NetworkEnvironment.Mainnet,
		ledgerModels: [NetworkLedgerModel.Utxo],
		executionModels: [NetworkExecutionModel.ZcashShielded],
	},
] as const satisfies readonly {
	namespace: NetworkNamespace
	slug: string
	caip2?: {
		namespace: string
		reference: string
	}
	name: string
	environment: NetworkEnvironment
	ledgerModels: readonly NetworkLedgerModel[]
	executionModels: readonly NetworkExecutionModel[]
}[]

export const networkResourceUrls = [
	{
		networkSlug: '0g',
		kind: NetworkResourceKind.BlockExplorer,
		url: 'https://chainscan-galileo.0g.ai/',
	},
	{
		networkSlug: 'arbitrum',
		kind: NetworkResourceKind.BlockExplorer,
		url: 'https://arbiscan.io/',
	},
	{
		networkSlug: 'bitcoin',
		kind: NetworkResourceKind.BlockExplorer,
		url: 'https://mempool.space/',
	},
	{
		networkSlug: 'bitcoin-cash',
		kind: NetworkResourceKind.BlockExplorer,
		url: 'https://explorer.bitcoinunlimited.info/',
	},
	{
		networkSlug: 'cosmos',
		kind: NetworkResourceKind.BlockExplorer,
		url: 'https://www.mintscan.io/cosmos',
	},
	{
		networkSlug: 'dogecoin',
		kind: NetworkResourceKind.BlockExplorer,
		url: 'https://dogechain.info/',
	},
	{
		networkSlug: 'filecoin',
		kind: NetworkResourceKind.BlockExplorer,
		url: 'https://filfox.info/',
	},
	{
		networkSlug: 'hyperliquid',
		kind: NetworkResourceKind.BlockExplorer,
		url: 'https://app.hyperliquid.xyz/explorer',
	},
	{
		networkSlug: 'lightning',
		kind: NetworkResourceKind.BlockExplorer,
		url: 'https://mempool.space/lightning',
	},
	{
		networkSlug: 'liquid',
		kind: NetworkResourceKind.BlockExplorer,
		url: 'https://blockstream.info/liquid/',
	},
	{
		networkSlug: 'optimism',
		kind: NetworkResourceKind.BlockExplorer,
		url: 'https://optimistic.etherscan.io/',
	},
	{
		networkSlug: 'litecoin',
		kind: NetworkResourceKind.BlockExplorer,
		url: 'https://litecoinspace.org/',
	},
	{
		networkSlug: 'monero',
		kind: NetworkResourceKind.BlockExplorer,
		url: 'https://xmrchain.net/',
	},
	{
		networkSlug: 'near',
		kind: NetworkResourceKind.BlockExplorer,
		url: 'https://nearblocks.io/',
	},
	{
		networkSlug: 'polkadot',
		kind: NetworkResourceKind.BlockExplorer,
		url: 'https://polkadot.subscan.io/',
	},
	{
		networkSlug: 'solana',
		kind: NetworkResourceKind.BlockExplorer,
		url: 'https://explorer.solana.com/',
	},
	{
		networkSlug: 'tron',
		kind: NetworkResourceKind.BlockExplorer,
		url: 'https://tronscan.org/',
	},
	{
		networkSlug: 'zcash',
		kind: NetworkResourceKind.BlockExplorer,
		url: 'https://zcashblockexplorer.com/',
	},
] as const satisfies readonly {
	networkSlug: string
	kind: NetworkResourceKind
	url: string
}[]

// Lookups

export const networkEnvironmentByEnvironment = Object.fromEntries(
	networkEnvironments.map((row) => [
		row.environment,
		row,
	])
)

export const networkBySlug = Object.fromEntries(
	networks.map((row) => [
		row.slug,
		row,
	])
)

export const networkByCaip2 = Object.fromEntries(
	networks.flatMap((row) => (
		!('caip2' in row) ?
			[]
		:
			[[
				`${row.caip2.namespace}:${row.caip2.reference}`,
				row,
			]]
	))
)

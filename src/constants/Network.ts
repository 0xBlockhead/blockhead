export enum NetworkNamespace {
	Bitcoin = 'Bitcoin',
	BitcoinCash = 'BitcoinCash',
	Cosmos = 'Cosmos',
	Dogecoin = 'Dogecoin',
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

export enum NetworkEnvironment {
	Mainnet = 'Mainnet',
	Testnet = 'Testnet',
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
	},
	{
		slug: 'hyperliquid',
		name: 'Hyperliquid',
		namespace: NetworkNamespace.Hyperliquid,
		environment: NetworkEnvironment.Mainnet,
	},
	{
		slug: 'lightning',
		name: 'Lightning Network',
		namespace: NetworkNamespace.Lightning,
		environment: NetworkEnvironment.Mainnet,
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
	},
	{
		slug: 'logos-testnet',
		name: 'Logos Testnet',
		namespace: NetworkNamespace.Logos,
		environment: NetworkEnvironment.Testnet,
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
	},
	{
		slug: 'near',
		name: 'NEAR',
		namespace: NetworkNamespace.Near,
		environment: NetworkEnvironment.Mainnet,
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
	},
	{
		slug: 'quilibrium',
		name: 'Quilibrium',
		namespace: NetworkNamespace.Quilibrium,
		environment: NetworkEnvironment.Mainnet,
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
	},
	{
		slug: 'tron',
		name: 'TRON Mainnet',
		namespace: NetworkNamespace.Tron,
		environment: NetworkEnvironment.Mainnet,
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
}[]

// Lookups

export const networkEnvironmentByEnvironment = Object.fromEntries(
	networkEnvironments.map((row) => [
		row.environment,
		row,
	]),
)

export const networkBySlug = Object.fromEntries(
	networks.map((row) => [
		row.slug,
		row,
	]),
)

export const networkByCaip2 = Object.fromEntries(
	networks.flatMap((row) => (
		!('caip2' in row) ?
			[]
	:	[[
				`${row.caip2.namespace}:${row.caip2.reference}`,
				row,
			]]
	)),
)

export const caip2NetworkNamespaceByNamespace = Object.fromEntries(
	networks.flatMap((row) => (
		!('caip2' in row) ?
			[]
	:	[[
				row.caip2.namespace,
				row.caip2.namespace,
			]]
	)),
)

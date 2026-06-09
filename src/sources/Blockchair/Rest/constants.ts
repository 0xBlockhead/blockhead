import type { SourceOrigin } from '$/sources/SourceProvider.ts'


// Types

export type BlockchairOrigin = (typeof blockchairOrigins)[number]


// Constants

export const blockchairOrigin = 'https://api.blockchair.com' as const

export const blockchairRestBaseUrl = blockchairOrigin

export const blockchairOrigins = [
	{
		origin: blockchairOrigin,
		corsEnabled: true,
	},
] as const satisfies readonly SourceOrigin[]

export const blockchairBitcoinLikeChains = [
	{
		chain: 'bitcoin',
		label: 'Bitcoin',
	},
	{
		chain: 'bitcoin-cash',
		label: 'Bitcoin Cash',
	},
	{
		chain: 'litecoin',
		label: 'Litecoin',
	},
	{
		chain: 'bitcoin-sv',
		label: 'Bitcoin SV',
	},
	{
		chain: 'dogecoin',
		label: 'Dogecoin',
	},
	{
		chain: 'dash',
		label: 'Dash',
	},
	{
		chain: 'groestlcoin',
		label: 'Groestlcoin',
	},
	{
		chain: 'zcash',
		label: 'Zcash',
	},
	{
		chain: 'bitcoin/testnet',
		label: 'Bitcoin Testnet',
	},
] as const

export const blockchairEthereumLikeChains = [
	{
		chain: 'ethereum',
		label: 'Ethereum',
	},
	{
		chain: 'ethereum/testnet',
		label: 'Ethereum Testnet',
	},
	{
		chain: 'ethereum-classic',
		label: 'Ethereum Classic',
	},
] as const

export const blockchairOtherStatsChains = [
	{
		chain: 'ripple',
		label: 'XRP Ledger',
	},
	{
		chain: 'stellar',
		label: 'Stellar',
	},
	{
		chain: 'monero',
		label: 'Monero',
	},
	{
		chain: 'cardano',
		label: 'Cardano',
	},
	{
		chain: 'mixin',
		label: 'Mixin',
	},
	{
		chain: 'solana',
		label: 'Solana',
	},
] as const

export const blockchairChains = [
	...blockchairBitcoinLikeChains,
	...blockchairEthereumLikeChains,
	...blockchairOtherStatsChains,
] as const

export const blockchairBlockInfinitableChains = [
	...blockchairBitcoinLikeChains,
	...blockchairEthereumLikeChains,
] as const

export const blockchairTransactionInfinitableChains = blockchairBlockInfinitableChains

export const blockchairAddressInfinitableChains = blockchairBlockInfinitableChains

export const blockchairRawBlockChains = [
	...blockchairBitcoinLikeChains,
	...blockchairEthereumLikeChains,
	{
		chain: 'monero',
		label: 'Monero',
	},
	{
		chain: 'cardano',
		label: 'Cardano',
	},
] as const

export const blockchairRawTransactionChains = [
	...blockchairRawBlockChains,
	{
		chain: 'ripple',
		label: 'XRP Ledger',
	},
	{
		chain: 'stellar',
		label: 'Stellar',
	},
	{
		chain: 'solana',
		label: 'Solana',
	},
] as const

export const blockchairDefaultLimit = 10

export const blockchairMaxLimit = 100


// Lookups

export const blockchairBitcoinLikeChainByChain = Object.fromEntries(
	blockchairBitcoinLikeChains.map((chain) => [chain.chain, chain]),
)

export const blockchairEthereumLikeChainByChain = Object.fromEntries(
	blockchairEthereumLikeChains.map((chain) => [chain.chain, chain]),
)

// Types

export type ChainlistFamilyAliasRow = {
	token: string
	canonicalFamily: string
}

export type ChainlistFamilyEquivalenceRow = {
	token: string
	rootFamily: string
}

export type ChainlistSlugFamilyAliasRow = {
	slugToken: string
	canonicalFamily: string
}


// Constants

export const chainlistTestnetKeywordPattern = /\b(testnet|sepolia|holesky|hoodi|goerli|rinkeby|ropsten|kovan)\b/i

const chainlistFamilyAliases = [
	{
		token: 'op',
		canonicalFamily: 'optimism',
	},
	{
		token: 'oeth',
		canonicalFamily: 'optimism',
	},
	{
		token: 'arb',
		canonicalFamily: 'arbitrum',
	},
	{
		token: 'arb1',
		canonicalFamily: 'arbitrum',
	},
	{
		token: 'eth',
		canonicalFamily: 'ethereum',
	},
] as const satisfies readonly ChainlistFamilyAliasRow[]

const chainlistFamilyEquivalences = [
	{
		token: 'bnb',
		rootFamily: 'binance',
	},
	{
		token: 'bnbt',
		rootFamily: 'binance',
	},
	{
		token: 'bsctest',
		rootFamily: 'binance',
	},
	{
		token: 'binance',
		rootFamily: 'binance',
	},
	{
		token: 'matic',
		rootFamily: 'polygon',
	},
	{
		token: 'maticmum',
		rootFamily: 'polygon',
	},
	{
		token: 'polygonamoy',
		rootFamily: 'polygon',
	},
] as const satisfies readonly ChainlistFamilyEquivalenceRow[]

export const chainlistFamilyStopwords = [
	'mainnet',
	'testnet',
	'network',
	'chain',
	'rollup',
	'l2',
	'l3',
	'public',
	'private',
	'alpha',
	'beta',
	'devnet',
	'deprecated',
	'legacy',
	'stage',
	'staging',
	'v1',
	'v2',
	'v3',
] as const

const chainlistSlugFamilyAliases = [
	{
		slugToken: 'zksyncera',
		canonicalFamily: 'zksync',
	},
] as const satisfies readonly ChainlistSlugFamilyAliasRow[]


// Lookups

export const chainlistCanonicalFamilyByToken = Object.fromEntries(
	chainlistFamilyAliases.map((row) => [
		row.token,
		row,
	])
)

export const chainlistRootFamilyByToken = Object.fromEntries(
	chainlistFamilyEquivalences.map((row) => [
		row.token,
		row,
	])
)

export const chainlistCanonicalFamilyBySlugToken = Object.fromEntries(
	chainlistSlugFamilyAliases.map((row) => [
		row.slugToken,
		row,
	])
)

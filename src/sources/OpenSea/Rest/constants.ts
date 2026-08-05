import type { OpenSeaChainIdentifier } from '$/sources/OpenSea/Rest/types.ts'

const chains = [
	{ chainId: 1, apiChain: 'ethereum' },
	{ chainId: 10, apiChain: 'optimism' },
	{ chainId: 130, apiChain: 'unichain' },
	{ chainId: 137, apiChain: 'polygon' },
	{ chainId: 143, apiChain: 'monad' },
	{ chainId: 360, apiChain: 'shape' },
	{ chainId: 747, apiChain: 'flow' },
	{ chainId: 999, apiChain: 'hyperevm' },
	{ chainId: 1329, apiChain: 'sei' },
	{ chainId: 1868, apiChain: 'soneium' },
	{ chainId: 2020, apiChain: 'ronin' },
	{ chainId: 2741, apiChain: 'abstract' },
	{ chainId: 4326, apiChain: 'megaeth' },
	{ chainId: 4663, apiChain: 'robinhood' },
	{ chainId: 5031, apiChain: 'somnia' },
	{ chainId: 8333, apiChain: 'b3' },
	{ chainId: 8453, apiChain: 'base' },
	{ chainId: 33139, apiChain: 'ape_chain' },
	{ chainId: 42161, apiChain: 'arbitrum' },
	{ chainId: 43114, apiChain: 'avalanche' },
	{ chainId: 43419, apiChain: 'gunzilla' },
	{ chainId: 57073, apiChain: 'ink' },
	{ chainId: 80094, apiChain: 'bera_chain' },
	{ chainId: 81457, apiChain: 'blast' },
	{ chainId: 7777777, apiChain: 'zora' },
] as const satisfies readonly {
	chainId: number
	apiChain: OpenSeaChainIdentifier
}[]

export const openSeaChainByChainId = Object.fromEntries(
	chains.map((chain) => [
		chain.chainId,
		chain.apiChain,
	])
)

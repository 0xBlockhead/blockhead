/**
 * Wire types for `GET https://chainid.network/chains.json` (array of chains).
 * @see https://github.com/ethereum-lists/chains
 * @see https://chainid.network/chains.json
 */
export type EthereumListsChainJsonExplorer = {
	name: string
	url: string
	standard?: string
	icon?: string
}

export type EthereumListsChainJson = {
	name: string
	title?: string
	chain: string
	icon?: string
	rpc: string[]
	features?: { name: string }[]
	faucets?: string[]
	nativeCurrency: { name: string, symbol: string, decimals: number }
	infoURL?: string
	shortName: string
	chainId: number
	networkId: number
	slip44?: number
	ens?: { registry: string }
	explorers?: EthereumListsChainJsonExplorer[]
	tvl?: number
	status?: 'active' | 'incubating' | 'deprecated' | string
	parent?: {
		type: string
		chain: string
		bridges?: { url: string }[]
	}
	redFlags?: string[]
}

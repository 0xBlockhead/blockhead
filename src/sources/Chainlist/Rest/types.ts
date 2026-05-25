/**
 * Types for `GET https://chainlist.org/rpcs.json` (array of chains).
 * @see https://chainlist.org/rpcs.json
 */

export type ChainlistRpcsJsonRpc = {
	url: string
	tracking?: 'limited' | 'none' | 'yes' | 'unspecified' | string
	isOpenSource?: boolean
}

export type ChainlistRpcsJsonRpcEntry = string | ChainlistRpcsJsonRpc

export type ChainlistRpcsJsonIcon = {
	url: string
	width?: number
	height?: number
	format?: string
}

export type ChainlistRpcsJsonChain = {
	name: string
	title?: string
	chain?: string
	icon?: string
	icons?: ChainlistRpcsJsonIcon[]
	rpc?: ChainlistRpcsJsonRpcEntry[]
	features?: { name: string }[]
	faucets?: string[]
	nativeCurrency: { name: string; symbol: string; decimals: number }
	infoURL?: string
	shortName?: string
	chainId: number
	networkId?: number
	slip44?: number
	ens?: { registry: string }
	explorers?: {
		name: string
		url: string
		standard?: string
		icon?: string
	}[]
	tvl?: number
	chainSlug?: string
	parent?: {
		type: string
		chain: string
		bridges?: { url: string }[]
	}
	status?: string
	redFlags?: string[]
	isTestnet?: boolean
	testnet?: boolean
}

/** Subset of `ChainlistRpcsJsonChain` used for mainnet/testnet pairing in resolvers. */
export type ChainlistChainPairing = Pick<
	ChainlistRpcsJsonChain,
	| 'chainId'
	| 'name'
	| 'title'
	| 'shortName'
	| 'chainSlug'
	| 'parent'
	| 'nativeCurrency'
	| 'isTestnet'
	| 'testnet'
>

/** Explorer row (+ optional `infoURL`) normalized into `Url` catalog entities. */
export type ChainlistExplorerLike = {
	name: string
	url: string
	standard?: string | null
	icon?: string | null
}

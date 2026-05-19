/**
 * Subset of OpenAPI `Token` / `Chain` for `GET /v1/chains` and `GET /v1/tokens`.
 * @see https://docs.li.fi/openapi.yaml
 */

export type LifiToken = {
	address: string
	decimals: number
	symbol: string
	chainId: number
	name: string
	coinKey?: string
	logoURI?: string
	priceUSD?: string
}

export type LifiChainMetamask = {
	chainId?: string
	blockExplorerUrls?: string[]
	chainName?: string
	nativeCurrency?: {
		name?: string
		symbol?: string
		decimals?: number
	}
	rpcUrls?: string[]
}

export type LifiChain = {
	key: string
	name: string
	coin: string
	id: number
	mainnet: boolean
	chainType?: string
	logoURI?: string
	tokenlistUrl?: string
	faucetUrls?: string[]
	multicallAddress?: string
	metamask?: LifiChainMetamask
	nativeToken?: LifiToken
	relayerSupported?: boolean
}

export type LifiChainsResponse = {
	chains: LifiChain[]
}

/** Live `li.quest` wraps per-chain token arrays under `tokens`. */
export type LifiTokensResponse = {
	tokens: Record<string, LifiToken[]>
}

export type FetchLifiChainsOptions = {
	chainTypes?: string
	baseUrl?: string
}

export type FetchLifiTokensOptions = {
	chains?: string
	tags?: string
	chainTypes?: string
	minPriceUSD?: number
	baseUrl?: string
}

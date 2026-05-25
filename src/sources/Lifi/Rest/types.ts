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

/** Metamask `blockExplorerUrls` entries mapped before `Url` catalog normalization. */
export type LifiBlockExplorerUrlLike = {
	name: string
	url: string
	standard?: string | null
	icon?: string | null
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

export type LifiToolChainPair = {
	fromChainId: number
	toChainId: number
}

export type LifiBridgeTool = {
	key: string
	name: string
	logoURI?: string
	supportedChains: LifiToolChainPair[]
}

export type LifiToolsResponse = {
	bridges: LifiBridgeTool[]
}

/** `GET /v1/quote` — single-step quote (tool + estimate). */
export type LifiQuoteRequest = {
	fromChain: number
	toChain: number
	fromToken: string
	toToken: string
	fromAmount: string
	fromAddress: string
	toAddress?: string
	slippage?: number
}

export type LifiQuoteStepLike = {
	type: string
	tool: string
	toolDetails?: {
		name?: string
		key?: string
	}
	action: {
		fromChainId: number
		toChainId: number
		fromAmount?: string
		toAmount?: string
		fromToken: LifiToken
		toToken: LifiToken
		fromAddress?: string
		toAddress?: string
	}
	estimate?: {
		toAmount?: string
		toAmountMin?: string
		executionDuration?: number
		gasCosts?: {
			amount?: string
			amountUSD?: string
		}[]
		feeCosts?: {
			amount?: string
			amountUSD?: string
		}[]
	}
}

export type LifiQuoteStep = LifiQuoteStepLike & {
	includedSteps?: LifiQuoteStepLike[]
}

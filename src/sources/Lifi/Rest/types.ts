import type {
	components,
	paths,
} from '$/sources/Lifi/OpenApi/openapi.d.ts'

export type LifiToken = components['schemas']['Token']
export type LifiChain = components['schemas']['Chain']

type GeneratedChainsResponse = (
	paths['/v1/chains']['get']['responses'][200]['content']['application/json']
)

/** The documented successful response always contains the catalog array. */
export type LifiChainsResponse = (
	Omit<GeneratedChainsResponse, 'chains'>
	& {
		chains: NonNullable<GeneratedChainsResponse['chains']>
	}
)

/**
 * The published OpenAPI still describes the pre-wrapper token map. The live
 * endpoint wraps that map in `tokens` and adds the `extended` mode flag.
 */
export type LifiTokensResponse = {
	tokens: Record<string, LifiToken[]>
	extended?: boolean
}

export type FetchLifiChainsOptions = NonNullable<
	paths['/v1/chains']['get']['parameters']['query']
>

export type FetchLifiTokensOptions = NonNullable<
	paths['/v1/tokens']['get']['parameters']['query']
>

export type LifiStatusRequest = (
	paths['/v1/status']['get']['parameters']['query']
)

export type LifiStatusResponse = (
	paths['/v1/status']['get']['responses'][200]['content']['application/json']
)

type GeneratedBridge = components['schemas']['Bridge']
type GeneratedExchange = components['schemas']['Exchange']

/**
 * LI.FI's OpenAPI declares bridge chain ids as strings and exchange chains as
 * one string. Live responses mix numeric and string ids; queries normalize to
 * numbers before returning.
 */
export type LifiToolsResponse = {
	bridges?: (
		Omit<GeneratedBridge, 'supportedChains'>
		& {
			supportedChains?: {
				fromChainId?: number | string
				toChainId?: number | string
			}[]
		}
	)[]
	exchanges?: (
		Omit<GeneratedExchange, 'supportedChains'>
		& {
			supportedChains?: (number | string)[]
		}
	)[]
}

type LifiQuoteQuery = paths['/v1/quote']['get']['parameters']['query']

/** The source currently exposes the numeric-chain quote subset used by resolvers. */
export type LifiQuoteRequest = (
	Pick<
		LifiQuoteQuery,
		| 'fromToken'
		| 'toToken'
		| 'fromAmount'
		| 'fromAddress'
		| 'toAddress'
		| 'slippage'
	>
	& {
		fromChain: number
		toChain: number
	}
)

type GeneratedQuoteStep = (
	paths['/v1/quote']['get']['responses'][200]['content']['application/json']
)

/** A successful quote always carries the estimate shown by the endpoint docs. */
export type LifiQuoteStep = (
	Omit<GeneratedQuoteStep, 'estimate'>
	& {
		estimate: NonNullable<GeneratedQuoteStep['estimate']>
	}
)

export type LifiQuoteStepLike = (
	| LifiQuoteStep
	| components['schemas']['IncludedStep']
)

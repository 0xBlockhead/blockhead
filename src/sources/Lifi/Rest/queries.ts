/**
 * LI.FI public catalog — `GET /v1/chains`, `GET /v1/tokens` (no API key).
 * @see https://docs.li.fi/api-reference/get-information-about-all-currently-supported-chains
 * @see https://docs.li.fi/api-reference/fetch-all-known-tokens
 */

import { throwIfHttpNotOk } from '$/lib/http.ts'
import { lifiRestFetch } from '$/sources/Lifi/Rest/client.ts'
import type {
	FetchLifiChainsOptions,
	FetchLifiTokensOptions,
	LifiChainsResponse,
	LifiQuoteRequest,
	LifiQuoteStep,
	LifiQuoteStepLike,
	LifiStatusRequest,
	LifiStatusResponse,
	LifiTokensResponse,
	LifiToolsResponse,
} from '$/sources/Lifi/Rest/types.ts'

const maximumQuoteSteps = 32
const maximumCostRows = 64
const maximumCatalogChains = 1_000
const maximumCatalogTokens = 100_000
const maximumTools = 1_000
const maximumSupportedChainsPerTool = 10_000
const unsignedIntegerPattern = /^(0|[1-9]\d*)$/
const decimalPattern = /^(0|[1-9]\d*)(\.\d+)?$/

const assertQuoteStep = (
	step: LifiQuoteStepLike,
	label: string
) => {
	if (
		step.id === ''
		|| step.tool === ''
		|| step.estimate.tool !== step.tool
		|| !unsignedIntegerPattern.test(step.action.fromAmount)
		|| !unsignedIntegerPattern.test(step.estimate.fromAmount)
		|| !unsignedIntegerPattern.test(step.estimate.toAmount)
		|| !unsignedIntegerPattern.test(step.estimate.toAmountMin)
		|| BigInt(step.estimate.toAmountMin) > BigInt(step.estimate.toAmount)
		|| !Number.isFinite(step.estimate.executionDuration)
		|| step.estimate.executionDuration < 0
	)
		throw new Error(`Lifi_Rest: malformed ${label} quote step`)

	for (const row of [
		...(step.estimate.feeCosts ?? []),
		...(step.estimate.gasCosts ?? []),
	]) {
		if (
			!unsignedIntegerPattern.test(row.amount ?? '')
			|| !decimalPattern.test(row.amountUSD ?? '')
			|| ('percentage' in row && !decimalPattern.test(row.percentage))
		)
			throw new Error(`Lifi_Rest: malformed ${label} quote cost`)
	}

	if (
		(step.estimate.feeCosts?.length ?? 0) > maximumCostRows
		|| (step.estimate.gasCosts?.length ?? 0) > maximumCostRows
	)
		throw new Error(`Lifi_Rest: excessive ${label} quote costs`)
}

/**
 * `GET /v1/chains` — supported chains (optional `chainTypes` e.g. `EVM,SVM`).
 */
export async function fetchChains(
	options?: FetchLifiChainsOptions
) {
	const params = new URLSearchParams()
	if (options?.chainTypes != null && options.chainTypes !== '')
		params.set('chainTypes', options.chainTypes)
	const queryString = params.toString()
	const path = `/v1/chains${queryString ? `?${queryString}` : ''}`
	const res = await lifiRestFetch(path)
	await throwIfHttpNotOk(res, path)
	const result = await res.json<LifiChainsResponse>()
	if (
		result.chains.length > maximumCatalogChains
		|| new Set(result.chains.map((chain) => chain.id)).size !== result.chains.length
		|| new Set(result.chains.map((chain) => chain.key)).size !== result.chains.length
		|| result.chains.some((chain) => (
			!Number.isSafeInteger(chain.id)
			|| chain.id <= 0
			|| (chain.nativeToken != null && chain.nativeToken.chainId !== chain.id)
		))
	)
		throw new Error('Lifi_Rest: malformed chains catalog')
	return result
}

/**
 * `GET /v1/tokens` — token lists keyed by chain id string under `tokens`.
 */
export async function fetchTokens(
	options?: FetchLifiTokensOptions
) {
	const params = new URLSearchParams()
	if (options?.chains != null && options.chains !== '')
		params.set('chains', options.chains)
	if (options?.tags != null && options.tags !== '') params.set('tags', options.tags)
	if (options?.chainTypes != null && options.chainTypes !== '')
		params.set('chainTypes', options.chainTypes)
	if (options?.minPriceUSD != null)
		params.set('minPriceUSD', String(options.minPriceUSD))
	const queryString = params.toString()
	const path = `/v1/tokens${queryString ? `?${queryString}` : ''}`
	const res = await lifiRestFetch(path)
	await throwIfHttpNotOk(res, path)
	const result = await res.json<LifiTokensResponse>()
	if (
		Object.values(result.tokens).reduce((total, tokens) => total + tokens.length, 0) > maximumCatalogTokens
		|| Object.entries(result.tokens).some(([chainId, tokens]) => (
			tokens.some((token) => (
				String(token.chainId) !== chainId
				|| !Number.isSafeInteger(token.decimals)
				|| token.decimals < 0
				|| token.decimals > 255
			))
			|| new Set(tokens.map((token) => token.address.toLowerCase())).size !== tokens.length
		))
	)
		throw new Error('Lifi_Rest: malformed tokens catalog')
	return result
}

/**
 * `GET /v1/status` — the current state of one cross-chain transfer.
 * The official operation accepts a source/destination transaction hash or a
 * LI.FI step id and deliberately returns `200` for `NOT_FOUND`.
 */
export const fetchTransferStatus = async (
	params: LifiStatusRequest
) => {
	if (params.txHash.trim() === '')
		throw new Error('Lifi_Rest: transfer status requires a transaction hash or step id')

	const path = `/v1/status?${new URLSearchParams({
		txHash: params.txHash,
		...(params.bridge != null && { bridge: params.bridge }),
		...(params.fromChain != null && { fromChain: params.fromChain }),
		...(params.toChain != null && { toChain: params.toChain }),
	})}`
	const response = await lifiRestFetch(path)
	await throwIfHttpNotOk(response, path)
	return response.json<LifiStatusResponse>()
}

/**
 * `GET /v1/tools` — supported bridges (and exchanges; callers use `bridges`).
 * @see https://docs.li.fi/li.fi-api/li.fi-api/requesting-all-supported-tools
 */
export async function fetchTools() {
	const path = '/v1/tools'
	const res = await lifiRestFetch(path)
	await throwIfHttpNotOk(res, path)
	const result = await res.json<LifiToolsResponse>()
	const bridges = result.bridges?.map((tool) => {
		if (
			tool.key == null
			|| tool.key === ''
			|| tool.name == null
			|| tool.name === ''
			|| tool.supportedChains == null
			|| tool.supportedChains.length > maximumSupportedChainsPerTool
		)
			throw new Error('Lifi_Rest: malformed tools catalog')

		const supportedChains = tool.supportedChains.map((pair) => {
			if (
				pair.fromChainId == null
				|| !unsignedIntegerPattern.test(String(pair.fromChainId))
				|| String(pair.fromChainId) === '0'
				|| pair.toChainId == null
				|| !unsignedIntegerPattern.test(String(pair.toChainId))
				|| String(pair.toChainId) === '0'
			)
				throw new Error('Lifi_Rest: malformed tools catalog')

			return {
				fromChainId: pair.fromChainId,
				toChainId: pair.toChainId,
			}
		})
		if (
			new Set(supportedChains.map((pair) => (
				`${String(pair.fromChainId)}:${String(pair.toChainId)}`
			))).size !== supportedChains.length
		)
			throw new Error('Lifi_Rest: malformed tools catalog')

		return {
			key: tool.key,
			name: tool.name,
			...(tool.logoURI != null && { logoURI: tool.logoURI }),
			supportedChains,
		}
	})
	const exchanges = result.exchanges?.map((exchange) => {
		if (
			exchange.key == null
			|| exchange.key === ''
			|| exchange.name == null
			|| exchange.name === ''
			|| exchange.supportedChains == null
		)
			throw new Error('Lifi_Rest: malformed tools catalog')

		return {
			key: exchange.key,
			name: exchange.name,
			...(exchange.logoURI != null && { logoURI: exchange.logoURI }),
			supportedChains: exchange.supportedChains,
		}
	})
	if (
		bridges == null
		|| bridges.length > maximumTools
		|| (exchanges?.length ?? 0) > maximumTools
		|| new Set(bridges.map((tool) => tool.key)).size !== bridges.length
	)
		throw new Error('Lifi_Rest: malformed tools catalog')
	return {
		bridges,
		...(exchanges != null && { exchanges }),
	}
}

/**
 * `GET /v1/quote` returns an ephemeral public observation. Execution and
 * signing payloads are deliberately discarded at this source boundary.
 */
export const fetchQuote = async (
	params: LifiQuoteRequest
) => {
	if (
		!Number.isSafeInteger(params.fromChain)
		|| params.fromChain <= 0
		|| !Number.isSafeInteger(params.toChain)
		|| params.toChain <= 0
		|| !unsignedIntegerPattern.test(params.fromAmount)
		|| BigInt(params.fromAmount) <= 0n
		|| (params.slippage != null && (
			!Number.isFinite(params.slippage)
			|| params.slippage < 0
			|| params.slippage >= 1
		))
	)
		throw new Error('Lifi_Rest: invalid quote request')

	const search = new URLSearchParams({
		fromChain: String(params.fromChain),
		toChain: String(params.toChain),
		fromToken: params.fromToken,
		toToken: params.toToken,
		fromAmount: params.fromAmount,
		fromAddress: params.fromAddress,
		...(params.toAddress != null && { toAddress: params.toAddress }),
		...(params.slippage != null && { slippage: String(params.slippage) }),
	})
	const path = `/v1/quote?${search}`
	const response = await lifiRestFetch(path)
	await throwIfHttpNotOk(response, path)
	const quote = await response.json<LifiQuoteStep>()

	assertQuoteStep(quote, 'top-level')
	if (
		quote.action.fromChainId !== params.fromChain
		|| quote.action.toChainId !== params.toChain
		|| quote.action.fromToken.chainId !== params.fromChain
		|| quote.action.toToken.chainId !== params.toChain
		|| !Number.isSafeInteger(quote.action.fromToken.decimals)
		|| quote.action.fromToken.decimals < 0
		|| quote.action.fromToken.decimals > 255
		|| !Number.isSafeInteger(quote.action.toToken.decimals)
		|| quote.action.toToken.decimals < 0
		|| quote.action.toToken.decimals > 255
		|| quote.action.fromToken.address.toLowerCase() !== params.fromToken.toLowerCase()
		|| quote.action.toToken.address.toLowerCase() !== params.toToken.toLowerCase()
		|| quote.action.fromAmount !== params.fromAmount
		|| quote.estimate.fromAmount !== params.fromAmount
		|| quote.action.fromAddress?.toLowerCase() !== params.fromAddress.toLowerCase()
		|| quote.action.toAddress?.toLowerCase() !== (params.toAddress ?? params.fromAddress).toLowerCase()
		|| (params.slippage != null && quote.action.slippage !== params.slippage)
	)
		throw new Error('Lifi_Rest: quote identity does not match the request')

	const steps = quote.includedSteps ?? []
	if (
		steps.length > maximumQuoteSteps
		|| new Set(steps.map((step) => step.id)).size !== steps.length
		|| (steps.length > 0 && (
			steps[0].action.fromChainId !== params.fromChain
			|| steps[0].action.fromToken.address.toLowerCase() !== params.fromToken.toLowerCase()
			|| steps[steps.length - 1].action.toChainId !== params.toChain
			|| steps[steps.length - 1].action.toToken.address.toLowerCase() !== params.toToken.toLowerCase()
		))
	)
		throw new Error('Lifi_Rest: malformed included quote steps')

	steps.forEach((step, index) => {
		assertQuoteStep(step, `included ${index}`)
		if (index > 0) {
			const previous = steps[index - 1]
			if (
				previous.action.toChainId !== step.action.fromChainId
				|| previous.action.toToken.address.toLowerCase() !== step.action.fromToken.address.toLowerCase()
			)
				throw new Error('Lifi_Rest: disconnected included quote steps')
		}
	})

	return {
		id: quote.id,
		type: quote.type,
		tool: quote.tool,
		...(quote.toolDetails != null && { toolDetails: quote.toolDetails }),
		action: quote.action,
		estimate: quote.estimate,
		...(steps.length > 0 && { includedSteps: steps }),
	}
}

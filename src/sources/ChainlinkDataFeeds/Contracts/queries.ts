import { throwHttpError } from '$/lib/http.ts'
import { Source } from '$/sources/Source.ts'
import {
	SourceEndpointKind,
	SourceTargetKind,
	type SourceBinding,
} from '$/sources/SourceBinding.ts'
import {
	firstHttpUrlForBinding,
	sourceFetch,
} from '$/sources/_runtime/http.ts'
import type {
	ChainlinkJsonRpcResponse,
	ChainlinkLatestRound,
} from '$/sources/ChainlinkDataFeeds/Contracts/types.ts'

const addressPattern = /^0x[0-9a-fA-F]{40}$/
const quantityPattern = /^0x(?:0|[1-9a-fA-F][0-9a-fA-F]*)$/
const wordPattern = /^[0-9a-fA-F]{64}$/
const unsignedIntegerPattern = /^(0|[1-9][0-9]*)$/

const functionSelector = {
	aggregator: '0x245a7bfc',
	decimals: '0x313ce567',
	description: '0x7284e416',
	latestRoundData: '0xfeaf968c',
}

const assertAddress = (
	value: string,
	label: string
): asserts value is `0x${string}` => {
	if (!addressPattern.test(value))
		throw new Error(`ChainlinkDataFeeds_Contracts: invalid ${label}`)
}

const decodeWords = (
	value: string,
	minimumWords: number
) => {
	if (
		!value.startsWith('0x')
		|| value.length < 2 + minimumWords * 64
		|| (value.length - 2) % 64 !== 0
	)
		throw new Error('ChainlinkDataFeeds_Contracts: malformed ABI response')

	const words = value.slice(2).match(/.{64}/g) ?? []
	if (words.some((word) => !wordPattern.test(word)))
		throw new Error('ChainlinkDataFeeds_Contracts: malformed ABI word')

	return words
}

const decodeUnsigned = (
	word: string
) => BigInt(`0x${word}`)

const decodeSigned = (
	word: string
) => {
	const value = decodeUnsigned(word)
	return value >= 1n << 255n ? value - (1n << 256n) : value
}

const decodeAddress = (value: string) => {
	const words = decodeWords(value, 1)
	const address = `0x${words[0].slice(24)}`
	assertAddress(address, 'aggregator address')
	if (/^0x0{40}$/.test(address))
		throw new Error('ChainlinkDataFeeds_Contracts: zero aggregator address')

	return address.toLowerCase() as `0x${string}`
}

const decodeString = (value: string) => {
	const words = decodeWords(value, 2)
	const offset = decodeUnsigned(words[0])
	if (offset !== 32n)
		throw new Error('ChainlinkDataFeeds_Contracts: invalid ABI string offset')

	const byteLength = decodeUnsigned(words[1])
	if (byteLength > 256n || byteLength > BigInt((words.length - 2) * 32))
		throw new Error('ChainlinkDataFeeds_Contracts: invalid ABI string length')

	const bytes = Uint8Array.from(
		(words.slice(2).join('').match(/.{2}/g) ?? [])
			.slice(0, Number(byteLength))
			.map((byte) => Number.parseInt(byte, 16))
	)
	const decoded = new TextDecoder('utf-8', {
		fatal: true,
	}).decode(bytes)
	if (decoded.length === 0 || decoded.trim() !== decoded)
		throw new Error('ChainlinkDataFeeds_Contracts: invalid feed description')

	return decoded
}

const rpc = async ({
	binding,
	method,
	params,
	requestId,
}: {
	binding: SourceBinding
	method: string
	params: (
		| string
		| {
			to: string
			data: string
		}
	)[]
	requestId: string
}) => {
	const response = await sourceFetch(
		binding,
		firstHttpUrlForBinding(binding),
		{
			method: 'POST',
			headers: {
				'content-type': 'application/json',
			},
			body: JSON.stringify({
				jsonrpc: '2.0',
				id: requestId,
				method,
				params,
			}),
		}
	)
	if (!response.ok)
		await throwHttpError(`ChainlinkDataFeeds_Contracts ${method}`, response)

	const envelope = await response.json<ChainlinkJsonRpcResponse>()
	if (envelope.jsonrpc !== '2.0' || envelope.id !== requestId)
		throw new Error('ChainlinkDataFeeds_Contracts: JSON-RPC response identity mismatch')
	if (envelope.error != null)
		throw new Error(`ChainlinkDataFeeds_Contracts: ${envelope.error.message}`)
	if (envelope.result == null)
		throw new Error('ChainlinkDataFeeds_Contracts: JSON-RPC result is missing')

	return envelope.result
}

export const getLatestRound = async ({
	binding,
	network,
	feedAddress,
	baseAsset,
	quoteAsset,
	expectedAggregatorAddress,
	staleAfterMs,
	resolvedAtMs = Date.now(),
}: {
	binding: SourceBinding
	network: `eip155:${string}`
	feedAddress: string
	baseAsset: string
	quoteAsset: string
	expectedAggregatorAddress?: string
	staleAfterMs: number
	resolvedAtMs?: number
}): Promise<ChainlinkLatestRound> => {
	if (
		binding.source !== Source.ChainlinkDataFeeds_Contracts
		|| binding.target.kind !== SourceTargetKind.Caip2Network
		|| binding.target.key !== network
		|| !binding.endpoints.some((endpoint) => endpoint.endpointKind === SourceEndpointKind.HttpUrl)
	)
		throw new Error('ChainlinkDataFeeds_Contracts: expected exact EVM network JSON-RPC binding')

	assertAddress(feedAddress, 'feed address')
	if (expectedAggregatorAddress != null)
		assertAddress(expectedAggregatorAddress, 'expected aggregator address')
	if (
		baseAsset.length === 0
		|| quoteAsset.length === 0
		|| baseAsset.trim() !== baseAsset
		|| quoteAsset.trim() !== quoteAsset
		|| baseAsset.includes('/')
		|| quoteAsset.includes('/')
	)
		throw new Error('ChainlinkDataFeeds_Contracts: invalid base or quote identity')
	if (!Number.isSafeInteger(staleAfterMs) || staleAfterMs < 1)
		throw new Error('ChainlinkDataFeeds_Contracts: stale threshold must be a positive safe integer')
	if (!Number.isSafeInteger(resolvedAtMs) || resolvedAtMs < 0)
		throw new Error('ChainlinkDataFeeds_Contracts: invalid resolution timestamp')

	const blockQuantity = await rpc({
		binding,
		method: 'eth_blockNumber',
		params: [],
		requestId: `${network}:${feedAddress}:block`,
	})
	if (!quantityPattern.test(blockQuantity))
		throw new Error('ChainlinkDataFeeds_Contracts: invalid block number')
	const blockNumber = BigInt(blockQuantity)

	const [decimalsResponse, descriptionResponse, aggregatorResponse, roundResponse] = await Promise.all([
		rpc({
			binding,
			method: 'eth_call',
			params: [{
				to: feedAddress,
				data: functionSelector.decimals,
			}, blockQuantity],
			requestId: `${network}:${feedAddress}:decimals:${blockQuantity}`,
		}),
		rpc({
			binding,
			method: 'eth_call',
			params: [{
				to: feedAddress,
				data: functionSelector.description,
			}, blockQuantity],
			requestId: `${network}:${feedAddress}:description:${blockQuantity}`,
		}),
		rpc({
			binding,
			method: 'eth_call',
			params: [{
				to: feedAddress,
				data: functionSelector.aggregator,
			}, blockQuantity],
			requestId: `${network}:${feedAddress}:aggregator:${blockQuantity}`,
		}),
		rpc({
			binding,
			method: 'eth_call',
			params: [{
				to: feedAddress,
				data: functionSelector.latestRoundData,
			}, blockQuantity],
			requestId: `${network}:${feedAddress}:latestRoundData:${blockQuantity}`,
		}),
	])

	const decimalsValue = decodeUnsigned(decodeWords(decimalsResponse, 1)[0])
	if (decimalsValue > 255n)
		throw new Error('ChainlinkDataFeeds_Contracts: invalid feed decimals')
	const description = decodeString(descriptionResponse)
	if (description !== `${baseAsset} / ${quoteAsset}`)
		throw new Error('ChainlinkDataFeeds_Contracts: feed description does not match base and quote')

	const aggregatorAddress = decodeAddress(aggregatorResponse)
	if (
		expectedAggregatorAddress != null
		&& aggregatorAddress !== expectedAggregatorAddress.toLowerCase()
	)
		throw new Error('ChainlinkDataFeeds_Contracts: aggregator does not match catalog')

	const roundWords = decodeWords(roundResponse, 5)
	if (roundWords.length !== 5)
		throw new Error('ChainlinkDataFeeds_Contracts: malformed latest round response')
	const roundId = decodeUnsigned(roundWords[0])
	const answer = decodeSigned(roundWords[1])
	const startedAtSeconds = decodeUnsigned(roundWords[2])
	const updatedAtSeconds = decodeUnsigned(roundWords[3])
	const answeredInRound = decodeUnsigned(roundWords[4])
	if (
		roundId === 0n
		|| updatedAtSeconds === 0n
		|| startedAtSeconds > updatedAtSeconds
		|| answeredInRound < roundId
	)
		throw new Error('ChainlinkDataFeeds_Contracts: invalid latest round lifecycle')

	const updatedAtMs = updatedAtSeconds * 1_000n
	if (updatedAtMs > BigInt(resolvedAtMs))
		throw new Error('ChainlinkDataFeeds_Contracts: latest round timestamp is in the future')
	const ageMs = BigInt(resolvedAtMs) - updatedAtMs
	if (ageMs > BigInt(Number.MAX_SAFE_INTEGER))
		throw new Error('ChainlinkDataFeeds_Contracts: latest round age is not safely representable')

	return {
		network,
		feedAddress: feedAddress.toLowerCase() as `0x${string}`,
		aggregatorAddress,
		baseAsset,
		quoteAsset,
		description,
		decimals: Number(decimalsValue),
		roundId: roundId.toString(),
		answer: answer.toString(),
		startedAtSeconds: startedAtSeconds.toString(),
		updatedAtSeconds: updatedAtSeconds.toString(),
		answeredInRound: answeredInRound.toString(),
		blockNumber: blockNumber.toString(),
		source: binding.source,
		resolvedAtMs,
		staleAfterMs,
		ageMs: Number(ageMs),
		stale: ageMs > BigInt(staleAfterMs),
	}
}

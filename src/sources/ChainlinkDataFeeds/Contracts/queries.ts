import { throwHttpError } from '$/lib/http.ts'
import { zeroExLowerCase } from '$/lib/hexLowerOfByteSize.ts'
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
import {
	chainlinkAbiHexWire,
	chainlinkJsonRpcResponseWire,
	chainlinkQuantityHexWire,
} from '$/sources/ChainlinkDataFeeds/Contracts/types.ts'

const addressPattern = /^0x[0-9a-fA-F]{40}$/
const wordPattern = /^[0-9a-fA-F]{64}$/

const functionSelector = {
	aggregator: '0x245a7bfc',
	decimals: '0x313ce567',
	description: '0x7284e416',
	latestRoundData: '0xfeaf968c',
	getRoundData: '0x9a6fc8f5',
} as const

type EthCall = (call: {
	to: `0x${string}`
	input: `0x${string}`
	blockTag?: `0x${string}` | 'latest'
}) => Promise<`0x${string}`>

const assertAddress: (
	value: string,
	label: string
) => asserts value is `0x${string}` = (value, label) => {
	if (!addressPattern.test(value))
		throw new Error(`ChainlinkDataFeeds_Contracts: invalid ${label}`)
}

const decodeWords = (
	value: string,
	minimumWords: number
) => {
	try {
		chainlinkAbiHexWire.assert(value)
	} catch {
		throw new Error('ChainlinkDataFeeds_Contracts: malformed ABI response')
	}

	if (
		value.length < 2 + minimumWords * 64
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
	const word = decodeWords(value, 1)[0]
	if (word == null)
		throw new Error('ChainlinkDataFeeds_Contracts: missing ABI address word')

	const address = `0x${word.slice(24)}`
	assertAddress(address, 'aggregator address')
	if (/^0x0{40}$/.test(address))
		throw new Error('ChainlinkDataFeeds_Contracts: zero aggregator address')

	return zeroExLowerCase(address)
}

const decodeString = (value: string) => {
	const words = decodeWords(value, 2)
	const offsetWord = words[0]
	if (offsetWord == null)
		throw new Error('ChainlinkDataFeeds_Contracts: missing ABI string offset')

	const offset = decodeUnsigned(offsetWord)
	if (offset !== 32n)
		throw new Error('ChainlinkDataFeeds_Contracts: invalid ABI string offset')

	const byteLengthWord = words[1]
	const byteLength = decodeUnsigned(byteLengthWord)
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

const encodeRoundIdArg = (
	roundId: bigint
) => {
	if (roundId < 0n)
		throw new Error('ChainlinkDataFeeds_Contracts: invalid round id')

	return `${functionSelector.getRoundData}${roundId.toString(16).padStart(64, '0')}` as `0x${string}`
}

const decodeRoundLifecycle = (
	roundResponse: string
) => {
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

	return {
		roundId: roundId.toString(),
		answer: answer.toString(),
		startedAtSeconds: startedAtSeconds.toString(),
		updatedAtSeconds: updatedAtSeconds.toString(),
		answeredInRound: answeredInRound.toString(),
	}
}

const assertPairIdentity = ({
	baseAsset,
	quoteAsset,
}: {
	baseAsset: string
	quoteAsset: string
}) => {
	if (
		baseAsset.length === 0
		|| quoteAsset.length === 0
		|| baseAsset.trim() !== baseAsset
		|| quoteAsset.trim() !== quoteAsset
		|| baseAsset.includes('/')
		|| quoteAsset.includes('/')
	)
		throw new Error('ChainlinkDataFeeds_Contracts: invalid base or quote identity')
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

	let envelope
	try {
		envelope = chainlinkJsonRpcResponseWire.assert(await response.json())
	} catch {
		throw new Error('ChainlinkDataFeeds_Contracts: JSON-RPC response identity mismatch')
	}

	if (envelope.id !== requestId)
		throw new Error('ChainlinkDataFeeds_Contracts: JSON-RPC response identity mismatch')
	if ('error' in envelope && envelope.error != null)
		throw new Error(`ChainlinkDataFeeds_Contracts: ${envelope.error.message}`)
	return envelope.result
}

const assertNetworkJsonRpcBinding = ({
	binding,
	network,
}: {
	binding: SourceBinding
	network: `eip155:${string}`
}) => {
	if (
		binding.source !== Source.ChainlinkDataFeeds_Contracts
		|| binding.target.kind !== SourceTargetKind.Caip2Network
		|| String(binding.target.key) !== network
		|| !binding.endpoints.some((endpoint) => endpoint.endpointKind === SourceEndpointKind.HttpUrl)
	)
		throw new Error('ChainlinkDataFeeds_Contracts: expected exact EVM network JSON-RPC binding')
}

export const readLatestRound = async ({
	getCall,
	getBlockNumber,
	network,
	feedAddress,
	baseAsset,
	quoteAsset,
	expectedAggregatorAddress,
}: {
	getCall: EthCall
	getBlockNumber: () => Promise<bigint>
	network: `eip155:${string}`
	feedAddress: string
	baseAsset: string
	quoteAsset: string
	expectedAggregatorAddress?: string
}) => {
	assertAddress(feedAddress, 'feed address')
	if (expectedAggregatorAddress != null)
		assertAddress(expectedAggregatorAddress, 'expected aggregator address')
	assertPairIdentity({
		baseAsset,
		quoteAsset,
	})

	const blockNumber = await getBlockNumber()
	if (blockNumber < 0n)
		throw new Error('ChainlinkDataFeeds_Contracts: invalid block number')

	const blockQuantity = `0x${blockNumber.toString(16)}`
	try {
		chainlinkQuantityHexWire.assert(blockQuantity)
	} catch {
		throw new Error('ChainlinkDataFeeds_Contracts: invalid block number')
	}

	const to = zeroExLowerCase(feedAddress)
	const [decimalsResponse, descriptionResponse, aggregatorResponse, roundResponse] = await Promise.all([
		getCall({
			to,
			input: functionSelector.decimals,
			blockTag: blockQuantity,
		}),
		getCall({
			to,
			input: functionSelector.description,
			blockTag: blockQuantity,
		}),
		getCall({
			to,
			input: functionSelector.aggregator,
			blockTag: blockQuantity,
		}),
		getCall({
			to,
			input: functionSelector.latestRoundData,
			blockTag: blockQuantity,
		}),
	])

	const decimalsWord = decodeWords(decimalsResponse, 1)[0]
	if (decimalsWord == null)
		throw new Error('ChainlinkDataFeeds_Contracts: missing ABI decimals word')

	const decimalsValue = decodeUnsigned(decimalsWord)
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

	return {
		network,
		feedAddress: to,
		aggregatorAddress,
		baseAsset,
		quoteAsset,
		description,
		decimals: Number(decimalsValue),
		...decodeRoundLifecycle(roundResponse),
		blockNumber: blockNumber.toString(),
	}
}

export const readRound = async ({
	getCall,
	getBlockNumber,
	network,
	feedAddress,
	roundId,
}: {
	getCall: EthCall
	getBlockNumber: () => Promise<bigint>
	network: `eip155:${string}`
	feedAddress: string
	roundId: bigint
}) => {
	assertAddress(feedAddress, 'feed address')

	const blockNumber = await getBlockNumber()
	if (blockNumber < 0n)
		throw new Error('ChainlinkDataFeeds_Contracts: invalid block number')

	const blockQuantity = `0x${blockNumber.toString(16)}`
	const to = zeroExLowerCase(feedAddress)
	const roundResponse = await getCall({
		to,
		input: encodeRoundIdArg(roundId),
		blockTag: blockQuantity,
	})
	const round = decodeRoundLifecycle(roundResponse)
	if (BigInt(round.roundId) !== roundId)
		throw new Error('ChainlinkDataFeeds_Contracts: round id mismatch')

	return {
		network,
		feedAddress: to,
		...round,
		blockNumber: blockNumber.toString(),
	}
}

export const getLatestRound = async ({
	binding,
	network,
	feedAddress,
	baseAsset,
	quoteAsset,
	expectedAggregatorAddress,
}: {
	binding: SourceBinding
	network: `eip155:${string}`
	feedAddress: string
	baseAsset: string
	quoteAsset: string
	expectedAggregatorAddress?: string
}) => {
	assertNetworkJsonRpcBinding({
		binding,
		network,
	})

	return readLatestRound({
		network,
		feedAddress,
		baseAsset,
		quoteAsset,
		expectedAggregatorAddress,
		getBlockNumber: async () => {
			const blockQuantity = await rpc({
				binding,
				method: 'eth_blockNumber',
				params: [],
				requestId: `${network}:${feedAddress}:block`,
			})
			try {
				chainlinkQuantityHexWire.assert(blockQuantity)
			} catch {
				throw new Error('ChainlinkDataFeeds_Contracts: invalid block number')
			}
			return BigInt(blockQuantity)
		},
		getCall: async ({
			to,
			input,
			blockTag = 'latest',
		}) => {
			const result = await rpc({
				binding,
				method: 'eth_call',
				params: [{
					to,
					data: input,
				}, blockTag],
				requestId: `${network}:${to}:${input}:${blockTag}`,
			})
			try {
					return chainlinkAbiHexWire.assert(result)
			} catch {
				throw new Error('ChainlinkDataFeeds_Contracts: malformed ABI response')
			}
		},
	})
}

export const getRoundData = async ({
	binding,
	network,
	feedAddress,
	roundId,
}: {
	binding: SourceBinding
	network: `eip155:${string}`
	feedAddress: string
	roundId: bigint
}) => {
	assertNetworkJsonRpcBinding({
		binding,
		network,
	})

	return readRound({
		network,
		feedAddress,
		roundId,
		getBlockNumber: async () => {
			const blockQuantity = await rpc({
				binding,
				method: 'eth_blockNumber',
				params: [],
				requestId: `${network}:${feedAddress}:block:${roundId}`,
			})
			try {
				chainlinkQuantityHexWire.assert(blockQuantity)
			} catch {
				throw new Error('ChainlinkDataFeeds_Contracts: invalid block number')
			}
			return BigInt(blockQuantity)
		},
		getCall: async ({
			to,
			input,
			blockTag = 'latest',
		}) => {
			const result = await rpc({
				binding,
				method: 'eth_call',
				params: [{
					to,
					data: input,
				}, blockTag],
				requestId: `${network}:${to}:${input}:${blockTag}`,
			})
			try {
					return chainlinkAbiHexWire.assert(result)
			} catch {
				throw new Error('ChainlinkDataFeeds_Contracts: malformed ABI response')
			}
		},
	})
}

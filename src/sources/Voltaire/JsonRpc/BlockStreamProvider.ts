import {
	BlockHash,
	BlockHeader,
	Uint,
} from '@tevm/voltaire'
import type {
	BlockStreamConstructorOptions,
	StreamBlock,
} from '@tevm/voltaire/block'

import { hexLowerOfByteSize } from '$/lib/hexLowerOfByteSize.ts'
import {
	isJsonArray,
	isJsonObject,
	type JsonObject,
	type JsonValue,
} from '$/typescript/JsonValue.ts'

type RpcProvider = {
	request: (request: {
		method: string
		params?: JsonValue[]
	}) => Promise<unknown>
}

const blockMethods = new Set([
	'eth_getBlockByHash',
	'eth_getBlockByNumber',
])

const isJsonValueUnknown = (value: unknown): value is JsonValue => {
	if (value == null || ['boolean', 'bigint', 'number', 'string'].includes(typeof value))
		return true
	if (Array.isArray(value))
		return value.every(isJsonValueUnknown)
	if (typeof value === 'object')
		return Object.values(value).every(isJsonValueUnknown)
	return false
}

const isJsonArrayUnknown = (value: unknown): value is JsonValue[] => (
	Array.isArray(value) && value.every(isJsonValueUnknown)
)

const isJsonObjectUnknown = (value: unknown): value is JsonObject => (
	typeof value === 'object'
	&& value !== null
	&& !Array.isArray(value)
	&& Object.values(value).every(isJsonValueUnknown)
)

const requiredString = (object: JsonObject, field: string) => {
	const value = object[field]
	if (typeof value !== 'string')
		throw new Error(`Voltaire_JsonRpc: block ${field} must be a string`)
	return value
}

const optionalString = (object: JsonObject, field: string) => {
	const value = object[field]
	if (value == null) return undefined
	if (typeof value !== 'string')
		throw new Error(`Voltaire_JsonRpc: block ${field} must be a string when present`)
	return value
}

const rpcHeaderFromJson = (block: JsonObject): Parameters<typeof BlockHeader.fromRpc>[0] => ({
	parentHash: requiredString(block, 'parentHash'),
	sha3Uncles: requiredString(block, 'sha3Uncles'),
	miner: requiredString(block, 'miner'),
	stateRoot: requiredString(block, 'stateRoot'),
	transactionsRoot: requiredString(block, 'transactionsRoot'),
	receiptsRoot: requiredString(block, 'receiptsRoot'),
	logsBloom: requiredString(block, 'logsBloom'),
	difficulty: requiredString(block, 'difficulty'),
	number: requiredString(block, 'number'),
	gasLimit: requiredString(block, 'gasLimit'),
	gasUsed: requiredString(block, 'gasUsed'),
	timestamp: requiredString(block, 'timestamp'),
	extraData: requiredString(block, 'extraData'),
	mixHash: requiredString(block, 'mixHash'),
	nonce: requiredString(block, 'nonce'),
	...Object.fromEntries([
		'baseFeePerGas',
		'withdrawalsRoot',
		'blobGasUsed',
		'excessBlobGas',
		'parentBeaconBlockRoot',
	].flatMap((field) => {
		const value = optionalString(block, field)
		return value == null ? [] : [[field, value]]
	})),
})

const quantity = (block: JsonObject, field: string) => {
	try {
		const value = BigInt(requiredString(block, field))
		if (value < 0n) throw new Error('negative')
		return value
	} catch {
		throw new Error(`Voltaire_JsonRpc: block ${field} must be a non-negative quantity`)
	}
}

const blockStreamBlockFromJson = (block: JsonObject): StreamBlock<'header'> => {
	const transactions = block['transactions']
	if (!isJsonArray(transactions))
		throw new Error('Voltaire_JsonRpc: block transactions must be an array')
	const transactionHashes = transactions.map((transaction) => {
		if (typeof transaction !== 'string')
			throw new Error('Voltaire_JsonRpc: header stream transaction must be a hash')
		const transactionHash = hexLowerOfByteSize(transaction, 32)
		if (transactionHash == null)
			throw new Error('Voltaire_JsonRpc: header stream transaction hash is malformed')
		return transactionHash
	})
	const blockHash = hexLowerOfByteSize(requiredString(block, 'hash'), 32)
	if (blockHash == null)
		throw new Error('Voltaire_JsonRpc: block hash is malformed')
	const totalDifficulty = optionalString(block, 'totalDifficulty')

	return {
		header: BlockHeader.fromRpc(rpcHeaderFromJson(block)),
		body: {
			transactions: transactionHashes,
			ommers: [],
		},
		hash: BlockHash.fromHex(blockHash),
		size: Uint.fromBigInt(quantity(block, 'size')),
		...(totalDifficulty == null ? {} : {
			totalDifficulty: Uint.fromBigInt(quantity(block, 'totalDifficulty')),
		}),
	}
}

export const blockStreamProvider = (
	provider: RpcProvider
): BlockStreamConstructorOptions['provider'] => {
	const adapted: BlockStreamConstructorOptions['provider'] = {
		request: async ({ method, params }) => {
			const jsonParams = params == null ? undefined : isJsonArrayUnknown(params) ? params : (() => {
				throw new Error('Voltaire_JsonRpc: provider parameters must be a JSON array')
			})()
			const result = await provider.request({ method, params: jsonParams })
			if (!blockMethods.has(method) || result == null)
				return result
			if (!isJsonArrayUnknown(params) || params[1] !== false)
				throw new Error('Voltaire_JsonRpc: block stream must request transaction hashes')
			if (!isJsonObjectUnknown(result))
				throw new Error(`Voltaire_JsonRpc: ${method} returned a malformed block`)
			return blockStreamBlockFromJson(result)
		},
		on: () => adapted,
		removeListener: () => adapted,
	}
	return adapted
}

import { Abi, decodeParameters, encodeFunction } from '@tevm/voltaire/Abi'
import { namehash, normalize as ensNormalizeNode, toString as ensToString } from '@tevm/voltaire/Ens'
import { fromBytes as hexFromBytes, toBytes } from '@tevm/voltaire/Hex'

import {
	ensCoinTypes,
	ensTextRecords,
} from '$/constants/Ens.ts'
import { TransportType } from '$/constants/TransportType.ts'
import { hexLowerOfByteSize } from '$/lib/hexLowerOfByteSize.ts'
import type { SourceEndpoint } from '$/sources/SourceBinding.ts'
import type { JsonValue } from '$/typescript/JsonValue.ts'

import { getProviderForExecutionUrl } from './queries.ts'

const ENS_REGISTRY_MAINNET = '0x00000000000C2E074eC69A0dFb2997BA6C7d2e1e' as const
const ZERO_ADDRESS = '0x0000000000000000000000000000000000000000'

const emptyStringRecord: Record<string, string> = {}

type ExecutionTransport = {
	endpoint: SourceEndpoint
	transportType: TransportType
}

const ENS_REGISTRY_ABI = new Abi([
	{
		type: 'function',
		name: 'owner',
		stateMutability: 'view',
		inputs: [{ type: 'bytes32', name: 'node' }],
		outputs: [{ type: 'address', name: '' }],
	},
	{
		type: 'function',
		name: 'resolver',
		stateMutability: 'view',
		inputs: [{ type: 'bytes32', name: 'node' }],
		outputs: [{ type: 'address', name: '' }],
	},
])

const RESOLVER_ADDR_ABI = new Abi([
	{
		type: 'function',
		name: 'addr',
		stateMutability: 'view',
		inputs: [{ type: 'bytes32', name: 'node' }],
		outputs: [{ type: 'address', name: '' }],
	},
])

const RESOLVER_TEXT_ABI = new Abi([
	{
		type: 'function',
		name: 'text',
		stateMutability: 'view',
		inputs: [
			{ type: 'bytes32', name: 'node' },
			{ type: 'string', name: 'key' },
		],
		outputs: [{ type: 'string', name: '' }],
	},
])

const RESOLVER_CONTENTHASH_ABI = new Abi([
	{
		type: 'function',
		name: 'contenthash',
		stateMutability: 'view',
		inputs: [{ type: 'bytes32', name: 'node' }],
		outputs: [{ type: 'bytes', name: '' }],
	},
])

const RESOLVER_ABI_RECORD_ABI = new Abi([
	{
		type: 'function',
		name: 'ABI',
		stateMutability: 'view',
		inputs: [
			{ type: 'bytes32', name: 'node' },
			{ type: 'uint256', name: 'contentTypes' },
		],
		outputs: [
			{ type: 'uint256', name: '' },
			{ type: 'bytes', name: '' },
		],
	},
])

const ensResolverAbiContentTypesMask = 15n

const ensResolverAbiContentTypeJson = 1n

const RESOLVER_MULTICOIN_ADDR_ABI = new Abi([
	{
		type: 'function',
		name: 'addr',
		stateMutability: 'view',
		inputs: [
			{ type: 'bytes32', name: 'node' },
			{ type: 'uint256', name: 'coinType' },
		],
		outputs: [{ type: 'bytes', name: '' }],
	},
])

const NAME_RESOLVER_ABI = new Abi([
	{
		type: 'function',
		name: 'name',
		stateMutability: 'view',
		inputs: [{ type: 'bytes32', name: 'node' }],
		outputs: [{ type: 'string', name: '' }],
	},
])

const ADDRESS_OUTPUT = [{ type: 'address' as const, name: '' }] as const
const STRING_OUTPUT = [{ type: 'string' as const, name: '' }] as const
const BYTES_OUTPUT = [{ type: 'bytes' as const, name: '' }] as const
const RESOLVER_ABI_OUTPUT = [
	{ type: 'uint256' as const, name: '' },
	{ type: 'bytes' as const, name: '' },
] as const

const bytes32FromNamehash = (nodeBytes: Uint8Array): `0x${string}` => {
	const hex = hexFromBytes(nodeBytes)
	const normalized = (
		hex.length === 66 ?
			hex
		:
			`0x${Array.from(nodeBytes)
				.map((byte) => byte.toString(16).padStart(2, '0'))
				.join('')}`
	)
	const out = hexLowerOfByteSize(normalized, 32)
	if (out == null) throw new Error('namehash: expected 32-byte hex')
	return out
}

const isZeroHex = (value: string) => (
	/^0x0*$/i.test(value)
)

const decodedBytesAsHex = (value: JsonValue | Uint8Array) => (
	typeof value === 'string' ?
		value
	: value instanceof Uint8Array ?
		hexFromBytes(value)
	:
		null
)

const getRegistryAddress = async ({
	endpoint,
	transportType,
	node,
	method,
}: ExecutionTransport & {
	node: `0x${string}`
	method: 'owner' | 'resolver'
}) => {
	const provider = await getProviderForExecutionUrl({
		endpoint,
		transportType,
	})
	const response = await provider.request({
		method: 'eth_call',
		params: [
			{
				to: ENS_REGISTRY_MAINNET,
				data: encodeFunction(ENS_REGISTRY_ABI, method, [node]),
			},
			'latest',
		],
	})
	if (typeof response !== 'string' || response === '0x' || response.length < 66) return null
	const [address] = decodeParameters(ADDRESS_OUTPUT, toBytes(response))
	const hex = typeof address === 'string' && address !== ZERO_ADDRESS ?
			hexLowerOfByteSize(address, 20)
		:
			null
	return hex ?? null
}

const resolveAddr = async ({
	endpoint,
	transportType,
	resolverAddress,
	node,
}: ExecutionTransport & {
	resolverAddress: `0x${string}`
	node: `0x${string}`
}) => {
	const provider = await getProviderForExecutionUrl({
		endpoint,
		transportType,
	})
	const response = await provider.request({
		method: 'eth_call',
		params: [
			{
				to: resolverAddress,
				data: encodeFunction(RESOLVER_ADDR_ABI, 'addr', [node]),
			},
			'latest',
		],
	})
	if (typeof response !== 'string' || response === '0x' || response.length < 66) return null
	const [address] = decodeParameters(ADDRESS_OUTPUT, toBytes(response))
	const hex = typeof address === 'string' && address !== ZERO_ADDRESS ?
			hexLowerOfByteSize(address, 20)
		:
			null
	return hex ?? null
}

const resolveText = async ({
	endpoint,
	transportType,
	resolverAddress,
	node,
	key,
}: ExecutionTransport & {
	resolverAddress: `0x${string}`
	node: `0x${string}`
	key: string
}) => {
	const provider = await getProviderForExecutionUrl({
		endpoint,
		transportType,
	})
	const response = await provider.request({
		method: 'eth_call',
		params: [
			{
				to: resolverAddress,
				data: encodeFunction(RESOLVER_TEXT_ABI, 'text', [node, key]),
			},
			'latest',
		],
	})
	if (response == null) return ''
	if (typeof response !== 'string' || response === '0x') return ''
	const [value] = decodeParameters(STRING_OUTPUT, toBytes(response))
	return typeof value === 'string' ? value : ''
}

const resolveContentHash = async ({
	endpoint,
	transportType,
	resolverAddress,
	node,
}: ExecutionTransport & {
	resolverAddress: `0x${string}`
	node: `0x${string}`
}) => {
	const provider = await getProviderForExecutionUrl({
		endpoint,
		transportType,
	})
	const response = await provider.request({
		method: 'eth_call',
		params: [
			{
				to: resolverAddress,
				data: encodeFunction(RESOLVER_CONTENTHASH_ABI, 'contenthash', [node]),
			},
			'latest',
		],
	})
	if (response == null || typeof response !== 'string' || response === '0x') return null
	const [value] = decodeParameters(BYTES_OUTPUT, toBytes(response))
	const contentHash = decodedBytesAsHex(value)
	return contentHash == null || isZeroHex(contentHash) ?
			null
		:
			contentHash
}

const resolverAbiJsonTextFromWire = (
	contentType: bigint,
	data: Uint8Array
) => {
	if (data.length === 0) return null
	if (contentType === ensResolverAbiContentTypeJson) {
		const text = new TextDecoder().decode(data).trim()
		return text === '' ? null : text
	}
	return null
}

const resolveResolverAbiJson = async ({
	endpoint,
	transportType,
	resolverAddress,
	node,
}: ExecutionTransport & {
	resolverAddress: `0x${string}`
	node: `0x${string}`
}) => {
	const provider = await getProviderForExecutionUrl({
		endpoint,
		transportType,
	})
	const response = await provider.request({
		method: 'eth_call',
		params: [
			{
				to: resolverAddress,
				data: encodeFunction(RESOLVER_ABI_RECORD_ABI, 'ABI', [
					node,
					ensResolverAbiContentTypesMask,
				]),
			},
			'latest',
		],
	})
	if (response == null || typeof response !== 'string' || response === '0x') return null
	const [contentType, data] = decodeParameters(RESOLVER_ABI_OUTPUT, toBytes(response))
	const contentTypeBigInt = (
		typeof contentType === 'bigint' ?
			contentType
		: typeof contentType === 'number' ?
			BigInt(contentType)
		:
			null
	)
	const dataBytes = (
		data instanceof Uint8Array ?
			data
		: typeof data === 'string' ?
			toBytes(data)
		:
			null
	)
	if (contentTypeBigInt == null || dataBytes == null) return null
	return resolverAbiJsonTextFromWire(contentTypeBigInt, dataBytes)
}

const resolveMulticoinAddr = async ({
	endpoint,
	transportType,
	resolverAddress,
	node,
	coinType,
}: ExecutionTransport & {
	resolverAddress: `0x${string}`
	node: `0x${string}`
	coinType: number
}) => {
	const provider = await getProviderForExecutionUrl({
		endpoint,
		transportType,
	})
	const response = await provider.request({
		method: 'eth_call',
		params: [
			{
				to: resolverAddress,
				data: encodeFunction(RESOLVER_MULTICOIN_ADDR_ABI, 'addr', [node, BigInt(coinType)]),
			},
			'latest',
		],
	})
	if (response == null || typeof response !== 'string' || response === '0x') return null
	const [value] = decodeParameters(BYTES_OUTPUT, toBytes(response))
	const coinAddress = decodedBytesAsHex(value)
	return coinAddress == null || isZeroHex(coinAddress) ?
			null
		:
			coinAddress
}

const reverseNode = (address: `0x${string}`) => (
	bytes32FromNamehash(
		namehash(`${address.toLowerCase().slice(2).padStart(40, '0')}.addr.reverse`)
	)
)

const resolveReverseName = async ({
	endpoint,
	transportType,
	resolverAddress,
	node,
}: ExecutionTransport & {
	resolverAddress: `0x${string}`
	node: `0x${string}`
}) => {
	const provider = await getProviderForExecutionUrl({
		endpoint,
		transportType,
	})
	const response = await provider.request({
		method: 'eth_call',
		params: [
			{
				to: resolverAddress,
				data: encodeFunction(NAME_RESOLVER_ABI, 'name', [node]),
			},
			'latest',
		],
	})
	if (typeof response !== 'string' || response === '0x') return null
	const [value] = decodeParameters(STRING_OUTPUT, toBytes(response))
	return typeof value === 'string' && value.length > 0 ? value : null
}

export const normalizeEnsName = (raw: string) => {
	const trimmed = raw.trim()
	if (!trimmed || !trimmed.includes('.') || trimmed.length <= 2) {
		throw new Error('Not a potential ENS name')
	}
	return ensToString(ensNormalizeNode(trimmed))
}

export const resolveEnsForwardForEndpoint = async ({
	endpoint,
	transportType,
	name,
	textKeys = ensTextRecords.map((row) => row.key),
	coinTypeIds = ensCoinTypes.map((row) => Number(row.key)),
}: ExecutionTransport & {
	name: string
	textKeys?: readonly string[]
	coinTypeIds?: readonly number[]
}) => {
	const node = bytes32FromNamehash(namehash(name))
	const [owner, resolverAddress] = await Promise.all([
		getRegistryAddress({
			endpoint,
			transportType,
			node,
			method: 'owner',
		}),
		getRegistryAddress({
			endpoint,
			transportType,
			node,
			method: 'resolver',
		}),
	])
	if (resolverAddress == null) {
		return {
			address: null,
			owner,
			resolver: null,
			textRecords: { ...emptyStringRecord },
			contentHash: null,
			resolverAbiJsonText: null,
			coinAddresses: { ...emptyStringRecord },
		}
	}
	const [address, textRecords, contentHash, resolverAbiJsonText, coinAddresses] = await Promise.all([
		resolveAddr({
			endpoint,
			transportType,
			resolverAddress,
			node,
		}),
		Promise.all(
			textKeys.map(async (key) => (
				[
					key,
					await resolveText({
						endpoint,
						transportType,
						resolverAddress,
						node,
						key,
					}),
				] as const
			))
		)
			.then((entries) => Object.fromEntries(entries.filter(([, value]) => value !== ''))),
		resolveContentHash({
			endpoint,
			transportType,
			resolverAddress,
			node,
		}),
		resolveResolverAbiJson({
			endpoint,
			transportType,
			resolverAddress,
			node,
		}),
		Promise.all(
			coinTypeIds.map(async (coinType) => (
				[
					String(coinType),
					await resolveMulticoinAddr({
						endpoint,
						transportType,
						resolverAddress,
						node,
						coinType,
					}),
				] as const
			))
		)
			.then((entries) => (
				Object.fromEntries(
					entries.filter((entry): entry is [string, string] => entry[1] != null)
				)
			)),
	])
	return {
		address,
		owner,
		resolver: resolverAddress,
		textRecords,
		contentHash,
		resolverAbiJsonText,
		coinAddresses,
	}
}

export const resolveEnsReverseForEndpoint = async ({
	endpoint,
	transportType,
	address,
}: ExecutionTransport & {
	address: `0x${string}`
}) => {
	const node = reverseNode(address)
	const resolverAddress = await getRegistryAddress({
		endpoint,
		transportType,
		node,
		method: 'resolver',
	})
	return resolverAddress == null ?
			null
		:
			resolveReverseName({
				endpoint,
				transportType,
				resolverAddress,
			node,
		})
}

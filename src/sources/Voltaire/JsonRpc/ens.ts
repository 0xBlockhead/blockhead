import { Abi, decodeParameters, encodeFunction } from '@tevm/voltaire/Abi'
import { namehash, normalize as ensNormalizeNode, toString as ensToString } from '@tevm/voltaire/Ens'
import { keccak256 } from '@tevm/voltaire/Hash'
import { fromBytes as hexFromBytes, toBytes } from '@tevm/voltaire/Hex'

import {
	ensCoinTypes,
	ensTextRecords,
} from '$/constants/Ens.ts'
import { hexLowerOfByteSize } from '$/lib/hexLowerOfByteSize.ts'
import type { JsonValue } from '$/typescript/JsonValue.ts'

const ENS_REGISTRY_MAINNET = '0x00000000000C2E074eC69A0dFb2997BA6C7d2e1e' as const
const ZERO_ADDRESS = '0x0000000000000000000000000000000000000000'

const emptyStringRecord: Record<string, string> = {}

type EnsRequest = {
	request: (request: {
		method: string
		params?: JsonValue[]
	}) => Promise<unknown>
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

const RESOLVER_DNS_RECORD_ABI = new Abi([
	{
		type: 'function',
		name: 'dnsRecord',
		stateMutability: 'view',
		inputs: [
			{ type: 'bytes32', name: 'node' },
			{ type: 'bytes32', name: 'name' },
			{ type: 'uint16', name: 'resource' },
		],
		outputs: [{ type: 'bytes', name: '' }],
	},
])

const RESOLVER_ZONEHASH_ABI = new Abi([
	{
		type: 'function',
		name: 'zonehash',
		stateMutability: 'view',
		inputs: [{ type: 'bytes32', name: 'node' }],
		outputs: [{ type: 'bytes', name: '' }],
	},
])

const RESOLVER_PUBKEY_ABI = new Abi([
	{
		type: 'function',
		name: 'pubkey',
		stateMutability: 'view',
		inputs: [{ type: 'bytes32', name: 'node' }],
		outputs: [
			{ type: 'bytes32', name: 'x' },
			{ type: 'bytes32', name: 'y' },
		],
	},
])

const ENS_DNS_RR_TYPE_A = 1
const ENS_DNS_RR_TYPE_AAAA = 28
const ENS_DNS_RR_TYPE_TXT = 16

const ADDRESS_OUTPUT = [{ type: 'address' as const, name: '' }] as const
const STRING_OUTPUT = [{ type: 'string' as const, name: '' }] as const
const BYTES_OUTPUT = [{ type: 'bytes' as const, name: '' }] as const
const RESOLVER_ABI_OUTPUT = [
	{ type: 'uint256' as const, name: '' },
	{ type: 'bytes' as const, name: '' },
] as const
const RESOLVER_PUBKEY_OUTPUT = [
	{ type: 'bytes32' as const, name: '' },
	{ type: 'bytes32' as const, name: '' },
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
	request,
	node,
	method,
}: EnsRequest & {
	node: `0x${string}`
	method: 'owner' | 'resolver'
}) => {
	const response = await request({
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
	request,
	resolverAddress,
	node,
}: EnsRequest & {
	resolverAddress: `0x${string}`
	node: `0x${string}`
}) => {
	const response = await request({
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
	request,
	resolverAddress,
	node,
	key,
}: EnsRequest & {
	resolverAddress: `0x${string}`
	node: `0x${string}`
	key: string
}) => {
	const response = await request({
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
	request,
	resolverAddress,
	node,
}: EnsRequest & {
	resolverAddress: `0x${string}`
	node: `0x${string}`
}) => {
	const response = await request({
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
	request,
	resolverAddress,
	node,
}: EnsRequest & {
	resolverAddress: `0x${string}`
	node: `0x${string}`
}) => {
	const response = await request({
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
	request,
	resolverAddress,
	node,
	coinType,
}: EnsRequest & {
	resolverAddress: `0x${string}`
	node: `0x${string}`
	coinType: number
}) => {
	const response = await request({
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

const dnsNameWireFromName = (name: string) => {
	const bytes: number[] = []
	for (const label of name.split('.')) {
		const labelBytes = new TextEncoder().encode(label)
		if (labelBytes.length === 0 || labelBytes.length > 63)
			throw new Error('Voltaire_JsonRpc: DNS name label length out of range')
		bytes.push(labelBytes.length, ...labelBytes)
	}
	bytes.push(0)
	return Uint8Array.from(bytes)
}

const resolveDnsRecord = async ({
	request,
	resolverAddress,
	node,
	name,
	resource,
}: EnsRequest & {
	resolverAddress: `0x${string}`
	node: `0x${string}`
	name: string
	resource: number
}) => {
	const response = await request({
		method: 'eth_call',
		params: [
			{
				to: resolverAddress,
				data: encodeFunction(RESOLVER_DNS_RECORD_ABI, 'dnsRecord', [
					node,
					bytes32FromNamehash(keccak256(dnsNameWireFromName(name))),
					BigInt(resource),
				]),
			},
			'latest',
		],
	})
	if (response == null || typeof response !== 'string' || response === '0x') return null
	const [value] = decodeParameters(BYTES_OUTPUT, toBytes(response))
	const record = decodedBytesAsHex(value)
	return record == null || isZeroHex(record) ?
			null
		:
			record
}

const resolveZonehash = async ({
	request,
	resolverAddress,
	node,
}: EnsRequest & {
	resolverAddress: `0x${string}`
	node: `0x${string}`
}) => {
	const response = await request({
		method: 'eth_call',
		params: [
			{
				to: resolverAddress,
				data: encodeFunction(RESOLVER_ZONEHASH_ABI, 'zonehash', [node]),
			},
			'latest',
		],
	})
	if (response == null || typeof response !== 'string' || response === '0x') return null
	const [value] = decodeParameters(BYTES_OUTPUT, toBytes(response))
	const zoneHash = decodedBytesAsHex(value)
	return zoneHash == null || isZeroHex(zoneHash) ?
			null
		:
			zoneHash
}

const resolveResolverPubkey = async ({
	request,
	resolverAddress,
	node,
}: EnsRequest & {
	resolverAddress: `0x${string}`
	node: `0x${string}`
}) => {
	const response = await request({
		method: 'eth_call',
		params: [
			{
				to: resolverAddress,
				data: encodeFunction(RESOLVER_PUBKEY_ABI, 'pubkey', [node]),
			},
			'latest',
		],
	})
	if (response == null || typeof response !== 'string' || response === '0x') return null
	const [x, y] = decodeParameters(RESOLVER_PUBKEY_OUTPUT, toBytes(response))
	const xHex = hexLowerOfByteSize(decodedBytesAsHex(x) ?? '', 32)
	const yHex = hexLowerOfByteSize(decodedBytesAsHex(y) ?? '', 32)
	if (xHex == null || yHex == null) return null
	if (isZeroHex(xHex) && isZeroHex(yHex)) return null
	return `0x${xHex.slice(2)}${yHex.slice(2)}`
}

const reverseNode = (address: `0x${string}`) => (
	bytes32FromNamehash(
		namehash(`${address.toLowerCase().slice(2).padStart(40, '0')}.addr.reverse`)
	)
)

const resolveReverseName = async ({
	request,
	resolverAddress,
	node,
}: EnsRequest & {
	resolverAddress: `0x${string}`
	node: `0x${string}`
}) => {
	const response = await request({
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

const resolveEnsForward = async ({
	request,
	name,
	textKeys = ensTextRecords.map((row) => row.key),
	coinTypeIds = ensCoinTypes.map((row) => Number(row.key)),
	dnsRecordKeys = [
		{ name: `_dnslink.${name}`, type: ENS_DNS_RR_TYPE_TXT },
		{ name, type: ENS_DNS_RR_TYPE_TXT },
		{ name, type: ENS_DNS_RR_TYPE_A },
		{ name, type: ENS_DNS_RR_TYPE_AAAA },
	],
	zonehash = true,
	resolverAbi = true,
	resolverPubkey = true,
}: EnsRequest & {
	name: string
	textKeys?: readonly string[]
	coinTypeIds?: readonly number[]
	dnsRecordKeys?: readonly {
		name: string
		type: number
	}[]
	zonehash?: boolean
	resolverAbi?: boolean
	resolverPubkey?: boolean
}) => {
	const node = bytes32FromNamehash(namehash(name))
	const [owner, resolverAddress] = await Promise.all([
		getRegistryAddress({
			request,
			node,
			method: 'owner',
		}),
		getRegistryAddress({
			request,
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
			dnsRecords: { ...emptyStringRecord },
			zonehash: null,
			pubkey: null,
		}
	}
	const [address, textRecords, contentHash, resolverAbiJsonText, coinAddresses, dnsRecords, zoneHash, pubkey] = await Promise.all([
		resolveAddr({
			request,
			resolverAddress,
			node,
		}),
		Promise.all(
			textKeys.map(async (key) => (
				[
					key,
					await resolveText({
						request,
						resolverAddress,
						node,
						key,
					}),
				] as const
			))
		)
			.then((entries) => Object.fromEntries(entries.filter(([, value]) => value !== ''))),
		resolveContentHash({
			request,
			resolverAddress,
			node,
		}),
		resolverAbi ?
			resolveResolverAbiJson({
				request,
				resolverAddress,
				node,
			})
		:
			Promise.resolve(null),
		Promise.all(
			coinTypeIds.map(async (coinType) => (
				[
					String(coinType),
					await resolveMulticoinAddr({
						request,
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
		Promise.all(
			dnsRecordKeys.map(async ({ name: dnsName, type }) => (
				[
					`dns:${type}:${dnsName}`,
					await resolveDnsRecord({
						request,
						resolverAddress,
						node,
						name: dnsName,
						resource: type,
					}),
				] as const
			))
		)
			.then((entries) => (
				Object.fromEntries(
					entries.filter((entry): entry is [string, string] => entry[1] != null)
				)
			)),
		zonehash ?
			resolveZonehash({
				request,
				resolverAddress,
				node,
			})
		:
			Promise.resolve(null),
		resolverPubkey ?
			resolveResolverPubkey({
				request,
				resolverAddress,
				node,
			})
		:
			Promise.resolve(null),
	])
	return {
		address,
		owner,
		resolver: resolverAddress,
		textRecords,
		contentHash,
		resolverAbiJsonText,
		coinAddresses,
		dnsRecords,
		zonehash: zoneHash,
		pubkey,
	}
}

const resolveEnsReverse = async ({
	request,
	address,
}: EnsRequest & {
	address: `0x${string}`
}) => {
	const node = reverseNode(address)
	const resolverAddress = await getRegistryAddress({
		request,
		node,
		method: 'resolver',
	})
	return resolverAddress == null ?
			null
		:
			resolveReverseName({
				request,
				resolverAddress,
				node,
			})
}

export const ens = ({ request }: EnsRequest) => ({
	resolveEnsForward: (
		parameters: Omit<Parameters<typeof resolveEnsForward>[0], 'request'>
	) => resolveEnsForward({
		request,
		...parameters,
	}),
	resolveEnsReverse: (
		parameters: Omit<Parameters<typeof resolveEnsReverse>[0], 'request'>
	) => resolveEnsReverse({
		request,
		...parameters,
	}),
})

import { Abi, decodeParameters, encodeFunction } from '@tevm/voltaire/Abi'
import { namehash, normalize as ensNormalizeNode, toString as ensToString } from '@tevm/voltaire/Ens'
import { fromBytes as hexFromBytes, toBytes } from '@tevm/voltaire/Hex'

import {
	ensCoinTypeIdsToResolve,
	ensTextRecordKeys,
} from '$/constants/Ens.ts'
import { TransportType } from '$/constants/TransportType.ts'

import { getVoltaireProviderForExecutionUrl } from './queries.ts'

const ENS_REGISTRY_MAINNET = '0x00000000000C2E074eC69A0dFb2997BA6C7d2e1e' as const
const ZERO_ADDRESS = '0x0000000000000000000000000000000000000000'

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

const bytes32FromNamehash = (nodeBytes: Uint8Array) => {
	const hex = hexFromBytes(nodeBytes)
	return (
		hex.length === 66 ?
			hex
		:	`0x${Array.from(nodeBytes)
				.map((byte) => byte.toString(16).padStart(2, '0'))
				.join('')}`
	) as `0x${string}`
}

const isZeroHex = (value: string) => (
	/^0x0*$/i.test(value)
)

const decodedBytesAsHex = (value: unknown) => (
	typeof value === 'string' ?
		value
	: value instanceof Uint8Array ?
		hexFromBytes(value)
	: null
)

const getRegistryAddress = async ({
	rpcUrl,
	transportType,
	node,
	method,
}: {
	rpcUrl: string
	transportType: TransportType
	node: `0x${string}`
	method: 'owner' | 'resolver'
}) => {
	const provider = getVoltaireProviderForExecutionUrl({
		url: rpcUrl,
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
	return typeof address === 'string' && address !== ZERO_ADDRESS ?
			address as `0x${string}`
		: null
}

const resolveAddr = async ({
	rpcUrl,
	transportType,
	resolverAddress,
	node,
}: {
	rpcUrl: string
	transportType: TransportType
	resolverAddress: `0x${string}`
	node: `0x${string}`
}) => {
	const provider = getVoltaireProviderForExecutionUrl({
		url: rpcUrl,
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
	return typeof address === 'string' && address !== ZERO_ADDRESS ?
			address as `0x${string}`
		: null
}

const resolveText = async ({
	rpcUrl,
	transportType,
	resolverAddress,
	node,
	key,
}: {
	rpcUrl: string
	transportType: TransportType
	resolverAddress: `0x${string}`
	node: `0x${string}`
	key: string
}) => {
	const provider = getVoltaireProviderForExecutionUrl({
		url: rpcUrl,
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
	rpcUrl,
	transportType,
	resolverAddress,
	node,
}: {
	rpcUrl: string
	transportType: TransportType
	resolverAddress: `0x${string}`
	node: `0x${string}`
}) => {
	const provider = getVoltaireProviderForExecutionUrl({
		url: rpcUrl,
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
		: contentHash
}

const resolveMulticoinAddr = async ({
	rpcUrl,
	transportType,
	resolverAddress,
	node,
	coinType,
}: {
	rpcUrl: string
	transportType: TransportType
	resolverAddress: `0x${string}`
	node: `0x${string}`
	coinType: number
}) => {
	const provider = getVoltaireProviderForExecutionUrl({
		url: rpcUrl,
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
		: coinAddress
}

const reverseNode = (address: `0x${string}`) => (
	bytes32FromNamehash(
		namehash(`${address.toLowerCase().slice(2).padStart(40, '0')}.addr.reverse`),
	)
)

const resolveReverseName = async ({
	rpcUrl,
	transportType,
	resolverAddress,
	node,
}: {
	rpcUrl: string
	transportType: TransportType
	resolverAddress: `0x${string}`
	node: `0x${string}`
}) => {
	const provider = getVoltaireProviderForExecutionUrl({
		url: rpcUrl,
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

export const resolveEnsForwardForRpcUrl = async ({
	rpcUrl,
	transportType,
	name,
	textKeys = [...ensTextRecordKeys],
	coinTypeIds = ensCoinTypeIdsToResolve.map((value) => Number(value)),
}: {
	rpcUrl: string
	transportType: TransportType
	name: string
	textKeys?: string[]
	coinTypeIds?: number[]
}) => {
	const node = bytes32FromNamehash(namehash(name))
	const [owner, resolverAddress] = await Promise.all([
		getRegistryAddress({
			rpcUrl,
			transportType,
			node,
			method: 'owner',
		}),
		getRegistryAddress({
			rpcUrl,
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
			textRecords: {} as Record<string, string>,
			contentHash: null,
			coinAddresses: {} as Record<string, string>,
		}
	}
	const [address, textRecords, contentHash, coinAddresses] = await Promise.all([
		resolveAddr({
			rpcUrl,
			transportType,
			resolverAddress,
			node,
		}),
		Promise.all(
			textKeys.map(async (key) => (
				[
					key,
					await resolveText({
						rpcUrl,
						transportType,
						resolverAddress,
						node,
						key,
					}),
				] as const
			)),
		)
			.then((entries) => Object.fromEntries(entries.filter(([, value]) => value !== ''))),
		resolveContentHash({
			rpcUrl,
			transportType,
			resolverAddress,
			node,
		}),
		Promise.all(
			coinTypeIds.map(async (coinType) => (
				[
					String(coinType),
					await resolveMulticoinAddr({
						rpcUrl,
						transportType,
						resolverAddress,
						node,
						coinType,
					}),
				] as const
			)),
		)
			.then((entries) => (
				Object.fromEntries(
					entries.filter((entry): entry is [string, string] => entry[1] != null),
				)
			)),
	])
	return {
		address,
		owner,
		resolver: resolverAddress,
		textRecords,
		contentHash,
		coinAddresses,
	}
}

export const resolveEnsReverseForRpcUrl = async ({
	rpcUrl,
	transportType,
	address,
}: {
	rpcUrl: string
	transportType: TransportType
	address: `0x${string}`
}) => {
	const node = reverseNode(address)
	const resolverAddress = await getRegistryAddress({
		rpcUrl,
		transportType,
		node,
		method: 'resolver',
	})
	return resolverAddress == null ?
			null
		: resolveReverseName({
			rpcUrl,
			transportType,
			resolverAddress,
			node,
		})
}

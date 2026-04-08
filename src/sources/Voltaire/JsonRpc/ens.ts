import { Abi, decodeParameters, encodeFunction } from '@tevm/voltaire/Abi'
import { namehash, normalize as ensNormalizeNode, toString as ensToString } from '@tevm/voltaire/Ens'
import { fromBytes as hexFromBytes, toBytes } from '@tevm/voltaire/Hex'

import { TransportType } from '$/constants/TransportType.ts'

import { getVoltaireProviderForExecutionUrl } from './queries.ts'

const ENS_REGISTRY_MAINNET = '0x00000000000C2E074eC69A0dFb2997BA6C7d2e1e' as const
const ZERO_ADDRESS = '0x0000000000000000000000000000000000000000'

const ENS_REGISTRY_ABI = Abi([
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

const RESOLVER_ADDR_ABI = Abi([
	{
		type: 'function',
		name: 'addr',
		stateMutability: 'view',
		inputs: [{ type: 'bytes32', name: 'node' }],
		outputs: [{ type: 'address', name: '' }],
	},
])

const RESOLVER_TEXT_ABI = Abi([
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

const NAME_RESOLVER_ABI = Abi([
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
	if (typeof response !== 'string' || response === '0x') return ''
	const [value] = decodeParameters(STRING_OUTPUT, toBytes(response))
	return typeof value === 'string' ? value : ''
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
	textKeys = ['avatar'],
}: {
	rpcUrl: string
	transportType: TransportType
	name: string
	textKeys?: string[]
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
		}
	}
	const [address, textRecords] = await Promise.all([
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
	])
	return {
		address,
		owner,
		resolver: resolverAddress,
		textRecords,
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

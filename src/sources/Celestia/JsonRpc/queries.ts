/**
 * Celestia Node read-only JSON-RPC (OpenRPC v0.28.4).
 * @see https://docs.celestia.org/build/rpc/node-api/
 * @see https://docs.celestia.org/specs/openrpc-v0.28.4.json
 */

import { type as arktype } from 'arktype'

import {
	resolveEnvLocator,
	type SourcePublicEnv,
} from '$/sources/$sources.ts'
import { jsonRpc2 } from '$/sources/_shared/wire/JsonRpc2/client.ts'
import bindings from '$/sources/Celestia/bindings.ts'
import type {
	BlobProofWire,
	ExtendedHeaderWire,
	SyncStateWire,
} from '$/sources/Celestia/JsonRpc/types.ts'
import { Source } from '$/sources/Source.ts'

const hashPattern = /^[0-9a-fA-F]{64}$/
const namespacePattern = /^[A-Za-z0-9+/]{39}=$/
const commitmentPattern = /^[A-Za-z0-9+/]{43}=$/
const base64Pattern = /^(?:[A-Za-z0-9+/]{4})*(?:[A-Za-z0-9+/]{2}==|[A-Za-z0-9+/]{3}=)?$/
const unsignedDecimal = /^(0|[1-9][0-9]*)$/
const safeUnsignedInteger = 'number.integer >= 0 <= 9007199254740991'

const extendedHeaderWire = arktype({
	header: {
		chain_id: 'string',
		height: 'string',
		time: 'string',
		last_block_id: {
			hash: 'string',
		},
		data_hash: 'string',
		app_hash: 'string',
		proposer_address: 'string',
	},
	commit: {
		block_id: {
			hash: 'string',
		},
	},
})

const syncStateWire = arktype({
	id: safeUnsignedInteger,
	height: safeUnsignedInteger,
	from_height: safeUnsignedInteger,
	to_height: safeUnsignedInteger,
	from_hash: 'string',
	to_hash: 'string',
	start: 'string',
	end: 'string',
	error: 'string',
})

const blobProofWire = arktype({
	'start?': safeUnsignedInteger,
	end: safeUnsignedInteger,
	nodes: 'string[]',
	is_max_namespace_ignored: 'boolean',
}).array()

const binding = bindings[Source.CelestiaNode][0]

const configuredBinding = (publicEnv: SourcePublicEnv) => ({
	...binding,
	endpoints: binding.endpoints.map((endpoint) => ({
		...endpoint,
		locator: resolveEnvLocator(endpoint.locator, publicEnv),
	})),
})

const assertHeight = (height: bigint) => {
	if (height < 1n || height > BigInt(Number.MAX_SAFE_INTEGER))
		throw new Error('Celestia Node: height must be a positive JSON-safe integer')
}

const assertHash = (
	hash: string,
	label: string,
	allowEmpty = false
) => {
	if ((!allowEmpty || hash !== '') && !hashPattern.test(hash))
		throw new Error(`Celestia Node: invalid ${label}`)
}

const extendedHeaderFromWire = (
	wire: typeof extendedHeaderWire.infer
) => {
	if (wire.header.chain_id !== 'celestia')
		throw new Error('Celestia Node: foreign chain header')
	if (!unsignedDecimal.test(wire.header.height))
		throw new Error('Celestia Node: invalid header height')
	assertHash(wire.commit.block_id.hash, 'header hash')
	assertHash(wire.header.last_block_id.hash, 'parent header hash', true)
	assertHash(wire.header.data_hash, 'header data hash', true)
	assertHash(wire.header.app_hash, 'header application hash', true)
	if (!/^[0-9a-fA-F]{40}$/.test(wire.header.proposer_address))
		throw new Error('Celestia Node: invalid header proposer address')
	if (!Number.isFinite(Date.parse(wire.header.time)))
		throw new Error('Celestia Node: invalid header time')

	return {
		chainId: wire.header.chain_id,
		height: BigInt(wire.header.height),
		hash: wire.commit.block_id.hash.toLowerCase(),
		...(wire.header.last_block_id.hash !== '' && {
			parentHash: wire.header.last_block_id.hash.toLowerCase(),
		}),
		...(wire.header.data_hash !== '' && {
			dataHash: wire.header.data_hash.toLowerCase(),
		}),
		...(wire.header.app_hash !== '' && {
			appHash: wire.header.app_hash.toLowerCase(),
		}),
		proposerAddress: wire.header.proposer_address.toLowerCase(),
		time: wire.header.time,
	}
}

export const getHeaderSyncState = async (
	publicEnv: SourcePublicEnv
) => {
	const wire = syncStateWire.assert(await jsonRpc2<SyncStateWire>(
		configuredBinding(publicEnv),
		'header.SyncState',
		[]
	))
	assertHash(wire.from_hash, 'sync start hash', true)
	assertHash(wire.to_hash, 'sync end hash', true)

	return {
		id: wire.id,
		height: BigInt(wire.height),
		fromHeight: BigInt(wire.from_height),
		toHeight: BigInt(wire.to_height),
		...(wire.from_hash !== '' && {
			fromHash: wire.from_hash.toLowerCase(),
		}),
		...(wire.to_hash !== '' && {
			toHash: wire.to_hash.toLowerCase(),
		}),
		start: wire.start,
		end: wire.end,
		error: wire.error,
	}
}

export const getHeaderLocalHead = async (
	publicEnv: SourcePublicEnv
) => (
	extendedHeaderFromWire(extendedHeaderWire.assert(
		await jsonRpc2<ExtendedHeaderWire>(
			configuredBinding(publicEnv),
			'header.LocalHead',
			[]
		)
	))
)

export const getHeaderNetworkHead = async (
	publicEnv: SourcePublicEnv
) => (
	extendedHeaderFromWire(extendedHeaderWire.assert(
		await jsonRpc2<ExtendedHeaderWire>(
			configuredBinding(publicEnv),
			'header.NetworkHead',
			[]
		)
	))
)

export const getHeaderByHeight = async (
	publicEnv: SourcePublicEnv,
	height: bigint
) => {
	assertHeight(height)
	const header = extendedHeaderFromWire(extendedHeaderWire.assert(
		await jsonRpc2<ExtendedHeaderWire>(
			configuredBinding(publicEnv),
			'header.GetByHeight',
			[Number(height)]
		)
	))
	if (header.height !== height)
		throw new Error('Celestia Node: header response has mismatched height')

	return header
}

export const getBlobProof = async ({
	publicEnv,
	height,
	namespace,
	commitment,
}: {
	publicEnv: SourcePublicEnv
	height: bigint
	namespace: string
	commitment: string
}) => {
	assertHeight(height)
	if (!namespacePattern.test(namespace))
		throw new Error('Celestia Node: invalid blob namespace')
	if (!commitmentPattern.test(commitment))
		throw new Error('Celestia Node: invalid blob commitment')

	const proof = blobProofWire.assert(await jsonRpc2<BlobProofWire>(
		configuredBinding(publicEnv),
		'blob.GetProof',
		[
			Number(height),
			namespace,
			commitment,
		]
	))
	for (const rangeProof of proof)
		for (const node of rangeProof.nodes)
			if (!base64Pattern.test(node))
				throw new Error('Celestia Node: invalid blob proof node')

	return proof
}

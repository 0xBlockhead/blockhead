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
	BlobsWire,
	BlobWire,
	DasSamplingStatsWire,
	ExtendedHeaderWire,
	NodeInfoWire,
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

const blobWire = arktype({
	namespace: 'string',
	data: 'string',
	share_version: safeUnsignedInteger,
	commitment: 'string',
	index: 'number.integer',
})

const blobsWire = blobWire.array()

const dasSamplingStatsWire = arktype({
	head_of_sampled_chain: safeUnsignedInteger,
	head_of_catchup: safeUnsignedInteger,
	network_head_height: safeUnsignedInteger,
	'concurrency?': safeUnsignedInteger,
	catch_up_done: 'boolean',
	is_running: 'boolean',
})

const nodeInfoWire = arktype({
	type: 'number.integer >= 0',
	api_version: 'string',
})

const nodeTypeLabelByType = {
	1: 'bridge',
	2: 'full',
	3: 'light',
} as const

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

export const getHeaderByHash = async (
	publicEnv: SourcePublicEnv,
	hash: string
) => {
	assertHash(hash, 'header hash')
	const header = extendedHeaderFromWire(extendedHeaderWire.assert(
		await jsonRpc2<ExtendedHeaderWire>(
			configuredBinding(publicEnv),
			'header.GetByHash',
			[hash]
		)
	))
	if (header.hash !== hash.toLowerCase())
		throw new Error('Celestia Node: header response has mismatched hash')

	return header
}

const sizeBytesFromBase64 = (data: string) => {
	const padding = (
		data.endsWith('==') ?
			2
		: data.endsWith('=') ?
			1
		:
			0
	)
	return BigInt(((data.length * 3) / 4) - padding)
}

const blobFromWire = (wire: typeof blobWire.infer) => {
	if (!namespacePattern.test(wire.namespace))
		throw new Error('Celestia Node: invalid blob namespace in response')
	if (!commitmentPattern.test(wire.commitment))
		throw new Error('Celestia Node: invalid blob commitment in response')
	if (!base64Pattern.test(wire.data))
		throw new Error('Celestia Node: invalid blob data')

	return {
		namespace: wire.namespace,
		data: wire.data,
		shareVersion: wire.share_version,
		commitment: wire.commitment,
		index: wire.index,
		sizeBytes: sizeBytesFromBase64(wire.data),
	}
}

/**
 * Normalize enrolled namespace ids into Celestia Node base64 namespaces.
 * Accepts Node base64 (`…=`) or Celenium-style hex (`versionByte` + 28-byte id).
 */
export const namespaceForNodeRpc = (namespaceId: string) => {
	if (namespacePattern.test(namespaceId))
		return namespaceId
	if (!/^[0-9a-fA-F]{58}$/.test(namespaceId))
		throw new Error('Celestia Node: invalid blob namespace')
	const bytes = Uint8Array.from(
		(namespaceId.match(/.{2}/g) ?? []).map((pair) => Number.parseInt(pair, 16))
	)
	if (bytes.length !== 29)
		throw new Error('Celestia Node: invalid blob namespace')
	return globalThis.btoa(String.fromCharCode(...bytes))
}

export const getBlob = async ({
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
	const rpcNamespace = namespaceForNodeRpc(namespace)
	if (!commitmentPattern.test(commitment))
		throw new Error('Celestia Node: invalid blob commitment')

	const blob = blobFromWire(blobWire.assert(await jsonRpc2<BlobWire>(
		configuredBinding(publicEnv),
		'blob.Get',
		[
			Number(height),
			rpcNamespace,
			commitment,
		]
	)))
	if (blob.namespace !== rpcNamespace)
		throw new Error('Celestia Node: blob response has mismatched namespace')
	if (blob.commitment !== commitment)
		throw new Error('Celestia Node: blob response has mismatched commitment')

	return blob
}

export const getBlobsByNamespace = async ({
	publicEnv,
	height,
	namespaces,
}: {
	publicEnv: SourcePublicEnv
	height: bigint
	namespaces: readonly string[]
}) => {
	assertHeight(height)
	if (namespaces.length === 0)
		throw new Error('Celestia Node: namespaces required')
	const rpcNamespaces = namespaces.map((namespace) => namespaceForNodeRpc(namespace))
	for (const namespace of rpcNamespaces)
		if (!namespacePattern.test(namespace))
			throw new Error('Celestia Node: invalid blob namespace')

	const wires = blobsWire.assert(await jsonRpc2<BlobsWire>(
		configuredBinding(publicEnv),
		'blob.GetAll',
		[
			Number(height),
			rpcNamespaces,
		]
	))
	return wires.map((wire) => blobFromWire(wire))
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
	const rpcNamespace = namespaceForNodeRpc(namespace)
	if (!commitmentPattern.test(commitment))
		throw new Error('Celestia Node: invalid blob commitment')

	const proof = blobProofWire.assert(await jsonRpc2<BlobProofWire>(
		configuredBinding(publicEnv),
		'blob.GetProof',
		[
			Number(height),
			rpcNamespace,
			commitment,
		]
	))
	for (const rangeProof of proof)
		for (const node of rangeProof.nodes)
			if (!base64Pattern.test(node))
				throw new Error('Celestia Node: invalid blob proof node')

	return proof
}

export const isBlobIncluded = async ({
	publicEnv,
	height,
	namespace,
	commitment,
	proof,
}: {
	publicEnv: SourcePublicEnv
	height: bigint
	namespace: string
	commitment: string
	proof: typeof blobProofWire.infer
}) => {
	assertHeight(height)
	const rpcNamespace = namespaceForNodeRpc(namespace)
	if (!commitmentPattern.test(commitment))
		throw new Error('Celestia Node: invalid blob commitment')

	const included = arktype('boolean').assert(await jsonRpc2<boolean>(
		configuredBinding(publicEnv),
		'blob.Included',
		[
			Number(height),
			rpcNamespace,
			proof,
			commitment,
		]
	))
	return included
}

export const getDasSamplingStats = async (
	publicEnv: SourcePublicEnv
) => {
	const wire = dasSamplingStatsWire.assert(await jsonRpc2<DasSamplingStatsWire>(
		configuredBinding(publicEnv),
		'das.SamplingStats',
		[]
	))
	return {
		sampledHeaderHeight: BigInt(wire.head_of_sampled_chain),
		catchupHeight: BigInt(wire.head_of_catchup),
		networkHeadHeight: BigInt(wire.network_head_height),
		...(wire.concurrency != null && {
			concurrency: wire.concurrency,
		}),
		catchUpDone: wire.catch_up_done,
		isRunning: wire.is_running,
	}
}

export const getNodeReady = async (
	publicEnv: SourcePublicEnv
) => (
	arktype('boolean').assert(await jsonRpc2<boolean>(
		configuredBinding(publicEnv),
		'node.Ready',
		[]
	))
)

export const getNodeInfo = async (
	publicEnv: SourcePublicEnv
) => {
	const wire = nodeInfoWire.assert(await jsonRpc2<NodeInfoWire>(
		configuredBinding(publicEnv),
		'node.Info',
		[]
	))
	return {
		nodeType: (
			wire.type === 1 || wire.type === 2 || wire.type === 3 ?
				nodeTypeLabelByType[wire.type]
			:
				String(wire.type)
		),
		apiVersion: wire.api_version,
	}
}

/**
 * `share.SharesAvailable` returns null when DA shares for the height are available.
 * Failures surface as JSON-RPC errors from the node.
 */
export const assertSharesAvailable = async (
	publicEnv: SourcePublicEnv,
	height: bigint
) => {
	assertHeight(height)
	const result = await jsonRpc2<null>(
		configuredBinding(publicEnv),
		'share.SharesAvailable',
		[Number(height)]
	)
	if (result != null)
		throw new Error('Celestia Node: unexpected SharesAvailable result')
}

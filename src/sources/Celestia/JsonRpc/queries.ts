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
import {
	celestiaBlobProofWire,
	celestiaBlobWire,
	celestiaBlobsWire,
	celestiaDasSamplingStatsWire,
	celestiaExtendedHeaderWire,
	celestiaNodeInfoWire,
	celestiaShareRangeWire,
	celestiaSyncStateWire,
	type CelestiaBlobProof,
} from '$/sources/Celestia/JsonRpc/types.ts'
import { Source } from '$/sources/Source.ts'


const hashPattern = /^[0-9a-fA-F]{64}$/
const namespacePattern = /^[A-Za-z0-9+/]{39}=$/
const commitmentPattern = /^[A-Za-z0-9+/]{43}=$/
const base64Pattern = /^(?:[A-Za-z0-9+/]{4})*(?:[A-Za-z0-9+/]{2}==|[A-Za-z0-9+/]{3}=)?$/
const unsignedDecimal = /^(0|[1-9][0-9]*)$/

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

const assertEnvelope = <_Value>(
	label: string,
	wire: { assert: (value: unknown) => _Value },
	response: unknown
) => {
	try {
		return wire.assert(response)
	} catch {
		throw new Error(`Celestia Node: invalid ${label} response envelope`)
	}
}

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
	wire: typeof celestiaExtendedHeaderWire.infer
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
	const wire = assertEnvelope(
		'header.SyncState',
		celestiaSyncStateWire,
		await jsonRpc2(
			configuredBinding(publicEnv),
			'header.SyncState',
			[]
		)
	)
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
	extendedHeaderFromWire(assertEnvelope(
		'header.LocalHead',
		celestiaExtendedHeaderWire,
		await jsonRpc2(
			configuredBinding(publicEnv),
			'header.LocalHead',
			[]
		)
	))
)

export const getHeaderNetworkHead = async (
	publicEnv: SourcePublicEnv
) => (
	extendedHeaderFromWire(assertEnvelope(
		'header.NetworkHead',
		celestiaExtendedHeaderWire,
		await jsonRpc2(
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
	const header = extendedHeaderFromWire(assertEnvelope(
		'header.GetByHeight',
		celestiaExtendedHeaderWire,
		await jsonRpc2(
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
	const header = extendedHeaderFromWire(assertEnvelope(
		'header.GetByHash',
		celestiaExtendedHeaderWire,
		await jsonRpc2(
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

const blobFromWire = (wire: typeof celestiaBlobWire.infer) => {
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

const namespaceFromShareProof = ({
	namespaceId,
	namespaceVersion,
}: {
	namespaceId: string
	namespaceVersion: number
}) => {
	if (namespacePattern.test(namespaceId))
		return namespaceId
	if (namespaceVersion < 0 || namespaceVersion > 255)
		throw new Error('Celestia Node: invalid share namespace version')
	if (/^[0-9a-fA-F]{56}$/.test(namespaceId))
		return namespaceForNodeRpc(
			namespaceVersion.toString(16).padStart(2, '0') + namespaceId.toLowerCase()
		)
	if (!base64Pattern.test(namespaceId))
		throw new Error('Celestia Node: invalid share namespace id')
	const idBytes = Uint8Array.from(
		globalThis.atob(namespaceId),
		(character) => character.charCodeAt(0)
	)
	if (idBytes.length !== 28)
		throw new Error('Celestia Node: invalid share namespace id')
	const bytes = new Uint8Array(29)
	bytes[0] = namespaceVersion
	bytes.set(idBytes, 1)
	return globalThis.btoa(String.fromCharCode(...bytes))
}

export const getShareRange = async ({
	publicEnv,
	height,
	from,
	to,
}: {
	publicEnv: SourcePublicEnv
	height: bigint
	from: number
	to: number
}) => {
	assertHeight(height)
	if (
		!Number.isInteger(from)
		|| from < 0
		|| from > Number.MAX_SAFE_INTEGER
		|| !Number.isInteger(to)
		|| to <= from
		|| to > Number.MAX_SAFE_INTEGER
	)
		throw new Error('Celestia Node: invalid share range')

	const wire = assertEnvelope(
		'share.GetRange',
		celestiaShareRangeWire,
		await jsonRpc2(
			configuredBinding(publicEnv),
			'share.GetRange',
			[
				Number(height),
				from,
				to,
			]
		)
	)
	return {
		namespace: namespaceFromShareProof({
			namespaceId: wire.Proof.namespace_id,
			namespaceVersion: wire.Proof.namespace_version,
		}),
	}
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

	const blob = blobFromWire(assertEnvelope(
		'blob.Get',
		celestiaBlobWire,
		await jsonRpc2(
			configuredBinding(publicEnv),
			'blob.Get',
			[
				Number(height),
				rpcNamespace,
				commitment,
			]
		)
	))
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

	const wires = assertEnvelope(
		'blob.GetAll',
		celestiaBlobsWire,
		await jsonRpc2(
			configuredBinding(publicEnv),
			'blob.GetAll',
			[
				Number(height),
				rpcNamespaces,
			]
		)
	)
	const blobs = wires.map((wire) => blobFromWire(wire))
	const requestedNamespaces = new Set(rpcNamespaces)
	for (const blob of blobs)
		if (!requestedNamespaces.has(blob.namespace))
			throw new Error('Celestia Node: blob response has unrequested namespace')

	return blobs
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

	const proof = assertEnvelope(
		'blob.GetProof',
		celestiaBlobProofWire,
		await jsonRpc2(
			configuredBinding(publicEnv),
			'blob.GetProof',
			[
				Number(height),
				rpcNamespace,
				commitment,
			]
		)
	)
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
	proof: CelestiaBlobProof
}) => {
	assertHeight(height)
	const rpcNamespace = namespaceForNodeRpc(namespace)
	if (!commitmentPattern.test(commitment))
		throw new Error('Celestia Node: invalid blob commitment')

	const included = assertEnvelope(
		'blob.Included',
		arktype('boolean'),
		await jsonRpc2(
			configuredBinding(publicEnv),
			'blob.Included',
			[
				Number(height),
				rpcNamespace,
				proof,
				commitment,
			]
		)
	)
	return included
}

export const getDasSamplingStats = async (
	publicEnv: SourcePublicEnv
) => {
	const wire = assertEnvelope(
		'das.SamplingStats',
		celestiaDasSamplingStatsWire,
		await jsonRpc2(
			configuredBinding(publicEnv),
			'das.SamplingStats',
			[]
		)
	)
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
	assertEnvelope(
		'node.Ready',
		arktype('boolean'),
		await jsonRpc2(
			configuredBinding(publicEnv),
			'node.Ready',
			[]
		)
	)
)

export const getNodeInfo = async (
	publicEnv: SourcePublicEnv
) => {
	const wire = assertEnvelope(
		'node.Info',
		celestiaNodeInfoWire,
		await jsonRpc2(
			configuredBinding(publicEnv),
			'node.Info',
			[]
		)
	)
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
	const result = await jsonRpc2(
		configuredBinding(publicEnv),
		'share.SharesAvailable',
		[Number(height)]
	)
	if (result != null)
		throw new Error('Celestia Node: unexpected SharesAvailable result')
}

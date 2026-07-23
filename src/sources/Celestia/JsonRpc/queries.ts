import { type as arktype } from 'arktype'

import { Source } from '$/sources/Source.ts'
import {
	SourceTargetKind,
	type SourceBinding,
} from '$/sources/SourceBinding.ts'
import { jsonRpc2 } from '$/sources/_shared/wire/JsonRpc2/client.ts'
import type {
	CelestiaBlobProof,
	CelestiaExtendedHeader,
	CelestiaHeaderSyncState,
} from '$/sources/Celestia/JsonRpc/types.ts'
import type { JsonValue } from '$/typescript/JsonValue.ts'

const hashPattern = /^[0-9a-fA-F]{64}$/
const namespacePattern = /^[A-Za-z0-9+/]{39}=$/
const commitmentPattern = /^[A-Za-z0-9+/]{43}=$/
const unsignedDecimal = /^(0|[1-9][0-9]*)$/

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
	from_height: 'string',
	to_height: 'string',
})

const assertBinding = (binding: SourceBinding) => {
	if (
		binding.source !== Source.Celestia_JsonRpc
		|| binding.target.kind !== SourceTargetKind.NetworkSlug
		|| binding.target.key !== 'celestia'
	)
		throw new Error('Celestia_JsonRpc: expected canonical Celestia network binding')
}

const assertHeight = (height: bigint) => {
	if (height < 1n || height > 18_446_744_073_709_551_615n)
		throw new Error('Celestia_JsonRpc: height must be a positive unsigned 64-bit integer')
}

const request = (
	binding: SourceBinding,
	method: string,
	params: readonly JsonValue[] = []
) => {
	assertBinding(binding)
	return jsonRpc2<JsonValue>(binding, method, params)
}

const extendedHeaderFromWire = (
	wire: typeof extendedHeaderWire.infer
): CelestiaExtendedHeader => {
	if (wire.header.chain_id !== 'celestia')
		throw new Error('Celestia_JsonRpc: foreign chain header')
	if (!unsignedDecimal.test(wire.header.height))
		throw new Error('Celestia_JsonRpc: invalid header height')
	for (const [value, label] of [
		[wire.commit.block_id.hash, 'header hash'],
		[wire.header.data_hash, 'header data hash'],
		[wire.header.app_hash, 'header application hash'],
	] as const)
		if (!hashPattern.test(value))
			throw new Error(`Celestia_JsonRpc: invalid ${label}`)
	if (!/^[0-9a-fA-F]{40}$/.test(wire.header.proposer_address))
		throw new Error('Celestia_JsonRpc: invalid header proposer address')
	if (
		wire.header.last_block_id.hash !== ''
		&& !hashPattern.test(wire.header.last_block_id.hash)
	)
		throw new Error('Celestia_JsonRpc: invalid parent header hash')
	return {
		chainId: wire.header.chain_id,
		height: BigInt(wire.header.height),
		hash: wire.commit.block_id.hash.toLowerCase(),
		...(wire.header.last_block_id.hash !== '' && {
			parentHash: wire.header.last_block_id.hash.toLowerCase(),
		}),
		dataHash: wire.header.data_hash.toLowerCase(),
		appHash: wire.header.app_hash.toLowerCase(),
		proposerAddress: wire.header.proposer_address.toLowerCase(),
		time: wire.header.time,
	}
}

export const getHeaderSyncState = async (
	binding: SourceBinding
): Promise<CelestiaHeaderSyncState> => {
	const wire = syncStateWire.assert(await request(binding, 'header.SyncState'))
	if (
		!unsignedDecimal.test(wire.from_height)
		|| !unsignedDecimal.test(wire.to_height)
	)
		throw new Error('Celestia_JsonRpc: invalid header sync range')
	return {
		fromHeight: BigInt(wire.from_height),
		toHeight: BigInt(wire.to_height),
	}
}

export const getHeaderLocalHead = async (
	binding: SourceBinding
): Promise<CelestiaExtendedHeader> => (
	extendedHeaderFromWire(extendedHeaderWire.assert(
		await request(binding, 'header.LocalHead')
	))
)

export const getHeaderNetworkHead = async (
	binding: SourceBinding
): Promise<CelestiaExtendedHeader> => (
	extendedHeaderFromWire(extendedHeaderWire.assert(
		await request(binding, 'header.NetworkHead')
	))
)

export const getHeaderByHeight = async (
	binding: SourceBinding,
	height: bigint
): Promise<CelestiaExtendedHeader> => {
	assertHeight(height)
	const header = extendedHeaderFromWire(extendedHeaderWire.assert(
		await request(
			binding,
			'header.GetByHeight',
			[height.toString()]
		)
	))
	if (header.height !== height)
		throw new Error('Celestia_JsonRpc: header response has mismatched height')
	return header
}

export const getBlobProof = async ({
	binding,
	height,
	namespace,
	commitment,
}: {
	binding: SourceBinding
	height: bigint
	namespace: string
	commitment: string
}): Promise<CelestiaBlobProof> => {
	assertHeight(height)
	if (!namespacePattern.test(namespace))
		throw new Error('Celestia_JsonRpc: invalid blob namespace')
	if (!commitmentPattern.test(commitment))
		throw new Error('Celestia_JsonRpc: invalid blob commitment')
	return await request(
		binding,
		'blob.GetProof',
		[
			height.toString(),
			namespace,
			commitment,
		]
	)
}

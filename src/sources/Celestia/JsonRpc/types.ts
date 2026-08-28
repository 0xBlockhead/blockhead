/**
 * Celestia Node JSON-RPC wire shapes.
 * OpenRPC aliases track codegen; arktype envelopes fail-close live tip/blob responses.
 * @see https://docs.celestia.org/build/rpc/node-api/
 * @see https://docs.celestia.org/specs/openrpc-v0.28.4.json
 */

import { type as arktype } from 'arktype'

import type { components } from '$/sources/Celestia/JsonRpc/openrpc.d.ts'


type CelestiaSchemas = components['schemas']

/**
 * Wire ExtendedHeader from Celestia Node OpenRPC `header.LocalHead` / `header.NetworkHead` / `header.GetByHeight` / `header.GetByHash`.
 */
export type ExtendedHeaderWire = CelestiaSchemas['header_LocalHead_Result']

/**
 * Wire syncer state from Celestia Node OpenRPC `header.SyncState`.
 */
export type SyncStateWire = CelestiaSchemas['header_SyncState_Result']

/**
 * Wire blob from Celestia Node OpenRPC `blob.Get`
 * (OpenRPC collapses several nested shapes via `typeUnsupportedByJSONSchema`).
 */
export type BlobWire = CelestiaSchemas['blob_Get_Result']

/**
 * Wire proof ranges from Celestia Node OpenRPC `blob.GetProof`
 * (OpenRPC collapses item shape to empty records via `typeUnsupportedByJSONSchema`).
 */
export type BlobProofWire = CelestiaSchemas['blob_GetProof_Result']

/**
 * Wire blob list from Celestia Node OpenRPC `blob.GetAll`.
 */
export type BlobsWire = CelestiaSchemas['blob_GetAll_Result']

/**
 * Wire DAS sampling stats from Celestia Node OpenRPC `das.SamplingStats`.
 */
export type DasSamplingStatsWire = CelestiaSchemas['das_SamplingStats_Result']

/**
 * Wire node info from Celestia Node OpenRPC `node.Info` (admin on many public nodes).
 */
export type NodeInfoWire = CelestiaSchemas['node_Info_Result']


const safeUnsignedInteger = '0 <= number.integer <= 9007199254740991'

/** Fail-closed ExtendedHeader envelope for tip / by-height / by-hash reads. */
export const celestiaExtendedHeaderWire = arktype({
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

export type CelestiaExtendedHeader = typeof celestiaExtendedHeaderWire.infer

/** Fail-closed `header.SyncState` envelope. */
export const celestiaSyncStateWire = arktype({
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

export type CelestiaSyncState = typeof celestiaSyncStateWire.infer

/** Fail-closed `blob.GetProof` range-proof list. */
export const celestiaBlobProofWire = arktype({
	'start?': safeUnsignedInteger,
	end: safeUnsignedInteger,
	nodes: 'string[]',
	is_max_namespace_ignored: 'boolean',
}).array()

export type CelestiaBlobProof = typeof celestiaBlobProofWire.infer

/** Fail-closed `blob.Get` / `blob.GetAll` item. */
export const celestiaBlobWire = arktype({
	namespace: 'string',
	data: 'string',
	share_version: safeUnsignedInteger,
	commitment: 'string',
	index: 'number.integer',
})

export type CelestiaBlob = typeof celestiaBlobWire.infer

export const celestiaBlobsWire = celestiaBlobWire.array()

export type CelestiaBlobs = typeof celestiaBlobsWire.infer

/** Fail-closed `das.SamplingStats` envelope. */
export const celestiaDasSamplingStatsWire = arktype({
	head_of_sampled_chain: safeUnsignedInteger,
	head_of_catchup: safeUnsignedInteger,
	network_head_height: safeUnsignedInteger,
	'concurrency?': safeUnsignedInteger,
	catch_up_done: 'boolean',
	is_running: 'boolean',
})

export type CelestiaDasSamplingStats = typeof celestiaDasSamplingStatsWire.infer

/** Fail-closed `node.Info` envelope. */
export const celestiaNodeInfoWire = arktype({
	type: 'number.integer >= 0',
	api_version: 'string',
})

export type CelestiaNodeInfo = typeof celestiaNodeInfoWire.infer

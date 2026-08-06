import type { components } from '$/sources/Celestia/JsonRpc/openrpc.d.ts'

type CelestiaSchemas = components['schemas']

/**
 * Wire ExtendedHeader from Celestia Node OpenRPC `header.LocalHead` / `header.NetworkHead` / `header.GetByHeight` / `header.GetByHash`.
 * @see https://docs.celestia.org/build/rpc/node-api/
 */
export type ExtendedHeaderWire = CelestiaSchemas['header_LocalHead_Result']

/**
 * Wire syncer state from Celestia Node OpenRPC `header.SyncState`.
 * @see https://docs.celestia.org/build/rpc/node-api/
 */
export type SyncStateWire = CelestiaSchemas['header_SyncState_Result']

/**
 * Wire blob from Celestia Node OpenRPC `blob.Get`
 * (OpenRPC collapses several nested shapes via `typeUnsupportedByJSONSchema`).
 * @see https://docs.celestia.org/build/rpc/node-api/
 */
export type BlobWire = CelestiaSchemas['blob_Get_Result']

/**
 * Wire proof ranges from Celestia Node OpenRPC `blob.GetProof`
 * (OpenRPC collapses item shape to empty records via `typeUnsupportedByJSONSchema`).
 * @see https://docs.celestia.org/build/rpc/node-api/
 * @see https://docs.celestia.org/specs/openrpc-v0.28.4.json
 */
export type BlobProofWire = CelestiaSchemas['blob_GetProof_Result']

import { readFileSync } from 'node:fs'
import { dirname, resolve } from 'node:path'
import { fileURLToPath } from 'node:url'

import { describe, expect, it } from 'vitest'

import type {
	BlobProofWire,
	BlobWire,
	ExtendedHeaderWire,
	SyncStateWire,
} from '$/sources/Celestia/JsonRpc/types.ts'
import { schemaSource } from '$/sources/Celestia/JsonRpc/schema-source.ts'

const openRpcDir = dirname(fileURLToPath(import.meta.url))

describe('Celestia Node OpenRPC schema-source', () => {
	it('declares a checked-in OpenRPC document and generated typesFile', () => {
		expect(schemaSource.schemaUrl).toBe('https://docs.celestia.org/specs/openrpc-v0.28.4.json')
		expect(schemaSource.schemaFile).toBe('./openrpc.json')
		expect(schemaSource.typesFile).toBe('./openrpc.d.ts')
		expect(readFileSync(resolve(openRpcDir, schemaSource.schemaFile), 'utf8')).toContain('"header.LocalHead"')
		expect(readFileSync(resolve(openRpcDir, schemaSource.typesFile), 'utf8')).toContain('header_LocalHead_Result:')
		expect(readFileSync(resolve(openRpcDir, schemaSource.typesFile), 'utf8')).toContain('header_SyncState_Result:')
		expect(readFileSync(resolve(openRpcDir, schemaSource.typesFile), 'utf8')).toContain('blob_GetProof_Result:')
		expect(readFileSync(resolve(openRpcDir, schemaSource.typesFile), 'utf8')).toContain('blob_Get_Result:')
		expect(readFileSync(resolve(openRpcDir, schemaSource.typesFile), 'utf8')).toContain('header_GetByHash_Result:')
	})

	it('aliases ExtendedHeader, SyncState, Blob, and BlobProof wire shapes from generated OpenRPC schemas', () => {
		const header = {
			header: {
				chain_id: 'celestia',
				height: 1,
				time: '2026-07-23T04:49:10Z',
				last_block_id: {
					hash: 'a'.repeat(64),
				},
				data_hash: 'b'.repeat(64),
				app_hash: 'c'.repeat(64),
				proposer_address: 'd'.repeat(40),
			},
			commit: {
				block_id: {
					hash: 'e'.repeat(64),
				},
			},
		} as const satisfies ExtendedHeaderWire

		const syncState = {
			id: 1,
			height: 2,
			from_height: 1,
			to_height: 3,
			from_hash: 'f'.repeat(64),
			to_hash: 'g'.repeat(64),
			start: '2026-07-23T04:49:10Z',
			end: '2026-07-23T04:50:10Z',
			error: '',
		} as const satisfies SyncStateWire

		// OpenRPC collapses proof item schemas; the generated result is still an array.
		const proof = [{}] as const satisfies BlobProofWire
		const blob = {
			commitment: 'aHlbp+J9yub6hw/uhK6dP8hBLR2mFy78XNRRdLf2794=',
		} as const satisfies BlobWire

		expect(header.header?.chain_id).toBe('celestia')
		expect(syncState.height).toBe(2)
		expect(proof).toHaveLength(1)
		expect(blob.commitment).toContain('aHlbp')
	})
})

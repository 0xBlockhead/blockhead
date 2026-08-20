import { describe, expect, it } from 'vitest'

import type {
	BlobProofWire,
	BlobWire,
	ExtendedHeaderWire,
	SyncStateWire,
} from '$/sources/Celestia/JsonRpc/types.ts'

describe('Celestia Node OpenRPC schema-source', () => {
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

		expect(header.header.chain_id).toBe('celestia')
		expect(syncState.height).toBe(2)
		expect(proof).toHaveLength(1)
		expect(blob.commitment).toContain('aHlbp')
	})
})

import { readFileSync } from 'node:fs'
import { dirname, resolve } from 'node:path'
import { fileURLToPath } from 'node:url'

import { describe, expect, it } from 'vitest'

import type {
	BlockId,
	Event,
	EventsFilter,
	Felt,
	SyncStatus,
} from '$/sources/_shared/interfaces/StarknetJsonRpc/types.ts'
import { schemaSource } from '$/sources/_shared/interfaces/StarknetJsonRpc/OpenRpc/schema-source.ts'

const openRpcDir = dirname(fileURLToPath(import.meta.url))

describe('Starknet OpenRPC schema-source', () => {
	it('declares a checked-in OpenRPC document and generated typesFile', () => {
		expect(schemaSource.schemaUrl).toContain('starknet-specs')
		expect(schemaSource.schemaFile).toBe('./openrpc.json')
		expect(schemaSource.typesFile).toBe('./openrpc.d.ts')
		expect(readFileSync(resolve(openRpcDir, schemaSource.schemaFile), 'utf8')).toContain('"starknet_getEvents"')
		expect(readFileSync(resolve(openRpcDir, schemaSource.typesFile), 'utf8')).toContain('SyncingStatus:')
	})

	it('aliases shared Starknet wire types from generated OpenRPC schemas', () => {
		const felt = '0x1' as const satisfies Felt
		const blockId = 'latest' as const satisfies BlockId
		const syncing = false as const satisfies SyncStatus
		const filter = {
			from_block: blockId,
			address: felt,
			chunk_size: 10,
		} as const satisfies EventsFilter
		const event = {
			from_address: felt,
			keys: [felt],
			data: [felt],
			transaction_hash: felt,
			transaction_index: 0,
			event_index: 0,
		} as const satisfies Event

		expect(filter.chunk_size).toBe(10)
		expect(event.transaction_index).toBe(0)
		expect(syncing).toBe(false)
	})
})

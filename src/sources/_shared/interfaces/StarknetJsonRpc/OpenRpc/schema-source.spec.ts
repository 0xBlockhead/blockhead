import { describe, expect, it } from 'vitest'

import type {
	BlockId,
	BlockWithTxHashes,
	Event,
	EventsFilter,
	Felt,
	SyncStatus,
	TransactionReceiptWithBlockInfo,
	TransactionWithHash,
} from '$/sources/_shared/interfaces/StarknetJsonRpc/types.ts'

describe('Starknet OpenRPC schema-source', () => {
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
		const block = {
			status: 'ACCEPTED_ON_L2',
			block_hash: felt,
			parent_hash: felt,
			block_number: 1,
			new_root: felt,
			timestamp: 1,
			sequencer_address: felt,
			l1_gas_price: {
				price_in_fri: felt,
				price_in_wei: felt,
			},
			l2_gas_price: {
				price_in_fri: felt,
				price_in_wei: felt,
			},
			l1_data_gas_price: {
				price_in_fri: felt,
				price_in_wei: felt,
			},
			l1_da_mode: 'CALLDATA',
			starknet_version: '0.13.0',
			event_commitment: felt,
			transaction_commitment: felt,
			receipt_commitment: felt,
			state_diff_commitment: felt,
			event_count: 0,
			transaction_count: 1,
			state_diff_length: 0,
			transactions: [felt],
		} as const satisfies BlockWithTxHashes
		const transaction = {
			type: 'INVOKE',
			version: '0x3',
			sender_address: felt,
			calldata: [felt],
			signature: [felt],
			nonce: felt,
			resource_bounds: {
				l1_gas: {
					max_amount: '0x1',
					max_price_per_unit: '0x1',
				},
				l2_gas: {
					max_amount: '0x1',
					max_price_per_unit: '0x1',
				},
				l1_data_gas: {
					max_amount: '0x1',
					max_price_per_unit: '0x1',
				},
			},
			tip: '0x0',
			paymaster_data: [],
			account_deployment_data: [],
			nonce_data_availability_mode: 'L1',
			fee_data_availability_mode: 'L1',
			transaction_hash: felt,
		} as const satisfies TransactionWithHash
		const receipt = {
			type: 'INVOKE',
			transaction_hash: felt,
			actual_fee: {
				amount: felt,
				unit: 'WEI',
			},
			finality_status: 'ACCEPTED_ON_L2',
			messages_sent: [],
			events: [],
			execution_resources: {
				l1_gas: 0,
				l1_data_gas: 0,
				l2_gas: 0,
			},
			execution_status: 'SUCCEEDED',
			block_number: 1,
		} as const satisfies TransactionReceiptWithBlockInfo

		expect(filter.chunk_size).toBe(10)
		expect(event.transaction_index).toBe(0)
		expect(syncing).toBe(false)
		expect(block.transactions).toHaveLength(1)
		expect(transaction.type).toBe('INVOKE')
		expect(receipt.block_number).toBe(1)
	})
})

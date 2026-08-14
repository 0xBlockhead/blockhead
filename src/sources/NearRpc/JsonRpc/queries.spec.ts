import {
	beforeEach,
	expect,
	it,
	vi,
} from 'vitest'

const jsonRpc2 = vi.hoisted(() => vi.fn())

vi.mock('$/sources/_shared/wire/JsonRpc2/client.ts', () => ({
	jsonRpc2,
}))

const {
	nearRpc,
} = await import('$/sources/NearRpc/JsonRpc/queries.ts')
const {
	getGasPrice,
	getReceipt,
	getTx,
	getTxStatus,
	getValidators,
	viewAccessKey,
	viewAccessKeyList,
	viewAccount,
} = nearRpc

const actionReceiptBody = {
	Action: {
		signer_id: 'signer.near',
		signer_public_key: 'ed25519:signer',
		gas_price: '100000000',
		actions: [{
			Transfer: {
				deposit: '1',
			},
		}],
		input_data_ids: [],
		output_data_receivers: [],
	},
} as const

beforeEach(() => {
	jsonRpc2.mockReset()
})

it('fail-closes malformed receipt and transaction-status envelopes', async () => {
	jsonRpc2
		.mockResolvedValueOnce({
			predecessor_id: 'a.near',
		})
		.mockResolvedValueOnce({
			transaction: {
				hash: 'hash',
			},
		})
		.mockResolvedValueOnce({
			predecessor_id: 'signer.near',
			receiver_id: 'receiver.near',
			receipt_id: 'receipt-1',
			receipt: {
				Action: {},
			},
		})
		.mockResolvedValueOnce({
			current_fishermen: [],
			current_proposals: [],
			current_validators: [{
				account_id: 'alice.near',
				public_key: 'ed25519:alice',
				stake: '1000',
				is_slashed: false,
			}],
			epoch_height: 1,
			epoch_start_height: 1,
			next_fishermen: [],
			next_validators: [],
			prev_epoch_kickout: [],
		})
		.mockResolvedValueOnce({
			amount: '10',
			code_hash: '11111111111111111111111111111111',
			storage_usage: 100,
		})

	await expect(getReceipt({
		receiptId: 'receipt-1',
	})).rejects.toThrow('invalid receipt response envelope')
	await expect(getTxStatus({
		txHash: 'hash',
		senderAccountId: 'signer.near',
	})).rejects.toThrow('invalid tx status response envelope')
	await expect(getReceipt({
		receiptId: 'receipt-1',
	})).rejects.toThrow('invalid receipt response envelope')
	await expect(getValidators()).rejects.toThrow('invalid validators response envelope')
	await expect(viewAccount({
		accountId: 'signer.near',
	})).rejects.toThrow('invalid account response envelope')
})

it('accepts EXPERIMENTAL_tx_status receipts and receipt predecessor/receiver wires', async () => {
	jsonRpc2
		.mockResolvedValueOnce({
			predecessor_id: 'signer.near',
			receiver_id: 'receiver.near',
			receipt_id: 'receipt-1',
			receipt: actionReceiptBody,
		})
		.mockResolvedValueOnce({
			transaction: {
				hash: 'hash',
				signer_id: 'signer.near',
				receiver_id: 'receiver.near',
				nonce: 1,
				actions: [{
					Transfer: {
						deposit: '1',
					},
				}],
			},
			transaction_outcome: {
				id: 'outcome-tx',
				outcome: {
					gas_burnt: 1,
					receipt_ids: ['receipt-1'],
					status: {
						SuccessValue: '',
					},
					executor_id: 'signer.near',
					logs: [],
					tokens_burnt: '0',
				},
			},
			receipts_outcome: [{
				id: 'outcome-receipt',
				outcome: {
					gas_burnt: 2,
					receipt_ids: [],
					status: {
						SuccessValue: '',
					},
					executor_id: 'receiver.near',
					logs: [],
					tokens_burnt: '0',
				},
			}],
			status: {
				SuccessValue: '',
			},
			receipts: [{
				predecessor_id: 'signer.near',
				receiver_id: 'receiver.near',
				receipt_id: 'receipt-1',
				receipt: actionReceiptBody,
			}],
		})
		.mockResolvedValueOnce({
			amount: '10',
			locked: '0',
			code_hash: '11111111111111111111111111111111',
			storage_usage: 100,
			storage_paid_at: 0,
			block_height: 123,
			block_hash: 'account-block-hash',
		})
		.mockResolvedValueOnce({
			nonce: 7,
			permission: 'FullAccess',
			block_height: 124,
			block_hash: 'access-key-block-hash',
		})
		.mockResolvedValueOnce({
			keys: [{
				public_key: 'ed25519:key',
				access_key: {
					nonce: 7,
					permission: 'FullAccess',
				},
			}],
			block_height: 125,
			block_hash: 'access-key-list-block-hash',
		})
		.mockResolvedValueOnce({
			gas_price: '100000000',
		})
		.mockResolvedValueOnce({
			current_fishermen: [],
			current_proposals: [{
				account_id: 'proposal.near',
				public_key: 'ed25519:proposal',
				stake: '1',
				validator_stake_struct_version: 'V1',
			}],
			current_validators: [{
				account_id: 'alice.near',
				public_key: 'ed25519:alice',
				stake: '1000',
				is_slashed: false,
				shards: [0],
				num_expected_blocks: 10,
				num_produced_blocks: 9,
				num_expected_chunks: 20,
				num_produced_chunks: 18,
			}],
			epoch_height: 100,
			epoch_start_height: 1_200_000,
			next_fishermen: [],
			next_validators: [{
				account_id: 'next.near',
				public_key: 'ed25519:next',
				stake: '1',
				shards: [0],
			}],
			prev_epoch_kickout: [{
				account_id: 'kicked.near',
				reason: {
					NotEnoughBlocks: {
						expected: 10,
						produced: 1,
					},
				},
			}],
		})

	await expect(getReceipt({
		receiptId: 'receipt-1',
	})).resolves.toMatchObject({
		receipt_id: 'receipt-1',
		predecessor_id: 'signer.near',
		receipt: {
			Action: {
				signer_id: 'signer.near',
				actions: [{
					Transfer: {
						deposit: '1',
					},
				}],
			},
		},
	})
	await expect(getTxStatus({
		txHash: 'hash',
		senderAccountId: 'signer.near',
	})).resolves.toMatchObject({
		receipts: [{
			receipt_id: 'receipt-1',
		}],
	})
	await expect(viewAccount({
		accountId: 'signer.near',
	})).resolves.toMatchObject({
		amount: '10',
		locked: '0',
		block_height: 123,
	})
	await expect(viewAccessKey({
		accountId: 'signer.near',
		publicKey: 'ed25519:key',
	})).resolves.toMatchObject({
		nonce: 7,
		block_height: 124,
	})
	await expect(viewAccessKeyList({
		accountId: 'signer.near',
	})).resolves.toMatchObject({
		block_height: 125,
		keys: [{
			public_key: 'ed25519:key',
		}],
	})
	await expect(getGasPrice()).resolves.toMatchObject({
		gas_price: '100000000',
	})
	await expect(getValidators()).resolves.toMatchObject({
		current_proposals: [{
			account_id: 'proposal.near',
		}],
		current_validators: [{
			account_id: 'alice.near',
			shards: [0],
		}],
		next_validators: [{
			account_id: 'next.near',
			shards: [0],
		}],
	})
})

it('rejects empty receipt and transaction selectors before transport', async () => {
	await expect(getReceipt({
		receiptId: '',
	})).rejects.toThrow('empty receipt id')
	await expect(getTxStatus({
		txHash: '',
		senderAccountId: 'signer.near',
	})).rejects.toThrow('transaction hash and signer are required')
	expect(jsonRpc2).not.toHaveBeenCalled()
})

it('pins account state queries to the requested block hash', async () => {
	jsonRpc2.mockResolvedValueOnce({
		amount: '10',
		locked: '0',
		code_hash: '11111111111111111111111111111111',
		storage_usage: 100,
		storage_paid_at: 0,
		block_height: 123,
		block_hash: 'block-hash',
	})

	await viewAccount({
		accountId: 'signer.near',
		blockId: 'block-hash',
	})

	expect(jsonRpc2).toHaveBeenCalledWith(
		expect.anything(),
		'query',
		{
			request_type: 'view_account',
			block_id: 'block-hash',
			account_id: 'signer.near',
		}
	)
})

it('rejects substituted receipt and transaction subjects', async () => {
	jsonRpc2
		.mockResolvedValueOnce({
			predecessor_id: 'signer.near',
			receiver_id: 'receiver.near',
			receipt_id: 'receipt-2',
			receipt: actionReceiptBody,
		})
		.mockResolvedValueOnce({
			transaction: {
				hash: 'other-hash',
				signer_id: 'signer.near',
				receiver_id: 'receiver.near',
				nonce: 1,
				actions: [],
			},
			transaction_outcome: {
				id: 'outcome',
				outcome: {
					gas_burnt: 0,
					receipt_ids: [],
					status: { SuccessValue: '' },
				},
			},
			receipts_outcome: [],
			status: { SuccessValue: '' },
		})
		.mockResolvedValueOnce({
			transaction: {
				hash: 'hash',
				signer_id: 'other.near',
				receiver_id: 'receiver.near',
				nonce: 1,
				actions: [],
			},
			transaction_outcome: {
				id: 'outcome',
				outcome: {
					gas_burnt: 0,
					receipt_ids: [],
					status: { SuccessValue: '' },
				},
			},
			receipts_outcome: [],
			status: { SuccessValue: '' },
		})

	await expect(getReceipt({ receiptId: 'receipt-1' })).rejects.toThrow('receipt response does not match request')
	await expect(getTx({
		txHash: 'hash',
		senderAccountId: 'signer.near',
	})).rejects.toThrow('tx response does not match request')
	await expect(getTxStatus({
		txHash: 'hash',
		senderAccountId: 'signer.near',
	})).rejects.toThrow('tx status response does not match request')
})

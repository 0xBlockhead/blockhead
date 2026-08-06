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
	getReceipt,
	getTxStatus,
	viewAccount,
} = await import('$/sources/NearRpc/JsonRpc/queries.ts')

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

	await expect(getReceipt({
		receiptId: 'receipt-1',
	})).rejects.toThrow('invalid receipt response envelope')
	await expect(getTxStatus({
		txHash: 'hash',
		senderAccountId: 'signer.near',
	})).rejects.toThrow('invalid tx status response envelope')
})

it('accepts EXPERIMENTAL_tx_status receipts and receipt predecessor/receiver wires', async () => {
	jsonRpc2
		.mockResolvedValueOnce({
			predecessor_id: 'signer.near',
			receiver_id: 'receiver.near',
			receipt_id: 'receipt-1',
			receipt: {
				Action: {},
			},
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
				},
			}],
			status: {
				SuccessValue: '',
			},
			receipts: [{
				predecessor_id: 'signer.near',
				receiver_id: 'receiver.near',
				receipt_id: 'receipt-1',
				receipt: {
					Action: {},
				},
			}],
		})
		.mockResolvedValueOnce({
			amount: '10',
			code_hash: '11111111111111111111111111111111',
			storage_usage: 100,
		})

	await expect(getReceipt({
		receiptId: 'receipt-1',
	})).resolves.toMatchObject({
		receipt_id: 'receipt-1',
		predecessor_id: 'signer.near',
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

import { beforeEach, describe, expect, it, vi } from 'vitest'

const sourceFetch = vi.hoisted(() => vi.fn())

vi.mock('$/sources/_runtime/http.ts', () => ({
	firstHttpUrlForBinding: () => 'https://fullnode.test/v1/',
	sourceFetch,
}))

const {
	getAccount,
	getBlockByHeight,
	getLedgerInfo,
	getTransactionByVersion,
} = await import('$/sources/AptosFullnode/Rest/queries.ts')

const metadataHeaders = {
	'x-aptos-chain-id': '1',
	'x-aptos-ledger-version': '42',
	'x-aptos-ledger-oldest-version': '1',
	'x-aptos-ledger-timestampusec': '1720000000123456',
	'x-aptos-epoch': '7',
	'x-aptos-block-height': '9',
	'x-aptos-oldest-block-height': '1',
}

const jsonResponse = (
	body: unknown,
	headers: Record<string, string> = metadataHeaders
) => (
	new Response(JSON.stringify(body), {
		status: 200,
		headers,
	})
)

beforeEach(() => {
	sourceFetch.mockReset()
})

describe('AptosFullnode Rest arktype envelopes', () => {
	it('accepts ledger / account / block / transaction envelopes', async () => {
		sourceFetch
			.mockResolvedValueOnce(jsonResponse({
				chain_id: 1,
				epoch: '7',
				ledger_version: '42',
				oldest_ledger_version: '1',
				ledger_timestamp: '1720000000123456',
				node_role: 'full_node',
				oldest_block_height: '1',
				block_height: '9',
			}))
			.mockResolvedValueOnce(jsonResponse({
				sequence_number: '8',
				authentication_key: '0xauth',
			}))
			.mockResolvedValueOnce(jsonResponse({
				block_height: '9',
				block_hash: '0xblock',
				block_timestamp: '1720000000123456',
				first_version: '40',
				last_version: '42',
				transactions: [],
			}))
			.mockResolvedValueOnce(jsonResponse({
				type: 'user_transaction',
				version: '42',
				hash: '0x42',
				changes: [],
				events: [],
				sender: '0xa11ce',
				timestamp: '1720000000123456',
				gas_used: '21',
				success: true,
				vm_status: 'Executed successfully',
			}))

		await expect(getLedgerInfo()).resolves.toMatchObject({
			body: {
				chain_id: 1,
				ledger_version: '42',
			},
		})
		await expect(getAccount('0xa11ce')).resolves.toMatchObject({
			body: {
				sequence_number: '8',
			},
		})
		await expect(getBlockByHeight(9n)).resolves.toMatchObject({
			body: {
				block_hash: '0xblock',
			},
		})
		await expect(getTransactionByVersion(42n)).resolves.toMatchObject({
			body: {
				hash: '0x42',
				version: '42',
			},
		})
	})

	it('fail-closes malformed ledger / account / block / transaction envelopes', async () => {
		sourceFetch
			.mockResolvedValueOnce(jsonResponse({
				chain_id: 1,
				epoch: 'not-a-u64',
			}))
			.mockResolvedValueOnce(jsonResponse({
				sequence_number: '8',
			}))
			.mockResolvedValueOnce(jsonResponse({
				block_height: '9',
				block_hash: '0xblock',
			}))
			.mockResolvedValueOnce(jsonResponse({
				type: 'user_transaction',
			}))

		await expect(getLedgerInfo()).rejects.toThrow('invalid ledger info response envelope')
		await expect(getAccount('0xa11ce')).rejects.toThrow('invalid account response envelope')
		await expect(getBlockByHeight(9n)).rejects.toThrow('invalid block response envelope')
		await expect(getTransactionByVersion(42n)).rejects.toThrow('invalid transaction response envelope')
	})
})

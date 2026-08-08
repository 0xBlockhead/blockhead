import { beforeEach, describe, expect, it, vi } from 'vitest'
import bindings from '$/sources/AptosFullnode/bindings.ts'
import { Source } from '$/sources/Source.ts'

const sourceFetch = vi.hoisted(() => vi.fn())
const firstHttpUrlForBinding = vi.hoisted(() => vi.fn())

vi.mock('$/sources/_runtime/http.ts', () => ({
	firstHttpUrlForBinding,
	sourceFetch,
}))

const {
	getAccount,
	getAccountModule,
	getAccountModules,
	getBlockByHeight,
	getLedgerInfo,
	getTableItem,
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

const binding = bindings[Source.AptosFullnode_Rest][0]

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
	firstHttpUrlForBinding.mockReset().mockReturnValue('https://fullnode.test/v1/')
})

describe('AptosFullnode Rest arktype envelopes', () => {
	it('passes a modified noncanonical binding through endpoint selection and transport', async () => {
		const modifiedBinding = {
			...binding,
			endpoints: binding.endpoints.map((endpoint) => ({
				...endpoint,
				locator: 'https://modified-fullnode.test/v1/',
			})),
		}
		firstHttpUrlForBinding.mockReturnValue('https://modified-fullnode.test/v1/')
		sourceFetch.mockResolvedValue(jsonResponse({
			chain_id: 1,
			epoch: '7',
			ledger_version: '42',
			oldest_ledger_version: '1',
			ledger_timestamp: '1720000000123456',
			node_role: 'full_node',
			oldest_block_height: '1',
			block_height: '9',
		}))

		await getLedgerInfo(modifiedBinding)

		expect(firstHttpUrlForBinding).toHaveBeenCalledOnce()
		expect(firstHttpUrlForBinding).toHaveBeenCalledWith(modifiedBinding)
		expect(sourceFetch).toHaveBeenCalledOnce()
		expect(sourceFetch).toHaveBeenCalledWith(
			modifiedBinding,
			'https://modified-fullnode.test/v1/',
			undefined
		)
	})

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

		await expect(getLedgerInfo(binding)).resolves.toMatchObject({
			body: {
				chain_id: 1,
				ledger_version: '42',
			},
		})
		await expect(getAccount(binding, '0xa11ce')).resolves.toMatchObject({
			body: {
				sequence_number: '8',
			},
		})
		await expect(getBlockByHeight(binding, 9n)).resolves.toMatchObject({
			body: {
				block_hash: '0xblock',
			},
		})
		await expect(getTransactionByVersion(binding, 42n)).resolves.toMatchObject({
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

		await expect(getLedgerInfo(binding)).rejects.toThrow('invalid ledger info response envelope')
		await expect(getAccount(binding, '0xa11ce')).rejects.toThrow('invalid account response envelope')
		await expect(getBlockByHeight(binding, 9n)).rejects.toThrow('invalid block response envelope')
		await expect(getTransactionByVersion(binding, 42n)).rejects.toThrow('invalid transaction response envelope')
	})

	it('accepts Move-module bytecode and table-item value envelopes', async () => {
		const moduleBody = {
			bytecode: '0xabcdef',
			abi: {
				address: '0xa11ce',
				name: 'payments',
				friends: [],
				exposed_functions: [],
				structs: [],
			},
		}
		sourceFetch
			.mockResolvedValueOnce(jsonResponse([moduleBody]))
			.mockResolvedValueOnce(jsonResponse(moduleBody))
			.mockResolvedValueOnce(jsonResponse('7'))
			.mockResolvedValueOnce(jsonResponse({
				coin: {
					value: '1',
				},
			}))

		await expect(getAccountModules(binding, '0xa11ce')).resolves.toMatchObject({
			body: [moduleBody],
		})
		await expect(getAccountModule(binding, '0xa11ce', 'payments')).resolves.toMatchObject({
			body: moduleBody,
		})
		await expect(getTableItem(binding, '0xhandle', {
			key_type: 'address',
			value_type: 'u64',
			key: '0xa11ce',
		})).resolves.toMatchObject({
			body: '7',
		})
		await expect(getTableItem(binding, '0xhandle', {
			key_type: '0x1::string::String',
			value_type: '0x1::coin::CoinStore<0x1::aptos_coin::AptosCoin>',
			key: 'alice',
		})).resolves.toMatchObject({
			body: {
				coin: {
					value: '1',
				},
			},
		})
	})

	it('fail-closes malformed Move-module / table-item envelopes', async () => {
		sourceFetch
			.mockResolvedValueOnce(jsonResponse([{
				bytecode: 'not-hex',
			}]))
			.mockResolvedValueOnce(jsonResponse({
				bytecode: '0xab',
				abi: {
					address: '0xa11ce',
					name: 'payments',
				},
			}))

		await expect(getAccountModules(binding, '0xa11ce')).rejects.toThrow('invalid account module response envelope')
		await expect(getAccountModule(binding, '0xa11ce', 'payments')).rejects.toThrow('invalid account module response envelope')
		await expect(getTableItem(
			binding,
			'0xhandle',
			JSON.parse('{"key_type":"address","value_type":"u64"}')
		)).rejects.toThrow('invalid table item request response envelope')
	})
})

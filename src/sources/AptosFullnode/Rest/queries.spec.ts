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
	getAccountResources,
	getBlockByHeight,
	getBlockByVersion,
	getLedgerInfo,
	getTableItem,
	getTransactionByHash,
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
	it.each([undefined, '42'])('rejects a pending transaction from the version endpoint (version=%s)', async (version) => {
		sourceFetch.mockResolvedValueOnce(jsonResponse({
			type: 'pending_transaction',
			hash: '0x42',
			version,
		}))
		await expect(getTransactionByVersion(binding, 42n))
			.rejects.toThrow('transaction version response does not match request')
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
	it.each(['transaction', 'height', 'version'])('validates nested event JSON through %s responses', async (endpoint) => {
		const transaction = {
			type: 'user_transaction',
			version: '42',
			hash: '0x42',
			changes: [],
			events: [{
				guid: {
					creation_number: '0',
					account_address: '0xa11ce',
				},
				sequence_number: '0',
				type: '0x1::event::Value',
				data: { values: [null, true, 2, 'value'] },
			}],
		}
		const body = endpoint === 'transaction' ? transaction : {
			block_height: '9',
			block_hash: '0xblock',
			block_timestamp: '1720000000123456',
			first_version: '42',
			last_version: '42',
			transactions: [transaction],
		}
		const load = () => endpoint === 'transaction' ? getTransactionByVersion(binding, 42n) :
			endpoint === 'height' ? getBlockByHeight(binding, 9n) : getBlockByVersion(binding, 42n)
		sourceFetch.mockResolvedValueOnce(jsonResponse(body))
		await expect(load()).resolves.toMatchObject({ body })
		sourceFetch.mockResolvedValueOnce(new Response(JSON.stringify(body, (key, value) => key === 'data' ? undefined : value), {
			status: 200,
			headers: metadataHeaders,
		}))
		await expect(load()).rejects.toThrow('invalid transaction event response envelope')
	})


	it('fail-closes malformed committed transaction effects before resolver materialization', async () => {
		sourceFetch
			.mockResolvedValueOnce(jsonResponse({
				type: 'user_transaction',
				version: '42',
				hash: '0x42',
				changes: [{
					type: 'write_resource',
					address: '0xa11ce',
					state_key_hash: '0xstate',
					data: {
						type: '0x1::coin::CoinStore',
						// missing resource data
					},
				}],
				events: [],
			}))
			.mockResolvedValueOnce(jsonResponse({
				type: 'user_transaction',
				version: '42',
				hash: '0x42',
				changes: [],
				events: [{
					guid: {
						creation_number: '0',
						account_address: '0xa11ce',
					},
					sequence_number: 'not-a-u64',
					type: '0x1::event::Malformed',
					data: {},
				}],
			}))

		await expect(getTransactionByVersion(binding, 42n)).rejects.toThrow('invalid transaction state change response envelope')
		await expect(getTransactionByVersion(binding, 42n)).rejects.toThrow('invalid transaction event response envelope')
	})

	it('rejects substituted block and transaction coordinates', async () => {
		sourceFetch
			.mockResolvedValueOnce(jsonResponse({
				block_height: '10',
				block_hash: '0xblock',
				block_timestamp: '1',
				first_version: '40',
				last_version: '42',
			}))
			.mockResolvedValueOnce(jsonResponse({
				block_height: '9',
				block_hash: '0xblock',
				block_timestamp: '1',
				first_version: '40',
				last_version: '42',
			}))
			.mockResolvedValueOnce(jsonResponse({
				type: 'user_transaction',
				hash: '0x43',
				version: '42',
			}))
			.mockResolvedValueOnce(jsonResponse({
				type: 'user_transaction',
				hash: '0x42',
				version: '43',
			}))

		await expect(getBlockByHeight(binding, 9n)).rejects.toThrow('block height response does not match request')
		await expect(getBlockByVersion(binding, 43n)).rejects.toThrow('block version response does not contain request')
		await expect(getTransactionByHash(binding, '0x42')).rejects.toThrow('transaction hash response does not match request')
		await expect(getTransactionByVersion(binding, 42n)).rejects.toThrow('transaction version response does not match request')
	})

	it('rejects negative historical coordinates and duplicate resource identities', async () => {
		for (const query of [
			() => getAccount(binding, '0xa11ce', -1n),
			() => getAccountResources(binding, '0xa11ce', -1n),
			() => getAccountModules(binding, '0xa11ce', -1n),
			() => getAccountModule(binding, '0xa11ce', 'coin', -1n),
			() => getTableItem(binding, '0xhandle', {
				key_type: 'address',
				value_type: 'u64',
				key: '0xa11ce',
			}, -1n),
		])
			await expect(query()).rejects.toThrow('ledger version must not be negative')
		expect(sourceFetch).not.toHaveBeenCalled()

		sourceFetch.mockResolvedValueOnce(jsonResponse([
			{
				type: '0x1::coin::CoinStore<0x1::aptos_coin::AptosCoin>',
				data: {},
			},
			{
				type: '0x1::coin::CoinStore<0x1::aptos_coin::AptosCoin>',
				data: {},
			},
		]))
		await expect(getAccountResources(binding, '0xa11ce')).rejects.toThrow('duplicate account resource type')
	})

	it('preserves opaque account resource cursors and rejects cursor cycles', async () => {
		sourceFetch
			.mockResolvedValueOnce(jsonResponse(
				[{
					type: '0x1::resource::Value',
					data: {},
				}],
				{
					...metadataHeaders,
					'x-aptos-cursor': 'opaque+/=',
				}
			))
			.mockResolvedValueOnce(jsonResponse(
				[],
				{
					...metadataHeaders,
					'x-aptos-cursor': 'opaque+/=',
				}
			))

		await expect(getAccountResources(
			binding,
			'0xa11ce',
			42n,
			'prior+/=',
			1
		)).resolves.toMatchObject({
			metadata: {
				cursor: 'opaque+/=',
			},
		})
		expect(sourceFetch.mock.calls[0][1]).toBe(
			'https://fullnode.test/v1/accounts/0xa11ce/resources?ledger_version=42&start=prior%2B%2F%3D&limit=1'
		)
		await expect(getAccountResources(
			binding,
			'0xa11ce',
			undefined,
			'opaque+/=',
			1
		)).rejects.toThrow('resource cursor did not advance')
	})

	it('accepts Move-module bytecode and table-item value envelopes', async () => {
		const moduleBody = {
			bytecode: '0xabcdef',
			abi: {
				address: '0xa11ce',
				name: 'payments',
				friends: [],
				exposed_functions: [{
					name: 'transfer',
					visibility: 'public',
					is_entry: true,
					is_view: false,
					generic_type_params: [],
					params: [
						'signer',
					],
					return: [],
				}],
				structs: [{
					name: 'CoinStore',
					is_native: false,
					is_event: false,
					is_enum: true,
					variants: [{
						name: 'Some',
						fields: [],
					}],
					abilities: [
						'key',
					],
					generic_type_params: [{
						constraints: [],
					}],
					fields: [{
						name: 'coin',
						type: 'u64',
	it('fail-closes malformed Move enum variants', async () => {
		sourceFetch.mockResolvedValueOnce(jsonResponse({
			bytecode: '0xab',
			abi: {
				address: '0xa11ce',
				name: 'payments',
				friends: [],
				exposed_functions: [],
				structs: [{
					name: 'CoinStore',
					is_native: false,
					is_event: false,
					is_enum: true,
					abilities: [],
					generic_type_params: [],
					fields: [],
					variants: [{ name: 'Some', fields: 3 }],
				}],
			},
		}))
		await expect(getAccountModule(binding, '0xa11ce', 'payments')).rejects.toThrow('invalid account module response envelope')
	})

					}],
				}],
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

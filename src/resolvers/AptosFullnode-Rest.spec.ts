import { beforeEach, describe, expect, it, vi } from 'vitest'

import { EntityMetaKey, entityFieldAddressKey } from '$/schema/$schema.ts'
import { EntityType } from '$/schema/EntityType.ts'
import { Source } from '$/sources/Source.ts'
import bindings from '$/sources/AptosFullnode/bindings.ts'
import {
	ApiFamily,
	SourceDelivery,
	SourceEndpointKind,
	SourceOperationGroup,
	SourceTargetKind,
	WireProtocol,
} from '$/sources/SourceBinding.ts'

const sourceFetch = vi.fn()

vi.mock('$/sources/_runtime/http.ts', () => ({
	firstHttpUrlForBinding: () => 'https://fullnode.test/v1/',
	sourceFetch,
}))

const queries = await import('$/sources/AptosFullnode/Rest/queries.ts')
const { default: aptosFullnodeResolvers } = await import('$/resolvers/AptosFullnode-Rest.ts')

const resolverFor = (entityType: EntityType) => {
	const resolver = aptosFullnodeResolvers.resolvers.find((candidate) => candidate.entityType === entityType)
	if (resolver == null)
		throw new Error(`AptosFullnode-Rest spec missing ${entityType} resolver`)

	return resolver
}

const aptosFullnodeBinding = bindings[Source.AptosFullnode_Rest][0]

const canonicalNetwork = {
	caip2: {
		namespace: 'aptos',
		reference: '1',
	},
} as const

const aptosNetwork = {
	$network: canonicalNetwork,
}

const aptosAccount = {
	$network: aptosNetwork,
	address: '0xa11ce',
}

const aptosTransaction = {
	$network: aptosNetwork,
	version: 42n,
}

const ledgerInfo = {
	chain_id: 1,
	epoch: '7',
	ledger_version: '42',
	oldest_ledger_version: '1',
	ledger_timestamp: '1720000000123456',
	node_role: 'full_node',
	oldest_block_height: '1',
	block_height: '9',
}

const metadata = {
	chainId: '1',
	ledgerVersion: '42',
	oldestLedgerVersion: '1',
	ledgerTimestampUsec: '1720000000123456',
	epoch: '7',
	blockHeight: '9',
	oldestBlockHeight: '1',
}

const response = <_Body>(body: _Body) => ({
	body,
	metadata,
})

const transaction = {
	type: 'user_transaction',
	version: '42',
	hash: '0x42',
	state_change_hash: '0xstatechange',
	event_root_hash: '0xeventroot',
	sender: '0xa11ce',
	sequence_number: '8',
	max_gas_amount: '1000',
	expiration_timestamp_secs: '1720001000',
	payload: {
		type: 'module_bundle_payload',
	},
	timestamp: '1720000000123456',
	gas_unit_price: '100',
	gas_used: '21',
	success: true,
	vm_status: 'Executed successfully',
	accumulator_root_hash: '0xacc',
	events: [{
		guid: {
			creation_number: '3',
			account_address: '0xa11ce',
		},
		sequence_number: '4',
		type: '0x1::coin::DepositEvent',
		data: {
			amount: '5',
		},
	}],
	changes: [{
		type: 'write_resource',
		state_key_hash: '0xstate',
		address: '0xa11ce',
		data: {
			type: '0x1::coin::CoinStore<0x1::aptos_coin::AptosCoin>',
			data: {
				coin: {
					value: '5',
				},
			},
		},
	}, {
		type: 'delete_resource',
		state_key_hash: '0xdeleted-resource-state',
		address: '0xa11ce',
		resource: '0x1::resource::Deleted',
	}, {
		type: 'write_module',
		state_key_hash: '0xmodule-state',
		address: '0xa11ce',
		data: {
			bytecode: '0xmodule',
			abi: {
				address: '0xa11ce',
				name: 'payments',
				friends: [],
				exposed_functions: [],
				structs: [],
			},
		},
	}, {
		type: 'delete_module',
		state_key_hash: '0xdeleted-module-state',
		address: '0xa11ce',
		module: '0xa11ce::legacy',
	}, {
		type: 'write_table_item',
		state_key_hash: '0xtable-state',
		handle: '0xhandle',
		key: '0xkey',
		value: '0xvalue',
		data: {
			key: 'alice',
			key_type: 'address',
			value: '7',
			value_type: 'u64',
		},
	}, {
		type: 'delete_table_item',
		state_key_hash: '0xdeleted-table-state',
		handle: '0xhandle',
		key: '0xkey',
		data: {
			key: 'alice',
			key_type: 'address',
		},
	}],
}

const block = {
	block_height: '9',
	block_hash: '0xblock',
	block_timestamp: '1720000000123456',
	first_version: '40',
	last_version: '44',
	transactions: [transaction],
}

const resolverContext = {
	filters: [],
	sorts: [],
	pagination: {},
	selectorKeys: [],
	parentSelectorKeys: [],
	sources: [],
	publicEnv: {},
}

const aptosResponseHeaders = {
	'x-aptos-chain-id': metadata.chainId,
	'x-aptos-ledger-version': metadata.ledgerVersion,
	'x-aptos-ledger-oldest-version': metadata.oldestLedgerVersion,
	'x-aptos-ledger-timestampusec': metadata.ledgerTimestampUsec,
	'x-aptos-epoch': metadata.epoch,
	'x-aptos-block-height': metadata.blockHeight,
	'x-aptos-oldest-block-height': metadata.oldestBlockHeight,
}

const jsonAptosResponse = (body: unknown) => (
	new Response(JSON.stringify(body), {
		status: 200,
		headers: aptosResponseHeaders,
	})
)

describe('Aptos Fullnode typed operations', () => {
	beforeEach(() => {
		vi.restoreAllMocks()
		sourceFetch.mockReset()
	})

	it('addresses every core REST operation without a generic query surface', async () => {
		sourceFetch
			.mockResolvedValueOnce(jsonAptosResponse(ledgerInfo))
			.mockResolvedValueOnce(jsonAptosResponse({
				sequence_number: '8',
				authentication_key: '0xauth',
			}))
			.mockResolvedValueOnce(jsonAptosResponse([]))
			.mockResolvedValueOnce(jsonAptosResponse([]))
			.mockResolvedValueOnce(jsonAptosResponse({
				block_height: '9',
				block_hash: '0xblock',
				block_timestamp: '1720000000123456',
				first_version: '40',
				last_version: '42',
			}))
			.mockResolvedValueOnce(jsonAptosResponse({
				block_height: '9',
				block_hash: '0xblock',
				block_timestamp: '1720000000123456',
				first_version: '40',
				last_version: '42',
			}))
			.mockResolvedValueOnce(jsonAptosResponse([]))
			.mockResolvedValueOnce(jsonAptosResponse({
				value: '1',
			}))
			.mockResolvedValueOnce(jsonAptosResponse(transaction))
			.mockResolvedValueOnce(jsonAptosResponse(transaction))

		const ledgerResponse = await queries.getLedgerInfo()
		await queries.getAccount('0xa/b', 42n)
		await queries.getAccountResources('0xa/b', 42n)
		await queries.getAccountModules('0xa/b', 42n)
		await queries.getBlockByHeight(9n)
		await queries.getBlockByVersion(42n, false)
		await queries.getEventsByEventHandle('0xa/b', '0x1::event::Handle', 'events', 2n, 10)
		await queries.getTableItem('0xtable/handle', {
			key_type: 'address',
			value_type: 'u64',
			key: '0xa11ce',
		}, 42n)
		await queries.getTransactionByHash('0xhash/value')
		await queries.getTransactionByVersion(42n)

		expect(Object.keys(bindings)).toEqual([Source.AptosFullnode_Rest])
		expect(aptosFullnodeBinding).toMatchObject({
			endpoints: [{
				endpointKind: SourceEndpointKind.HttpUrl,
				locator: 'https://fullnode.mainnet.aptoslabs.com/v1/',
			}],
			wireProtocol: WireProtocol.HttpRest,
			apiFamily: ApiFamily.OpenApiHttp,
			operationGroups: [SourceOperationGroup.GenericRead],
			delivery: SourceDelivery.HttpProxy,
			credentials: [],
		})
		expect(sourceFetch.mock.calls.map((call) => call[1])).toEqual([
			'https://fullnode.test/v1/',
			'https://fullnode.test/v1/accounts/0xa%2Fb?ledger_version=42',
			'https://fullnode.test/v1/accounts/0xa%2Fb/resources?ledger_version=42',
			'https://fullnode.test/v1/accounts/0xa%2Fb/modules?ledger_version=42',
			'https://fullnode.test/v1/blocks/by_height/9?with_transactions=true',
			'https://fullnode.test/v1/blocks/by_version/42?with_transactions=false',
			'https://fullnode.test/v1/accounts/0xa%2Fb/events/0x1%3A%3Aevent%3A%3AHandle/events?start=2&limit=10',
			'https://fullnode.test/v1/tables/0xtable%2Fhandle/item?ledger_version=42',
			'https://fullnode.test/v1/transactions/by_hash/0xhash%2Fvalue',
			'https://fullnode.test/v1/transactions/by_version/42',
		])
		expect(ledgerResponse).toEqual({
			body: ledgerInfo,
			metadata,
		})
		expect(sourceFetch.mock.calls[7][2]).toEqual({
			method: 'POST',
			headers: {
				'content-type': 'application/json',
			},
			body: JSON.stringify({
				key_type: 'address',
				value_type: 'u64',
				key: '0xa11ce',
			}),
		})
	})
})

describe('Aptos Fullnode resolver materialization', () => {
	beforeEach(() => {
		vi.restoreAllMocks()
	})

	it('keys network observations by the source ledger version and maps only source time', async () => {
		const getLedgerInfo = vi.spyOn(queries, 'getLedgerInfo').mockResolvedValue(response(ledgerInfo))
		const networkResolver = resolverFor(EntityType.AptosNetwork)
		const observations = await networkResolver.resolve['Network'].resolve(aptosNetwork, resolverContext)
		expect(getLedgerInfo).toHaveBeenCalledOnce()
		expect(observations).toEqual([{
			[EntityMetaKey.Selector]: {
				$network: aptosNetwork,
				ledgerVersion: 42n,
				source: Source.AptosFullnode_Rest,
			},
		}])

		const observationResolver = resolverFor(EntityType.AptosNetwork_Timestamp)
		await expect(observationResolver.resolve['NetworkLedgerVersionSource'].resolve(
			observations[0][EntityMetaKey.Selector],
			resolverContext
		)).resolves.toMatchObject({
			ledgerVersion: 42n,
			timestampMs: 1_720_000_000_123,
			blockHeight: 9n,
			chainId: 1,
			epoch: 7n,
		})
	})

	it('materializes account observations and resources with exact parents', async () => {
		vi.spyOn(queries, 'getLedgerInfo').mockResolvedValue(response(ledgerInfo))
		vi.spyOn(queries, 'getAccount').mockImplementation(async (_address, ledgerVersion) => ({
			body: {
				sequence_number: '8',
				authentication_key: '0xauth',
			},
			metadata: {
				...metadata,
				...(ledgerVersion != null && {
					ledgerVersion: '43',
					ledgerTimestampUsec: '1720000001123456',
					epoch: '8',
					blockHeight: '10',
				}),
			},
		}))
		vi.spyOn(queries, 'getAccountResources').mockResolvedValue(response([{
			type: '0x1::coin::CoinStore<0x1::aptos_coin::AptosCoin>',
			data: {
				coin: {
					value: '5',
				},
			},
		}]))
		const getBlockByVersion = vi.spyOn(queries, 'getBlockByVersion').mockResolvedValue(response(block))
		const accountResolvers = aptosFullnodeResolvers.resolvers.filter((candidate) => candidate.entityType === EntityType.AptosAccount)
		expect(accountResolvers).toHaveLength(2)
		const accountSnapshots = await Promise.all(accountResolvers.map((resolver) => resolver.resolve['NetworkAddress'].resolve(aptosAccount, resolverContext)))
		expect(accountSnapshots).toContainEqual([{
			[EntityMetaKey.Selector]: {
				$account: aptosAccount,
				ledgerVersion: 42n,
				source: Source.AptosFullnode_Rest,
			},
			[EntityMetaKey.Fields]: {
				[entityFieldAddressKey(EntityType.AptosAccount_Timestamp, [], 'authenticationKey')]: '0xauth',
				[entityFieldAddressKey(EntityType.AptosAccount_Timestamp, [], 'blockHeight')]: 9n,
				[entityFieldAddressKey(EntityType.AptosAccount_Timestamp, [], 'epoch')]: 7n,
				[entityFieldAddressKey(EntityType.AptosAccount_Timestamp, [], 'sequenceNumber')]: 8n,
				[entityFieldAddressKey(EntityType.AptosAccount_Timestamp, [], 'timestampMs')]: 1_720_000_000_123,
			},
		}])
		expect(accountSnapshots).toContainEqual([{
			[EntityMetaKey.Selector]: {
				$account: aptosAccount,
				resourceType: '0x1::coin::CoinStore<0x1::aptos_coin::AptosCoin>',
			},
		}])
		await expect(resolverFor(EntityType.AptosAccount_Timestamp).resolve[
			'AccountLedgerVersionSource'
		].resolve({
			$account: aptosAccount,
			ledgerVersion: 42n,
			source: Source.AptosFullnode_Rest,
		}, resolverContext)).resolves.toEqual({
			sequenceNumber: 8n,
			authenticationKey: '0xauth',
			timestampMs: 1_720_000_000_123,
			blockHeight: 9n,
		})
		expect(getBlockByVersion).toHaveBeenCalledWith(42n, false)
	})

	it('accepts canonical Aptos identities and rejects unsupported networks before transport', async () => {
		const resolveAccount = resolverFor(EntityType.AptosAccount).resolve[
			'NetworkAddress'
		]
		expect(aptosFullnodeResolvers.resolvers
			.flatMap((resolver) => Object.values(resolver.resolve))
			.every((operation) => operation.appliesTo != null)).toBe(true)
		expect(resolveAccount.appliesTo).toEqual([
			{
				$network: {
					$network: canonicalNetwork,
				},
			},
			{
				$network: {
					$network: {
						slug: 'aptos',
					},
				},
			},
		])

		const getAccount = vi.spyOn(queries, 'getAccount').mockResolvedValue(response({
			authentication_key: '0xauth',
			sequence_number: '8',
		}))
		for (const network of [
			canonicalNetwork,
			{ slug: 'aptos' } as const,
		])
			await expect(resolveAccount.resolve({
				...aptosAccount,
				$network: {
					$network: network,
				},
			}, resolverContext)).resolves.toHaveLength(1)
		expect(getAccount).toHaveBeenCalledTimes(2)

		await expect(resolveAccount.resolve({
			...aptosAccount,
			$network: {
				$network: {
					caip2: {
						namespace: 'aptos',
						reference: '2',
					},
				},
			},
		}, resolverContext)).rejects.toThrow('unsupported network')
		expect(getAccount).toHaveBeenCalledTimes(2)
	})

	it('converges block and transaction selector paths and materializes event and change children', async () => {
		vi.spyOn(queries, 'getBlockByHeight').mockResolvedValue(response(block))
		vi.spyOn(queries, 'getBlockByVersion').mockResolvedValue(response(block))
		const getTransactionByHash = vi.spyOn(queries, 'getTransactionByHash').mockResolvedValue(response(transaction))
		const getTransactionByVersion = vi.spyOn(queries, 'getTransactionByVersion').mockResolvedValue(response(transaction))

		const blockResolver = resolverFor(EntityType.AptosBlock)
		const heightBlock = await blockResolver.resolve['NetworkHeight'].resolve({
			$network: aptosNetwork,
			height: 9n,
		}, resolverContext)
		const versionBlock = await blockResolver.resolve['NetworkVersion'].resolve({
			$network: aptosNetwork,
			version: 42n,
		}, resolverContext)
		expect(heightBlock).toEqual({
			height: 9n,
			firstVersion: 40n,
			lastVersion: 44n,
			timestampMs: 1_720_000_000_123,
			transactions: [{
				[EntityMetaKey.Selector]: aptosTransaction,
			}],
		})
		expect(versionBlock).toEqual(heightBlock)

		const transactionResolver = resolverFor(EntityType.AptosTransaction)
		const byVersion = await transactionResolver.resolve['NetworkVersion'].resolve(aptosTransaction, resolverContext)
		const byHash = await transactionResolver.resolve['NetworkHash'].resolve({
			$network: aptosNetwork,
			hash: '0x42',
		}, resolverContext)
		expect(byVersion).toEqual(byHash)
		expect(getTransactionByVersion).toHaveBeenCalledWith(42n)
		expect(getTransactionByHash).toHaveBeenCalledWith('0x42')
		expect(byVersion.stateChanges[0][EntityMetaKey.Selector]).toEqual({
			$transaction: aptosTransaction,
			changeIndex: 0,
		})
		expect(byVersion.events[0][EntityMetaKey.Selector]).toEqual({
			$network: aptosNetwork,
			transactionVersion: 42n,
			eventIndex: 0,
		})

		await expect(resolverFor(EntityType.AptosEvent).resolve[
			'NetworkTransactionVersionEventIndex'
		].resolve({
			$network: aptosNetwork,
			transactionVersion: 42n,
			eventIndex: 0,
		}, resolverContext)).resolves.toMatchObject({
			eventType: '0x1::coin::DepositEvent',
			creationNumber: 3n,
			sequenceNumber: 4n,
		})

		await expect(resolverFor(EntityType.AptosStateChange).resolve[
			'TransactionChangeIndex'
		].resolve({
			$transaction: aptosTransaction,
			changeIndex: 0,
		}, resolverContext)).resolves.toMatchObject({
			changeKind: 'write_resource',
			address: '0xa11ce',
			resourceType: '0x1::coin::CoinStore<0x1::aptos_coin::AptosCoin>',
		})
		await expect(Promise.all([1, 2, 3, 4, 5].map((changeIndex) => resolverFor(EntityType.AptosStateChange).resolve[
			'TransactionChangeIndex'
		].resolve({
			$transaction: aptosTransaction,
			changeIndex,
		}, resolverContext)))).resolves.toMatchObject([
			{
				changeKind: 'delete_resource',
				resourceType: '0x1::resource::Deleted',
			},
			{
				changeKind: 'write_module',
				moduleAddress: '0xa11ce',
				moduleName: 'payments',
			},
			{
				changeKind: 'delete_module',
				moduleAddress: '0xa11ce',
				moduleName: 'legacy',
			},
			{
				changeKind: 'write_table_item',
				stateKeyHash: '0xtable-state',
			},
			{
				changeKind: 'delete_table_item',
				stateKeyHash: '0xdeleted-table-state',
			},
		])
	})

	it('rejects transaction responses that mismatch either exact selector arm', async () => {
		const transactionResolver = resolverFor(EntityType.AptosTransaction)
		vi.spyOn(queries, 'getTransactionByVersion').mockResolvedValue(response({
			...transaction,
			version: '43',
		}))
		await expect(transactionResolver.resolve['NetworkVersion'].resolve(
			aptosTransaction,
			resolverContext
		)).rejects.toThrow('transaction version mismatch')

		vi.spyOn(queries, 'getTransactionByHash').mockResolvedValue(response({
			...transaction,
			hash: '0x43',
		}))
		await expect(transactionResolver.resolve['NetworkHash'].resolve({
			$network: aptosNetwork,
			hash: '0x42',
		}, resolverContext)).rejects.toThrow('transaction hash mismatch')
	})

	it('resolves resource and transaction observations without inventing clocks', async () => {
		vi.spyOn(queries, 'getAccountResources').mockResolvedValue(response([{
			type: '0x1::resource::Value',
			data: {
				value: '7',
			},
		}]))
		vi.spyOn(queries, 'getTransactionByVersion').mockResolvedValue(response(transaction))

		await expect(resolverFor(EntityType.AptosAccountResource_Timestamp).resolve[
			'ResourceLedgerVersionSource'
		].resolve({
			$resource: {
				$account: aptosAccount,
				resourceType: '0x1::resource::Value',
			},
			ledgerVersion: 42n,
			source: Source.AptosFullnode_Rest,
		}, resolverContext)).resolves.toEqual({
			value: '7',
		})

		const transactionObservation = await resolverFor(EntityType.AptosTransaction_Timestamp).resolve[
			'TransactionLedgerVersionSource'
		].resolve({
			$transaction: aptosTransaction,
			ledgerVersion: 42n,
			source: Source.AptosFullnode_Rest,
		}, resolverContext)
		expect(transactionObservation.timestampMs).toBe(1_720_000_000_123)
	})

	it('rejects malformed wire identities, mismatched clocks, and foreign provenance', async () => {
		vi.spyOn(queries, 'getLedgerInfo').mockResolvedValue({
			body: ledgerInfo,
			metadata: {
				...metadata,
				ledgerVersion: 'not-a-version',
			},
		})
		await expect(resolverFor(EntityType.AptosNetwork).resolve['Network'].resolve(
			aptosNetwork,
			resolverContext
		)).rejects.toThrow('malformed ledger version')

		vi.spyOn(queries, 'getLedgerInfo').mockResolvedValue(response(ledgerInfo))
		await expect(resolverFor(EntityType.AptosNetwork_Timestamp).resolve[
			'NetworkLedgerVersionSource'
		].resolve({
			$network: aptosNetwork,
			ledgerVersion: 41n,
			source: Source.AptosFullnode_Rest,
		}, resolverContext)).rejects.toThrow('ledger version mismatch')

		await expect(resolverFor(EntityType.AptosNetwork_Timestamp).resolve[
			'NetworkLedgerVersionSource'
		].resolve({
			$network: aptosNetwork,
			ledgerVersion: 42n,
			source: Source.Constants_Internal,
		}, resolverContext)).rejects.toThrow('observation source mismatch')
	})
})

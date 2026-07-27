import { beforeEach, describe, expect, it, vi } from 'vitest'

import { networkBySlug } from '$/constants/Network.ts'
import {
	entityFieldAddressKey,
	EntityMetaKey,
} from '$/schema/$schema.ts'
import { EntityType } from '$/schema/EntityType.ts'
import { Source } from '$/sources/Source.ts'
import bindings from '$/sources/KaspaExplorer/bindings.ts'
import {
	ApiFamily,
	SourceCredentialScope,
	SourceDelivery,
	SourceEndpointKind,
	SourceOperationGroup,
	SourceTargetKind,
	WireProtocol,
} from '$/sources/SourceBinding.ts'

const {
	getAddressBalance,
	getAddressTransactionCount,
	getAddressTransactionsPage,
	getAddressUtxoCount,
	getCompleteAddressUtxos,
} = vi.hoisted(() => ({
	getAddressBalance: vi.fn(),
	getAddressTransactionCount: vi.fn(),
	getAddressTransactionsPage: vi.fn(),
	getAddressUtxoCount: vi.fn(),
	getCompleteAddressUtxos: vi.fn(),
}))

vi.mock('$/sources/KaspaExplorer/Rest/queries.ts', () => ({
	getAddressBalance,
	getAddressTransactionCount,
	getAddressTransactionsPage,
	getAddressUtxoCount,
	getCompleteAddressUtxos,
}))

const { default: kaspaExplorerResolvers } = await import('$/resolvers/KaspaExplorer-Rest.ts')

const observationsResolver = kaspaExplorerResolvers.resolvers.find((resolver) => (
	'$$timestamps' in resolver.projections
))
const utxosResolver = kaspaExplorerResolvers.resolvers.find((resolver) => (
	'$$utxos' in resolver.projections
))
const transactionsResolver = kaspaExplorerResolvers.resolvers.find((resolver) => (
	'$$transactions' in resolver.projections
))

if (
	observationsResolver == null
	|| utxosResolver == null
	|| transactionsResolver == null
)
	throw new Error('KaspaExplorer-Rest spec missing address resolvers')

const binding = bindings[Source.KaspaExplorer_Rest]

const network = {
	$network: {
		slug: networkBySlug.kaspa.slug,
	},
}
const address = {
	$network: network,
	address: 'kaspa:qqkqkzjvr7zwxxmjxjkmxxdwju9kjs6e9u82uh59z07vgaks6gg62v8707g73',
}
const resolverContext = {
	filters: [],
	sorts: [],
	pagination: {
		limit: 2,
	},
	selectorKeys: [],
	parentSelectorKeys: [],
	sources: [],
	publicEnv: {},
}

describe('Kaspa Explorer address resolver', () => {
	beforeEach(() => {
		vi.clearAllMocks()
		vi.spyOn(Date, 'now').mockReturnValue(1_720_000_000_000)
	})

	it('declares canonical Kaspa selector applicability and source authority', () => {
		expect(binding).toEqual(expect.objectContaining({
			source: Source.KaspaExplorer_Rest,
			target: {
				kind: SourceTargetKind.Global,
				key: 'kaspa-explorer-api',
			},
			endpoints: [{
				endpointKind: SourceEndpointKind.HttpUrl,
				locator: 'https://{kaspa-explorer-api-host}',
				origin: 'https://{kaspa-explorer-api-host}',
				corsEnabled: false,
			}],
			wireProtocol: WireProtocol.HttpRest,
			apiFamily: ApiFamily.RestJson,
			operationGroups: [SourceOperationGroup.GenericRead],
			delivery: SourceDelivery.RemoteQuery,
			credentials: [{
				scope: SourceCredentialScope.None,
			}],
		}))
		expect(observationsResolver.resolve[
			'NetworkAddress'
		].appliesTo).toEqual([{
			$network: {
				$network: {
					slug: networkBySlug.kaspa.slug,
				},
			},
		}])
		expect(kaspaExplorerResolvers.source).toBe(Source.KaspaExplorer_Rest)
	})

	it('materializes one exact sompi/count observation with resolution-time provenance', async () => {
		getAddressBalance.mockResolvedValueOnce({
			address: address.address,
			balance: 9_000_000,
		})
		getAddressTransactionCount.mockResolvedValueOnce({
			total: 12,
		})
		getAddressUtxoCount.mockResolvedValueOnce({
			count: 2,
		})

		const observations = await observationsResolver.resolve[
			'NetworkAddress'
		].resolve(address, resolverContext)
		const projection = observationsResolver.projections.$$timestamps
		if (typeof projection !== 'function')
			throw new Error('KaspaExplorer-Rest spec missing timestamp projection')
		const [observation] = projection(observations, address, resolverContext)

		expect(getAddressBalance).toHaveBeenCalledWith(address.address)
		expect(observation[EntityMetaKey.Selector]).toEqual({
			$address: address,
			timestampMs: 1_720_000_000_000,
			source: Source.KaspaExplorer_Rest,
		})
		expect(observation[EntityMetaKey.Fields]).toEqual({
			[entityFieldAddressKey(EntityType.KaspaAddress_Timestamp, [], 'balanceSompi')]: 9_000_000n,
			[entityFieldAddressKey(EntityType.KaspaAddress_Timestamp, [], 'utxoCount')]: 2,
			[entityFieldAddressKey(EntityType.KaspaAddress_Timestamp, [], 'transactionCount')]: 12,
		})
	})

	it('preserves complete UTXO order, exact units, identity, and one snapshot clock', async () => {
		getCompleteAddressUtxos.mockResolvedValueOnce([
			{
				address: address.address,
				outpoint: {
					transactionId: 'a'.repeat(64),
					index: 1,
				},
				utxoEntry: {
					amount: '28700000000000000',
					scriptPublicKey: {
						scriptPublicKey: '20aa',
					},
					blockDaaScore: '12345678901234567',
					isCoinbase: false,
				},
			},
			{
				address: address.address,
				outpoint: {
					transactionId: 'b'.repeat(64),
					index: 0,
				},
				utxoEntry: {
					amount: '1',
					scriptPublicKey: {},
				},
			},
		])

		const utxos = await utxosResolver.resolve[
			'NetworkAddress'
		].resolve(address, resolverContext)
		const projection = utxosResolver.projections.$$utxos
		if (typeof projection !== 'function')
			throw new Error('KaspaExplorer-Rest spec missing UTXO projection')
		const projectedUtxos = projection(utxos, address, resolverContext)

		expect(projectedUtxos.map((utxo) => utxo[EntityMetaKey.Selector].outpointTransactionId)).toEqual([
			'a'.repeat(64),
			'b'.repeat(64),
		])
		expect(projectedUtxos[0][EntityMetaKey.Selector]).toMatchObject({
			$address: address,
			outpointIndex: 1,
			timestampMs: 1_720_000_000_000,
			source: Source.KaspaExplorer_Rest,
		})
		expect(projectedUtxos[0][EntityMetaKey.Fields]).toEqual({
			[entityFieldAddressKey(EntityType.KaspaAddressUtxo_Timestamp, [], 'amountSompi')]: 28_700_000_000_000_000n,
			[entityFieldAddressKey(EntityType.KaspaAddressUtxo_Timestamp, [], 'scriptPublicKey')]: '20aa',
			[entityFieldAddressKey(EntityType.KaspaAddressUtxo_Timestamp, [], 'blockDaaScore')]: 12_345_678_901_234_567n,
			[entityFieldAddressKey(EntityType.KaspaAddressUtxo_Timestamp, [], 'isCoinbase')]: false,
		})
	})

	it('materializes newest-first transaction identity and advances the bounded cursor', async () => {
		getAddressTransactionsPage.mockResolvedValueOnce([
			{
				transaction_id: 'a'.repeat(64),
				block_time: 1_720_000_000_000,
				mass: '12345678901234567',
				inputs: [],
				outputs: [],
			},
			{
				transaction_id: 'b'.repeat(64),
				block_time: 1_719_999_999_000,
				inputs: [],
				outputs: [],
			},
		])

		const page = await transactionsResolver.resolve[
			'NetworkAddress'
		].resolve(address, {
			...resolverContext,
			providerContinuationToken: '1720000001000',
		})
		const projection = transactionsResolver.projections.$$transactions
		if (
			typeof projection === 'function'
			|| projection.select == null
			|| projection.continuation == null
		)
			throw new Error('KaspaExplorer-Rest spec missing transaction pagination')
		const transactions = projection.select(page, address, resolverContext)

		expect(getAddressTransactionsPage).toHaveBeenCalledWith(
			{
				address: address.address,
				limit: 2,
				before: 1_720_000_001_000,
			}
		)
		expect(transactions.map((transaction) => transaction[EntityMetaKey.Selector])).toEqual([
			{
				$network: network,
				transactionId: 'a'.repeat(64),
			},
			{
				$network: network,
				transactionId: 'b'.repeat(64),
			},
		])
		expect(transactions[0][EntityMetaKey.Fields]).toEqual({
			[entityFieldAddressKey(EntityType.KaspaTransaction, [], 'mass')]: 12_345_678_901_234_567n,
		})
		expect(projection.continuation(page, address, resolverContext)).toEqual({
			operation: 'address-transactions',
			target: address.address,
			terminal: false,
			token: '1719999999000',
		})
	})

	it('fails before transport for foreign networks and refuses partial UTXO snapshots', async () => {
		await expect(observationsResolver.resolve[
			'NetworkAddress'
		].resolve({
			$network: {
				$network: {
					slug: 'not-kaspa',
				},
			},
			address: address.address,
		}, resolverContext)).rejects.toThrow('unsupported network')
		expect(getAddressBalance).not.toHaveBeenCalled()

		getCompleteAddressUtxos.mockResolvedValueOnce([
			{},
			{},
			{},
		])
		await expect(utxosResolver.resolve[
			'NetworkAddress'
		].resolve(address, resolverContext)).rejects.toThrow('exceeds the requested row limit')
	})
})

import { beforeEach, describe, expect, it, vi } from 'vitest'

import { networkBySlug } from '$/constants/Network.ts'
import { EntityMetaKey } from '$/schema/$schema.ts'
import { EntityType } from '$/schema/EntityType.ts'
import bindings from '$/sources/MempoolSpace/bindings.ts'
import { Source } from '$/sources/Source.ts'
import { SourceTargetKind } from '$/sources/SourceBinding.ts'

const sourceGetJson = vi.fn()

vi.mock('$/sources/_runtime/http.ts', async (importOriginal) => ({
	...await importOriginal<typeof import('$/sources/_runtime/http.ts')>(),
	sourceGetJson,
}))

const { default: mempoolSpaceResolvers } = await import('$/resolvers/MempoolSpace-Rest.ts')

const networkResolvers = mempoolSpaceResolvers.resolvers.filter((resolver) => (
	resolver.entityType === EntityType.Network
))
const blocksResolver = networkResolvers.find((resolver) => (
	'Utxo' in resolver.projections
	&& '$$blocks' in resolver.projections.Utxo
	&& typeof resolver.projections.Utxo.$$blocks === 'function'
))
const addressTransactionsResolver = mempoolSpaceResolvers.resolvers.find((resolver) => (
	resolver.entityType === EntityType.UtxoAddress
	&& '$$transactions' in resolver.projections
))
const transactionResolver = mempoolSpaceResolvers.resolvers.find((resolver) => (
	resolver.entityType === EntityType.UtxoTransaction
))
const inputResolver = mempoolSpaceResolvers.resolvers.find((resolver) => (
	resolver.entityType === EntityType.UtxoInput
))
const outputResolver = mempoolSpaceResolvers.resolvers.find((resolver) => (
	resolver.entityType === EntityType.UtxoOutput
))

if (blocksResolver == null)
	throw new Error('MempoolSpace-Rest spec missing Network.Utxo.$$blocks resolver')

if (addressTransactionsResolver == null)
	throw new Error('MempoolSpace-Rest spec missing UtxoAddress.$$transactions resolver')

if (transactionResolver == null)
	throw new Error('MempoolSpace-Rest spec missing UtxoTransaction same-response resolver')

if (inputResolver == null || outputResolver == null)
	throw new Error('MempoolSpace-Rest spec missing independently addressable child resolver')

const binding = bindings[Source.MempoolSpace_Rest][0]

const resolverContext = {
	filters: [],
	sorts: [],
	pagination: {
		limit: 1,
	},
	selectorKeys: [],
	parentSelectorKeys: [],
	sources: [],
	publicEnv: {},
}
const network = {
	caip2: networkBySlug.bitcoin.caip2,
}
const address = {
	$network: network,
	address: 'bc1qexample',
}
const transactions = [
	{
		txid: 'a'.repeat(64),
	},
	{
		txid: 'd'.repeat(64),
	},
]

describe('MempoolSpace UTXO', () => {
	beforeEach(() => {
		vi.clearAllMocks()
	})

	it('projects transaction fields and child selectors from one provider response', async () => {
		const txId = 'b'.repeat(64)
		sourceGetJson.mockResolvedValueOnce({
			txid: txId,
			version: 2,
			locktime: 0,
			size: 200,
			weight: 800,
			fee: 1_000,
			status: {
				confirmed: true,
				block_height: 840_000,
				block_hash: 'c'.repeat(64),
			},
			vin: [{
				txid: 'd'.repeat(64),
				vout: 1,
				is_coinbase: false,
				sequence: 1,
			}],
			vout: [{
				scriptpubkey: '0014',
				scriptpubkey_type: 'v0_p2wpkh',
				value: 5_000,
			}],
		})
		const entitySelector = {
			$network: network,
			txId,
		}
		const transaction = await transactionResolver.resolve[
			'NetworkTxId'
		].resolve(entitySelector)

		expect(transactionResolver.projections.version(transaction)).toBe(2)
		expect(transactionResolver.projections.$$inputs(transaction)).toEqual([{
			[EntityMetaKey.Selector]: {
				$transaction: entitySelector,
				indexInTransaction: 0,
			},
		}])
		expect(transactionResolver.projections.$$outputs(transaction)).toEqual([{
			[EntityMetaKey.Selector]: {
				$transaction: entitySelector,
				indexInTransaction: 0,
			},
		}])
		expect(sourceGetJson).toHaveBeenCalledOnce()
		expect(sourceGetJson).toHaveBeenCalledWith(
			binding,
			`https://mempool.space/api/tx/${txId}`
		)
		expect(mempoolSpaceResolvers.resolvers.filter((resolver) => (
			resolver.entityType === EntityType.UtxoTransaction
		))).toEqual([transactionResolver])
	})

	it('limits every selector to canonical Bitcoin subjects', () => {
		for (const resolver of mempoolSpaceResolvers.resolvers)
			for (const selectorEntry of Object.values(resolver.resolve))
				expect(selectorEntry.appliesTo?.length).toBeGreaterThan(0)

		for (const resolver of networkResolvers) {
			expect(resolver.resolve['Caip2'].appliesTo).toEqual([
				{
					caip2: networkBySlug.bitcoin.caip2,
				},
			])
			expect(resolver.resolve['Slug'].appliesTo).toEqual([
				{
					slug: 'bitcoin',
				},
			])
		}
	})

	it('issues Bitcoin list requests for canonical CAIP-2 and rejects unsupported networks before I/O', async () => {
		sourceGetJson.mockResolvedValueOnce([
			{
				height: 1,
				id: 'a'.repeat(64),
			},
		])

		await expect(blocksResolver.resolve['Caip2'].resolve(network, resolverContext)).resolves.toHaveLength(1)
		expect(sourceGetJson).toHaveBeenCalledWith(
			binding,
			'https://mempool.space/api/v1/blocks'
		)

		await expect(blocksResolver.resolve['Caip2'].resolve({
			caip2: {
				namespace: 'eip155',
				reference: '1',
			},
		}, resolverContext)).rejects.toThrow('unsupported Bitcoin network')
		expect(sourceGetJson).toHaveBeenCalledTimes(1)
	})

	it('uses the bound confirmed-history endpoint with resumable pagination', async () => {
		sourceGetJson.mockResolvedValueOnce(transactions)

		const page = await addressTransactionsResolver.resolve[
			'NetworkAddress'
		].resolve(address, resolverContext)
		const projection = addressTransactionsResolver.projections.$$transactions
		if (
			typeof projection === 'function'
			|| projection.select == null
			|| projection.continuation == null
		)
			throw new Error('MempoolSpace-Rest spec missing address transaction pagination')

		expect(sourceGetJson).toHaveBeenCalledWith(
			binding,
			`https://mempool.space/api/address/${address.address}/txs/chain`
		)
		expect(projection.continuation(page, address, resolverContext)).toEqual({
			operation: 'address-transactions',
			target: address.address,
			terminal: false,
			token: transactions[0].txid,
		})

		sourceGetJson.mockResolvedValueOnce([])
		const terminalPage = await addressTransactionsResolver.resolve[
			'NetworkAddress'
		].resolve(address, {
			...resolverContext,
			providerContinuationToken: transactions[0].txid,
		})
		expect(sourceGetJson).toHaveBeenLastCalledWith(
			binding,
			`https://mempool.space/api/address/${address.address}/txs/chain/${transactions[0].txid}`
		)
		expect(projection.continuation(terminalPage, address, resolverContext)).toEqual({
			operation: 'address-transactions',
			target: address.address,
			terminal: true,
		})
	})

	it('rejects non-Bitcoin subjects before provider I/O', async () => {
		for (const $network of [
			{
				slug: 'litecoin',
			},
			{
				caip2: {
					namespace: 'wrong-namespace',
					reference: networkBySlug.bitcoin.caip2.reference,
				},
			},
			{
				caip2: {
					namespace: networkBySlug.bitcoin.caip2.namespace,
					reference: 'wrong-mainnet',
				},
			},
		])
			await expect(addressTransactionsResolver.resolve[
				'NetworkAddress'
			].resolve({
				$network,
				address: address.address,
			}, resolverContext)).rejects.toThrow('unsupported Bitcoin network')
		expect(sourceGetJson).not.toHaveBeenCalled()
	})
})

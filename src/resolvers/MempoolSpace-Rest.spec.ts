import { QueryClient } from '@tanstack/query-core'
import { beforeEach, describe, expect, it, vi } from 'vitest'

import { networkBySlug } from '$/constants/Network.ts'
import { entityFieldAddressKey, EntityMetaKey } from '$/schema/$schema.ts'
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
const liveNetworkResolver = networkResolvers.find((resolver) => (
	resolver.resolveLive?.utxoNetwork != null
))
const blockResolver = mempoolSpaceResolvers.resolvers.find((resolver) => (
	resolver.entityType === EntityType.UtxoBlock
	&& 'NetworkHeight' in resolver.resolve
	&& 'NetworkHeightHash' in resolver.resolve
))
const addressTransactionsResolver = mempoolSpaceResolvers.resolvers.find((resolver) => (
	resolver.entityType === EntityType.UtxoAddress
	&& '$$transactions' in resolver.projections
))
const addressOutputsResolver = mempoolSpaceResolvers.resolvers.find((resolver) => (
	resolver.entityType === EntityType.UtxoAddress
	&& '$$outputs' in resolver.projections
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

if (liveNetworkResolver == null)
	throw new Error('MempoolSpace-Rest spec missing Network UTXO live resolver')

if (blockResolver == null)
	throw new Error('MempoolSpace-Rest spec missing UtxoBlock NetworkHeight resolver')

if (addressTransactionsResolver == null)
	throw new Error('MempoolSpace-Rest spec missing UtxoAddress.$$transactions resolver')

if (addressOutputsResolver == null)
	throw new Error('MempoolSpace-Rest spec missing UtxoAddress.$$outputs resolver')

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

	it('resolves UtxoBlock by height via block-height then block', async () => {
		const hash = 'c'.repeat(64)
		const previous = 'd'.repeat(64)
		sourceGetJson
			.mockResolvedValueOnce(hash)
			.mockResolvedValueOnce({
				id: hash,
				height: 840_000,
				timestamp: 1_700_000_000,
				merkle_root: 'e'.repeat(64),
				nonce: 1,
				difficulty: 2,
				size: 3,
				weight: 4,
				tx_count: 5,
				previousblockhash: previous,
			})

		const snapshot = await blockResolver.resolve.NetworkHeight.resolve({
			$network: network,
			height: 840_000n,
		})

		expect(sourceGetJson.mock.calls).toEqual([
			[
				binding,
				'https://mempool.space/api/block-height/840000',
			],
			[
				binding,
				`https://mempool.space/api/block/${hash}`,
			],
		])
		expect(blockResolver.projections.hash(snapshot)).toBe(hash)
		expect(blockResolver.projections.$parent(snapshot)).toEqual({
			[EntityMetaKey.Selector]: {
				$network: network,
				height: 839_999n,
				hash: previous,
			},
		})
		expect(blockResolver.projections.transactionCount(snapshot)).toBe(5)
	})

	it('projects address UTXO outputs from /address/.../utxo', async () => {
		const txId = 'f'.repeat(64)
		sourceGetJson.mockResolvedValueOnce([
			{
				txid: txId,
				vout: 2,
				status: {
					confirmed: true,
				},
				value: 9_000,
			},
		])

		const outputs = await addressOutputsResolver.resolve.NetworkAddress.resolve(
			address,
			resolverContext
		)

		expect(sourceGetJson).toHaveBeenCalledWith(
			binding,
			`https://mempool.space/api/address/${address.address}/utxo`
		)
		expect(addressOutputsResolver.projections.$$outputs(outputs)).toEqual([{
			[EntityMetaKey.Selector]: {
				$transaction: {
					$network: network,
					txId,
				},
				indexInTransaction: 2,
			},
		}])
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

	it('publishes UTXO observations and invalidates affected projections on each live refresh', async () => {
		vi.useFakeTimers()
		vi.spyOn(Date, 'now').mockReturnValue(1_700_000_000_000)
		const fields = {
			'$$timestamps': {
				replaceRows: vi.fn(),
				invalidate: vi.fn(),
				count: {
					replaceRows: vi.fn(),
					invalidate: vi.fn(),
				},
			},
			'$$blocks': {
				replaceRows: vi.fn(),
				invalidate: vi.fn(),
				count: {
					replaceRows: vi.fn(),
					invalidate: vi.fn(),
				},
			},
			'$$transactions': {
				replaceRows: vi.fn(),
				invalidate: vi.fn(),
				count: {
					replaceRows: vi.fn(),
					invalidate: vi.fn(),
				},
			},
			invalidate: vi.fn(),
		}
		const controller = new AbortController()
		sourceGetJson
			.mockResolvedValueOnce([{
				height: 840_000,
				id: 'a'.repeat(64),
			}])
			.mockResolvedValueOnce({
				count: 12,
				vsize: 345.2,
			})
			.mockResolvedValueOnce({
				fastestFee: 10,
				halfHourFee: 8,
				hourFee: 6,
				economyFee: 4,
				minimumFee: 1,
			})

		const cleanup = liveNetworkResolver.resolveLive.utxoNetwork.start({
			parentEntitySelector: network,
			queryClient: new QueryClient(),
			signal: controller.signal,
			trigger: resolverContext,
			fields,
		})
		await vi.waitFor(() => {
			expect(fields.$$timestamps.replaceRows).toHaveBeenCalledOnce()
		})

		expect(fields.$$timestamps.replaceRows).toHaveBeenCalledWith([{
			source: Source.MempoolSpace_Rest,
			value: [{
				[EntityMetaKey.Selector]: {
					$network: network,
					timestampMs: 1_700_000_000_000,
					source: Source.MempoolSpace_Rest,
				},
				[EntityMetaKey.Fields]: {
					[entityFieldAddressKey(EntityType.Network_Timestamp, ['Utxo'], 'bestBlockHeight')]: 840_000n,
					[entityFieldAddressKey(EntityType.Network_Timestamp, ['Utxo'], 'bestBlockHash')]: 'a'.repeat(64),
					[entityFieldAddressKey(EntityType.Network_Timestamp, ['Utxo'], 'mempoolTransactionCount')]: 12,
					[entityFieldAddressKey(EntityType.Network_Timestamp, ['Utxo'], 'mempoolSizeBytes')]: 346n,
					[entityFieldAddressKey(EntityType.Network_Timestamp, ['Utxo'], 'suggestedTransactionFeePerByteSats')]: 6,
				},
			}],
		}])
		expect(fields.invalidate).toHaveBeenCalledWith([
			'$$blocks',
			'$$transactions',
		])

		controller.abort()
		if (typeof cleanup === 'function')
			cleanup()
		vi.useRealTimers()
	})

	it('stops live refresh and suppresses in-flight publication after cleanup', async () => {
		vi.useFakeTimers()
		const fields = {
			'$$timestamps': {
				replaceRows: vi.fn(),
				invalidate: vi.fn(),
				count: {
					replaceRows: vi.fn(),
					invalidate: vi.fn(),
				},
			},
			'$$blocks': {
				replaceRows: vi.fn(),
				invalidate: vi.fn(),
				count: {
					replaceRows: vi.fn(),
					invalidate: vi.fn(),
				},
			},
			'$$transactions': {
				replaceRows: vi.fn(),
				invalidate: vi.fn(),
				count: {
					replaceRows: vi.fn(),
					invalidate: vi.fn(),
				},
			},
			invalidate: vi.fn(),
		}
		const controller = new AbortController()
		let resolveBlocks = (_value: unknown) => {}
		sourceGetJson
			.mockImplementationOnce(() => new Promise((resolve) => {
				resolveBlocks = resolve
			}))
			.mockResolvedValueOnce({
				count: 12,
				vsize: 345,
			})
			.mockResolvedValueOnce({
				hourFee: 6,
			})

		const cleanup = liveNetworkResolver.resolveLive.utxoNetwork.start({
			parentEntitySelector: network,
			queryClient: new QueryClient(),
			signal: controller.signal,
			trigger: resolverContext,
			fields,
		})
		await vi.waitFor(() => {
			expect(sourceGetJson).toHaveBeenCalledTimes(3)
		})
		controller.abort()
		if (typeof cleanup === 'function')
			cleanup()
		resolveBlocks([{
			height: 840_000,
			id: 'a'.repeat(64),
		}])
		await Promise.resolve()
		await Promise.resolve()
		await vi.advanceTimersByTimeAsync(60_000)

		expect(fields.$$timestamps.replaceRows).not.toHaveBeenCalled()
		expect(fields.invalidate).not.toHaveBeenCalled()
		expect(sourceGetJson).toHaveBeenCalledTimes(3)
		vi.useRealTimers()
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

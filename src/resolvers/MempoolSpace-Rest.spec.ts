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

	it('projects Ordinals/Runes from fetched mempool.space transaction wires', async () => {
		const txId = 'e'.repeat(64)
		const helloWorldInscriptionHex = (
			'0063'
			+ '036f7264'
			+ '0101'
			+ '18746578742f706c61696e3b636861727365743d7574662d38'
			+ '00'
			+ '0d48656c6c6f2c20776f726c6421'
			+ '68'
		)
		const wire = {
			txid: txId,
			version: 2,
			locktime: 0,
			size: 200,
			weight: 400,
			fee: 100,
			status: {
				confirmed: true,
				block_height: 840000,
				block_hash: 'f'.repeat(64),
			},
			vin: [{
				txid: '1'.repeat(64),
				vout: 0,
				is_coinbase: false,
				sequence: 0xffffffff,
				witness: [
					helloWorldInscriptionHex,
				],
			}],
			vout: [
				{
					scriptpubkey: '6a5d03010203',
					scriptpubkey_type: 'op_return',
					value: 0,
				},
				{
					scriptpubkey: '0014',
					scriptpubkey_type: 'v0_p2wpkh',
					scriptpubkey_address: 'bc1qexample',
					value: 546,
				},
			],
		}
		sourceGetJson.mockResolvedValue(wire)

		const entitySelector = {
			$network: network,
			txId,
		}
		const transaction = await transactionResolver.resolve.NetworkTxId.resolve(entitySelector, resolverContext)
		expect(transactionResolver.projections.$$bitcoinOrdinalInscriptions(transaction)).toEqual([
			{
				[EntityMetaKey.Selector]: {
					$network: network,
					inscriptionId: `${txId}i0`,
				},
			},
		])
		expect(transactionResolver.projections.$bitcoinRunestone(transaction)).toEqual({
			[EntityMetaKey.Selector]: {
				$transaction: entitySelector,
				outputIndex: 0,
			},
		})

		const runestoneOutput = await outputResolver.resolve.TransactionIndexInTransaction.resolve({
			$transaction: entitySelector,
			indexInTransaction: 0,
		}, resolverContext)
		expect(outputResolver.projections.$bitcoinRunestone(runestoneOutput)).toEqual({
			[EntityMetaKey.Selector]: {
				$transaction: entitySelector,
				outputIndex: 0,
			},
		})

		const inscriptionResolver = mempoolSpaceResolvers.resolvers.find((resolver) => (
			resolver.entityType === EntityType.BitcoinOrdinalInscription
		))
		const runestoneResolver = mempoolSpaceResolvers.resolvers.find((resolver) => (
			resolver.entityType === EntityType.BitcoinRunestone
		))
		if (inscriptionResolver == null || runestoneResolver == null)
			throw new Error('MempoolSpace-Rest missing Ordinals/Runes entity resolvers')

		const inscription = await inscriptionResolver.resolve.NetworkInscriptionId.resolve({
			$network: network,
			inscriptionId: `${txId}i0`,
		}, resolverContext)
		expect(inscriptionResolver.projections.contentType(inscription)).toBe('text/plain;charset=utf-8')
		expect(inscriptionResolver.projections.bodyHex(inscription)).toBe('48656c6c6f2c20776f726c6421')

		const runestone = await runestoneResolver.resolve.TransactionOutputIndex.resolve({
			$transaction: entitySelector,
			outputIndex: 0,
		}, resolverContext)
		expect(runestoneResolver.projections.payloadHex(runestone)).toBe('010203')
		expect(runestoneResolver.projections.isCenotaph(runestone)).toBe(false)
	})
})

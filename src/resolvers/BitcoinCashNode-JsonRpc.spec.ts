import { beforeEach, describe, expect, it, vi } from 'vitest'

import { networkBySlug } from '$/constants/Network.ts'
import { EntityMetaKey } from '$/schema/$schema.ts'
import { EntityType } from '$/schema/EntityType.ts'
import { Source } from '$/sources/Source.ts'

const getRawTransaction = vi.fn()
const getBlock = vi.fn()
const getBlockCount = vi.fn()
const getBlockHash = vi.fn()
const getTransparentAddressUtxos = vi.fn()

vi.mock('$/sources/BitcoinCashNode/JsonRpc/queries.ts', () => ({
	getRawTransaction,
	getBlock,
	getBlockCount,
	getBlockHash,
	getTransparentAddressUtxos,
}))

const { default: bitcoinCashNodeResolvers } = await import('$/resolvers/BitcoinCashNode-JsonRpc.ts')

const transactionResolver = bitcoinCashNodeResolvers.resolvers.find((resolver) => (
	resolver.entityType === EntityType.UtxoTransaction
))
const inputResolver = bitcoinCashNodeResolvers.resolvers.find((resolver) => (
	resolver.entityType === EntityType.UtxoInput
))
const outputResolver = bitcoinCashNodeResolvers.resolvers.find((resolver) => (
	resolver.entityType === EntityType.UtxoOutput
))
const blockResolver = bitcoinCashNodeResolvers.resolvers.find((resolver) => (
	resolver.entityType === EntityType.UtxoBlock
	&& 'NetworkHeight' in resolver.resolve
))
const networkBlocksResolver = bitcoinCashNodeResolvers.resolvers.find((resolver) => (
	resolver.entityType === EntityType.Network
	&& 'Utxo' in resolver.projections
	&& '$$blocks' in resolver.projections.Utxo
	&& typeof resolver.projections.Utxo.$$blocks === 'object'
	&& 'select' in resolver.projections.Utxo.$$blocks
))
const addressOutputsResolver = bitcoinCashNodeResolvers.resolvers.find((resolver) => (
	resolver.entityType === EntityType.UtxoAddress
	&& '$$outputs' in resolver.projections
))
const addressTimestampResolver = bitcoinCashNodeResolvers.resolvers.find((resolver) => (
	resolver.entityType === EntityType.UtxoAddress_Timestamp
))

if (transactionResolver == null)
	throw new Error('BitcoinCashNode-JsonRpc spec missing UtxoTransaction resolver')

if (inputResolver == null || outputResolver == null)
	throw new Error('BitcoinCashNode-JsonRpc spec missing child input/output resolver')

if (blockResolver == null || networkBlocksResolver == null)
	throw new Error('BitcoinCashNode-JsonRpc spec missing UTXO block / network list resolvers')

if (addressOutputsResolver == null || addressTimestampResolver == null)
	throw new Error('BitcoinCashNode-JsonRpc spec missing address UTXO resolvers')

const network = {
	caip2: networkBySlug['bitcoin-cash'].caip2,
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

describe('BitcoinCashNode UTXO', () => {
	beforeEach(() => {
		vi.clearAllMocks()
	})

	it('projects transaction fields and child selectors from one provider response', async () => {
		const txId = 'b'.repeat(64)
		getRawTransaction.mockResolvedValueOnce({
			txid: txId,
			version: 2,
			locktime: 0,
			size: 200,
			vsize: 200,
			weight: 800,
			vin: [{
				txid: 'd'.repeat(64),
				vout: 1,
				scriptSig: {
					asm: 'input script',
				},
				sequence: 1,
			}],
			vout: [{
				value: 0.00005,
				n: 0,
				scriptPubKey: {
					asm: 'output script',
					hex: '76a914',
					type: 'pubkeyhash',
					address: 'bitcoincash:qpexample',
				},
			}],
		})
		const entitySelector = {
			$network: network,
			txId,
		}
		const transaction = await transactionResolver.resolve[
			'NetworkTxId'
		].resolve(entitySelector, resolverContext)

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
		expect(getRawTransaction).toHaveBeenCalledOnce()
		expect(getRawTransaction).toHaveBeenCalledWith({
			txId,
		})
	})

	it('resolves input and output fields including CashToken refs from the same transaction response', async () => {
		const txId = 'e'.repeat(64)
		const spentTxId = 'f'.repeat(64)
		const categoryId = 'a'.repeat(64)
		getRawTransaction.mockResolvedValue({
			txid: txId,
			version: 2,
			locktime: 0,
			size: 200,
			vsize: 200,
			weight: 800,
			vin: [{
				txid: spentTxId,
				vout: 2,
				scriptSig: {
					asm: 'spent input',
				},
				sequence: 0xffffffff,
			}],
			vout: [{
				value: 1.5,
				n: 0,
				scriptPubKey: {
					asm: 'paid output',
					hex: '76a914',
					type: 'pubkeyhash',
					address: 'bitcoincash:qpexample',
				},
				tokenData: {
					category: categoryId,
					amount: '42',
					nft: {
						capability: 'none',
						commitment: 'abcd',
					},
				},
			}],
		})
		const entitySelector = {
			$network: network,
			txId,
		}
		const input = await inputResolver.resolve[
			'TransactionIndexInTransaction'
		].resolve({
			$transaction: entitySelector,
			indexInTransaction: 0,
		}, resolverContext)
		const output = await outputResolver.resolve[
			'TransactionIndexInTransaction'
		].resolve({
			$transaction: entitySelector,
			indexInTransaction: 0,
		}, resolverContext)

		expect(inputResolver.projections.$spentOutput(input)).toEqual({
			[EntityMetaKey.Selector]: {
				$transaction: {
					$network: network,
					txId: spentTxId,
				},
				indexInTransaction: 2,
			},
		})
		expect(inputResolver.projections.scriptSigAsm(input)).toBe('spent input')
		expect(outputResolver.projections.valueSats(output)).toBe(150_000_000n)
		expect(outputResolver.projections.scriptPubKeyType(output)).toBe('pubkeyhash')
		expect(outputResolver.projections.$address(output)).toEqual({
			[EntityMetaKey.Selector]: {
				$network: network,
				address: 'bitcoincash:qpexample',
			},
		})
		expect(outputResolver.projections.$bitcoinCashCashTokenFungibleAmount(output)).toEqual({
			[EntityMetaKey.Selector]: {
				$output: {
					$transaction: entitySelector,
					indexInTransaction: 0,
				},
			},
		})
		expect(outputResolver.projections.$bitcoinCashCashTokenNft(output)).toEqual({
			[EntityMetaKey.Selector]: {
				$output: {
					$transaction: entitySelector,
					indexInTransaction: 0,
				},
			},
		})
		expect(getRawTransaction).toHaveBeenCalledTimes(2)
	})

	it('projects Network.Utxo.$$blocks tip walk and UtxoBlock by height', async () => {
		getBlockCount.mockResolvedValueOnce(10)
		getBlockHash
			.mockResolvedValueOnce('1'.repeat(64))
			.mockResolvedValueOnce('2'.repeat(64))
		getBlock.mockResolvedValueOnce({
			hash: '1'.repeat(64),
			height: 10,
			version: 1,
			versionHex: '00000001',
			merkleroot: '3'.repeat(64),
			time: 1_700_000_000,
			mediantime: 1_700_000_000,
			nonce: 1,
			bits: '1a00ffff',
			difficulty: 1,
			chainwork: '01',
			nTx: 2,
			previousblockhash: '2'.repeat(64),
			tx: ['4'.repeat(64), '5'.repeat(64)],
		})

		const blocksSnapshot = await networkBlocksResolver.resolve.Caip2.resolve(
			network,
			resolverContext
		)
		expect(networkBlocksResolver.projections.Utxo.$$blocks.select(blocksSnapshot)).toEqual([
			{
				[EntityMetaKey.Selector]: {
					$network: network,
					height: 10n,
					hash: '1'.repeat(64),
				},
			},
			{
				[EntityMetaKey.Selector]: {
					$network: network,
					height: 9n,
					hash: '2'.repeat(64),
				},
			},
		])
		expect(networkBlocksResolver.projections.Utxo.$$blocks.resolveCount(blocksSnapshot)).toBe(11n)

		const block = await blockResolver.resolve.NetworkHeight.resolve({
			$network: network,
			height: 10n,
		}, resolverContext)
		expect(blockResolver.projections.hash(block)).toBe('1'.repeat(64))
		expect(blockResolver.projections.transactionCount(block)).toBe(2)
	})

	it('projects address $$outputs and tip balance from CashToken-aware scantxoutset', async () => {
		const address = `bitcoincash:q${'q'.repeat(41)}`
		getTransparentAddressUtxos.mockResolvedValue({
			unspents: [{
				txid: '6'.repeat(64),
				vout: 0,
				valueZatoshis: 12_345n,
			}],
			totalAmountZatoshis: 12_345n,
			tokenTotalAmountByCategory: {},
		})

		const outputs = await addressOutputsResolver.resolve.NetworkAddress.resolve({
			$network: network,
			address,
		}, resolverContext)
		expect(addressOutputsResolver.projections.$$outputs(outputs)).toEqual([{
			[EntityMetaKey.Selector]: {
				$transaction: {
					$network: network,
					txId: '6'.repeat(64),
				},
				indexInTransaction: 0,
			},
		}])

		const observation = await addressTimestampResolver.resolve.AddressTimestampMsSource.resolve({
			$address: {
				$network: network,
				address,
			},
			timestampMs: 1,
			source: Source.BitcoinCashNode_JsonRpc,
		}, resolverContext)
		expect(addressTimestampResolver.projections.balanceSats(observation)).toBe(12_345n)
		expect(addressTimestampResolver.projections.unspentOutputCount(observation)).toBe(1)
	})

	it('fails closed on unsupported networks before transport', async () => {
		await expect(transactionResolver.resolve[
			'NetworkTxId'
		].resolve({
			$network: {
				caip2: networkBySlug.bitcoin.caip2,
			},
			txId: 'c'.repeat(64),
		}, resolverContext)).rejects.toThrow('BitcoinCashNode_JsonRpc: unsupported network')

		await expect(inputResolver.resolve[
			'TransactionIndexInTransaction'
		].resolve({
			$transaction: {
				$network: {
					slug: networkBySlug.bitcoin.slug,
				},
				txId: 'c'.repeat(64),
			},
			indexInTransaction: 0,
		}, resolverContext)).rejects.toThrow('BitcoinCashNode_JsonRpc: unsupported network')

		expect(getRawTransaction).not.toHaveBeenCalled()
	})

	it('fails closed on JSON-RPC errors', async () => {
		getRawTransaction.mockRejectedValueOnce(new Error('JSON-RPC getrawtransaction: No such mempool transaction'))

		await expect(transactionResolver.resolve[
			'NetworkTxId'
		].resolve({
			$network: network,
			txId: 'missing-transaction',
		}, resolverContext)).rejects.toThrow('No such mempool transaction')
	})
})

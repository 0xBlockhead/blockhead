import { beforeEach, describe, expect, it, vi } from 'vitest'

import { networkBySlug } from '$/constants/Network.ts'
import { EntityMetaKey } from '$/schema/$schema.ts'
import { EntityType } from '$/schema/EntityType.ts'

const getRawTransaction = vi.fn()

vi.mock('$/sources/BitcoinCashNode/JsonRpc/queries.ts', () => ({
	getRawTransaction,
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

if (transactionResolver == null)
	throw new Error('BitcoinCashNode-JsonRpc spec missing UtxoTransaction resolver')

if (inputResolver == null || outputResolver == null)
	throw new Error('BitcoinCashNode-JsonRpc spec missing child input/output resolver')

const network = {
	caip2: networkBySlug['bitcoin-cash'].caip2,
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

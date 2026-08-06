import { beforeEach, describe, expect, it, vi } from 'vitest'

import { networkBySlug } from '$/constants/Network.ts'
import { EntityMetaKey } from '$/schema/$schema.ts'
import { EntityType } from '$/schema/EntityType.ts'

const getRawTransaction = vi.fn()
const getTransactionProtocolPayloads = vi.fn(async () => [])

vi.mock('$/sources/BitcoinCore/JsonRpc/queries.ts', () => ({
	getRawTransaction,
	getTransactionProtocolPayloads,
}))

const { default: bitcoinCoreResolvers } = await import('$/resolvers/BitcoinCore-JsonRpc.ts')

const transactionResolver = bitcoinCoreResolvers.resolvers.find((resolver) => (
	resolver.entityType === EntityType.UtxoTransaction
))
const inputResolver = bitcoinCoreResolvers.resolvers.find((resolver) => (
	resolver.entityType === EntityType.UtxoInput
))
const outputResolver = bitcoinCoreResolvers.resolvers.find((resolver) => (
	resolver.entityType === EntityType.UtxoOutput
))

if (transactionResolver == null)
	throw new Error('BitcoinCore-JsonRpc spec missing UtxoTransaction resolver')

if (inputResolver == null || outputResolver == null)
	throw new Error('BitcoinCore-JsonRpc spec missing child input/output resolver')

const network = {
	caip2: networkBySlug.bitcoin.caip2,
}

describe('BitcoinCore UTXO', () => {
	beforeEach(() => {
		vi.clearAllMocks()
		getTransactionProtocolPayloads.mockResolvedValue([])
	})

	it('projects transaction fields and child selectors from one provider response', async () => {
		const txId = 'b'.repeat(64)
		getRawTransaction.mockResolvedValueOnce({
			txid: txId,
			version: 2,
			locktime: 0,
			size: 200,
			vsize: 100,
			weight: 400,
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
					hex: '0014',
					type: 'witness_v0_keyhash',
					address: 'bc1qexample',
				},
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
		expect(getRawTransaction).toHaveBeenCalledOnce()
		expect(getRawTransaction).toHaveBeenCalledWith({
			txId,
		})
	})

	it('resolves input and output fields from the same transaction response', async () => {
		const txId = 'e'.repeat(64)
		const spentTxId = 'f'.repeat(64)
		getRawTransaction.mockResolvedValue({
			txid: txId,
			version: 2,
			locktime: 0,
			size: 200,
			vsize: 100,
			weight: 400,
			vin: [{
				txid: spentTxId,
				vout: 2,
				scriptSig: {
					asm: 'spent input',
				},
				sequence: 0xffffffff,
				txinwitness: [
					'witness-item',
				],
			}],
			vout: [{
				value: 1.5,
				n: 0,
				scriptPubKey: {
					asm: 'paid output',
					hex: '76a914',
					type: 'pubkeyhash',
					address: '1ExampleAddress',
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
		})
		const output = await outputResolver.resolve[
			'TransactionIndexInTransaction'
		].resolve({
			$transaction: entitySelector,
			indexInTransaction: 0,
		})

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
		expect(inputResolver.projections.witness(input)).toEqual([
			'witness-item',
		])
		expect(outputResolver.projections.valueSats(output)).toBe(150_000_000n)
		expect(outputResolver.projections.scriptPubKeyType(output)).toBe('pubkeyhash')
		expect(outputResolver.projections.$address(output)).toEqual({
			[EntityMetaKey.Selector]: {
				$network: network,
				address: '1ExampleAddress',
			},
		})
		expect(getRawTransaction).toHaveBeenCalledTimes(2)
	})

	it('fails closed on JSON-RPC errors', async () => {
		getRawTransaction.mockRejectedValueOnce(new Error('JSON-RPC getrawtransaction: No such mempool transaction'))

		await expect(transactionResolver.resolve[
			'NetworkTxId'
		].resolve({
			$network: network,
			txId: 'missing-transaction',
		})).rejects.toThrow('No such mempool transaction')
	})

	it('projects Ordinals and Runes refs from the fetched transaction witness/scripts', async () => {
		const txId = 'a'.repeat(64)
		const helloWorldInscriptionHex = (
			'0063'
			+ '036f7264'
			+ '0101'
			+ '18746578742f706c61696e3b636861727365743d7574662d38'
			+ '00'
			+ '0d48656c6c6f2c20776f726c6421'
			+ '68'
		)
		getRawTransaction.mockResolvedValue({
			txid: txId,
			version: 2,
			locktime: 0,
			size: 200,
			vsize: 100,
			weight: 400,
			vin: [{
				txid: 'b'.repeat(64),
				vout: 0,
				scriptSig: {
					asm: '',
				},
				sequence: 0xffffffff,
				txinwitness: [
					helloWorldInscriptionHex,
				],
			}],
			vout: [
				{
					value: 0.00000546,
					n: 0,
					scriptPubKey: {
						asm: 'OP_RETURN OP_13 010203',
						hex: '6a5d03010203',
						type: 'nulldata',
					},
				},
				{
					value: 0.00001,
					n: 1,
					scriptPubKey: {
						asm: 'OP_DUP',
						hex: '76',
						type: 'pubkeyhash',
						address: '1Example',
					},
				},
			],
		})

		const entitySelector = {
			$network: network,
			txId,
		}
		const transaction = await transactionResolver.resolve.NetworkTxId.resolve(entitySelector)
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
		})
		expect(outputResolver.projections.$bitcoinRunestone(runestoneOutput)).toEqual({
			[EntityMetaKey.Selector]: {
				$transaction: entitySelector,
				outputIndex: 0,
			},
		})

		const paymentOutput = await outputResolver.resolve.TransactionIndexInTransaction.resolve({
			$transaction: entitySelector,
			indexInTransaction: 1,
		})
		expect(outputResolver.projections.$bitcoinRunestone(paymentOutput)).toBeUndefined()

		const inscriptionResolver = bitcoinCoreResolvers.resolvers.find((resolver) => (
			resolver.entityType === EntityType.BitcoinOrdinalInscription
		))
		const runestoneResolver = bitcoinCoreResolvers.resolvers.find((resolver) => (
			resolver.entityType === EntityType.BitcoinRunestone
		))
		if (inscriptionResolver == null || runestoneResolver == null)
			throw new Error('BitcoinCore-JsonRpc missing Ordinals/Runes entity resolvers')

		const inscription = await inscriptionResolver.resolve.NetworkInscriptionId.resolve({
			$network: network,
			inscriptionId: `${txId}i0`,
		})
		expect(inscriptionResolver.projections.contentType(inscription)).toBe('text/plain;charset=utf-8')
		expect(inscriptionResolver.projections.revealInputIndex(inscription)).toBe(0)
		expect(inscriptionResolver.projections.revealWitnessIndex(inscription)).toBe(0)
		expect(inscriptionResolver.projections.payloadHex(inscription)).toBeTruthy()

		const runestone = await runestoneResolver.resolve.TransactionOutputIndex.resolve({
			$transaction: entitySelector,
			outputIndex: 0,
		})
		expect(runestoneResolver.projections.payloadHex(runestone)).toBe('010203')
		expect(runestoneResolver.projections.isCenotaph(runestone)).toBe(false)
	})
})

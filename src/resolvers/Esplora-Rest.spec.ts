import { beforeEach, describe, expect, it, vi } from 'vitest'

import { networkBySlug } from '$/constants/Network.ts'
import { EntityMetaKey } from '$/schema/$schema.ts'
import { EntityType } from '$/schema/EntityType.ts'

const getTransaction = vi.fn()

vi.mock('$/sources/Esplora/Rest/queries.ts', async (importOriginal) => {
	const actual = await importOriginal<typeof import('$/sources/Esplora/Rest/queries.ts')>()
	return {
		...actual,
		getTransaction,
		getTransactionProtocolPayloads: async ({
			target,
			txId,
		}: {
			target: string
			txId: string
		}) => {
			const { extractEsploraProtocolPayloads } = await import('$/sources/BitcoinCore/JsonRpc/protocol.ts')
			return extractEsploraProtocolPayloads(
				await getTransaction({
					target,
					txId,
				})
			)
		},
	}
})

const { default: esploraResolvers } = await import('$/resolvers/Esplora-Rest.ts')

const transactionResolver = esploraResolvers.resolvers.find((resolver) => (
	resolver.entityType === EntityType.UtxoTransaction
))
const inputResolver = esploraResolvers.resolvers.find((resolver) => (
	resolver.entityType === EntityType.UtxoInput
))
const outputResolver = esploraResolvers.resolvers.find((resolver) => (
	resolver.entityType === EntityType.UtxoOutput
))
const inscriptionResolver = esploraResolvers.resolvers.find((resolver) => (
	resolver.entityType === EntityType.BitcoinOrdinalInscription
))
const runestoneResolver = esploraResolvers.resolvers.find((resolver) => (
	resolver.entityType === EntityType.BitcoinRunestone
))

if (transactionResolver == null)
	throw new Error('Esplora-Rest spec missing UtxoTransaction resolver')

if (inputResolver == null || outputResolver == null)
	throw new Error('Esplora-Rest spec missing child input/output resolver')

if (inscriptionResolver == null || runestoneResolver == null)
	throw new Error('Esplora-Rest spec missing Bitcoin Ordinals/Runes resolvers')

const resolverContext = {
	filters: [],
	sorts: [],
	pagination: {},
	selectorKeys: [],
	parentSelectorKeys: [],
	sources: [],
	publicEnv: {},
}

const liquidNetwork = {
	slug: 'liquid',
}

const bitcoinNetwork = {
	caip2: networkBySlug.bitcoin.caip2,
}

const helloWorldInscriptionHex = (
	'0063'
	+ '036f7264'
	+ '0101'
	+ '18746578742f706c61696e3b636861727365743d7574662d38'
	+ '00'
	+ '0d48656c6c6f2c20776f726c6421'
	+ '68'
)

describe('Esplora UTXO', () => {
	beforeEach(() => {
		getTransaction.mockReset()
	})

	it('projects child selectors and resolves Elements confidential outputs without inventing valueSats', async () => {
		const txId = 'c'.repeat(64)
		getTransaction.mockResolvedValue({
			txid: txId,
			version: 2,
			locktime: 0,
			size: 300,
			weight: 400,
			fee: 250,
			status: {
				confirmed: true,
				block_height: 100,
				block_hash: 'b'.repeat(64),
			},
			vin: [{
				txid: 'd'.repeat(64),
				vout: 1,
				scriptsig_asm: 'input asm',
				is_coinbase: false,
				sequence: 1,
				witness: [
					'wit',
				],
			}],
			vout: [{
				scriptpubkey: '5120',
				scriptpubkey_asm: 'OP_1',
				scriptpubkey_type: 'v1_p2tr',
				scriptpubkey_address: 'ex1qexample',
				valuecommitment: '09valuecommitment',
				assetcommitment: '0aassetcommitment',
				noncecommitment: '02noncecommitment',
				surjection_proof: 'surjection',
				range_proof: 'range',
			}],
		})
		const entitySelector = {
			$network: liquidNetwork,
			txId,
		}
		const transaction = await transactionResolver.resolve[
			'NetworkTxId'
		].resolve(entitySelector, resolverContext)

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
					$network: liquidNetwork,
					txId: 'd'.repeat(64),
				},
				indexInTransaction: 1,
			},
		})
		expect(outputResolver.projections.valueSats(output)).toBeUndefined()
		expect(outputResolver.projections.isConfidential(output)).toBe(true)
		expect(outputResolver.projections.Confidential.valueCommitment(output)).toBe('09valuecommitment')
		expect(outputResolver.projections.Confidential.assetCommitment(output)).toBe('0aassetcommitment')
		expect(outputResolver.projections.Confidential.nonceCommitment(output)).toBe('02noncecommitment')
		expect(outputResolver.projections.Confidential.surjectionProof(output)).toBe('surjection')
		expect(outputResolver.projections.Confidential.rangeProof(output)).toBe('range')
		expect(getTransaction).toHaveBeenCalledWith({
			target: 'liquid',
			txId,
		})
	})

	it('maps explicit unblinded Liquid value sats when present', async () => {
		const txId = 'e'.repeat(64)
		getTransaction.mockResolvedValueOnce({
			txid: txId,
			version: 2,
			locktime: 0,
			size: 100,
			weight: 200,
			status: {
				confirmed: false,
			},
			vin: [],
			vout: [{
				scriptpubkey: '6a',
				scriptpubkey_type: 'op_return',
				value: 50_000,
				asset: 'a'.repeat(64),
			}],
		})
		const output = await outputResolver.resolve[
			'TransactionIndexInTransaction'
		].resolve({
			$transaction: {
				$network: liquidNetwork,
				txId,
			},
			indexInTransaction: 0,
		}, resolverContext)

		expect(outputResolver.projections.valueSats(output)).toBe(50_000n)
		expect(outputResolver.projections.isConfidential(output)).toBeUndefined()
		expect(outputResolver.projections.Confidential.valueCommitment(output)).toBeUndefined()
	})

	it('projects Bitcoin Ordinals/Runes from fetched Esplora transaction wires', async () => {
		const txId = 'f'.repeat(64)
		getTransaction.mockResolvedValue({
			txid: txId,
			version: 2,
			locktime: 0,
			size: 200,
			weight: 400,
			fee: 100,
			status: {
				confirmed: true,
				block_height: 840000,
				block_hash: '1'.repeat(64),
			},
			vin: [{
				txid: '2'.repeat(64),
				vout: 0,
				is_coinbase: false,
				sequence: 0xffffffff,
				witness: [
					helloWorldInscriptionHex,
				],
			}],
			vout: [
				{
					scriptpubkey: '6a5d03020100',
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
		})

		const entitySelector = {
			$network: bitcoinNetwork,
			txId,
		}
		const transaction = await transactionResolver.resolve.NetworkTxId.resolve(entitySelector, resolverContext)
		expect(transactionResolver.projections.$$bitcoinOrdinalInscriptions(transaction)).toEqual([
			{
				[EntityMetaKey.Selector]: {
					$network: bitcoinNetwork,
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

		const inscription = await inscriptionResolver.resolve.NetworkInscriptionId.resolve({
			$network: bitcoinNetwork,
			inscriptionId: `${txId}i0`,
		}, resolverContext)
		expect(inscriptionResolver.projections.contentType(inscription)).toBe('text/plain;charset=utf-8')
		expect(inscriptionResolver.projections.revealWitnessIndex(inscription)).toBe(0)

		const runestone = await runestoneResolver.resolve.TransactionOutputIndex.resolve({
			$transaction: entitySelector,
			outputIndex: 0,
		}, resolverContext)
		expect(runestoneResolver.projections.payloadHex(runestone)).toBe('020100')
		expect(runestoneResolver.projections.isCenotaph(runestone)).toBe(false)
	})

	it('projects multi-envelope inscriptions and LEB128 cenotaph runestones from Esplora wires', async () => {
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
		const secondInscriptionHex = (
			'0063'
			+ '036f7264'
			+ '0101'
			+ '0a746578742f706c61696e'
			+ '00'
			+ '024869'
			+ '68'
		)
		getTransaction.mockResolvedValue({
			txid: txId,
			version: 2,
			locktime: 0,
			size: 300,
			weight: 600,
			fee: 200,
			status: {
				confirmed: true,
				block_height: 840001,
				block_hash: '2'.repeat(64),
			},
			vin: [{
				txid: '3'.repeat(64),
				vout: 0,
				is_coinbase: false,
				sequence: 0xffffffff,
				witness: [
					helloWorldInscriptionHex + secondInscriptionHex,
				],
			}],
			vout: [
				{
					scriptpubkey: '6a5d037e0000',
					scriptpubkey_type: 'op_return',
					value: 0,
				},
			],
		})

		const entitySelector = {
			$network: bitcoinNetwork,
			txId,
		}
		const transaction = await transactionResolver.resolve.NetworkTxId.resolve(entitySelector, resolverContext)
		expect(transactionResolver.projections.$$bitcoinOrdinalInscriptions(transaction)).toHaveLength(2)
		expect(transactionResolver.projections.$$bitcoinOrdinalInscriptions(transaction)?.[1]).toEqual({
			[EntityMetaKey.Selector]: {
				$network: bitcoinNetwork,
				inscriptionId: `${txId}i1`,
			},
		})

		const second = await inscriptionResolver.resolve.NetworkInscriptionId.resolve({
			$network: bitcoinNetwork,
			inscriptionId: `${txId}i1`,
		}, resolverContext)
		expect(inscriptionResolver.projections.inscriptionIndex(second)).toBe(1)
		expect(inscriptionResolver.projections.bodyHex(second)).toBe('4869')

		const runestone = await runestoneResolver.resolve.TransactionOutputIndex.resolve({
			$transaction: entitySelector,
			outputIndex: 0,
		}, resolverContext)
		expect(runestoneResolver.projections.isCenotaph(runestone)).toBe(true)
		expect(runestoneResolver.projections.payloadHex(runestone)).toBe('7e0000')
	})
})

import { beforeEach, describe, expect, it, vi } from 'vitest'

import { EntityMetaKey } from '$/schema/$schema.ts'
import { EntityType } from '$/schema/EntityType.ts'

const getTransaction = vi.fn()

vi.mock('$/sources/Esplora/Rest/queries.ts', () => ({
	getTransaction,
}))

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

if (transactionResolver == null)
	throw new Error('Esplora-Rest spec missing UtxoTransaction resolver')

if (inputResolver == null || outputResolver == null)
	throw new Error('Esplora-Rest spec missing child input/output resolver')

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
		expect(outputResolver.projections.valueCommitment(output)).toBe('09valuecommitment')
		expect(outputResolver.projections.assetCommitment(output)).toBe('0aassetcommitment')
		expect(outputResolver.projections.nonceCommitment(output)).toBe('02noncecommitment')
		expect(outputResolver.projections.surjectionProof(output)).toBe('surjection')
		expect(outputResolver.projections.rangeProof(output)).toBe('range')
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
		expect(outputResolver.projections.valueCommitment(output)).toBeUndefined()
	})
})

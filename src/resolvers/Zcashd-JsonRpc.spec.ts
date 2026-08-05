import { beforeEach, describe, expect, it, vi } from 'vitest'

import { networkBySlug } from '$/constants/Network.ts'
import { EntityMetaKey } from '$/schema/$schema.ts'
import { EntityType } from '$/schema/EntityType.ts'

const getTreeState = vi.fn()
const getRawTransaction = vi.fn()

vi.mock('$/sources/Zcashd/JsonRpc/queries.ts', () => ({
	getTreeState,
	getRawTransaction,
}))

const { default: zcashdResolvers } = await import('$/resolvers/Zcashd-JsonRpc.ts')
const blockResolver = zcashdResolvers.resolvers.find((resolver) => (
	resolver.entityType === EntityType.UtxoBlock
))

if (blockResolver == null)
	throw new Error('Zcashd-JsonRpc spec missing UtxoBlock resolver')

const resolverContext = {
	filters: [],
	sorts: [],
	pagination: {},
	selectorKeys: [],
	parentSelectorKeys: [],
	sources: [],
	publicEnv: {},
}
const network = {
	caip2: networkBySlug.zcash.caip2,
}

describe('Zcashd block selector ownership', () => {
	beforeEach(() => {
		vi.clearAllMocks()
	})

	it('uses height and hash only for their exact selector arms', async () => {
		const heightSelector = {
			$network: network,
			height: 2_000_000n,
		}
		getTreeState.mockResolvedValueOnce({
			height: Number(heightSelector.height),
			hash: 'height-response-hash',
			sapling: {
				commitments: 'sapling-tree',
			},
			orchard: {
				commitments: 'orchard-tree',
			},
		})
		const heightSnapshot = await blockResolver.resolve.NetworkHeight.resolve(
			heightSelector,
			resolverContext
		)
		expect(getTreeState).toHaveBeenCalledWith({
			block: Number(heightSelector.height),
		})
		expect(blockResolver.projections.$$zcashShieldedPoolStates(heightSnapshot)).toHaveLength(2)

		const hashSelector = {
			...heightSelector,
			hash: 'zcash-block-hash',
		}
		getTreeState.mockResolvedValueOnce({
			height: Number(hashSelector.height),
			hash: hashSelector.hash,
		})
		const hashSnapshot = await blockResolver.resolve.NetworkHeightHash.resolve(
			hashSelector,
			resolverContext
		)
		expect(getTreeState).toHaveBeenLastCalledWith({
			block: hashSelector.hash,
		})
		expect(blockResolver.projections.$$zcashShieldedPoolStates(hashSnapshot)
			.map((state) => state[EntityMetaKey.Selector].$block)
		).toEqual([
			hashSelector,
			hashSelector,
		])
	})

	it('rejects height and hash identity mismatches independently', async () => {
		getTreeState.mockResolvedValueOnce({
			height: 2_000_001,
			hash: 'height-response-hash',
		})
		await expect(blockResolver.resolve.NetworkHeight.resolve({
			$network: network,
			height: 2_000_000n,
		}, resolverContext)).rejects.toThrow('returned a different block')

		getTreeState.mockResolvedValueOnce({
			height: 2_000_000,
			hash: 'different-hash',
		})
		await expect(blockResolver.resolve.NetworkHeightHash.resolve({
			$network: network,
			height: 2_000_000n,
			hash: 'zcash-block-hash',
		}, resolverContext)).rejects.toThrow('returned a different block')
	})
})


const transactionResolver = zcashdResolvers.resolvers.find((resolver) => (
	resolver.entityType === EntityType.UtxoTransaction
))
const inputResolver = zcashdResolvers.resolvers.find((resolver) => (
	resolver.entityType === EntityType.UtxoInput
))
const outputResolver = zcashdResolvers.resolvers.find((resolver) => (
	resolver.entityType === EntityType.UtxoOutput
))

if (transactionResolver == null)
	throw new Error('Zcashd-JsonRpc spec missing UtxoTransaction resolver')

if (inputResolver == null || outputResolver == null)
	throw new Error('Zcashd-JsonRpc spec missing transparent input/output resolver')

describe('Zcashd transparent UTXO', () => {
	beforeEach(() => {
		getRawTransaction.mockReset()
	})

	it('projects transparent vin/vout selectors beside shielded actions', async () => {
		const txId = 'z'.repeat(64)
		getRawTransaction.mockResolvedValueOnce({
			txid: txId,
			hash: txId,
			version: 5,
			locktime: 0,
			expiryheight: 0,
			size: 300,
			vsize: 250,
			vin: [{
				txid: 'a'.repeat(64),
				vout: 0,
				scriptSig: {
					asm: 'input',
				},
				sequence: 1,
			}],
			vout: [{
				value: 0.5,
				n: 0,
				scriptPubKey: {
					asm: 'OP_DUP',
					hex: '76a914',
					type: 'pubkeyhash',
					address: 't1Example',
				},
			}],
			vShieldedSpend: [],
			vShieldedOutput: [],
		})
		const entitySelector = {
			$network: network,
			txId,
		}
		const transaction = await transactionResolver.resolve.NetworkTxId.resolve(
			entitySelector,
			resolverContext
		)
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
		expect(transactionResolver.projections.isCoinbase(transaction)).toBe(false)
	})

	it('resolves transparent input and output fields from getrawtransaction', async () => {
		const txId = 'b'.repeat(64)
		getRawTransaction.mockResolvedValue({
			txid: txId,
			hash: txId,
			version: 5,
			locktime: 0,
			expiryheight: 0,
			size: 200,
			vin: [{
				txid: 'c'.repeat(64),
				vout: 3,
				scriptSig: {
					asm: 'spent',
				},
				sequence: 0xffffffff,
			}],
			vout: [{
				value: 1.25,
				n: 0,
				scriptPubKey: {
					asm: 'OP_CHECKSIG',
					hex: 'ac',
					type: 'pubkeyhash',
					address: 't1Transparent',
				},
			}],
		})
		const $transaction = {
			$network: network,
			txId,
		}
		const input = await inputResolver.resolve.TransactionIndexInTransaction.resolve({
			$transaction,
			indexInTransaction: 0,
		}, resolverContext)
		const output = await outputResolver.resolve.TransactionIndexInTransaction.resolve({
			$transaction,
			indexInTransaction: 0,
		}, resolverContext)
		expect(inputResolver.projections.$spentOutput(input)).toEqual({
			[EntityMetaKey.Selector]: {
				$transaction: {
					$network: network,
					txId: 'c'.repeat(64),
				},
				indexInTransaction: 3,
			},
		})
		expect(outputResolver.projections.valueSats(output)).toBe(125_000_000n)
		expect(outputResolver.projections.$address(output)).toEqual({
			[EntityMetaKey.Selector]: {
				$network: network,
				address: 't1Transparent',
			},
		})
	})
})

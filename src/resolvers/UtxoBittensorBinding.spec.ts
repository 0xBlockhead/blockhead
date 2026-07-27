import { beforeEach, describe, expect, it, vi } from 'vitest'

import { bitcoinNetworkBySlug } from '$/constants/BitcoinNetwork.ts'
import { EntityType } from '$/schema/EntityType.ts'
import bitcoinCashNodeBindings from '$/sources/BitcoinCashNode/bindings.ts'
import bitcoinCoreBindings from '$/sources/BitcoinCore/bindings.ts'
import bittensorBindings from '$/sources/Bittensor/bindings.ts'
import { Source } from '$/sources/Source.ts'

const {
	getBitcoinCashRawTransaction,
	getBitcoinRawTransaction,
	getBittensorBlock,
} = vi.hoisted(() => ({
	getBitcoinCashRawTransaction: vi.fn(),
	getBitcoinRawTransaction: vi.fn(),
	getBittensorBlock: vi.fn(),
}))

vi.mock('$/sources/BitcoinCashNode/JsonRpc/queries.ts', () => ({
	getRawTransaction: getBitcoinCashRawTransaction,
}))

vi.mock('$/sources/BitcoinCore/JsonRpc/queries.ts', () => ({
	getRawTransaction: getBitcoinRawTransaction,
}))

vi.mock('$/sources/Bittensor/JsonRpc/queries.ts', () => ({
	getBlock: getBittensorBlock,
	getBlockHash: vi.fn(),
}))

const [
	{ default: bitcoinCashNodeResolvers },
	{ default: bitcoinCoreResolvers },
	{ default: bittensorResolvers },
] = await Promise.all([
	import('$/resolvers/BitcoinCashNode-JsonRpc.ts'),
	import('$/resolvers/BitcoinCore-JsonRpc.ts'),
	import('$/resolvers/Bittensor-JsonRpc.ts'),
])

const bitcoinNetwork = {
	caip2: bitcoinNetworkBySlug.bitcoin.caip2,
}
const bitcoinCashNetwork = {
	caip2: bitcoinNetworkBySlug['bitcoin-cash'].caip2,
}

describe('UTXO and Bittensor resolver binding ownership', () => {
	beforeEach(() => {
		vi.clearAllMocks()
	})

	it('passes the exact Bitcoin Core mainnet binding to transport', async () => {
		getBitcoinRawTransaction.mockResolvedValueOnce({
			txid: 'bitcoin-transaction',
			version: 2,
			locktime: 0,
			size: 120,
			vsize: 100,
			weight: 400,
			vin: [],
		})

		await bitcoinCoreResolvers.resolvers.find((resolver) => (
			resolver.entityType === EntityType.UtxoTransaction
		))?.resolve['NetworkTxId'].resolve({
			$network: bitcoinNetwork,
			txId: 'bitcoin-transaction',
		})

		expect(getBitcoinRawTransaction).toHaveBeenCalledWith({
			txId: 'bitcoin-transaction',
		})
	})

	it('preserves Bitcoin Core CAIP-2-only network semantics', async () => {
		const resolver = bitcoinCoreResolvers.resolvers.find((candidate) => (
			candidate.entityType === EntityType.UtxoTransaction
		))
		if (resolver == null)
			throw new Error('Bitcoin Core transaction resolver is missing')

		await expect(resolver.resolve['NetworkTxId'].resolve({
			$network: {
				slug: 'bitcoin',
			},
			txId: 'bitcoin-transaction',
		})).rejects.toThrow('BitcoinCore_JsonRpc: unsupported Bitcoin network')
		expect(getBitcoinRawTransaction).not.toHaveBeenCalled()
	})

	it('passes the exact Bitcoin Cash mainnet binding to transport', async () => {
		getBitcoinCashRawTransaction.mockResolvedValueOnce({
			vout: [{
				value: 1,
				scriptPubKey: {
					asm: '',
					hex: '51',
					type: 'pubkey',
				},
			}],
		})

		await bitcoinCashNodeResolvers.resolvers.find((resolver) => (
			resolver.entityType === EntityType.UtxoOutput
		))?.resolve['TransactionIndexInTransaction'].resolve({
			$transaction: {
				$network: bitcoinCashNetwork,
				txId: 'bitcoin-cash-transaction',
			},
			indexInTransaction: 0,
		})

		expect(getBitcoinCashRawTransaction).toHaveBeenCalledWith({
			txId: 'bitcoin-cash-transaction',
		})
	})

	it('rejects foreign Bitcoin Cash networks before transport', async () => {
		const resolver = bitcoinCashNodeResolvers.resolvers.find((candidate) => (
			candidate.entityType === EntityType.UtxoOutput
		))
		if (resolver == null)
			throw new Error('Bitcoin Cash output resolver is missing')

		await expect(resolver.resolve['TransactionIndexInTransaction'].resolve({
			$transaction: {
				$network: bitcoinNetwork,
				txId: 'bitcoin-cash-transaction',
			},
			indexInTransaction: 0,
		})).rejects.toThrow('BitcoinCashNode_JsonRpc: unsupported network')
		expect(getBitcoinCashRawTransaction).not.toHaveBeenCalled()
	})

	it('passes the exact Bittensor mainnet binding to transport', async () => {
		getBittensorBlock.mockResolvedValueOnce({
			block: {
				header: {
					number: '0x1',
					parentHash: '0xparent',
					stateRoot: '0xstate',
					extrinsicsRoot: '0xextrinsics',
				},
				extrinsics: [],
			},
		})
		const resolver = bittensorResolvers.resolvers.find((candidate) => (
			candidate.entityType === EntityType.BittensorBlock
		))
		if (resolver == null)
			throw new Error('Bittensor block resolver is missing')

		await resolver.resolve['NetworkBlockNumberHash'].resolve({
			$network: {
				slug: 'bittensor',
			},
			blockNumber: 1n,
			hash: '0xblock',
		})

		expect(getBittensorBlock).toHaveBeenCalledWith({
			blockHash: '0xblock',
		})
	})

	it('rejects foreign Bittensor networks before transport', async () => {
		const resolver = bittensorResolvers.resolvers.find((candidate) => (
			candidate.entityType === EntityType.BittensorBlock
		))
		if (resolver == null)
			throw new Error('Bittensor block resolver is missing')

		await expect(resolver.resolve['NetworkBlockNumberHash'].resolve({
			$network: {
				slug: 'polkadot',
			},
			blockNumber: 1n,
			hash: '0xblock',
		})).rejects.toThrow('Bittensor_JsonRpc: unsupported network')
		expect(getBittensorBlock).not.toHaveBeenCalled()
	})
})

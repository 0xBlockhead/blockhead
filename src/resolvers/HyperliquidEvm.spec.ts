import {
	beforeEach,
	describe,
	expect,
	it,
	vi,
} from 'vitest'

import {
	EntityMetaKey,
	entityFieldAddressKey,
} from '$/schema/$schema.ts'
import { EntityType } from '$/schema/EntityType.ts'
import { Source } from '$/sources/Source.ts'

const getBlockByNumber = vi.hoisted(() => vi.fn())
const getBlockNumber = vi.hoisted(() => vi.fn())
const getTransactionByHash = vi.hoisted(() => vi.fn())
const getTransactionReceipt = vi.hoisted(() => vi.fn())

vi.mock('$/sources/Hyperliquid/JsonRpc/queries.ts', () => ({
	getBlockByNumber,
	getBlockNumber,
	getTransactionByHash,
	getTransactionReceipt,
}))

const { hyperliquidEvmResolvers } = await import('$/resolvers/HyperliquidEvm.ts')

const [
	blockResolver,
	transactionResolver,
] = hyperliquidEvmResolvers
const network = {
	slug: 'hyperliquid',
}
const blockHash = `0x${'a'.repeat(64)}`
const transactionHash = `0x${'b'.repeat(64)}`
const accountAddress = `0x${'c'.repeat(40)}`
const transaction = {
	hash: transactionHash.toUpperCase(),
	blockNumber: '0x10',
	blockHash: blockHash.toUpperCase(),
	transactionIndex: '0x0',
	from: accountAddress.toUpperCase(),
	to: null,
	value: '0x0',
	nonce: '0x0',
	input: '0x',
	gas: '0x5208',
	r: '0x1',
	s: '0x2',
}
const block = {
	number: '0x10',
	hash: blockHash.toUpperCase(),
	parentHash: `0x${'d'.repeat(64)}`,
	timestamp: '0x6553f100',
	miner: accountAddress,
	gasUsed: '0x0',
	gasLimit: '0x0',
	transactions: [transaction],
}
const receipt = {
	transactionHash,
	status: '0x1',
}

describe('Hyperliquid EVM resolvers', () => {
	beforeEach(() => {
		vi.restoreAllMocks()
		getBlockByNumber.mockReset()
		getBlockNumber.mockReset()
		getTransactionByHash.mockReset()
		getTransactionReceipt.mockReset()
		getBlockByNumber.mockResolvedValue(block)
		getBlockNumber.mockResolvedValue('0x10')
		getTransactionByHash.mockResolvedValue(transaction)
		getTransactionReceipt.mockResolvedValue(receipt)
	})

	it('normalizes block transaction identities only after verifying their block', async () => {
		const snapshot = await blockResolver.resolve.Height.resolve({
			$network: network,
			height: 16n,
		})

		expect(blockResolver.projections.hash(snapshot)).toBe(blockHash)
		const transactions = blockResolver.projections.$$transactions(snapshot)
		expect(transactions).toHaveLength(1)
		expect(transactions[0]?.[EntityMetaKey.Selector]).toMatchObject({
			$network: network,
			txHash: transactionHash,
		})
	})

	it('rejects block and transaction response identities that do not match the request', async () => {
		getBlockByNumber.mockResolvedValueOnce({
			...block,
			number: '0x11',
		})
		await expect(blockResolver.resolve.Height.resolve({
			$network: network,
			height: 16n,
		})).rejects.toThrow('block height does not match request')

		getTransactionByHash.mockResolvedValueOnce({
			...transaction,
			hash: `0x${'e'.repeat(64)}`,
		})
		await expect(transactionResolver.resolve.NetworkTxHash.resolve({
			$network: network,
			txHash: transactionHash,
		})).rejects.toThrow('transaction hash does not match request')
	})

	it('materializes complete transaction state without arbitrary timestamp resolution', async () => {
		vi.spyOn(Date, 'now').mockReturnValue(1_700_000_000_000)

		const snapshot = await transactionResolver.resolve.NetworkTxHash.resolve({
			$network: network,
			txHash: transactionHash,
		})
		expect(transactionResolver.projections.$$timestamps(snapshot)).toEqual([{
			[EntityMetaKey.Selector]: {
				$transaction: {
					$network: network,
					txHash: transactionHash,
				},
				timestampMs: 1_700_000_000_000,
				source: Source.Hyperliquid,
			},
			[EntityMetaKey.Fields]: {
				[entityFieldAddressKey(EntityType.HyperliquidTransaction_Timestamp, [], 'status')]: 'success',
				[entityFieldAddressKey(EntityType.HyperliquidTransaction_Timestamp, [], 'blockNumber')]: 16n,
			},
		}])
		expect(hyperliquidEvmResolvers.find((resolver) => (
			resolver.entityType === EntityType.HyperliquidTransaction_Timestamp
		))).toBeUndefined()
	})
})

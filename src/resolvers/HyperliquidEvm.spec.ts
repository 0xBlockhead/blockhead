import {
	beforeEach,
	describe,
	expect,
	it,
	vi,
} from 'vitest'

import { EntityMetaKey } from '$/schema/$schema.ts'
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
,
	transactionTimestampResolver,
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
		getTransactionReceipt.mockResolvedValue({
			transactionHash: transactionHash.toUpperCase(),
			transactionIndex: '0x0',
			blockHash,
			blockNumber: '0x10',
			from: accountAddress,
			gasUsed: '0x0',
			cumulativeGasUsed: '0x0',
			effectiveGasPrice: '0x0',
			logs: [],
			logsBloom: '0x',
			status: '0x1',
		})
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

	it('rejects a receipt for another transaction before projecting status', async () => {
		getTransactionReceipt.mockResolvedValueOnce({
			transactionHash: `0x${'f'.repeat(64)}`,
			transactionIndex: '0x0',
			blockHash,
			blockNumber: '0x10',
			from: accountAddress,
			gasUsed: '0x0',
			cumulativeGasUsed: '0x0',
			effectiveGasPrice: '0x0',
			logs: [],
			logsBloom: '0x',
		})

		await expect(transactionTimestampResolver.resolve.TransactionTimestampMsSource.resolve({
			$transaction: {
				$network: network,
				txHash: transactionHash,
			},
			timestampMs: Date.now(),
			source: Source.Hyperliquid,
		})).rejects.toThrow('receipt hash does not match transaction')
	})
})

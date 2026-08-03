import {
	beforeEach,
	describe,
	expect,
	it,
	vi,
} from 'vitest'

import bindings from '$/sources/Voltaire/bindings.ts'
import { Source } from '$/sources/Source.ts'

const jsonRpc2 = vi.hoisted(() => vi.fn())

vi.mock('$/sources/_shared/wire/JsonRpc2/client.ts', () => ({
	jsonRpc2,
}))

const binding = bindings[Source.Voltaire_JsonRpc][0]
const endpoint = binding.endpoints[0]
const { evmExecutionJsonRpc } = await import('$/sources/_shared/interfaces/EvmExecutionJsonRpc/queries.ts')
const {
	getBlockByHash,
	getBlockByNumber,
	getTransactionByHash,
	getTransactionReceipt,
} = evmExecutionJsonRpc({
	binding,
	endpoint,
})

const block = {
	number: '0x2a',
	hash: '0xblock',
	parentHash: '0xparent',
	timestamp: '0x1',
	miner: '0xminer',
	gasUsed: '0x2',
	gasLimit: '0x3',
	transactions: ['0xtransaction'],
}
const transaction = {
	hash: '0xtransaction',
	blockHash: null,
	blockNumber: null,
	transactionIndex: null,
	from: '0xfrom',
	to: null,
	value: '0x1',
	nonce: '0x2',
	input: '0x',
	gas: '0x5208',
	r: '0xr',
	s: '0xs',
}
const blockWithTransactions = {
	...block,
	transactions: [transaction],
}
const receipt = {
	transactionHash: '0xtransaction',
	transactionIndex: '0x0',
	blockHash: '0xblock',
	blockNumber: '0x2a',
	from: '0xfrom',
	status: '0x1',
	gasUsed: '0x2',
	cumulativeGasUsed: '0x3',
	effectiveGasPrice: '0x4',
	logsBloom: '0xbloom',
	logs: [{
		transactionHash: '0xtransaction',
		logIndex: '0x0',
		removed: false,
	}],
}

describe('shared EVM execution JSON-RPC queries', () => {
	beforeEach(() => {
		jsonRpc2.mockReset()
	})

	it('forwards each exact request and narrows its result', async () => {
		jsonRpc2
			.mockResolvedValueOnce(blockWithTransactions)
			.mockResolvedValueOnce(block)
			.mockResolvedValueOnce(transaction)
			.mockResolvedValueOnce(receipt)

		await expect(getBlockByNumber({
			blockNumber: 42n,
			txObjects: true,
		})).resolves.toEqual(blockWithTransactions)
		await expect(getBlockByHash({
			blockHash: '0xblock',
			txObjects: false,
		})).resolves.toEqual(block)
		await expect(getTransactionByHash({
			txHash: '0xtransaction',
		})).resolves.toMatchObject(transaction)
		await expect(getTransactionReceipt({
			txHash: '0xtransaction',
		})).resolves.toMatchObject(receipt)

		expect(jsonRpc2.mock.calls).toEqual([
			[
				binding,
				'eth_getBlockByNumber',
				[
					'0x2a',
					true,
				],
				endpoint,
			],
			[
				binding,
				'eth_getBlockByHash',
				[
					'0xblock',
					false,
				],
				endpoint,
			],
			[
				binding,
				'eth_getTransactionByHash',
				['0xtransaction'],
				endpoint,
			],
			[
				binding,
				'eth_getTransactionReceipt',
				['0xtransaction'],
				endpoint,
			],
		])
	})

	it('uses one injected request capability for every bound scalar and structured query', async () => {
		const request = vi.fn()
			.mockResolvedValueOnce('0x20000000000001')
			.mockResolvedValueOnce('0x2a')
			.mockResolvedValueOnce('0x3')
			.mockResolvedValueOnce({
				oldestBlock: '0x20',
				baseFeePerGas: ['0x1', '0x2'],
				gasUsedRatio: [0.5],
				baseFeePerBlobGas: ['0x3'],
				blobGasUsedRatio: [0.25],
				reward: [['0x4']],
			})
			.mockResolvedValueOnce('0xstorage')
			.mockResolvedValueOnce('0xcode')
			.mockResolvedValueOnce('0xcall')
			.mockResolvedValueOnce({
				pending: '0x5',
				queued: '0x6',
			})
		const client = evmExecutionJsonRpc({
			binding,
			request,
		})

		await expect(client.getBlockNumber()).resolves.toBe(0x20000000000001n)
		await expect(client.getGasPrice()).resolves.toBe('0x2a')
		await expect(client.getMaxPriorityFeePerGas()).resolves.toBe('0x3')
		await expect(client.getFeeHistory({
			blockCount: 1,
			newestBlock: 32n,
			rewardPercentiles: [50],
		})).resolves.toEqual({
			oldestBlock: '0x20',
			baseFeePerGas: ['0x1', '0x2'],
			gasUsedRatio: [0.5],
			baseFeePerBlobGas: ['0x3'],
			blobGasUsedRatio: [0.25],
			reward: [['0x4']],
		})
		await expect(client.getStorageAt({
			address: '0xaddress',
			slotQuantityHex: '0x0',
		})).resolves.toBe('0xstorage')
		await expect(client.getCode({ address: '0xaddress' })).resolves.toBe('0xcode')
		await expect(client.getCall({
			to: '0xaddress',
			data: '0xdata',
		})).resolves.toBe('0xcall')
		await expect(client.getTxpoolStatus()).resolves.toEqual({
			pending: '0x5',
			queued: '0x6',
		})

		expect(request.mock.calls).toEqual([
			['eth_blockNumber'],
			['eth_gasPrice'],
			['eth_maxPriorityFeePerGas'],
			[
				'eth_feeHistory',
				[
					'0x1',
					'0x20',
					[50],
				],
			],
			[
				'eth_getStorageAt',
				[
					'0xaddress',
					'0x0',
					'latest',
				],
			],
			[
				'eth_getCode',
				[
					'0xaddress',
					'latest',
				],
			],
			[
				'eth_call',
				[
					{
						to: '0xaddress',
						data: '0xdata',
					},
					'latest',
				],
			],
			[
				'txpool_status',
				[],
			],
		])
	})

	it('rejects block transaction representations that contradict txObjects', async () => {
		jsonRpc2
			.mockResolvedValueOnce(block)
			.mockResolvedValueOnce(blockWithTransactions)
			.mockResolvedValueOnce(block)
			.mockResolvedValueOnce(blockWithTransactions)

		await expect(getBlockByNumber({
			blockNumber: 42n,
			txObjects: true,
		})).rejects.toThrow('malformed transaction representation')
		await expect(getBlockByNumber({
			blockNumber: 42n,
			txObjects: false,
		})).rejects.toThrow('malformed transaction representation')
		await expect(getBlockByHash({
			blockHash: '0xblock',
			txObjects: true,
		})).rejects.toThrow('malformed transaction representation')
		await expect(getBlockByHash({
			blockHash: '0xblock',
			txObjects: false,
		})).rejects.toThrow('malformed transaction representation')
	})

	it('preserves null results', async () => {
		jsonRpc2.mockResolvedValue(null)

		await expect(Promise.all([
			getBlockByNumber({
				blockNumber: 42n,
				txObjects: false,
			}),
			getBlockByHash({
				blockHash: '0xblock',
				txObjects: false,
			}),
			getTransactionByHash({
				txHash: '0xtransaction',
			}),
			getTransactionReceipt({
				txHash: '0xtransaction',
			}),
		])).resolves.toEqual([
			null,
			null,
			null,
			null,
		])
	})

	it.each([
		[
			'eth_getBlockByNumber',
			() => getBlockByNumber({
				blockNumber: 42n,
				txObjects: false,
			}),
		],
		[
			'eth_getBlockByHash',
			() => getBlockByHash({
				blockHash: '0xblock',
				txObjects: false,
			}),
		],
		[
			'eth_getTransactionByHash',
			() => getTransactionByHash({
				txHash: '0xtransaction',
			}),
		],
		[
			'eth_getTransactionReceipt',
			() => getTransactionReceipt({
				txHash: '0xtransaction',
			}),
		],
	] as const)('rejects a malformed non-null %s result', async (method, query) => {
		jsonRpc2.mockResolvedValue('malformed')

		await expect(query()).rejects.toThrow(
			`EVM execution JSON-RPC ${method}: malformed result`
		)
	})

	it.each([
		[
			'eth_getTransactionByHash',
			() => getTransactionByHash({
				txHash: '0xtransaction',
			}),
		],
		[
			'eth_getTransactionReceipt',
			() => getTransactionReceipt({
				txHash: '0xtransaction',
			}),
		],
	] as const)('rejects a non-null %s result missing required fields', async (method, query) => {
		jsonRpc2.mockResolvedValue({})

		await expect(query()).rejects.toThrow(
			`EVM execution JSON-RPC ${method}: malformed result`
		)
	})

	it('rejects a block containing a malformed full transaction', async () => {
		jsonRpc2.mockResolvedValue({
			...block,
			transactions: [{}],
		})

		await expect(getBlockByNumber({
			blockNumber: 42n,
			txObjects: true,
		})).rejects.toThrow(
			'EVM execution JSON-RPC eth_getBlockByNumber: malformed result'
		)
	})
})

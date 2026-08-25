import {
	beforeEach,
	describe,
	expect,
	expectTypeOf,
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

	it('uses one injected request capability and emits input-only execution calls', async () => {
		const dateNow = vi.spyOn(Date, 'now').mockReturnValue(1_700_000_000_123)
		const request = vi.fn()
			.mockResolvedValueOnce('0x20000000000001')
			.mockResolvedValueOnce({
				number: '0x1',
				hash: '0xhash',
				parentHash: '0xparent',
				miner: '0xminer',
				gasUsed: '0x0',
				gasLimit: '0x0',
				timestamp: '0x65a8',
				transactions: [],
			})
			.mockResolvedValueOnce('0x2a')
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
			.mockResolvedValueOnce('0x2a')
			.mockResolvedValueOnce('0xstorage')
			.mockResolvedValueOnce('0xcode')
			.mockResolvedValueOnce('0xcafe')
			.mockResolvedValueOnce('0x5208')
			.mockResolvedValueOnce({
				pending: '0x5',
				queued: '0x6',
			})
		const client = evmExecutionJsonRpc({
			binding,
			request,
		})

		expectTypeOf(client.getCall).returns.toEqualTypeOf<Promise<`0x${string}`>>()
		await expect(client.getBlockNumber()).resolves.toBe(0x20000000000001n)
		await expect(client.getPeerCountObservation()).resolves.toEqual({
			peerCount: 42,
			providerClockMs: 26_024_000,
			fetchedAtMs: 1_700_000_000_123,
		})
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
		await expect(client.getBalance({
			address: '0x0000000000000000000000000000000000000001',
			blockTag: '0x20',
		})).resolves.toBe('0x2a')
		await expect(client.getStorageAt({
			address: '0xaddress',
			slotQuantityHex: '0x0',
		})).resolves.toBe('0xstorage')
		await expect(client.getCode({ address: '0xaddress' })).resolves.toBe('0xcode')
		await expect(client.getCall({
			to: '0x0000000000000000000000000000000000000001',
			input: '0xdead',
		})).resolves.toBe('0xcafe')
		await expect(client.estimateGas({
			from: '0x0000000000000000000000000000000000000002',
			to: '0x0000000000000000000000000000000000000001',
			input: '0xdead',
			value: 1_000_000_000_000_000_000n,
		})).resolves.toBe(21_000n)
		await expect(client.getTxpoolStatus()).resolves.toEqual({
			pending: '0x5',
			queued: '0x6',
		})

		expect(request.mock.calls).toEqual([
			['eth_blockNumber'],
			[
				'eth_getBlockByNumber',
				[
					'latest',
					false,
				],
			],
			['net_peerCount'],
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
				'eth_getBalance',
				[
					'0x0000000000000000000000000000000000000001',
					'0x20',
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
						to: '0x0000000000000000000000000000000000000001',
						input: '0xdead',
					},
					'latest',
				],
			],
			[
				'eth_estimateGas',
				[
					{
						to: '0x0000000000000000000000000000000000000001',
						input: '0xdead',
						from: '0x0000000000000000000000000000000000000002',
						value: '0xde0b6b3a7640000',
					},
				],
			],
			[
				'txpool_status',
				[],
			],
		])
		dateNow.mockRestore()
	})

	it('rejects malformed or unsafe peer-count quantities before timestamping', async () => {
		const dateNow = vi.spyOn(Date, 'now')
		const block = {
			number: '0x1',
			hash: '0xhash',
			parentHash: '0xparent',
			miner: '0xminer',
			gasUsed: '0x0',
			gasLimit: '0x0',
			timestamp: '0x65a8',
			transactions: [],
		}
		const request = vi.fn()
			.mockResolvedValueOnce(block)
			.mockResolvedValueOnce('0x00')
			.mockResolvedValueOnce(block)
			.mockResolvedValueOnce('0x20000000000000')
		const client = evmExecutionJsonRpc({
			binding,
			request,
		})

		await expect(client.getPeerCountObservation()).rejects.toThrow('malformed QUANTITY result')
		await expect(client.getPeerCountObservation()).rejects.toThrow('peer count exceeds safe integer range')
		expect(dateNow).not.toHaveBeenCalled()
		dateNow.mockRestore()
	})

	it('rejects a malformed eth_call DATA result at the shared wire boundary', async () => {
		const client = evmExecutionJsonRpc({
			binding,
			request: vi.fn().mockResolvedValue('0xnot-hex'),
		})

		await expect(client.getCall({
			to: '0x0000000000000000000000000000000000000001',
			input: '0xdead',
		})).rejects.toThrow(
			'EVM execution JSON-RPC eth_call: malformed result'
		)
	})

	it('includes an explicit simulation block without changing the existing call default', async () => {
		const upstreamError = new Error('execution reverted')
		const request = vi.fn()
			.mockResolvedValueOnce('0x')
			.mockResolvedValueOnce('0x6000')
			.mockRejectedValueOnce(upstreamError)
		const client = evmExecutionJsonRpc({
			binding,
			request,
		})

		await expect(client.getCall({
			from: '0x0000000000000000000000000000000000000002',
			to: '0x0000000000000000000000000000000000000001',
			input: '0x',
			value: 0n,
			blockTag: 'pending',
		})).resolves.toBe('0x')
		await expect(client.estimateGas({
			to: '0x0000000000000000000000000000000000000001',
			input: '0x',
			blockTag: '0x2a',
		})).resolves.toBe(24_576n)
		await expect(client.estimateGas({
			to: '0x0000000000000000000000000000000000000001',
			input: '0x',
		})).rejects.toBe(upstreamError)

		expect(request.mock.calls).toEqual([
			[
				'eth_call',
				[
					{
						to: '0x0000000000000000000000000000000000000001',
						input: '0x',
						from: '0x0000000000000000000000000000000000000002',
						value: '0x0',
					},
					'pending',
				],
			],
			[
				'eth_estimateGas',
				[
					{
						to: '0x0000000000000000000000000000000000000001',
						input: '0x',
					},
					'0x2a',
				],
			],
			[
				'eth_estimateGas',
				[
					{
						to: '0x0000000000000000000000000000000000000001',
						input: '0x',
					},
				],
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

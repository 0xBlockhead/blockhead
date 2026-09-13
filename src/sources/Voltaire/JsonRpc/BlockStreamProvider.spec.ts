import { describe, expect, it, vi } from 'vitest'
import { BlockStream } from '@tevm/voltaire/block'

import { blockStreamProvider } from '$/sources/Voltaire/JsonRpc/BlockStreamProvider.ts'

const hash = (byte: string) => `0x${byte.repeat(64)}`

const rpcBlock = (number: bigint, hashByte: string, parentHashByte: string) => ({
	baseFeePerGas: '0x1',
	difficulty: '0x0',
	extraData: '0x',
	gasLimit: '0x1c9c380',
	gasUsed: '0x5208',
	hash: hash(hashByte),
	logsBloom: `0x${'00'.repeat(256)}`,
	miner: `0x${'11'.repeat(20)}`,
	mixHash: hash('2'),
	nonce: `0x${'00'.repeat(8)}`,
	number: `0x${number.toString(16)}`,
	parentHash: hash(parentHashByte),
	receiptsRoot: hash('3'),
	sha3Uncles: hash('4'),
	size: '0x1',
	stateRoot: hash('5'),
	timestamp: '0x65a8',
	totalDifficulty: '0x0',
	transactions: [],
	transactionsRoot: hash('6'),
})

describe('Voltaire block-stream provider boundary', () => {
	it('advances the installed block stream across canonically linked raw RPC blocks', async () => {
		const blocks = new Map([
			['0x1', rpcBlock(1n, 'a', '0')],
			['0x2', rpcBlock(2n, 'b', 'a')],
		])
		const request = vi.fn(async ({ method, params }: {
			method: string
			params?: readonly unknown[]
		}) => {
			if (method === 'eth_blockNumber') return '0x2'
			if (method === 'eth_getBlockByNumber')
				return blocks.get(String(params?.[0])) ?? null
			throw new Error(`Unexpected method ${method}`)
		})
		const abortController = new AbortController()
		const events = BlockStream({
			provider: blockStreamProvider({ request }),
		}).watch({
			fromBlock: 1n,
			include: 'transactions',
			pollingInterval: 1,
			signal: abortController.signal,
		})

		const initial = await events.next()
		const advanced = await events.next()
		expect(initial.value).toMatchObject({
			type: 'blocks',
			metadata: { chainHead: 1n },
		})
		expect(advanced.value).toMatchObject({
			type: 'blocks',
			metadata: { chainHead: 2n },
			blocks: [{ header: { number: 2n } }],
		})
		abortController.abort()
	})

	it('converts raw JSON-RPC blocks to the native shape used by the installed stream reconciler', async () => {
		const request = vi.fn(async ({ method }: { method: string }) => (
			method === 'eth_getBlockByNumber' ? rpcBlock(2n, 'a', 'b') : '0x2'
		))
		const provider = blockStreamProvider({ request })
		const block = await provider.request({
			method: 'eth_getBlockByNumber',
			params: ['0x2', true],
		})

		expect(block).toMatchObject({
			header: {
				number: 2n,
				timestamp: 0x65a8n,
			},
			body: { transactions: [] },
		})
		expect((block as { hash: Uint8Array }).hash).toEqual(
			Uint8Array.from({ length: 32 }, () => 0xaa)
		)
		await expect(provider.request({ method: 'eth_blockNumber' })).resolves.toBe('0x2')
	})

	it('preserves null blocks and rejects malformed block payloads', async () => {
		const provider = blockStreamProvider({
			request: vi.fn()
				.mockResolvedValueOnce(null)
				.mockResolvedValueOnce('not-a-block'),
		})

		await expect(provider.request({
			method: 'eth_getBlockByHash',
			params: [hash('a'), true],
		})).resolves.toBeNull()
		await expect(provider.request({
			method: 'eth_getBlockByHash',
			params: [hash('a'), true],
		})).rejects.toThrow('eth_getBlockByHash returned a malformed block')
	})
})

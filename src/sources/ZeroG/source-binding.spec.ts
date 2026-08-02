import { beforeEach, describe, expect, it, vi } from 'vitest'

import bindings from '$/sources/ZeroG/bindings.ts'
import { Source } from '$/sources/Source.ts'

const sourceFetch = vi.fn()
const sourceGetJson = vi.fn()

vi.mock('$/sources/_runtime/http.ts', () => ({
	firstHttpUrlForBinding: (binding: { endpoints: { locator: string }[] }) => binding.endpoints[0]?.locator,
	sourceFetch,
	sourceGetJson,
	sourceGetText: vi.fn(),
}))

const { getBlockNumber } = await import('$/sources/ZeroG/Chain/JsonRpc/queries.ts')
const { getInfo } = await import('$/sources/ZeroG/ChainScan/Rest/queries.ts')
const { getStatus } = await import('$/sources/ZeroG/StorageNode/JsonRpc/queries.ts')
const { getStorageMiner } = await import('$/sources/ZeroG/StorageScan/Rest/queries.ts')

describe('0G transport binding authority', () => {
	beforeEach(() => {
		sourceFetch.mockReset()
		sourceGetJson.mockReset()
	})

	it('routes chain and storage-node JSON-RPC through their exact bindings', async () => {
		sourceFetch.mockImplementation(async () => new Response(JSON.stringify({
				jsonrpc: '2.0',
				id: 1,
				result: '0x1',
			}), {
				status: 200,
			}))

		await getBlockNumber()
		await getStatus()

		expect(sourceFetch.mock.calls.map(([binding, url]) => [
			binding.source,
			url,
		])).toEqual([
			[
				Source.ZeroGChain_JsonRpc,
				'https://evmrpc.0g.ai',
			],
			[
				Source.ZeroGStorageNode_JsonRpc,
				'http://127.0.0.1:5678',
			],
		])
	})

	it('derives ChainScan identity and StorageScan requests from their exact bindings', async () => {
		sourceGetJson.mockResolvedValue({
			code: 0,
			message: 'ok',
			data: {
				balance: '1',
				totalReward: '2',
			},
		})

		expect(getInfo()).toEqual({
			url: 'https://chainscan.0g.ai',
			chainId: 16661,
			features: [
				'accounts',
				'blocks',
				'contracts',
				'transactions',
				'validators',
			],
		})
		await getStorageMiner({
			address: '0x0000000000000000000000000000000000000000',
		})

		expect(sourceGetJson).toHaveBeenCalledWith(
			bindings[Source.ZeroGStorageScan_Rest][0],
			'https://storagescan.0g.ai/api/miners/0x0000000000000000000000000000000000000000'
		)
	})
})

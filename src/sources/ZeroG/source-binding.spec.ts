import { beforeEach, describe, expect, it, vi } from 'vitest'

import bindings from '$/sources/ZeroG/bindings.ts'
import { Source } from '$/sources/Source.ts'

const sourceFetch = vi.fn()
const sourceGetJson = vi.fn()
const sourceGetText = vi.fn()

vi.mock('$/sources/_runtime/http.ts', () => ({
	firstHttpUrlForBinding: (binding: { endpoints: { locator: string }[] }) => binding.endpoints[0]?.locator,
	sourceFetch,
	sourceGetJson,
	sourceGetText,
}))

const { getBlockNumber } = await import('$/sources/ZeroG/Chain/JsonRpc/queries.ts')
const { getInfo, getExplorerIdentity } = await import('$/sources/ZeroG/ChainScan/Rest/queries.ts')
const { getStatus } = await import('$/sources/ZeroG/StorageNode/JsonRpc/queries.ts')
const { getStorageMiner, listStorageRewards } = await import('$/sources/ZeroG/StorageScan/Rest/queries.ts')

describe('0G transport binding authority', () => {
	beforeEach(() => {
		sourceFetch.mockReset()
		sourceGetJson.mockReset()
		sourceGetText.mockReset()
	})

	it('routes chain and storage-node JSON-RPC through their exact bindings', async () => {
		sourceFetch
			.mockResolvedValueOnce(new Response(JSON.stringify({
				jsonrpc: '2.0',
				id: 1,
				result: '0x1',
			}), {
				status: 200,
			}))
			.mockResolvedValueOnce(new Response(JSON.stringify({
				jsonrpc: '2.0',
				id: 1,
				result: {
					connectedPeers: 0,
					logSyncHeight: 1,
					logSyncBlock: '0x1',
					nextTxSeq: 1,
					networkIdentity: {
						chainId: 16661,
						flowAddress: '0x0000000000000000000000000000000000000001',
						p2pProtocolVersion: {
							major: 1,
							minor: 0,
							build: 0,
						},
					},
				},
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
		sourceGetJson
			.mockResolvedValueOnce({
				code: 0,
				message: 'ok',
				data: {
					balance: '1',
					totalReward: '2',
				},
			})
			.mockResolvedValueOnce({
				code: 0,
				message: 'ok',
				data: {
					total: 1,
					list: [{
						miner: '0x0000000000000000000000000000000000000001',
						reward: '1',
						blockNumber: 1,
						txHash: '0xc0096b77649851f5b2dcb484175fbcf727e71ce56ac7d692092dd5e4775187b8',
						timestamp: 1,
					}],
				},
			})
		sourceGetText.mockResolvedValueOnce(`# 0G ChainScan
- URL: https://chainscan.0g.ai
- Chain ID: 16661 (mainnet)
`)

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
		await expect(getExplorerIdentity()).resolves.toMatchObject({
			url: 'https://chainscan.0g.ai',
			chainId: 16661,
		})
		await getStorageMiner({
			address: '0x0000000000000000000000000000000000000000',
		})
		await listStorageRewards({
			limit: 1,
		})

		expect(sourceGetJson.mock.calls.map(([, url]) => url)).toEqual([
			'https://storagescan.0g.ai/api/miners/0x0000000000000000000000000000000000000000',
			'https://storagescan.0g.ai/api/rewards?limit=1',
		])
		expect(sourceGetJson.mock.calls[0]?.[0]).toBe(bindings[Source.ZeroGStorageScan_Rest][0])
	})
})

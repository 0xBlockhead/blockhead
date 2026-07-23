import { beforeEach, describe, expect, it, vi } from 'vitest'

import { substrateJsonRpc } from '$/sources/Substrate/JsonRpc/client.ts'
import {
	getAllMetagraphs,
	getMainnetRpcUrl,
	getNeuronLite,
	getNeuronsLite,
	getSubnetInfo,
} from '$/sources/Bittensor/JsonRpc/queries.ts'

vi.mock('$/sources/Substrate/JsonRpc/client.ts', () => ({
	substrateJsonRpc: vi.fn(),
}))

const substrateJsonRpcMock = vi.mocked(substrateJsonRpc)
const blockHash = `0x${'a'.repeat(64)}`

describe('Bittensor custom JSON-RPC SCALE transport', () => {
	beforeEach(() => {
		substrateJsonRpcMock.mockReset()
		substrateJsonRpcMock.mockResolvedValue([0, 1, 254, 255])
	})

	it('pins network and subnet observations to the requested block hash', async () => {
		await expect(getAllMetagraphs({
			rpcUrl: getMainnetRpcUrl,
			blockHash,
		})).resolves.toEqual([0, 1, 254, 255])
		expect(substrateJsonRpcMock).toHaveBeenLastCalledWith(expect.objectContaining({
			method: 'subnetInfo_getAllMetagraphs',
			params: [blockHash],
		}))

		await getSubnetInfo({
			rpcUrl: getMainnetRpcUrl,
			netuid: 65_535,
			blockHash,
		})
		expect(substrateJsonRpcMock).toHaveBeenLastCalledWith(expect.objectContaining({
			method: 'subnetInfo_getSubnetInfo',
			params: [
				65_535,
				blockHash,
			],
		}))
	})

	it('uses the official neuron RPC identities without signing state', async () => {
		await getNeuronsLite({
			rpcUrl: getMainnetRpcUrl,
			netuid: 1,
			blockHash,
		})
		expect(substrateJsonRpcMock).toHaveBeenLastCalledWith(expect.objectContaining({
			method: 'neuronInfo_getNeuronsLite',
			params: [
				1,
				blockHash,
			],
		}))

		await getNeuronLite({
			rpcUrl: getMainnetRpcUrl,
			netuid: 1,
			uid: 2,
			blockHash,
		})
		expect(substrateJsonRpcMock).toHaveBeenLastCalledWith(expect.objectContaining({
			method: 'neuronInfo_getNeuronLite',
			params: [
				1,
				2,
				blockHash,
			],
		}))
	})

	it.each([
		-1,
		65_536,
		1.5,
	])('rejects foreign or malformed subnet identity %s before transport', async (netuid) => {
		await expect(getSubnetInfo({
			rpcUrl: getMainnetRpcUrl,
			netuid,
		})).rejects.toThrow('unsigned 16-bit integer')
		expect(substrateJsonRpcMock).not.toHaveBeenCalled()
	})

	it('rejects non-canonical endpoints before transport', async () => {
		await expect(getSubnetInfo({
			rpcUrl: 'https://attacker.invalid',
			netuid: 1,
		})).rejects.toThrow('canonical mainnet RPC endpoint')
		expect(substrateJsonRpcMock).not.toHaveBeenCalled()
	})

	it('rejects malformed observation block identity before transport', async () => {
		await expect(getSubnetInfo({
			rpcUrl: getMainnetRpcUrl,
			netuid: 1,
			blockHash: '0x1234',
		})).rejects.toThrow('invalid observation block hash')
		expect(substrateJsonRpcMock).not.toHaveBeenCalled()
	})

	it.each([
		[256],
		[-1],
		[1.5],
		['0x00'],
	])('rejects malformed SCALE byte arrays', async (wire) => {
		substrateJsonRpcMock.mockResolvedValue(wire)
		await expect(getSubnetInfo({
			rpcUrl: getMainnetRpcUrl,
			netuid: 1,
		})).rejects.toThrow()
	})

	it('rejects unbounded aggregate SCALE responses', async () => {
		substrateJsonRpcMock.mockResolvedValue(new Array(16_777_217).fill(0))
		await expect(getAllMetagraphs({
			rpcUrl: getMainnetRpcUrl,
		})).rejects.toThrow('16777216 byte response limit')
	})
})

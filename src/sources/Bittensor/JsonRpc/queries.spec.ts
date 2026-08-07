import { beforeEach, describe, expect, it, vi } from 'vitest'

import { substrateJsonRpc } from '$/sources/_shared/interfaces/SubstrateJsonRpc/client.ts'
import bindings from '$/sources/Bittensor/bindings.ts'
import { Source } from '$/sources/Source.ts'
import {
	getAllDynamicInfo,
	getAllMetagraphs,
	getNeuronLite,
	getNeuronsLite,
	getSubnetHyperparams,
	getSubnetInfo,
} from '$/sources/Bittensor/JsonRpc/queries.ts'

vi.mock('$/sources/_shared/interfaces/SubstrateJsonRpc/client.ts', () => ({
	substrateJsonRpc: vi.fn(),
}))

const substrateJsonRpcMock = vi.mocked(substrateJsonRpc)
const blockHash = `0x${'a'.repeat(64)}`
const bittensorBinding = bindings[Source.Bittensor_JsonRpc][0]

describe('Bittensor custom JSON-RPC SCALE transport', () => {
	beforeEach(() => {
		substrateJsonRpcMock.mockReset()
		substrateJsonRpcMock.mockResolvedValue([0, 1, 254, 255])
	})

	it('pins network and subnet observations to the requested block hash', async () => {
		await expect(getAllMetagraphs({
			blockHash,
		})).resolves.toEqual([0, 1, 254, 255])
		expect(substrateJsonRpcMock).toHaveBeenLastCalledWith(expect.objectContaining({
			method: 'subnetInfo_getAllMetagraphs',
			params: [blockHash],
		}))

		await getSubnetInfo({
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

		await getSubnetHyperparams({
			netuid: 1,
			blockHash,
		})
		expect(substrateJsonRpcMock).toHaveBeenLastCalledWith(expect.objectContaining({
			method: 'subnetInfo_getSubnetHyperparams',
			params: [
				1,
				blockHash,
			],
		}))
	})

	it('uses the official neuron RPC identities without signing state', async () => {
		await getNeuronsLite({
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
			netuid,
		})).rejects.toThrow('invalid netuid')
		expect(substrateJsonRpcMock).not.toHaveBeenCalled()
	})

	it.each([
		-1,
		65_536,
		1.5,
	])('rejects foreign or malformed neuron uid %s before transport', async (uid) => {
		await expect(getNeuronLite({
			netuid: 1,
			uid,
		})).rejects.toThrow('invalid uid')
		expect(substrateJsonRpcMock).not.toHaveBeenCalled()
	})

	it('derives transport authority from the canonical source binding', async () => {
		await getSubnetInfo({
			netuid: 1,
		})
		expect(substrateJsonRpcMock).toHaveBeenCalledWith(expect.objectContaining({
			binding: bittensorBinding,
		}))
	})

	it('rejects malformed observation block identity before transport', async () => {
		await expect(getSubnetInfo({
			netuid: 1,
			blockHash: '0x1234',
		})).rejects.toThrow('invalid observation block hash')
		expect(substrateJsonRpcMock).not.toHaveBeenCalled()

		await expect(getAllDynamicInfo({
			blockHash: '0xgg',
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
			netuid: 1,
		})).rejects.toThrow('SCALE byte array')
	})

	it('rejects unbounded aggregate SCALE responses', async () => {
		substrateJsonRpcMock.mockResolvedValue(new Array(16_777_217).fill(0))
		await expect(getAllMetagraphs()).rejects.toThrow('16777216 byte response limit')
	})

	it('rejects unbounded subnet neuron SCALE responses', async () => {
		substrateJsonRpcMock.mockResolvedValue(new Array(4_194_305).fill(0))
		await expect(getNeuronsLite({
			netuid: 1,
		})).rejects.toThrow('4194304 byte response limit')
	})
})

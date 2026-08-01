import { beforeEach, describe, expect, it, vi } from 'vitest'

import bindings from '$/sources/Avail/bindings.ts'
import { Source } from '$/sources/Source.ts'
import {
	getBlockHash,
	getFinalizedHead,
	getHeader,
	getNetworkIdentity,
} from '$/sources/Avail/JsonRpc/queries.ts'
import { jsonRpc2 } from '$/sources/_shared/wire/JsonRpc2/client.ts'

vi.mock('$/sources/_shared/wire/JsonRpc2/client.ts', () => ({
	jsonRpc2: vi.fn(),
}))

const binding = bindings[Source.Avail]
const publicEnv = {
	PUBLIC_AVAIL_RPC_URL: 'https://example.com',
}
const resolvedBinding = {
	...binding,
	endpoints: binding.endpoints.map((endpoint) => ({
		...endpoint,
		locator: publicEnv.PUBLIC_AVAIL_RPC_URL,
	})),
}

const jsonRpc2Mock = vi.mocked(jsonRpc2)
const hash = `0x${'a'.repeat(64)}`
const parentHash = `0x${'b'.repeat(64)}`
const genesisHash = '0xb91746b45e0346cc2f815a520b9c6cb4d5c0902af848db0a80f85932d2e8276a'
const headerWire = {
	parentHash,
	number: '0xffffffff',
	stateRoot: hash,
	extrinsicsRoot: parentHash,
	digest: {
		logs: ['0x0642414245'],
	},
}

describe('Avail mainnet read-only JSON-RPC contracts', () => {
	beforeEach(() => {
		jsonRpc2Mock.mockReset()
	})

	it('pins mainnet identity to chain name and genesis hash', async () => {
		jsonRpc2Mock
			.mockResolvedValueOnce('Avail DA Mainnet')
			.mockResolvedValueOnce(genesisHash)

		await expect(getNetworkIdentity(publicEnv)).resolves.toEqual({
			chainName: 'Avail DA Mainnet',
			genesisHash,
		})
		expect(jsonRpc2Mock).toHaveBeenNthCalledWith(
			1,
			resolvedBinding,
			'system_chain',
			[]
		)
		expect(jsonRpc2Mock).toHaveBeenNthCalledWith(
			2,
			resolvedBinding,
			'chain_getBlockHash',
			[0]
		)
	})

	it('marks only the finalized-head path as finalized', async () => {
		jsonRpc2Mock
			.mockResolvedValueOnce(hash)
			.mockResolvedValueOnce(headerWire)
		await expect(getFinalizedHead(publicEnv)).resolves.toMatchObject({
			hash,
			blockNumber: 4_294_967_295n,
			finalized: true,
		})

		jsonRpc2Mock.mockResolvedValueOnce(headerWire)
		await expect(getHeader(
			publicEnv,
			hash
		)).resolves.toMatchObject({
			hash,
			finalized: false,
		})
	})

	it('keeps block numbers bounded and lossless at the JSON-RPC boundary', async () => {
		jsonRpc2Mock.mockResolvedValue(hash)
		await expect(getBlockHash(
			publicEnv,
			4_294_967_295n
		)).resolves.toBe(hash)
		expect(jsonRpc2Mock).toHaveBeenCalledWith(
			resolvedBinding,
			'chain_getBlockHash',
			[4_294_967_295]
		)

		jsonRpc2Mock.mockClear()
		await expect(getBlockHash(
			publicEnv,
			4_294_967_296n
		)).rejects.toThrow('unsigned 32-bit integer')
		expect(jsonRpc2Mock).not.toHaveBeenCalled()
	})

	it('uses the official empty-parameter form for the latest block hash', async () => {
		jsonRpc2Mock.mockResolvedValue(hash)
		await expect(getBlockHash(publicEnv)).resolves.toBe(hash)
		expect(jsonRpc2Mock).toHaveBeenCalledWith(
			resolvedBinding,
			'chain_getBlockHash',
			[]
		)
	})

	it('rejects foreign network and malformed response identities', async () => {
		jsonRpc2Mock
			.mockResolvedValueOnce('Avail Turing Testnet')
			.mockResolvedValueOnce(genesisHash)
		await expect(getNetworkIdentity(publicEnv)).rejects.toThrow('foreign chain name')

		jsonRpc2Mock.mockResolvedValueOnce({
			...headerWire,
			parentHash: 'short',
		})
		await expect(getHeader(publicEnv)).rejects.toThrow('invalid parent block hash')
	})

	it.each([
		'short',
		`0x${'g'.repeat(64)}`,
	])('rejects malformed block hash %s before transport', async (blockHash) => {
		await expect(getHeader(
			publicEnv,
			blockHash
		)).rejects.toThrow('invalid block hash')
		expect(jsonRpc2Mock).not.toHaveBeenCalled()
	})
})

import { beforeEach, describe, expect, it, vi } from 'vitest'

import { sourceProviderDefinitions } from '$/sources/$sourceProviders.ts'
import { Source } from '$/sources/Source.ts'
import {
	getBlockHash,
	getFinalizedHead,
	getHeader,
	getNetworkIdentity,
	getRuntimeVersion,
} from '$/sources/Avail/JsonRpc/queries.ts'
import { jsonRpc2 } from '$/sources/_shared/wire/JsonRpc2/client.ts'

vi.mock('$/sources/_shared/wire/JsonRpc2/client.ts', () => ({
	jsonRpc2: vi.fn(),
}))

const binding = sourceProviderDefinitions
	.flatMap((provider) => provider.bindings)
	.find((candidate) => candidate.source === Source.Avail_JsonRpc)

if (binding == null)
	throw new Error('Avail JSON-RPC binding is not registered')

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

		await expect(getNetworkIdentity(binding)).resolves.toEqual({
			chainName: 'Avail DA Mainnet',
			genesisHash,
		})
		expect(jsonRpc2Mock).toHaveBeenNthCalledWith(
			1,
			binding,
			'system_chain',
			[]
		)
		expect(jsonRpc2Mock).toHaveBeenNthCalledWith(
			2,
			binding,
			'chain_getBlockHash',
			[0]
		)
	})

	it('marks only the finalized-head path as finalized', async () => {
		jsonRpc2Mock
			.mockResolvedValueOnce(hash)
			.mockResolvedValueOnce(headerWire)
		await expect(getFinalizedHead(binding)).resolves.toMatchObject({
			hash,
			blockNumber: 4_294_967_295n,
			finalized: true,
		})

		jsonRpc2Mock.mockResolvedValueOnce(headerWire)
		await expect(getHeader(
			binding,
			hash
		)).resolves.toMatchObject({
			hash,
			finalized: false,
		})
	})

	it('keeps block numbers bounded and lossless at the JSON-RPC boundary', async () => {
		jsonRpc2Mock.mockResolvedValue(hash)
		await expect(getBlockHash(
			binding,
			4_294_967_295n
		)).resolves.toBe(hash)
		expect(jsonRpc2Mock).toHaveBeenCalledWith(
			binding,
			'chain_getBlockHash',
			[4_294_967_295]
		)

		jsonRpc2Mock.mockClear()
		await expect(getBlockHash(
			binding,
			4_294_967_296n
		)).rejects.toThrow('unsigned 32-bit integer')
		expect(jsonRpc2Mock).not.toHaveBeenCalled()
	})

	it('pins runtime provenance to an explicit block hash', async () => {
		jsonRpc2Mock.mockResolvedValue({
			specName: 'data-avail',
			implName: 'avail',
			authoringVersion: 1,
			specVersion: 9_007_199_254_740_991,
			implVersion: 2,
			transactionVersion: 3,
			stateVersion: 1,
		})
		await expect(getRuntimeVersion(
			binding,
			hash
		)).resolves.toMatchObject({
			specVersion: 9_007_199_254_740_991n,
		})
		expect(jsonRpc2Mock).toHaveBeenCalledWith(
			binding,
			'state_getRuntimeVersion',
			[hash]
		)
	})

	it('rejects foreign network and malformed response identities', async () => {
		jsonRpc2Mock
			.mockResolvedValueOnce('Avail Turing Testnet')
			.mockResolvedValueOnce(genesisHash)
		await expect(getNetworkIdentity(binding)).rejects.toThrow('foreign chain name')

		jsonRpc2Mock.mockResolvedValueOnce({
			...headerWire,
			parentHash: 'short',
		})
		await expect(getHeader(binding)).rejects.toThrow('invalid parent block hash')
	})

	it.each([
		'short',
		`0x${'g'.repeat(64)}`,
	])('rejects malformed block hash %s before transport', async (blockHash) => {
		await expect(getHeader(
			binding,
			blockHash
		)).rejects.toThrow('invalid block hash')
		expect(jsonRpc2Mock).not.toHaveBeenCalled()
	})
})

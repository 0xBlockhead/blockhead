import { beforeEach, describe, expect, it, vi } from 'vitest'

import bindings from '$/sources/Avail/bindings.ts'
import { Source } from '$/sources/Source.ts'
import {
	getBlock,
	getBlockHash,
	getFinalizedHead,
	getHeader,
	getHeaderByBlockNumber,
	getNetworkIdentity,
	getSystemHealth,
	getSystemSyncState,
} from '$/sources/Avail/JsonRpc/queries.ts'
import { jsonRpc2 } from '$/sources/_shared/wire/JsonRpc2/client.ts'

vi.mock('$/sources/_shared/wire/JsonRpc2/client.ts', () => ({
	jsonRpc2: vi.fn(),
}))

const binding = bindings[Source.Avail][0]
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

	it('passes only the caller-provided noncanonical binding to JSON-RPC', async () => {
		const modifiedBinding = {
			...binding,
			endpoints: binding.endpoints.map((endpoint) => ({
				...endpoint,
				locator: 'https://noncanonical.example/avail',
			})),
		}
		jsonRpc2Mock.mockResolvedValueOnce(hash)

		await getBlockHash(modifiedBinding, {})

		expect(jsonRpc2Mock).toHaveBeenCalledOnce()
		expect(jsonRpc2Mock.mock.calls[0][0]).toBe(modifiedBinding)
		expect(jsonRpc2Mock.mock.calls[0][0].endpoints[0].locator).toBe('https://noncanonical.example/avail')
	})

	it('pins mainnet identity to chain name and genesis hash', async () => {
		jsonRpc2Mock
			.mockResolvedValueOnce('Avail DA Mainnet')
			.mockResolvedValueOnce(genesisHash)

		await expect(getNetworkIdentity(binding, publicEnv)).resolves.toEqual({
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
		await expect(getFinalizedHead(binding, publicEnv)).resolves.toMatchObject({
			hash,
			blockNumber: 4_294_967_295n,
			finalized: true,
		})

		jsonRpc2Mock.mockResolvedValueOnce(headerWire)
		await expect(getHeader(binding,
			publicEnv,
			hash
		)).resolves.toMatchObject({
			hash,
			finalized: false,
		})
	})

	it('keeps block numbers bounded and lossless at the JSON-RPC boundary', async () => {
		jsonRpc2Mock.mockResolvedValue(hash)
		await expect(getBlockHash(binding,
			publicEnv,
			4_294_967_295n
		)).resolves.toBe(hash)
		expect(jsonRpc2Mock).toHaveBeenCalledWith(
			resolvedBinding,
			'chain_getBlockHash',
			[4_294_967_295]
		)

		jsonRpc2Mock.mockClear()
		await expect(getBlockHash(binding,
			publicEnv,
			4_294_967_296n
		)).rejects.toThrow('unsigned 32-bit integer')
		expect(jsonRpc2Mock).not.toHaveBeenCalled()
	})

	it('uses the official empty-parameter form for the latest block hash', async () => {
		jsonRpc2Mock.mockResolvedValue(hash)
		await expect(getBlockHash(binding, publicEnv)).resolves.toBe(hash)
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
		await expect(getNetworkIdentity(binding, publicEnv)).rejects.toThrow('foreign chain name')

		jsonRpc2Mock.mockResolvedValueOnce({
			...headerWire,
			parentHash: 'short',
		})
		await expect(getHeader(binding, publicEnv)).rejects.toThrow('invalid parent block hash')
	})

	it.each([
		'short',
		`0x${'g'.repeat(64)}`,
	])('rejects malformed block hash %s before transport', async (blockHash) => {
		await expect(getHeader(binding,
			publicEnv,
			blockHash
		)).rejects.toThrow('invalid block hash')
		expect(jsonRpc2Mock).not.toHaveBeenCalled()
	})

	it('loads signed blocks with extrinsic counts and system health', async () => {
		jsonRpc2Mock
			.mockResolvedValueOnce({
				block: {
					header: headerWire,
					extrinsics: [
						'0x00',
						'0x01',
					],
				},
			})
		await expect(getBlock(binding,
			publicEnv,
			hash
		)).resolves.toMatchObject({
			hash,
			blockNumber: 4_294_967_295n,
			extrinsicCount: 2,
		})

		jsonRpc2Mock.mockResolvedValueOnce({
			peers: 12,
			isSyncing: false,
			shouldHavePeers: true,
		})
		await expect(getSystemHealth(binding, publicEnv)).resolves.toEqual({
			peers: 12,
			isSyncing: false,
			shouldHavePeers: true,
		})

		jsonRpc2Mock.mockResolvedValueOnce({
			startingBlock: 0,
			currentBlock: 10,
			highestBlock: 12,
		})
		await expect(getSystemSyncState(binding, publicEnv)).resolves.toEqual({
			startingBlock: 0n,
			currentBlock: 10n,
			highestBlock: 12n,
		})
	})

	it('resolves headers by block number through hash then header', async () => {
		jsonRpc2Mock
			.mockResolvedValueOnce(hash)
			.mockResolvedValueOnce(headerWire)
		await expect(getHeaderByBlockNumber(binding,
			publicEnv,
			4_294_967_295n
		)).resolves.toMatchObject({
			hash,
			blockNumber: 4_294_967_295n,
		})
	})

	it('fails closed on malformed health and block envelopes', async () => {
		jsonRpc2Mock.mockResolvedValueOnce({
			peers: -1,
			isSyncing: false,
			shouldHavePeers: true,
		})
		await expect(getSystemHealth(binding, publicEnv)).rejects.toThrow(
			'Avail: invalid system_health response envelope'
		)

		jsonRpc2Mock.mockResolvedValueOnce({
			block: {
				header: headerWire,
				extrinsics: ['not-hex'],
			},
		})
		await expect(getBlock(binding,
			publicEnv,
			hash
		)).rejects.toThrow('invalid extrinsic encoding')

		jsonRpc2Mock.mockResolvedValueOnce({
			parentHash,
			number: '0x1',
			stateRoot: hash,
			// missing extrinsicsRoot + digest
		})
		await expect(getHeader(binding, publicEnv)).rejects.toThrow(
			'Avail: invalid chain_getHeader response envelope'
		)
	})
})

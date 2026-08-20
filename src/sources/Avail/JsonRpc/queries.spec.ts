import { beforeEach, describe, expect, it, vi } from 'vitest'

import bindings from '$/sources/Avail/bindings.ts'
import { Source } from '$/sources/Source.ts'
import { SourceDelivery } from '$/sources/SourceBinding.ts'
import {
	getBlock,
	getBlockHash,
	getBlockTimestamp,
	getDataProof,
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

	it('delivers the non-CORS public endpoint through the HTTP proxy', () => {
		expect(binding.delivery).toBe(SourceDelivery.HttpProxy)
		expect(binding.endpoints[0].corsEnabled).toBe(false)
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
		await expect(getBlock(
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
		await expect(getSystemHealth(publicEnv)).resolves.toEqual({
			peers: 12,
			isSyncing: false,
			shouldHavePeers: true,
		})

		jsonRpc2Mock.mockResolvedValueOnce({
			startingBlock: 0,
			currentBlock: 10,
			highestBlock: 12,
		})
		await expect(getSystemSyncState(publicEnv)).resolves.toEqual({
			startingBlock: 0n,
			currentBlock: 10n,
			highestBlock: 12n,
		})
	})

	it('reads the runtime timestamp at the exact block hash', async () => {
		jsonRpc2Mock.mockResolvedValueOnce('0x407df51ea0010000')

		await expect(getBlockTimestamp(
			publicEnv,
			hash
		)).resolves.toBe(1_787_225_800_000)
		expect(jsonRpc2Mock).toHaveBeenCalledWith(
			resolvedBinding,
			'state_getStorage',
			[
				'0xf0c365c3cf59d671eb72da0e7a4113c49f1f0515f462cdcf84e0f1d6045dfcbb',
				hash,
			]
		)

		jsonRpc2Mock.mockResolvedValueOnce('0x01')
		await expect(getBlockTimestamp(
			publicEnv,
			hash
		)).rejects.toThrow('invalid block timestamp')
	})

	it('loads an exact finalized data proof for a block extrinsic', async () => {
		const proof = {
			dataProof: {
				roots: {
					dataRoot: hash,
					blobRoot: parentHash,
					bridgeRoot: `0x${'c'.repeat(64)}`,
				},
				proof: [
					`0x${'d'.repeat(64)}`,
				],
				numberOfLeaves: 3,
				leafIndex: 1,
				leaf: `0x${'e'.repeat(64)}`,
			},
		}
		jsonRpc2Mock.mockResolvedValueOnce(proof)

		await expect(getDataProof(
			publicEnv,
			hash,
			1
		)).resolves.toEqual(proof)
		expect(jsonRpc2Mock).toHaveBeenCalledWith(
			resolvedBinding,
			'kate_queryDataProof',
			[
				1,
				hash,
			]
		)
	})

	it('rejects contradictory data-proof tree coordinates', async () => {
		jsonRpc2Mock.mockResolvedValueOnce({
			dataProof: {
				roots: {
					dataRoot: hash,
					blobRoot: parentHash,
					bridgeRoot: `0x${'c'.repeat(64)}`,
				},
				proof: [],
				numberOfLeaves: 1,
				leafIndex: 1,
				leaf: `0x${'e'.repeat(64)}`,
			},
		})

		await expect(getDataProof(
			publicEnv,
			hash,
			1
		)).rejects.toThrow('invalid data proof tree coordinates')
	})

	it('does not materialize bridge proofs as data submissions', async () => {
		jsonRpc2Mock.mockResolvedValueOnce({
			dataProof: {
				roots: {
					dataRoot: hash,
					blobRoot: parentHash,
					bridgeRoot: `0x${'c'.repeat(64)}`,
				},
				proof: [],
				numberOfLeaves: 1,
				leafIndex: 0,
				leaf: `0x${'e'.repeat(64)}`,
			},
			message: {},
		})

		await expect(getDataProof(
			publicEnv,
			hash,
			1
		)).rejects.toThrow('bridge proof is not a data submission')
	})

	it('resolves headers by block number through hash then header', async () => {
		jsonRpc2Mock
			.mockResolvedValueOnce(hash)
			.mockResolvedValueOnce(headerWire)
		await expect(getHeaderByBlockNumber(
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
		await expect(getSystemHealth(publicEnv)).rejects.toThrow(
			'Avail: invalid system_health response envelope'
		)

		jsonRpc2Mock.mockResolvedValueOnce({
			block: {
				header: headerWire,
				extrinsics: ['not-hex'],
			},
		})
		await expect(getBlock(
			publicEnv,
			hash
		)).rejects.toThrow('invalid extrinsic encoding')

		jsonRpc2Mock.mockResolvedValueOnce({
			parentHash,
			number: '0x1',
			stateRoot: hash,
			// missing extrinsicsRoot + digest
		})
		await expect(getHeader(publicEnv)).rejects.toThrow(
			'Avail: invalid chain_getHeader response envelope'
		)
	})
})

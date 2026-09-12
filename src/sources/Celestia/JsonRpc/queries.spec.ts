import { beforeEach, describe, expect, it, vi } from 'vitest'

import bindings from '$/sources/Celestia/bindings.ts'
import { Source } from '$/sources/Source.ts'
import {
	getBlob,
	getBlobProof,
	getBlobsByNamespace,
	getDasSamplingStats,
	getHeaderByHash,
	getHeaderByHeight,
	getHeaderLocalHead,
	getHeaderNetworkHead,
	getHeaderSyncState,
	getNodeInfo,
	getNodeReady,
	getShareRange,
	isBlobIncluded,
	namespaceForNodeRpc,
} from '$/sources/Celestia/JsonRpc/queries.ts'
import { jsonRpc2 } from '$/sources/_shared/wire/JsonRpc2/client.ts'

vi.mock('$/sources/_shared/wire/JsonRpc2/client.ts', () => ({
	jsonRpc2: vi.fn(),
}))

const binding = bindings[Source.CelestiaNode][0]
const publicEnv = {
	PUBLIC_CELESTIA_NODE_RPC_URL: 'https://example.com',
}
const resolvedBinding = {
	...binding,
	endpoints: binding.endpoints.map((endpoint) => ({
		...endpoint,
		locator: publicEnv.PUBLIC_CELESTIA_NODE_RPC_URL,
	})),
}

const jsonRpc2Mock = vi.mocked(jsonRpc2)
const hash = 'a'.repeat(64)
const parentHash = 'b'.repeat(64)
const namespace = `${'A'.repeat(39)}=`
const commitment = `${'B'.repeat(43)}=`

const headerWire = {
	header: {
		chain_id: 'celestia',
		height: '9007199254740991',
		time: '2026-07-23T04:49:10Z',
		last_block_id: {
			hash: parentHash,
		},
		data_hash: hash,
		app_hash: parentHash,
		proposer_address: 'c'.repeat(40),
	},
	commit: {
		block_id: {
			hash,
		},
	},
}

describe('Celestia Node v0.28.4 read-only JSON-RPC contracts', () => {
	beforeEach(() => {
		jsonRpc2Mock.mockReset()
	})

	it('uses the official integer parameter and preserves header identity', async () => {
		jsonRpc2Mock.mockResolvedValue(headerWire)
		await expect(getHeaderByHeight(
			publicEnv,
			9_007_199_254_740_991n
		)).resolves.toMatchObject({
			chainId: 'celestia',
			height: 9_007_199_254_740_991n,
			hash,
			parentHash,
		})
		expect(jsonRpc2Mock).toHaveBeenCalledWith(
			resolvedBinding,
			'header.GetByHeight',
			[9_007_199_254_740_991]
		)
	})

	it('fails closed before transport when the node endpoint is not configured', async () => {
		await expect(getHeaderLocalHead({})).rejects.toThrow(
			'Missing or empty source endpoint env: PUBLIC_CELESTIA_NODE_RPC_URL'
		)
		expect(jsonRpc2Mock).not.toHaveBeenCalled()
	})

	it('distinguishes local, network, and complete sync-head observations', async () => {
		jsonRpc2Mock.mockResolvedValueOnce(headerWire)
		await getHeaderLocalHead(publicEnv)
		expect(jsonRpc2Mock).toHaveBeenLastCalledWith(
			resolvedBinding,
			'header.LocalHead',
			[]
		)

		jsonRpc2Mock.mockResolvedValueOnce(headerWire)
		await getHeaderNetworkHead(publicEnv)
		expect(jsonRpc2Mock).toHaveBeenLastCalledWith(
			resolvedBinding,
			'header.NetworkHead',
			[]
		)

		jsonRpc2Mock.mockResolvedValueOnce({
			id: 42,
			height: 12_424_743,
			from_height: 12_424_700,
			to_height: 12_424_800,
			from_hash: hash,
			to_hash: parentHash,
			start: '2026-07-23T04:49:10Z',
			end: '2026-07-23T04:50:10Z',
			error: '',
		})
		await expect(getHeaderSyncState(publicEnv)).resolves.toEqual({
			id: 42,
			height: 12_424_743n,
			fromHeight: 12_424_700n,
			toHeight: 12_424_800n,
			fromHash: hash,
			toHash: parentHash,
			start: '2026-07-23T04:49:10Z',
			end: '2026-07-23T04:50:10Z',
			error: '',
		})
	})

	it('returns a validated proof without reading blob payload data', async () => {
		jsonRpc2Mock.mockResolvedValue([
			{
				end: 8,
				nodes: [hash],
				is_max_namespace_ignored: true,
			},
		])

		await expect(getBlobProof({
			publicEnv,
			height: 12_424_743n,
			namespace,
			commitment,
		})).resolves.toEqual([
			{
				end: 8,
				nodes: [hash],
				is_max_namespace_ignored: true,
			},
		])
		expect(jsonRpc2Mock).toHaveBeenCalledWith(
			resolvedBinding,
			'blob.GetProof',
			[
				12_424_743,
				namespace,
				commitment,
			]
		)
		expect(jsonRpc2Mock.mock.calls.flatMap(([, method]) => method)).not.toContain('blob.GetAll')
	})

	it('loads blobs and headers by hash through OpenRPC-named methods', async () => {
		const blobData = `${'A'.repeat(43)}=`
		jsonRpc2Mock
			.mockResolvedValueOnce({
				namespace,
				data: blobData,
				share_version: 0,
				commitment,
				index: -1,
			})
			.mockResolvedValueOnce(headerWire)

		await expect(getBlob({
			publicEnv,
			height: 12_424_743n,
			namespace,
			commitment,
		})).resolves.toEqual({
			namespace,
			data: blobData,
			shareVersion: 0,
			commitment,
			index: -1,
			sizeBytes: 32n,
		})
		await expect(getHeaderByHash(publicEnv, hash)).resolves.toMatchObject({
			hash,
			height: 9_007_199_254_740_991n,
		})

		expect(jsonRpc2Mock).toHaveBeenNthCalledWith(
			1,
			resolvedBinding,
			'blob.Get',
			[
				12_424_743,
				namespace,
				commitment,
			]
		)
		expect(jsonRpc2Mock).toHaveBeenNthCalledWith(
			2,
			resolvedBinding,
			'header.GetByHash',
			[hash]
		)
	})

	it.each([
		{
			height: 0n,
			namespace,
			commitment,
			message: 'positive JSON-safe integer',
		},
		{
			height: 9_007_199_254_740_992n,
			namespace,
			commitment,
			message: 'positive JSON-safe integer',
		},
		{
			height: 1n,
			namespace: 'short',
			commitment,
			message: 'invalid blob namespace',
		},
		{
			height: 1n,
			namespace,
			commitment: 'short',
			message: 'invalid blob commitment',
		},
	])('rejects malformed blob subject before transport', async ({
		height,
		namespace: candidateNamespace,
		commitment: candidateCommitment,
		message,
	}) => {
		await expect(getBlobProof({
			publicEnv,
			height,
			namespace: candidateNamespace,
			commitment: candidateCommitment,
		})).rejects.toThrow(message)
		await expect(getBlob({
			publicEnv,
			height,
			namespace: candidateNamespace,
			commitment: candidateCommitment,
		})).rejects.toThrow(message)
		expect(jsonRpc2Mock).not.toHaveBeenCalled()
	})

	it('rejects foreign headers, substituted heights, and malformed proofs', async () => {
		jsonRpc2Mock.mockResolvedValueOnce({
			...headerWire,
			header: {
				...headerWire.header,
				chain_id: 'mocha-4',
			},
		})
		await expect(getHeaderLocalHead(publicEnv)).rejects.toThrow('foreign chain header')

		jsonRpc2Mock.mockResolvedValueOnce({
			...headerWire,
			header: {
				...headerWire.header,
				height: '2',
			},
		})
		await expect(getHeaderByHeight(
			publicEnv,
			1n
		)).rejects.toThrow('mismatched height')

		jsonRpc2Mock.mockResolvedValueOnce([
			{
				end: 8,
				nodes: ['not base64'],
				is_max_namespace_ignored: false,
			},
		])
		await expect(getBlobProof({
			publicEnv,
			height: 1n,
			namespace,
			commitment,
		})).rejects.toThrow('invalid blob proof node')
	})

	it('fail-closes malformed tip and DAS envelopes', async () => {
		jsonRpc2Mock.mockResolvedValueOnce({
			header: {
				chain_id: 'celestia',
				height: '1',
				time: '2026-07-23T04:49:10Z',
			},
		})
		await expect(getHeaderLocalHead(publicEnv)).rejects.toThrow(
			'Celestia Node: invalid header.LocalHead response envelope'
		)

		jsonRpc2Mock.mockResolvedValueOnce({
			head_of_sampled_chain: -1,
			head_of_catchup: 0,
			network_head_height: 0,
			catch_up_done: false,
			is_running: true,
		})
		await expect(getDasSamplingStats(publicEnv)).rejects.toThrow(
			'Celestia Node: invalid das.SamplingStats response envelope'
		)

		jsonRpc2Mock.mockResolvedValueOnce({
			type: 'light',
			api_version: 'v0.28.4',
		})
		await expect(getNodeInfo(publicEnv)).rejects.toThrow(
			'Celestia Node: invalid node.Info response envelope'
		)
	})

	it('lists blobs by namespace and reports size from base64 payload', async () => {
		jsonRpc2Mock.mockResolvedValueOnce([
			{
				namespace,
				data: 'AAAA',
				share_version: 0,
				commitment,
				index: 1,
			},
		])
		await expect(getBlobsByNamespace({
			publicEnv,
			height: 42n,
			namespaces: [namespace],
		})).resolves.toEqual([
			{
				namespace,
				data: 'AAAA',
				shareVersion: 0,
				commitment,
				index: 1,
				sizeBytes: 3n,
			},
		])
		expect(jsonRpc2Mock).toHaveBeenCalledWith(
			resolvedBinding,
			'blob.GetAll',
			[
				42,
				[namespace],
			]
		)
	})

	it('rejects blobs outside the requested namespaces', async () => {
		const otherNamespace = `${'C'.repeat(39)}=`
		jsonRpc2Mock.mockResolvedValueOnce([{
			namespace: otherNamespace,
			data: 'AAAA',
			share_version: 0,
			commitment,
			index: 1,
		}])
		await expect(getBlobsByNamespace({
			publicEnv,
			height: 42n,
			namespaces: [namespace],
		})).rejects.toThrow('unrequested namespace')
	})

	it('preserves repeated payload occurrences at distinct share indexes', async () => {
		jsonRpc2Mock.mockResolvedValueOnce([
			{
				namespace,
				data: 'AAAA',
				share_version: 0,
				commitment,
				index: 1,
			},
			{
				namespace,
				data: 'AAAA',
				share_version: 0,
				commitment,
				index: 2,
			},
		])
		const blobs = await getBlobsByNamespace({
			publicEnv,
			height: 42n,
			namespaces: [namespace],
		})
		expect(blobs.map(({ index }) => index)).toEqual([
			1,
			2,
		])
	})

	it('normalizes Celenium hex namespaces to Node base64', () => {
		const hex = `00${'ab'.repeat(28)}`
		expect(namespaceForNodeRpc(hex)).toMatch(/^[A-Za-z0-9+/]{39}=$/)
		expect(namespaceForNodeRpc(namespace)).toBe(namespace)
	})

	it('reads namespace from share.GetRange proof', async () => {
		jsonRpc2Mock.mockResolvedValueOnce({
			Proof: {
				namespace_id: namespace,
				namespace_version: 0,
			},
		})
		await expect(getShareRange({
			publicEnv,
			height: 42n,
			from: 1,
			to: 2,
		})).resolves.toEqual({
			namespace,
		})
		expect(jsonRpc2Mock).toHaveBeenCalledWith(
			resolvedBinding,
			'share.GetRange',
			[
				42,
				1,
				2,
			]
		)
	})

	it('composes a Node namespace from share proof version and 28-byte id', async () => {
		const idHex = 'ab'.repeat(28)
		jsonRpc2Mock.mockResolvedValueOnce({
			Proof: {
				namespace_id: idHex,
				namespace_version: 0,
			},
		})
		await expect(getShareRange({
			publicEnv,
			height: 42n,
			from: 1,
			to: 2,
		})).resolves.toEqual({
			namespace: namespaceForNodeRpc(`00${idHex}`),
		})
	})

	it('rejects malformed share ranges before transport', async () => {
		await expect(getShareRange({
			publicEnv,
			height: 0n,
			from: 1,
			to: 2,
		})).rejects.toThrow('positive JSON-safe integer')
		await expect(getShareRange({
			publicEnv,
			height: 42n,
			from: 2,
			to: 2,
		})).rejects.toThrow('invalid share range')
		expect(jsonRpc2Mock).not.toHaveBeenCalled()
	})

	it('fail-closes a share.GetRange envelope without a namespace proof', async () => {
		jsonRpc2Mock.mockResolvedValueOnce({
			Shares: [],
		})
		await expect(getShareRange({
			publicEnv,
			height: 42n,
			from: 1,
			to: 2,
		})).rejects.toThrow('Celestia Node: invalid share.GetRange response envelope')
	})

	it('projects DAS sampling stats and node readiness', async () => {
		jsonRpc2Mock.mockResolvedValueOnce({
			head_of_sampled_chain: 10,
			head_of_catchup: 20,
			network_head_height: 30,
			catch_up_done: false,
			is_running: true,
		})
		await expect(getDasSamplingStats(publicEnv)).resolves.toEqual({
			sampledHeaderHeight: 10n,
			catchupHeight: 20n,
			networkHeadHeight: 30n,
			catchUpDone: false,
			isRunning: true,
		})

		jsonRpc2Mock.mockResolvedValueOnce(true)
		await expect(getNodeReady(publicEnv)).resolves.toBe(true)

		jsonRpc2Mock.mockResolvedValueOnce({
			type: 3,
			api_version: 'v0.28.4',
		})
		await expect(getNodeInfo(publicEnv)).resolves.toEqual({
			nodeType: 'light',
			apiVersion: 'v0.28.4',
		})
	})

	it('checks blob inclusion with a prior proof', async () => {
		const proof = [
			{
				end: 8,
				nodes: ['AAAA'],
				is_max_namespace_ignored: false,
			},
		]
		jsonRpc2Mock.mockResolvedValueOnce(true)
		await expect(isBlobIncluded({
			publicEnv,
			height: 1n,
			namespace,
			commitment,
			proof,
		})).resolves.toBe(true)
		expect(jsonRpc2Mock).toHaveBeenCalledWith(
			resolvedBinding,
			'blob.Included',
			[
				1,
				namespace,
				proof,
				commitment,
			]
		)
	})
})

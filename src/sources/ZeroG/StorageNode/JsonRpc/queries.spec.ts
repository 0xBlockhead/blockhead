import {
	afterEach,
	describe,
	expect,
	it,
	vi,
} from 'vitest'

const sourceFetch = vi.fn()

vi.mock('$/sources/_runtime/http.ts', () => ({
	firstHttpUrlForBinding: (binding: { endpoints: { locator: string }[] }) => binding.endpoints[0]?.locator,
	sourceFetch,
	sourceGetJson: vi.fn(),
	sourceGetText: vi.fn(),
}))

const {
	getFileInfo,
	getFileInfoByTxSeq,
	getSectorProof,
	getStatus,
} = await import('$/sources/ZeroG/StorageNode/JsonRpc/queries.ts')

const statusWire = {
	connectedPeers: 1,
	logSyncHeight: 10,
	logSyncBlock: '0xabc',
	nextTxSeq: 2,
	networkIdentity: {
		chainId: 16661,
		flowAddress: '0x4D19F72978eaF45F6B0dC4db43f15B4a39D65bfD',
		p2pProtocolVersion: {
			major: 1,
			minor: 0,
			build: 0,
		},
	},
}

const jsonRpcResult = (result: unknown) => (
	new Response(JSON.stringify({
		jsonrpc: '2.0',
		id: 1,
		result,
	}), {
		status: 200,
		headers: {
			'content-type': 'application/json',
		},
	})
)

describe('ZeroG StorageNode JSON-RPC envelopes', () => {
	afterEach(() => {
		sourceFetch.mockReset()
	})

	it('accepts status / fileInfo / sector proof and fails closed on malformed wires', async () => {
		sourceFetch.mockResolvedValueOnce(jsonRpcResult(statusWire))
		await expect(getStatus()).resolves.toMatchObject({
			networkIdentity: {
				flowAddress: '0x4D19F72978eaF45F6B0dC4db43f15B4a39D65bfD',
			},
		})

		sourceFetch.mockResolvedValueOnce(jsonRpcResult({
			tx: {
				streamIds: ['0xaaa'],
				data: '0x',
				dataMerkleRoot: '0xbbb',
				startEntryIndex: 0,
				size: 12,
				seq: 7,
			},
			finalized: true,
			isCached: false,
			uploadedSegNum: 1,
			pruned: false,
		}))
		await expect(getFileInfo({
			root: '0xbbb',
			needAvailable: true,
		})).resolves.toMatchObject({
			tx: {
				seq: 7,
			},
		})

		sourceFetch.mockResolvedValueOnce(jsonRpcResult(null))
		await expect(getFileInfo({
			root: '0xmissing',
			needAvailable: true,
		})).resolves.toBeNull()

		sourceFetch.mockResolvedValueOnce(jsonRpcResult({
			lemma: ['0x1'],
			path: [true, false],
		}))
		await expect(getSectorProof({
			sectorIndex: 0,
		})).resolves.toEqual({
			lemma: ['0x1'],
			path: [true, false],
		})

		sourceFetch.mockResolvedValueOnce(jsonRpcResult({
			connectedPeers: 1,
			logSyncHeight: 10,
			logSyncBlock: '0xabc',
			nextTxSeq: 2,
			networkIdentity: {
				chainId: 16661,
				flowAddress: 'not-an-address',
				p2pProtocolVersion: {
					major: 1,
					minor: 0,
					build: 0,
				},
			},
		}))
		await expect(getStatus()).rejects.toThrow('invalid zgs_getStatus response envelope')
	})

	it('binds file information to its requested root and transaction sequence', async () => {
		sourceFetch.mockResolvedValueOnce(jsonRpcResult({
			tx: {
				streamIds: ['0xaaa'],
				data: '0x',
				dataMerkleRoot: '0xother',
				startEntryIndex: 0,
				size: 12,
				seq: 7,
			},
			finalized: true,
			isCached: false,
			uploadedSegNum: 1,
			pruned: false,
		}))
		await expect(getFileInfo({
			root: '0xbbb',
			needAvailable: true,
		})).rejects.toThrow('response root does not match request')

		sourceFetch.mockResolvedValueOnce(jsonRpcResult({
			tx: {
				streamIds: ['0xaaa'],
				data: '0x',
				dataMerkleRoot: '0xbbb',
				startEntryIndex: 0,
				size: 12,
				seq: 7,
			},
			finalized: true,
			isCached: false,
			uploadedSegNum: 1,
			pruned: false,
		}))
		await expect(getFileInfoByTxSeq({
			txSeq: 8,
		})).rejects.toThrow('response sequence does not match request')
	})

	it('rejects lossy or negative request coordinates before transport', async () => {
		await expect(getFileInfoByTxSeq({
			txSeq: BigInt(Number.MAX_SAFE_INTEGER) + 1n,
		})).rejects.toThrow('invalid transaction sequence')
		await expect(getSectorProof({
			sectorIndex: -1,
		})).rejects.toThrow('invalid sector index')
		expect(sourceFetch).not.toHaveBeenCalled()
	})
})

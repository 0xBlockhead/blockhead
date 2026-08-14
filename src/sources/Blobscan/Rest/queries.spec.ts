import {
	afterEach,
	describe,
	expect,
	it,
	vi,
} from 'vitest'

import bindings from '$/sources/Blobscan/bindings.ts'
import {
	getBlob,
	getBlobDetail,
	getBlock,
	getTransaction,
	listBlobs,
	listBlocks,
} from '$/sources/Blobscan/Rest/queries.ts'
import { Source } from '$/sources/Source.ts'

const ethereumBinding = bindings[Source.Blobscan_Rest].find((binding) => (
	binding.target.key === '1'
))

if (ethereumBinding == null)
	throw new Error('Blobscan REST spec missing Ethereum binding')

const jsonResponse = (body: unknown, status = 200) => (
	new Response(JSON.stringify(body), {
		status,
		headers: {
			'content-type': 'application/json',
		},
	})
)

const txHash = '0x1e46f5ba946b88488bb1afb80503f799ef9dc491af49a6cc8d1c5177de7b7cf1'
const versionedHash = '0x01301f3d74a866273da32b8103d31648b3753b2f12ae53c6d46dfc674121cc05'
const blockHash = '0xca22de2c1d7c8ac391921a2e3c96872ecf805a2d398813aa0f8cb995aa85ddea'
const commitment = '0xa289c72f77b7e5d4bb136760122ff2ce39f146acc0f13cffbfffca8a3098d3e0e1264d67e1714207cc79913c754626a9'

describe('Blobscan REST queries', () => {
	afterEach(() => {
		vi.restoreAllMocks()
		vi.unstubAllGlobals()
	})

	it('routes transaction, blob, and block GETs through the HTTP proxy binding', async () => {
		const fetchMock = vi.fn<typeof fetch>()
			.mockResolvedValueOnce(jsonResponse({
				hash: txHash,
				blockNumber: 12,
				blobs: [{
					versionedHash,
				}],
			}))
			.mockResolvedValueOnce(jsonResponse({
				versionedHash,
				commitment,
			}))
			.mockResolvedValueOnce(jsonResponse({
				blobs: [{
					versionedHash,
					txHash,
					index: 0,
				}],
				totalBlobs: 12,
			}))
			.mockResolvedValueOnce(jsonResponse({
				hash: blockHash,
				number: 12,
				timestamp: '2026-08-05T02:08:35.000Z',
				transactions: [{
					hash: txHash,
					blobs: [{
						versionedHash,
					}],
				}],
			}))
			.mockResolvedValueOnce(jsonResponse({
				blocks: [{
					hash: blockHash,
					number: 12,
					timestamp: '2026-08-05T02:08:35.000Z',
				}],
				totalBlocks: 8,
			}))
		vi.stubGlobal('fetch', fetchMock)
		vi.stubGlobal('window', {})

		await expect(getTransaction('1', {
			txHash,
		})).resolves.toMatchObject({
			blockNumber: 12,
		})
		await expect(getBlob('1', {
			versionedHash,
		})).resolves.toMatchObject({
			commitment,
		})
		await expect(listBlobs('1', {
			limit: 16,
			offset: 0,
		})).resolves.toEqual({
			blobs: [{
				versionedHash,
				txHash,
				index: 0,
			}],
			totalBlobs: 12,
		})
		await expect(getBlock('1', {
			blockId: 12,
		})).resolves.toMatchObject({
			hash: blockHash,
			number: 12,
		})
		await expect(listBlocks('1', {
			limit: 8,
			offset: 0,
		})).resolves.toEqual({
			blocks: [{
				hash: blockHash,
				number: 12,
				timestamp: '2026-08-05T02:08:35.000Z',
			}],
			totalBlocks: 8,
		})

		expect(fetchMock.mock.calls.map(([url]) => String(url))).toEqual([
			expect.stringMatching(/\/api-proxy\/.+\/https%3A%2F%2Fapi\.blobscan\.com%2Ftransactions%2F/),
			expect.stringMatching(/\/api-proxy\/.+\/https%3A%2F%2Fapi\.blobscan\.com%2Fblobs%2F/),
			expect.stringMatching(/\/api-proxy\/.+\/https%3A%2F%2Fapi\.blobscan\.com%2Fblobs%3Fps%3D16%26p%3D1%26count%3Dtrue$/),
			expect.stringMatching(/\/api-proxy\/.+\/https%3A%2F%2Fapi\.blobscan\.com%2Fblocks%2F12$/),
			expect.stringMatching(/\/api-proxy\/.+\/https%3A%2F%2Fapi\.blobscan\.com%2Fblocks%3Fps%3D8%26p%3D1%26count%3Dtrue$/),
		])
	})

	it('softens only 404 on optional GETs and hard-fails list HTTP errors', async () => {
		vi.spyOn(globalThis, 'fetch')
			.mockResolvedValueOnce(new Response(null, { status: 404 }))
			.mockResolvedValueOnce(new Response(null, { status: 500 }))
			.mockResolvedValueOnce(new Response(null, { status: 500 }))
			.mockResolvedValueOnce(new Response(null, { status: 500 }))

		await expect(getTransaction('1', {
			txHash,
		})).resolves.toBeUndefined()
		await expect(getBlob('1', {
			versionedHash,
		})).rejects.toThrow('500')
		await expect(listBlobs('1', {
			limit: 8,
		})).rejects.toThrow('500')
		await expect(listBlocks('1', {
			limit: 8,
		})).rejects.toThrow('500')
	})

	it('accepts live transaction inclusion fields and strips undeclared keys', async () => {
		vi.spyOn(globalThis, 'fetch')
			.mockResolvedValueOnce(jsonResponse({
				hash: txHash,
				blockNumber: 12,
				from: '0xc1b634853cb333d3ad8663715b08f41a3aec47cc',
				to: '0x1c479675ad559dc151f6ec7ed3fbf8cee79582b6',
				index: 71,
				blobGasUsed: '393216',
				maxFeePerBlobGas: '73140170',
				category: 'rollup',
				rollup: 'arbitrum',
				blobs: [{
					versionedHash,
				}],
			}))

		await expect(getTransaction('1', {
			txHash,
		})).resolves.toMatchObject({
			from: '0xc1b634853cb333d3ad8663715b08f41a3aec47cc',
			to: '0x1c479675ad559dc151f6ec7ed3fbf8cee79582b6',
			index: 71,
			blobGasUsed: '393216',
			maxFeePerBlobGas: '73140170',
		})
	})

	it('fail-closes transactions with an empty blob sidecar', async () => {
		vi.spyOn(globalThis, 'fetch')
			.mockResolvedValueOnce(jsonResponse({
				hash: txHash,
				blockNumber: 12,
				from: '0xc1b634853cb333d3ad8663715b08f41a3aec47cc',
				blobs: [],
			}))

		await expect(getTransaction('1', {
			txHash,
		})).rejects.toThrow('transaction missing blobs')
	})

	it('fail-closes malformed blob and block list envelopes', async () => {
		vi.spyOn(globalThis, 'fetch')
			.mockResolvedValueOnce(jsonResponse({}))
			.mockResolvedValueOnce(jsonResponse({
				blobs: [{
					versionedHash: '0x02deadbeefdeadbeefdeadbeefdeadbeefdeadbeefdeadbeefdeadbeefdeadbeef',
				}],
				totalBlobs: 1,
			}))
			.mockResolvedValueOnce(jsonResponse({}))
			.mockResolvedValueOnce(jsonResponse({
				blocks: [{
					hash: blockHash,
					number: 12,
					timestamp: 'not-a-date',
				}],
				totalBlocks: 1,
			}))

		await expect(listBlobs('1', {
			limit: 8,
		})).rejects.toThrow('invalid blob list response envelope')
		await expect(listBlobs('1', {
			limit: 8,
		})).rejects.toThrow('invalid blob list versioned hash')
		await expect(listBlocks('1', {
			limit: 8,
		})).rejects.toThrow('invalid block list response envelope')
		await expect(listBlocks('1', {
			limit: 8,
		})).rejects.toThrow('invalid block list timestamp')
	})

	it('requires the exact totals requested from Blobscan list endpoints', async () => {
		vi.spyOn(globalThis, 'fetch')
			.mockResolvedValueOnce(jsonResponse({
				blobs: [],
			}))
			.mockResolvedValueOnce(jsonResponse({
				blobs: [],
				totalBlobs: -1,
			}))
			.mockResolvedValueOnce(jsonResponse({
				blocks: [],
			}))
			.mockResolvedValueOnce(jsonResponse({
				blocks: [],
				totalBlocks: 1.5,
			}))

		await expect(listBlobs('1', {
			limit: 8,
		})).rejects.toThrow('blob list missing requested total')
		await expect(listBlobs('1', {
			limit: 8,
		})).rejects.toThrow('invalid blob total')
		await expect(listBlocks('1', {
			limit: 8,
		})).rejects.toThrow('block list missing requested total')
		await expect(listBlocks('1', {
			limit: 8,
		})).rejects.toThrow('invalid block total')
	})

	it('fail-closes duplicate transaction identity in a block hierarchy', async () => {
		vi.spyOn(globalThis, 'fetch').mockResolvedValueOnce(jsonResponse({
			hash: blockHash,
			number: 12,
			timestamp: '2026-08-05T02:08:35.000Z',
			transactions: [
				{
					hash: txHash,
					blobs: [{ versionedHash }],
				},
				{
					hash: txHash.toUpperCase().replace('0X', '0x'),
					blobs: [{ versionedHash }],
				},
			],
		}))

		await expect(getBlock('1', {
			blockId: 12,
		})).rejects.toThrow('block contains duplicate transaction identity')
	})

	it('validates nested block-list hierarchy and rejects duplicate block identity', async () => {
		vi.spyOn(globalThis, 'fetch')
			.mockResolvedValueOnce(jsonResponse({
				blocks: [{
					hash: blockHash,
					number: 12,
					timestamp: '2026-08-05T02:08:35.000Z',
					transactions: [{
						hash: txHash,
						blobs: [{
							versionedHash: `0x02${versionedHash.slice(4)}`,
						}],
					}],
				}],
				totalBlocks: 1,
			}))
			.mockResolvedValueOnce(jsonResponse({
				blocks: [
					{
						hash: blockHash,
						number: 12,
						timestamp: '2026-08-05T02:08:35.000Z',
					},
					{
						hash: `0x${'ab'.repeat(32)}`,
						number: 12,
						timestamp: '2026-08-05T02:08:47.000Z',
					},
				],
				totalBlocks: 2,
			}))

		await expect(listBlocks('1', {
			limit: 2,
		})).rejects.toThrow('invalid block blob versioned hash')
		await expect(listBlocks('1', {
			limit: 2,
		})).rejects.toThrow('block list contains duplicate identity')
	})

	it('throws when a found transaction lacks the requested blob index', async () => {
		vi.spyOn(globalThis, 'fetch')
			.mockResolvedValueOnce(jsonResponse({
				hash: txHash,
				blockNumber: 12,
				blobs: [{
					versionedHash,
				}],
			}))

		await expect(getBlobDetail('1', {
			txHash,
			blobIndex: 3,
		})).rejects.toThrow('blob index 3 missing')
	})

	it('throws when blob detail is missing after a known transaction sidecar', async () => {
		vi.spyOn(globalThis, 'fetch')
			.mockResolvedValueOnce(jsonResponse({
				hash: txHash,
				blockNumber: 12,
				blobs: [{
					versionedHash,
				}],
			}))
			.mockResolvedValueOnce(new Response(null, { status: 404 }))

		await expect(getBlobDetail('1', {
			txHash,
			blobIndex: 0,
		})).rejects.toThrow(`blob ${versionedHash} missing`)
	})

	it('fails closed when blob detail contradicts its transaction hierarchy', async () => {
		vi.spyOn(globalThis, 'fetch')
			.mockResolvedValueOnce(jsonResponse({
				hash: txHash,
				blockNumber: 12,
				blobs: [{
					versionedHash,
				}],
			}))
			.mockResolvedValueOnce(jsonResponse({
				versionedHash,
				commitment: '0xcommit',
				txHash: `0x${'2'.repeat(64)}`,
				blockNumber: 12,
				index: 0,
			}))

		await expect(getBlobDetail('1', {
			txHash,
			blobIndex: 0,
		})).rejects.toThrow('belongs to another transaction')
	})

	it('throws for unbound chains', async () => {
		await expect(getTransaction('999', {
			txHash,
		})).rejects.toThrow('no binding for chain 999')
	})
})

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
	getTransaction,
	listBlobs,
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

describe('Blobscan REST queries', () => {
	afterEach(() => {
		vi.restoreAllMocks()
		vi.unstubAllGlobals()
	})

	it('routes transaction and blob GETs through the HTTP proxy binding', async () => {
		const fetchMock = vi.fn<typeof fetch>()
			.mockResolvedValueOnce(jsonResponse({
				blockNumber: 12,
				blobs: [{
					versionedHash,
				}],
			}))
			.mockResolvedValueOnce(jsonResponse({
				versionedHash,
				commitment: '0xabc',
			}))
			.mockResolvedValueOnce(jsonResponse({
				blobs: [{
					versionedHash,
					txHash,
					index: 0,
				}],
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
			commitment: '0xabc',
		})
		await expect(listBlobs('1', {
			limit: 16,
			offset: 0,
		})).resolves.toEqual([{
			versionedHash,
			txHash,
			index: 0,
		}])

		expect(fetchMock.mock.calls.map(([url]) => String(url))).toEqual([
			expect.stringMatching(/\/api-proxy\/.+\/https%3A%2F%2Fapi\.blobscan\.com%2Ftransactions%2F/),
			expect.stringMatching(/\/api-proxy\/.+\/https%3A%2F%2Fapi\.blobscan\.com%2Fblobs%2F/),
			expect.stringMatching(/\/api-proxy\/.+\/https%3A%2F%2Fapi\.blobscan\.com%2Fblobs%3Fps%3D16%26p%3D1$/),
		])
	})

	it('softens only 404 on optional GETs and hard-fails list HTTP errors', async () => {
		vi.spyOn(globalThis, 'fetch')
			.mockResolvedValueOnce(new Response(null, { status: 404 }))
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
	})

	it('throws when a found transaction lacks the requested blob index', async () => {
		vi.spyOn(globalThis, 'fetch')
			.mockResolvedValueOnce(jsonResponse({
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

	it('throws for unbound chains', async () => {
		await expect(getTransaction('999', {
			txHash,
		})).rejects.toThrow('no binding for chain 999')
	})
})

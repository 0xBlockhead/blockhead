import {
	beforeEach,
	describe,
	expect,
	it,
	vi,
} from 'vitest'

const snapchainGet = vi.hoisted(() => vi.fn())

vi.mock('$/sources/Snapchain/Rest/client.ts', () => ({
	snapchainGet,
}))

const {
	getCastById,
	getCastsByFid,
	getFids,
	getLinksByTargetFid,
	getUserDataByFid,
} = await import('$/sources/Snapchain/Rest/queries.ts')

beforeEach(() => {
	snapchainGet.mockReset()
})

describe('Snapchain Rest arktype envelopes', () => {
	it('accepts cast / page / fids / links-by-target envelopes', async () => {
		snapchainGet
			.mockResolvedValueOnce({
				hash: '0x1111111111111111111111111111111111111111',
				data: {
					fid: 1,
					timestamp: 100,
					castAddBody: { text: 'hi' },
				},
			})
			.mockResolvedValueOnce({
				messages: [{
					hash: '0x2222222222222222222222222222222222222222',
					data: { fid: 1, timestamp: 101, castAddBody: { text: '' } },
				}],
				nextPageToken: 'opaque/+%',
			})
			.mockResolvedValueOnce({
				fids: [1, 2],
			})
			.mockResolvedValueOnce({
				messages: [{
					data: {
						fid: 9,
						linkBody: { type: 'follow', targetFid: 1 },
					},
				}],
			})
			.mockResolvedValueOnce({
				messages: [{
					data: {
						fid: 1,
						userDataBody: { type: 'USER_DATA_TYPE_BIO', value: 'bio' },
					},
				}],
			})

		await expect(getCastById({
			fid: 1,
			hash: '0x1111111111111111111111111111111111111111',
		})).resolves.toMatchObject({
			hash: '0x1111111111111111111111111111111111111111',
			data: { fid: 1 },
		})
		await expect(getCastsByFid({ fid: 1 })).resolves.toMatchObject({
			nextPageToken: 'opaque/+%',
		})
		await expect(getFids()).resolves.toEqual({ fids: [1, 2] })
		await expect(getLinksByTargetFid({ targetFid: 1 })).resolves.toMatchObject({
			messages: [{ data: { fid: 9 } }],
		})
		await expect(getUserDataByFid({ fid: 1 })).resolves.toMatchObject({
			messages: [{ data: { fid: 1 } }],
		})
		expect(snapchainGet.mock.calls.map((call) => call[0])).toEqual([
			'/v1/castById',
			'/v1/castsByFid',
			'/v1/fids',
			'/v1/linksByTargetFid',
			'/v1/userDataByFid',
		])
	})

	it('fail-closes malformed cast and fids envelopes', async () => {
		snapchainGet.mockResolvedValueOnce({ hash: 12 })
		await expect(getCastById({
			fid: 1,
			hash: '0x1111111111111111111111111111111111111111',
		})).rejects.toThrow('Snapchain_Rest: invalid cast response envelope')

		snapchainGet.mockResolvedValueOnce({ fids: ['1'] })
		await expect(getFids()).rejects.toThrow(
			'Snapchain_Rest: invalid fids response envelope'
		)
	})
})

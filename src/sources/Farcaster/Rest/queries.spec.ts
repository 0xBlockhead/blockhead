import {
	describe,
	expect,
	it,
	vi,
} from 'vitest'

const farcasterGet = vi.hoisted(() => vi.fn())

vi.mock('$/sources/Farcaster/Rest/client.ts', () => ({
	farcasterGet,
}))

const {
	getAllChannels,
	getPrimaryAddress,
	getUserThreadCasts,
} = await import(
	'$/sources/Farcaster/Rest/queries.ts'
)
describe('Farcaster public thread endpoint', () => {
	it('loads all channels once and rejects duplicate ids', async () => {
		farcasterGet.mockResolvedValueOnce({ result: { channels: [] } })

		await expect(getAllChannels()).resolves.toEqual([])
		expect(farcasterGet).toHaveBeenCalledOnce()
		expect(farcasterGet).toHaveBeenCalledWith(
			'client-api',
			'/v2/all-channels'
		)

		farcasterGet.mockResolvedValueOnce({
			result: {
				channels: [
					{ id: 'dev' },
					{ id: 'dev' },
				],
			},
		})

		await expect(getAllChannels()).rejects.toThrow('duplicate channel id')
	})

	it('returns the endpoint-native ordered thread response', async () => {
		const response = {
			result: {
				casts: [
					{
						hash: '0xF0CA1',
						author: { fid: 1 },
					},
					{
						hash: '0xD1RECT',
						parentHash: 'f0ca1',
						parentAuthor: { fid: 1 },
						author: { fid: 2 },
					},
					{
						hash: '0xGRAND',
						parentHash: '0xD1RECT',
						author: { fid: 3 },
					},
					{
						hash: '0xANCESTOR',
						author: { fid: 4 },
					},
					{
						parentHash: '0xF0CA1',
						parentAuthor: { fid: 1 },
					},
					{
						hash: '0xFOREIGN',
						parentHash: '0xF0CA1',
						parentAuthor: { fid: 99 },
						author: { fid: 5 },
					},
				],
			},
		}
		farcasterGet.mockResolvedValueOnce(response)

		await expect(getUserThreadCasts({
			username: 'alice',
			castHashPrefix: '0xf0ca1',
		})).resolves.toEqual(response)
		expect(farcasterGet).toHaveBeenCalledWith(
			'web-api',
			'/~api/v2/user-thread-casts',
			{
				username: 'alice',
				castHashPrefix: '0xf0ca1',
				limit: 15,
			}
		)
	})

	it('rejects a primary address for a different account or protocol', async () => {
		farcasterGet.mockResolvedValueOnce({
			result: {
				address: {
					fid: 99,
					protocol: 'ethereum',
					address: '0x0000000000000000000000000000000000000001',
				},
			},
		})

		await expect(getPrimaryAddress({
			fid: 42,
		})).rejects.toThrow('primary address subject mismatch')
	})
})

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
	getCastAndDirectRepliesByUsernameAndHashPrefix,
	getPrimaryAddress,
} = await import(
	'$/sources/Farcaster/Rest/queries.ts'
)

describe('Farcaster public thread direct replies', () => {
	it('keeps only casts whose exact parent is the focal cast', async () => {
		farcasterGet.mockResolvedValueOnce({
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
		})

		await expect(getCastAndDirectRepliesByUsernameAndHashPrefix({
			username: 'alice',
			castHashPrefix: '0xf0ca1',
		})).resolves.toEqual({
			cast: expect.objectContaining({ hash: '0xF0CA1' }),
			directReplies: [
				expect.objectContaining({ hash: '0xD1RECT' }),
			],
		})
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

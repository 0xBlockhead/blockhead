import {
	beforeEach,
	describe,
	expect,
	it,
	vi,
} from 'vitest'

const primalGet = vi.hoisted(() => vi.fn())
const primalPost = vi.hoisted(() => vi.fn())

vi.mock('$/sources/Primal/Rest/client.ts', () => ({
	primalGet,
	primalPost,
}))

const {
	getEventById,
	getNoteActions,
	getProfile,
	getProfileNotes,
	search,
} = await import('$/sources/Primal/Rest/queries.ts')

beforeEach(() => {
	primalGet.mockReset()
	primalPost.mockReset()
})

describe('Primal Rest arktype envelopes', () => {
	it('accepts profile / timeline / event / search envelopes', async () => {
		primalGet
			.mockResolvedValueOnce({
				events: [{
					id: 'a'.repeat(64),
					pubkey: 'b'.repeat(64),
					kind: 0,
					content: '{}',
					created_at: 1_700_000_000,
					tags: [],
					sig: 'c'.repeat(128),
				}],
			})
			.mockResolvedValueOnce({
				event: {
					id: 'd'.repeat(64),
					kind: 1,
					content: 'note',
				},
			})
		primalPost
			.mockResolvedValueOnce({
				notes: [{
					id: 'e'.repeat(64),
					kind: 1,
					content: 'hi',
				}],
			})
			.mockResolvedValueOnce({
				actions: [{
					id: 'f'.repeat(64),
					kind: 7,
					content: '+',
				}],
			})
			.mockResolvedValueOnce([{
				id: '1'.repeat(64),
				kind: 1,
				content: 'search hit',
			}])
			.mockResolvedValueOnce({
				users: [{
					id: '2'.repeat(64),
					kind: 0,
					content: '{}',
				}],
			})

		await expect(getProfile('npub1demo')).resolves.toMatchObject({
			events: [{
				kind: 0,
			}],
		})
		await expect(getEventById('D'.repeat(64))).resolves.toMatchObject({
			event: {
				kind: 1,
			},
		})
		await expect(getProfileNotes('B'.repeat(64), 2)).resolves.toMatchObject({
			notes: [{
				kind: 1,
			}],
		})
		await expect(getNoteActions('abcdef', 7, 3)).resolves.toMatchObject({
			actions: [{
				kind: 7,
			}],
		})
		await expect(search('events', {
			query: ' nostr ',
			kinds: [
				1,
				30_023,
			],
			limit: 2,
		})).resolves.toEqual([{
			id: '1'.repeat(64),
			kind: 1,
			content: 'search hit',
		}])
		await expect(search('users', {
			query: ' alice ',
			limit: 1,
		})).resolves.toMatchObject({
			users: [{
				kind: 0,
			}],
		})
	})

	it('fail-closes malformed timeline and search envelopes', async () => {
		primalPost
			.mockResolvedValueOnce({
				notes: 'not-an-array',
			})
			.mockResolvedValueOnce({
				users: {
					id: 'x',
				},
			})
		primalGet.mockResolvedValueOnce({
			events: 'bad',
		})

		await expect(getProfileNotes('a'.repeat(64), 1)).rejects.toThrow(
			'Primal_Rest: invalid timeline /timeline/profile/notes response envelope'
		)
		await expect(search('users', {
			query: 'alice',
			limit: 1,
		})).rejects.toThrow('Primal_Rest: invalid search users response envelope')
		await expect(getProfile('npub1demo')).rejects.toThrow(
			'Primal_Rest: invalid profile response envelope'
		)
	})
})

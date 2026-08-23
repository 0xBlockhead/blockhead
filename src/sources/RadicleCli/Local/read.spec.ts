import { describe, expect, it, vi } from 'vitest'

import { readRadicleRepository } from '$/sources/RadicleCli/Local/read.ts'

const repositoryId = 'rad:z3gqcJUoA1n9HaHKufZs5FCSGazv5D6Dt7Fnx1C4h2kKz'

describe('Radicle CLI local read boundary', () => {
	it('materializes public repository identity from inspect payload', async () => {
		const read = vi.fn().mockResolvedValue(JSON.stringify({
			rid: repositoryId,
			name: 'blockhead',
			description: 'A public repository',
			visibility: 'public',
			defaultBranch: 'main',
			git: { repositoryId: 'abc123', objectFormat: 'sha1' },
		}))

		expect(await readRadicleRepository(repositoryId, { read })).toMatchObject({
			rid: repositoryId,
			visibility: 'public',
			git: { repositoryId: 'abc123', objectFormat: 'sha1' },
		})
		expect(read).toHaveBeenCalledWith({ command: 'rad', args: ['inspect', '--payload', repositoryId] })
	})

	it('rejects payloads that do not identify the requested repository', async () => {
		await expect(readRadicleRepository(repositoryId, {
			read: vi.fn().mockResolvedValue(JSON.stringify({
				rid: 'rad:zother',
				visibility: 'public',
				git: { repositoryId: 'abc123', objectFormat: 'sha1' },
			})),
		})).rejects.toThrow('invalid rad inspect repository payload')
	})

	it.each([
		['malformed JSON', '{'],
		['private repositories', JSON.stringify({ rid: repositoryId, visibility: 'private', git: { repositoryId: 'abc123', objectFormat: 'sha1' } })],
		['incomplete Git identity', JSON.stringify({ rid: repositoryId, visibility: 'public', git: { repositoryId: '', objectFormat: 'sha1' } })],
	])('rejects %s payloads', async (_label, payload) => {
		await expect(readRadicleRepository(repositoryId, {
			read: vi.fn().mockResolvedValue(payload),
		})).rejects.toThrow('invalid rad inspect repository payload')
	})
})

import { describe, expect, it, vi } from 'vitest'

import { createRadicleCliLocalResolverModule } from '$/resolvers/RadicleCli-Local.ts'
import { createRadicleCliSession } from '$/sources/RadicleCli/Local/platform.ts'
import type { RadicleCliSession } from '$/sources/RadicleCli/Local/types.ts'

const repositoryId = 'rad:z3gqcJUoA1n9HaHKufZs5FCSGazv5D6Dt7Fnx1C4h2kKz'
const repository = {
	rid: repositoryId,
	name: 'blockhead',
	description: 'A public repository',
	visibility: 'public' as const,
	defaultBranch: 'main',
	git: { repositoryId: 'abc123', objectFormat: 'sha256' as const },
}

const resolveRepository = async (session: RadicleCliSession) => (
	createRadicleCliLocalResolverModule(session).resolvers[0].resolve.Rid.resolve({ rid: repositoryId }, {})
)

describe('Radicle CLI local resolver boundary', () => {
	it('projects the injected authoritative repository identity', async () => {
		const readRepository = vi.fn().mockResolvedValue(repository)
		const rows = await resolveRepository({ readRepository })

		expect(readRepository).toHaveBeenCalledWith(repositoryId)
		expect(rows).toEqual([{
			'__selector': { rid: repositoryId },
			'__fields': {
				rid: repositoryId,
				name: 'blockhead',
				description: 'A public repository',
				visibility: 'public',
				defaultBranch: 'main',
				$gitRepository: {
					'__selector': { repositoryId: 'abc123' },
					'__fields': { objectFormat: 'sha256' },
				},
			},
		}])
	})

	it.each([
		['mismatched', { ...repository, rid: 'rad:zother' }],
		['private', { ...repository, visibility: 'private' }],
		['incomplete', { ...repository, git: { repositoryId: '', objectFormat: 'sha256' } }],
	])('rejects %s authoritative payloads through the real resolver module', async (_label, payload) => {
		const session = createRadicleCliSession({ read: vi.fn().mockResolvedValue(JSON.stringify(payload)) })
		await expect(resolveRepository(session)).rejects.toThrow('invalid rad inspect repository payload')
	})

	it('rejects malformed authoritative payloads through the real resolver module', async () => {
		const session = createRadicleCliSession({ read: vi.fn().mockResolvedValue('{') })
		await expect(resolveRepository(session)).rejects.toThrow('invalid rad inspect repository payload')
	})

	it('uses the default module with an explicit missing-authority failure', async () => {
		await expect(createRadicleCliLocalResolverModule().resolvers[0].resolve.Rid.resolve({ rid: repositoryId }, {}))
			.rejects.toThrow('local radicle CLI authority is unavailable')
	})
})

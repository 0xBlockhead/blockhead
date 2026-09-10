import { describe, expect, it, vi } from 'vitest'

import { createRadicleCliLocalServerResolverModule } from '$/resolvers/RadicleCli-Local.server.ts'

const repositoryId = 'rad:z3gqcJUoA1n9HaHKufZs5FCSGazv5D6Dt7Fnx1C4h2kKz'

describe('Radicle CLI server resolver assembly', () => {
	it('injects a configured CLI adapter through the server factory', async () => {
		const adapter = {
			read: vi.fn().mockResolvedValue(JSON.stringify({
				rid: repositoryId,
				name: 'blockhead',
				visibility: 'public',
				git: { repositoryId: 'repo', objectFormat: 'sha256' },
			})),
		}

		const resolver = createRadicleCliLocalServerResolverModule(adapter).resolvers[0]
		const rows = await resolver.resolve.Rid.resolve({ rid: repositoryId }, {})

		expect(adapter.read).toHaveBeenCalledWith({ command: 'rad', args: ['inspect', '--payload', repositoryId] })
		expect(rows).toEqual([expect.objectContaining({
			'__selector': { rid: repositoryId },
			'__fields': expect.objectContaining({ rid: repositoryId, name: 'blockhead' }),
		})])
	})
})

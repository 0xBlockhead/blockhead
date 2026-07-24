import { describe, expect, it, vi } from 'vitest'

import { sourceProviderDefinitions } from '$/sources/$sourceProviders.ts'
import { Source } from '$/sources/Source.ts'
import { SourceTargetKind } from '$/sources/SourceBinding.ts'

const githubClient = vi.hoisted(() => ({
	getGithubContents: vi.fn(),
	getGithubRawText: vi.fn(),
}))

vi.mock('$/sources/_shared/hosts/Github/Http/client.ts', () => githubClient)

const {
	getContents,
	getMediaWikiText,
} = await import('$/sources/DogecoinDips/Github/queries.ts')

const binding = sourceProviderDefinitions
	.flatMap((provider) => provider.bindings)
	.find((candidate) => (
		candidate.source === Source.DogecoinDips_Github
		&& candidate.target.kind === SourceTargetKind.GitRepository
	))

if (binding == null)
	throw new Error('DogecoinDips_Github spec missing source binding')

describe('Dogecoin DIPs GitHub queries', () => {
	it('uses the registered binding endpoint and repository target', async () => {
		githubClient.getGithubContents.mockResolvedValueOnce([])

		await getContents()

		expect(githubClient.getGithubContents).toHaveBeenCalledOnce()
		const [{ endpoints, target }] = githubClient.getGithubContents.mock.calls[0]
		expect(endpoints).toBe(binding.endpoints)
		expect(`${target.owner}/${target.repo}@${target.ref}:${target.path}`).toBe(binding.target.key)
	})

	it('constructs the selected DIP path under the binding-owned repository', async () => {
		githubClient.getGithubRawText.mockResolvedValueOnce('DIP')

		await getMediaWikiText({ number: 70 })

		expect(githubClient.getGithubRawText).toHaveBeenCalledWith({
			endpoints: binding.endpoints,
			target: {
				owner: 'dogecoin',
				repo: 'dips',
				ref: 'master',
				path: 'dip-0070.mediawiki',
			},
		})
	})
})

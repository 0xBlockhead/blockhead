import { beforeEach, describe, expect, it, vi } from 'vitest'

import bindings from '$/sources/Forgejo/bindings.ts'
import { Source } from '$/sources/Source.ts'

const { getJson } = vi.hoisted(() => ({ getJson: vi.fn() }))

vi.mock('$/sources/_shared/wire/HttpRest/client.ts', () => ({ getJson }))

const { getContents, getRepository } = await import('$/sources/Forgejo/Rest/queries.ts')
const binding = bindings[Source.Forgejo_Rest][0]

describe('Forgejo repository transport', () => {
	beforeEach(() => {
		vi.clearAllMocks()
	})

	it.each([
		{
			label: 'repository identity',
			request: () => getRepository({
				binding,
				owner: 'owner/name',
				repo: 'repo?draft=true',
			}),
			path: '/repos/owner%2Fname/repo%3Fdraft%3Dtrue',
		},
		{
			label: 'content path and ref',
			request: () => getContents({
				binding,
				owner: 'owner name',
				repo: 'docs',
				path: 'guides/first page.md',
				ref: 'feature/docs?draft=true',
			}),
			path: '/repos/owner%20name/docs/contents/guides/first%20page.md?ref=feature%2Fdocs%3Fdraft%3Dtrue',
		},
	])('encodes the $label without changing the supplied binding', async ({ request, path }) => {
		getJson.mockResolvedValue([])

		await expect(request()).resolves.toEqual([])
		expect(getJson).toHaveBeenCalledWith(binding, path)
	})

	it('propagates transport failures instead of returning an empty result', async () => {
		getJson.mockRejectedValue(new Error('Forgejo unavailable'))

		await expect(getRepository({
			binding,
			owner: 'owner',
			repo: 'repo',
		})).rejects.toThrow('Forgejo unavailable')
	})
})

import { describe, expect, it, vi } from 'vitest'

import { createGitLocalResolverModule } from '$/resolvers/Git-Local.ts'
import { createGitLocalSession } from '$/sources/Git/Local/platform.ts'
import type { GitLocalSession } from '$/sources/Git/Local/types.ts'

const repositoryId = 'local-repository-1'
const objectId = 'a'.repeat(40)
const payload = {
	repositoryId,
	objectFormat: 'sha1' as const,
	defaultRefName: 'refs/heads/main',
	refs: [{ refName: 'refs/heads/main', refKind: 'branch', targetObjectId: objectId }],
}

const resolveRepository = async (session: GitLocalSession) => createGitLocalResolverModule(session).resolvers[0].resolve.RepositoryId.resolve({ repositoryId }, {})

describe('Git local read resolver boundary', () => {
	it('materializes stable repository identity, format, and refs from injected input', async () => {
		const readRepository = vi.fn().mockResolvedValue(JSON.stringify(payload))
		const rows = await resolveRepository(createGitLocalSession({ readRepository }))
		expect(readRepository).toHaveBeenCalledWith(repositoryId)
		expect(rows).toEqual([expect.objectContaining({
			__selector: { repositoryId },
			__fields: expect.objectContaining({ repositoryId, objectFormat: 'sha1', defaultRefName: 'refs/heads/main', $$refs: [expect.objectContaining({ __fields: expect.objectContaining({ targetObjectId: `0x${objectId}` }) })] }),
		})])
	})

	it('allows security-related words in legitimate ref values', async () => {
		const legitimatePayload = { ...payload, defaultRefName: 'refs/heads/token-path', refs: [{ ...payload.refs[0], refName: 'refs/heads/token-path' }] }
		const rows = await resolveRepository(createGitLocalSession({ readRepository: vi.fn().mockResolvedValue(JSON.stringify(legitimatePayload)) }))
		expect(rows).toEqual([expect.objectContaining({ __fields: expect.objectContaining({ defaultRefName: 'refs/heads/token-path' }) })])
	})

	it.each([
		['mismatched repository', { ...payload, repositoryId: 'other' }],
		['bad object format', { ...payload, objectFormat: 'sha512' }],
		['bad object ID', { ...payload, refs: [{ ...payload.refs[0], targetObjectId: 'bad' }] }],
		['bad ref name', { ...payload, refs: [{ ...payload.refs[0], refName: 'refs/heads/main\n--option' }] }],
		['path field', { ...payload, path: '/Users/example/repo' }],
		['credential field', { ...payload, credential: 'token' }],
		['nested file path field', { ...payload, metadata: { filePath: '/Users/example/repo' } }],
		['nested access token field', { ...payload, metadata: { accessToken: 'value' } }],
	])('rejects %s', async (_label, invalidPayload) => {
		await expect(resolveRepository(createGitLocalSession({ readRepository: vi.fn().mockResolvedValue(JSON.stringify(invalidPayload)) }))).rejects.toThrow()
	})

	it('fails closed when the production authority is absent', async () => {
		await expect(createGitLocalResolverModule().resolvers[0].resolve.RepositoryId.resolve({ repositoryId }, {})).rejects.toThrow('local Git authority is unavailable')
	})
})

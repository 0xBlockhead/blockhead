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
	refs: [
		{ refName: 'refs/heads/main', refKind: 'branch', targetObjectId: objectId },
		{ refName: 'refs/tags/v1.0.0', refKind: 'tag', targetObjectId: 'b'.repeat(40) },
	],
}

const resolveRepository = async (session: GitLocalSession) => createGitLocalResolverModule(session).resolvers[0].resolve.RepositoryId.resolve({ repositoryId }, {})
const resolveRef = async (session: GitLocalSession, refName: string) => createGitLocalResolverModule(session).resolvers[1].resolve.RepositoryRefName.resolve({ $repository: { repositoryId }, refName }, {})

describe('Git local read resolver boundary', () => {
	it('materializes stable repository identity, format, and refs from injected input', async () => {
		const readRepository = vi.fn().mockResolvedValue(JSON.stringify(payload))
		const rows = await resolveRepository(createGitLocalSession({ readRepository }))
		expect(readRepository).toHaveBeenCalledWith(repositoryId)
		expect(rows).toEqual([expect.objectContaining({
			__selector: { repositoryId },
			__fields: expect.objectContaining({ repositoryId, objectFormat: 'sha1', defaultRefName: 'refs/heads/main', $$refs: expect.arrayContaining([expect.objectContaining({ __fields: expect.objectContaining({ targetObjectId: `0x${objectId}` }) })]) }),
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

	it('registers the standalone GitRef resolver for its exact RepositoryRefName selector', () => {
		const resolver = createGitLocalResolverModule().resolvers[1]
		expect(resolver.entityType).toBe('GitRef')
		expect(Object.keys(resolver.resolve)).toEqual(['RepositoryRefName'])
	})

	it.each([
		['branch', payload.refs[0]],
		['tag', payload.refs[1]],
	])('resolves an exact %s selector and projects only GitRef-owned fields', async (_label, ref) => {
		const readRepository = vi.fn().mockResolvedValue(JSON.stringify(payload))
		const rows = await resolveRef(createGitLocalSession({ readRepository }), ref.refName)
		expect(readRepository).toHaveBeenCalledTimes(1)
		expect(rows).toEqual([{
			__selector: { $repository: { repositoryId }, refName: ref.refName },
			__fields: { refName: ref.refName, refKind: ref.refKind, targetObjectId: `0x${ref.targetObjectId}` },
		}])
	})

	it('returns a valid empty result for a missing ref without fabricating fields', async () => {
		const readRepository = vi.fn().mockResolvedValue(JSON.stringify(payload))
		expect(await resolveRef(createGitLocalSession({ readRepository }), 'refs/heads/missing')).toEqual([])
		expect(readRepository).toHaveBeenCalledTimes(1)
	})

	it('rejects a repository mismatch returned by the injected read boundary', async () => {
		const readRepository = vi.fn().mockResolvedValue({ ...payload, repositoryId: 'other-repository' })
		await expect(resolveRef({ readRepository }, 'refs/heads/main')).rejects.toThrow('did not match requested repository')
	})

	it('preserves sha256 target width and the 0x projection', async () => {
		const sha256Target = 'c'.repeat(64)
		const sha256Payload = { ...payload, objectFormat: 'sha256' as const, refs: [{ refName: 'refs/heads/main', refKind: 'branch', targetObjectId: sha256Target }] }
		const rows = await resolveRef(createGitLocalSession({ readRepository: vi.fn().mockResolvedValue(JSON.stringify(sha256Payload)) }), 'refs/heads/main')
		expect(rows[0]).toMatchObject({ __fields: { targetObjectId: `0x${sha256Target}` } })
	})

	it('fails closed for the default browser authority', async () => {
		await expect(resolveRef(createGitLocalSession(), 'refs/heads/main')).rejects.toThrow('local Git authority is unavailable')
	})

	it.each([
		['malformed payload', '{'],
		['unsafe ref', JSON.stringify({ ...payload, refs: [{ ...payload.refs[0], refName: 'refs/heads/main\n--option' }] })],
	])('does not turn %s into an empty success', async (_label, rawPayload) => {
		const session = createGitLocalSession({ readRepository: vi.fn().mockResolvedValue(rawPayload) })
		await expect(resolveRef(session, 'refs/heads/missing')).rejects.toThrow()
	})
})

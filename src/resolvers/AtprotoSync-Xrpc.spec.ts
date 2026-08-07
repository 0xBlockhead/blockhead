import {
	beforeEach,
	describe,
	expect,
	it,
	vi,
} from 'vitest'

import { EntityMetaKey } from '$/schema/$schema.ts'
import { EntityType } from '$/schema/EntityType.ts'
import { Source } from '$/sources/Source.ts'

const getLatestCommit = vi.fn()
const getRepoStatus = vi.fn()

vi.mock('$/sources/AtprotoSync/Xrpc/queries.ts', async (importOriginal) => ({
	...await importOriginal<typeof import('$/sources/AtprotoSync/Xrpc/queries.ts')>(),
	getLatestCommit,
	getRepoStatus,
	defaultAtprotoSyncRelayOrigin: 'https://bsky.network',
}))

const resolverModule = (await import('$/resolvers/AtprotoSync-Xrpc.ts')).default
const repoCommitResolvers = resolverModule.resolvers.filter((resolver) => (
	resolver.entityType === EntityType.AtprotoRepoCommit
))

const resolveByRev = repoCommitResolvers[0]?.resolve.RepoDidRevSource.resolve
const resolveByCommitCid = repoCommitResolvers[1]?.resolve.RepoDidCommitCidSource.resolve

if (resolveByRev == null || resolveByCommitCid == null)
	throw new Error('AtprotoSync-Xrpc AtprotoRepoCommit resolvers are missing')


describe('AtprotoSync-Xrpc AtprotoRepoCommit latest-commit projection', () => {
	beforeEach(() => {
		getLatestCommit.mockReset()
		getRepoStatus.mockReset()
		getLatestCommit.mockResolvedValue({
			commitCid: 'bafyreigbtj4x7ip5legnfznufuopld32owlx3aujofcjblvhwdcxxwrtya',
			rev: '3jzfcijpj2z2a',
		})
		getRepoStatus.mockResolvedValue({
			did: 'did:plc:example',
			active: true,
			rev: '3jzfcijpj2z2a',
		})
	})

	it('projects enrolled identity fields when the requested rev is tip', async () => {
		const snapshot = await resolveByRev({
			repoDid: 'did:plc:example',
			rev: '3jzfcijpj2z2a',
			source: Source.AtprotoSync_Xrpc,
		})

		expect(snapshot).toMatchObject({
			repoDid: 'did:plc:example',
			rev: '3jzfcijpj2z2a',
			source: Source.AtprotoSync_Xrpc,
			commitCid: 'bafyreigbtj4x7ip5legnfznufuopld32owlx3aujofcjblvhwdcxxwrtya',
			relayHost: 'bsky.network',
		})
		expect(repoCommitResolvers[0].projections.$$posts(snapshot)).toEqual([])
		expect(getLatestCommit).toHaveBeenCalledOnce()
		expect(getRepoStatus).toHaveBeenCalledOnce()
	})

	it('rejects tip projection when getRepoStatus rev disagrees with getLatestCommit', async () => {
		getRepoStatus.mockResolvedValue({
			did: 'did:plc:example',
			active: true,
			rev: '3jzfcijpj2z29',
		})

		await expect(resolveByRev({
			repoDid: 'did:plc:example',
			rev: '3jzfcijpj2z2a',
			source: Source.AtprotoSync_Xrpc,
		})).rejects.toThrow('disagrees with getLatestCommit')
	})

	it('rejects non-tip historical revs instead of inventing CAR decode', async () => {
		await expect(resolveByRev({
			repoDid: 'did:plc:example',
			rev: '3jzfcijpj2z29',
			source: Source.AtprotoSync_Xrpc,
		})).rejects.toThrow('is not the latest commit')
	})

	it('projects RepoDidCommitCidSource when the tip CID matches', async () => {
		const snapshot = await resolveByCommitCid({
			repoDid: 'did:plc:example',
			commitCid: 'bafyreigbtj4x7ip5legnfznufuopld32owlx3aujofcjblvhwdcxxwrtya',
			source: Source.AtprotoSync_Xrpc,
		})

		expect(snapshot.commitCid).toBe('bafyreigbtj4x7ip5legnfznufuopld32owlx3aujofcjblvhwdcxxwrtya')
		expect(repoCommitResolvers[1].projections.repoDid(snapshot)).toBe('did:plc:example')
		expect(EntityMetaKey.Selector in (repoCommitResolvers[1].projections.$$posts({
			...snapshot,
			$$posts: [{
				uri: 'at://did:plc:example/app.bsky.feed.post/abc',
			}],
		})[0])).toBe(true)
	})
})

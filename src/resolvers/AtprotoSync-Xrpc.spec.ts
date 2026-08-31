import {
	beforeEach,
	describe,
	expect,
	it,
	vi,
} from 'vitest'

import { Source } from '$/sources/Source.ts'

const getLatestCommit = vi.hoisted(() => vi.fn())
const getRepoStatus = vi.hoisted(() => vi.fn())
const getBlocks = vi.hoisted(() => vi.fn())
const projectAtprotoRepoCommitBlock = vi.hoisted(() => vi.fn())

vi.mock('$/sources/AtprotoSync/Xrpc/queries.ts', async (importOriginal) => ({
	...await importOriginal<typeof import('$/sources/AtprotoSync/Xrpc/queries.ts')>(),
	getLatestCommit,
	getRepoStatus,
	getBlocks,
	defaultAtprotoSyncRelayOrigin: 'https://bsky.network',
}))

vi.mock('$/sources/AtprotoSync/Xrpc/commit.ts', async (importOriginal) => ({
	...await importOriginal<typeof import('$/sources/AtprotoSync/Xrpc/commit.ts')>(),
	projectAtprotoRepoCommitBlock,
}))

const resolverModule = (await import('$/resolvers/AtprotoSync-Xrpc.ts')).default
const repoCommitResolvers = resolverModule.resolvers

const resolveByRev = repoCommitResolvers[0]?.resolve.RepoDidRevSource.resolve
const resolveByCommitCid = repoCommitResolvers[1]?.resolve.RepoDidCommitCidSource.resolve

if (resolveByRev == null || resolveByCommitCid == null)
	throw new Error('AtprotoSync-Xrpc AtprotoRepoCommit resolvers are missing')


describe('AtprotoSync-Xrpc AtprotoRepoCommit latest-commit projection', () => {
	beforeEach(() => {
		getLatestCommit.mockReset()
		getRepoStatus.mockReset()
		getBlocks.mockReset()
		projectAtprotoRepoCommitBlock.mockReset()
		getLatestCommit.mockResolvedValue({
			commitCid: 'bafyreigbtj4x7ip5legnfznufuopld32owlx3aujofcjblvhwdcxxwrtya',
			rev: '3jzfcijpj2z2a',
		})
		getRepoStatus.mockResolvedValue({
			did: 'did:plc:example',
			active: true,
			rev: '3jzfcijpj2z2a',
		})
		getBlocks.mockResolvedValue(new Uint8Array([1, 2, 3]))
		projectAtprotoRepoCommitBlock.mockReturnValue({
			rev: '3jzfcijpj2z2a',
			dataCid: 'bafyreidqz2dr7cr5h62etpb4hlhgkr6o6aw7y5h74sgzcjjsu4sl7w7fxe',
			carByteLength: 3,
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
			dataCid: 'bafyreidqz2dr7cr5h62etpb4hlhgkr6o6aw7y5h74sgzcjjsu4sl7w7fxe',
			carByteLength: 3,
		})
		expect(snapshot).not.toHaveProperty('$$posts')
		expect(snapshot).not.toHaveProperty('operationPaths')
		expect(getLatestCommit).toHaveBeenCalledWith({
			serviceOrigin: 'https://bsky.network',
			did: 'did:plc:example',
		})
		expect(getRepoStatus).toHaveBeenCalledWith({
			serviceOrigin: 'https://bsky.network',
			did: 'did:plc:example',
		})
		expect(getBlocks).toHaveBeenCalledWith({
			serviceOrigin: 'https://bsky.network',
			did: 'did:plc:example',
			cids: ['bafyreigbtj4x7ip5legnfznufuopld32owlx3aujofcjblvhwdcxxwrtya'],
		})
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

	it('rejects a latest commit when the relay marks its repository inactive', async () => {
		getRepoStatus.mockResolvedValue({
			did: 'did:plc:example',
			active: false,
			rev: '3jzfcijpj2z2a',
		})

		await expect(resolveByRev({
			repoDid: 'did:plc:example',
			rev: '3jzfcijpj2z2a',
			source: Source.AtprotoSync_Xrpc,
		})).rejects.toThrow('repository did:plc:example is inactive')
	})

	it('rejects non-tip historical revs instead of inventing CAR decode', async () => {
		await expect(resolveByRev({
			repoDid: 'did:plc:example',
			rev: '3jzfcijpj2z29',
			source: Source.AtprotoSync_Xrpc,
		})).rejects.toThrow('is not the latest commit')
	})

	it('projects RepoDidCommitCidSource directly from its CAR block without tip-only identity', async () => {
		getLatestCommit.mockClear()
		getRepoStatus.mockClear()
		projectAtprotoRepoCommitBlock.mockReturnValueOnce({
			rev: '3historical',
			dataCid: 'bafyreidqz2dr7cr5h62etpb4hlhgkr6o6aw7y5h74sgzcjjsu4sl7w7fxe',
			carByteLength: 3,
		})
		const snapshot = await resolveByCommitCid({
			repoDid: 'did:plc:example',
			commitCid: 'bafyreigbtj4x7ip5legnfznufuopld32owlx3aujofcjblvhwdcxxwrtya',
			source: Source.AtprotoSync_Xrpc,
		})

		expect(snapshot.commitCid).toBe('bafyreigbtj4x7ip5legnfznufuopld32owlx3aujofcjblvhwdcxxwrtya')
		expect(snapshot.rev).toBe('3historical')
		expect(getLatestCommit).not.toHaveBeenCalled()
		expect(getRepoStatus).not.toHaveBeenCalled()
		expect(repoCommitResolvers[1].projections.repoDid(snapshot)).toBe('did:plc:example')
		expect(repoCommitResolvers[1].projections.dataCid(snapshot)).toBe('bafyreidqz2dr7cr5h62etpb4hlhgkr6o6aw7y5h74sgzcjjsu4sl7w7fxe')
		expect(snapshot).not.toHaveProperty('$$posts')
		expect(snapshot).not.toHaveProperty('operationPaths')
	})
})

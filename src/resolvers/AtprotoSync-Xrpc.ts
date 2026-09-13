import {
	defineResolver,
	type RegisteredSourceResolverModule,
} from '$/resolvers/defineResolver.ts'
import { EntityType } from '$/schema/EntityType.ts'
import { Source } from '$/sources/Source.ts'

const getAtprotoCurrentPdsOrigin = async (did: string, signal?: AbortSignal) => {
	const input = signal == null ? { did } : { did, signal }
	if (typeof window === 'undefined')
		return import('$/sources/AtprotoSync/Xrpc/identity.ts').then(({ getCurrentPdsOrigin }) => getCurrentPdsOrigin(input))

	return import('$/sources/AtprotoSync/Xrpc/queries.remote.ts').then(({ getAtprotoCurrentPdsOriginRemote }) => getAtprotoCurrentPdsOriginRemote({ did }))
}

const getAtprotoCommitBlock = async (
	did: string,
	commitCid: string,
	signal?: AbortSignal
) => {
	const serviceOrigin = await getAtprotoCurrentPdsOrigin(did, signal)
	if (typeof window === 'undefined')
		return import('$/sources/AtprotoSync/Xrpc/queries.ts').then(({ getBlocks }) => getBlocks({
			serviceOrigin,
			did,
			cids: [commitCid],
			...(signal != null && { signal }),
		}))

	return import('$/sources/AtprotoSync/Xrpc/queries.remote.ts').then(({ getAtprotoBlocksRemote }) => getAtprotoBlocksRemote({
		serviceOrigin,
		did,
		cids: [commitCid],
	}))
}

const projectLatestCommit = async ({
	repoDid,
	rev,
	commitCid,
}: {
	repoDid: string
	rev?: string
	commitCid?: string
}) => {
	const { projectAtprotoRepoCommitBlock } = await import('$/sources/AtprotoSync/Xrpc/commit.ts')
	const { defaultAtprotoSyncRelayOrigin, getLatestCommit, getRepoStatus } = await import('$/sources/AtprotoSync/Xrpc/queries.ts')
	const input = {
		serviceOrigin: defaultAtprotoSyncRelayOrigin,
		did: repoDid,
	}
	const [latest, status] = await (
		typeof window === 'undefined' ?
			Promise.all([getLatestCommit(input), getRepoStatus(input)])
		:
			import('$/sources/AtprotoSync/Xrpc/queries.remote.ts').then(({ getAtprotoLatestCommitRemote, getAtprotoRepoStatusRemote }) => Promise.all([
				getAtprotoLatestCommitRemote(input),
				getAtprotoRepoStatusRemote(input),
			]))
	)

	if (status.did !== repoDid)
		throw new Error(`AtprotoSync_Xrpc: getRepoStatus did ${status.did} does not match ${repoDid}`)
	if (!status.active)
		throw new Error(`AtprotoSync_Xrpc: repository ${repoDid} is inactive`)

	if (status.rev != null && status.rev !== latest.rev)
		throw new Error(
			`AtprotoSync_Xrpc: getRepoStatus rev ${status.rev} disagrees with getLatestCommit rev ${latest.rev} for ${repoDid}`
		)

	if (rev != null && rev !== latest.rev)
		throw new Error(
			`AtprotoSync_Xrpc: rev ${rev} is not the latest commit for ${repoDid} (latest ${latest.rev}); historical rev CAR decode is not projected yet`
		)

	if (commitCid != null && commitCid !== latest.commitCid)
		throw new Error(
			`AtprotoSync_Xrpc: commitCid ${commitCid} is not the latest commit for ${repoDid} (latest ${latest.commitCid}); historical commit decode is not projected yet`
		)

	const commitBlock = await projectAtprotoRepoCommitBlock({
		car: await getAtprotoCommitBlock(repoDid, latest.commitCid),
		repoDid,
		rev: latest.rev,
		commitCid: latest.commitCid,
	})

	return {
		repoDid,
		source: Source.AtprotoSync_Xrpc,
		commitCid: latest.commitCid,
		...commitBlock,
		relayHost: new URL(defaultAtprotoSyncRelayOrigin).host,
	}
}

const projectCommitByCid = async ({
	repoDid,
	commitCid,
}: {
	repoDid: string
	commitCid: string
}) => {
	const { projectAtprotoRepoCommitBlock } = await import('$/sources/AtprotoSync/Xrpc/commit.ts')
	const commitBlock = await projectAtprotoRepoCommitBlock({
		car: await getAtprotoCommitBlock(repoDid, commitCid),
		repoDid,
		commitCid,
	})

	return {
		repoDid,
		source: Source.AtprotoSync_Xrpc,
		commitCid,
		...commitBlock,
	}
}

const commitApplicability = [{
	source: Source.AtprotoSync_Xrpc,
}] as const

export default {
	source: Source.AtprotoSync_Xrpc,

	resolvers: [
		defineResolver({
			entityType: EntityType.AtprotoRepoCommit,
			resolve: {
				RepoDidRevSource: {
					appliesTo: commitApplicability,
					resolve: async ({
						repoDid,
						rev,
						source,
					}) => {
						if (source !== Source.AtprotoSync_Xrpc)
							throw new Error(`AtprotoSync_Xrpc: unsupported source ${source}`)

						return projectLatestCommit({
							repoDid,
							rev,
						})
					},
				},
			},
		})({
			repoDid: (commit) => commit.repoDid,
			rev: (commit) => commit.rev,
			source: (commit) => commit.source,
			commitCid: (commit) => commit.commitCid,
			previousCommitCid: (commit) => commit.previousCommitCid,
			dataCid: (commit) => commit.dataCid,
			relayHost: (commit) => commit.relayHost,
			carByteLength: (commit) => commit.carByteLength,
		}),

		defineResolver({
			entityType: EntityType.AtprotoRepoCommit,
			resolve: {
				RepoDidCommitCidSource: {
					appliesTo: commitApplicability,
					resolve: async ({
						repoDid,
						commitCid,
						source,
					}) => {
						if (source !== Source.AtprotoSync_Xrpc)
							throw new Error(`AtprotoSync_Xrpc: unsupported source ${source}`)

						return projectCommitByCid({
							repoDid,
							commitCid,
						})
					},
				},
			},
		})({
			repoDid: (commit) => commit.repoDid,
			rev: (commit) => commit.rev,
			source: (commit) => commit.source,
			commitCid: (commit) => commit.commitCid,
			previousCommitCid: (commit) => commit.previousCommitCid,
			dataCid: (commit) => commit.dataCid,
			carByteLength: (commit) => commit.carByteLength,
		}),
	].map((resolver) => ({
		...resolver,
		source: Source.AtprotoSync_Xrpc,
	})),
} satisfies RegisteredSourceResolverModule

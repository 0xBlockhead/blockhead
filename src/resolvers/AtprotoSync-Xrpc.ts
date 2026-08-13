import {
	defineResolver,
	type RegisteredSourceResolverModule,
} from '$/resolvers/defineResolver.ts'
import {
	EntityMetaKey,
} from '$/schema/$schema.ts'
import { EntityType } from '$/schema/EntityType.ts'
import {
	defaultAtprotoSyncRelayOrigin,
	getBlocks,
	getLatestCommit,
	getRepoStatus,
} from '$/sources/AtprotoSync/Xrpc/queries.ts'
import { Source } from '$/sources/Source.ts'
import { projectAtprotoRepoCommitBlock } from '$/sources/AtprotoSync/Xrpc/commit.ts'

const getAtprotoLatestCommit = async (did: string) => (
	typeof window === 'undefined' ?
		await getLatestCommit({
			serviceOrigin: defaultAtprotoSyncRelayOrigin,
			did,
		})
	:
		await import('$/sources/AtprotoSync/Xrpc/queries.remote.ts').then(({ getAtprotoLatestCommitRemote }) => getAtprotoLatestCommitRemote({
			serviceOrigin: defaultAtprotoSyncRelayOrigin,
			did,
		}))
)

const getAtprotoRepoStatus = async (did: string) => (
	typeof window === 'undefined' ?
		await getRepoStatus({
			serviceOrigin: defaultAtprotoSyncRelayOrigin,
			did,
		})
	:
		await import('$/sources/AtprotoSync/Xrpc/queries.remote.ts').then(({ getAtprotoRepoStatusRemote }) => getAtprotoRepoStatusRemote({
			serviceOrigin: defaultAtprotoSyncRelayOrigin,
			did,
		}))
)

const getAtprotoCommitBlock = async (
	did: string,
	commitCid: string
) => (
	typeof window === 'undefined' ?
		await getBlocks({
			serviceOrigin: defaultAtprotoSyncRelayOrigin,
			did,
			cids: [commitCid],
		})
	:
		await import('$/sources/AtprotoSync/Xrpc/queries.remote.ts').then(({ getAtprotoBlocksRemote }) => getAtprotoBlocksRemote({
			serviceOrigin: defaultAtprotoSyncRelayOrigin,
			did,
			cids: [commitCid],
		}))
)

const projectLatestCommit = async ({
	repoDid,
	rev,
	commitCid,
}: {
	repoDid: string
	rev?: string
	commitCid?: string
}) => {
	const [latest, status] = await Promise.all([
		getAtprotoLatestCommit(repoDid),
		getAtprotoRepoStatus(repoDid),
	])

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
		operationPaths: [],
		createdRecordCids: [],
		updatedRecordCids: [],
		deletedRecordPaths: [],
		$$posts: [],
	}
}

const projectCommitByCid = async ({
	repoDid,
	commitCid,
}: {
	repoDid: string
	commitCid: string
}) => {
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
		relayHost: new URL(defaultAtprotoSyncRelayOrigin).host,
		operationPaths: [],
		createdRecordCids: [],
		updatedRecordCids: [],
		deletedRecordPaths: [],
		$$posts: [],
	}
}

export default {
	source: Source.AtprotoSync_Xrpc,

	resolvers: [
		defineResolver({
			entityType: EntityType.AtprotoRepoCommit,
			resolve: {
				RepoDidRevSource: {
					appliesTo: [{
						source: Source.AtprotoSync_Xrpc,
					}],
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
			previousRev: (commit) => commit.previousRev,
			previousDataCid: (commit) => commit.previousDataCid,
			dataCid: (commit) => commit.dataCid,
			sequence: (commit) => commit.sequence,
			pdsHost: (commit) => commit.pdsHost,
			relayHost: (commit) => commit.relayHost,
			time: (commit) => commit.time,
			tooBig: (commit) => commit.tooBig,
			rebase: (commit) => commit.rebase,
			operationCount: (commit) => commit.operationCount,
			blobCount: (commit) => commit.blobCount,
			carByteLength: (commit) => commit.carByteLength,
			operationPaths: (commit) => commit.operationPaths,
			createdRecordCids: (commit) => commit.createdRecordCids,
			updatedRecordCids: (commit) => commit.updatedRecordCids,
			deletedRecordPaths: (commit) => commit.deletedRecordPaths,
			$$posts: (commit) => (
				commit.$$posts.map((post) => ({
					[EntityMetaKey.Selector]: {
						uri: post.uri,
					},
				}))
			),
		}),

		defineResolver({
			entityType: EntityType.AtprotoRepoCommit,
			resolve: {
				RepoDidCommitCidSource: {
					appliesTo: [{
						source: Source.AtprotoSync_Xrpc,
					}],
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
			previousRev: (commit) => commit.previousRev,
			previousDataCid: (commit) => commit.previousDataCid,
			dataCid: (commit) => commit.dataCid,
			sequence: (commit) => commit.sequence,
			pdsHost: (commit) => commit.pdsHost,
			relayHost: (commit) => commit.relayHost,
			time: (commit) => commit.time,
			tooBig: (commit) => commit.tooBig,
			rebase: (commit) => commit.rebase,
			operationCount: (commit) => commit.operationCount,
			blobCount: (commit) => commit.blobCount,
			carByteLength: (commit) => commit.carByteLength,
			operationPaths: (commit) => commit.operationPaths,
			createdRecordCids: (commit) => commit.createdRecordCids,
			updatedRecordCids: (commit) => commit.updatedRecordCids,
			deletedRecordPaths: (commit) => commit.deletedRecordPaths,
			$$posts: (commit) => (
				commit.$$posts.map((post) => ({
					[EntityMetaKey.Selector]: {
						uri: post.uri,
					},
				}))
			),
		}),
	],
} satisfies RegisteredSourceResolverModule

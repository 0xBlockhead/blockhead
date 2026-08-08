import {
	defineResolver,
	type RegisteredSourceResolverModule,
} from '$/resolvers/defineResolver.ts'
import {
	EntityMetaKey,
} from '$/schema/$schema.ts'
import { EntityType } from '$/schema/EntityType.ts'
import bindings from '$/sources/AtprotoSync/bindings.ts'
import {
	getLatestCommit,
	getRepoStatus,
} from '$/sources/AtprotoSync/Xrpc/queries.ts'
import { Source } from '$/sources/Source.ts'
import { SourceDelivery } from '$/sources/SourceBinding.ts'

const defaultAtprotoSyncRelayOrigin = 'https://bsky.network'

const remoteQueryBinding = bindings[Source.AtprotoSync_Xrpc].find((binding) => (
	binding.delivery === SourceDelivery.RemoteQuery
))

if (remoteQueryBinding == null)
	throw new Error('AtprotoSync_Xrpc: RemoteQuery binding is missing')

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
		getLatestCommit({
			binding: remoteQueryBinding,
			serviceOrigin: defaultAtprotoSyncRelayOrigin,
			did: repoDid,
		}),
		getRepoStatus({
			binding: remoteQueryBinding,
			serviceOrigin: defaultAtprotoSyncRelayOrigin,
			did: repoDid,
		}),
	])

	if (status.did !== repoDid)
		throw new Error(`AtprotoSync_Xrpc: getRepoStatus did ${status.did} does not match ${repoDid}`)

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

	return {
		repoDid,
		rev: latest.rev,
		source: Source.AtprotoSync_Xrpc,
		commitCid: latest.commitCid,
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

						return projectLatestCommit({
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

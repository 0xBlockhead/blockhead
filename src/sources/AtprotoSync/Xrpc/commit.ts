import { type } from 'arktype'

import { atprotoCidString } from '$/sources/AtprotoSync/Xrpc/cid.ts'
import { Source } from '$/sources/Source.ts'


const repoOpWire = type({
	action: "'create' | 'update' | 'delete'",
	path: 'string',
	cid: 'unknown | null',
	'prev?': 'unknown',
})

const subscribeReposCommitWire = type({
	seq: 'number.integer',
	rebase: 'boolean',
	tooBig: 'boolean',
	repo: 'string',
	commit: 'unknown',
	rev: 'string',
	since: 'string | null',
	blocks: type.instanceOf(Uint8Array),
	ops: repoOpWire.array(),
	blobs: 'unknown[]',
	time: 'string',
	'prevData?': 'unknown',
})


export type AtprotoRepoCommitProjection = {
	repoDid: string
	rev: string
	source: Source.AtprotoSync_Xrpc
	commitCid: string
	previousRev?: string
	previousDataCid?: string
	sequence: bigint
	pdsHost?: string
	relayHost?: string
	time?: number
	tooBig: boolean
	rebase: boolean
	operationCount: number
	blobCount: number
	carByteLength: number
	operationPaths: string[]
	createdRecordCids: string[]
	updatedRecordCids: string[]
	deletedRecordPaths: string[]
	$$posts: {
		uri: string
	}[]
}


const hostFromServiceOrigin = (
	serviceOrigin: string | undefined
) => {
	if (serviceOrigin == null)
		return undefined
	try {
		return new URL(serviceOrigin).host
	} catch {
		return undefined
	}
}


const optionalCidString = (
	value: unknown
) => {
	if (value == null)
		return undefined
	const cid = atprotoCidString(value)
	if (cid == null)
		throw new Error('AtprotoSync_Xrpc: malformed CID link in commit body')
	return cid
}


export const projectAtprotoRepoCommitFromSubscribeReposBody = ({
	body,
	serviceOrigin,
	hostKind = 'relay',
}: {
	body: unknown
	serviceOrigin?: string
	hostKind?: 'pds' | 'relay'
}): AtprotoRepoCommitProjection => {
	const wire = subscribeReposCommitWire(body)
	if (wire instanceof type.errors)
		throw new Error(`AtprotoSync_Xrpc: malformed #commit body: ${wire.summary}`)

	const commitCid = atprotoCidString(wire.commit)
	if (commitCid == null)
		throw new Error('AtprotoSync_Xrpc: #commit missing commit CID')

	const previousDataCid = optionalCidString(wire.prevData)
	const host = hostFromServiceOrigin(serviceOrigin)
	const createdRecordCids: string[] = []
	const updatedRecordCids: string[] = []
	const deletedRecordPaths: string[] = []
	const posts: {
		uri: string
	}[] = []

	for (const op of wire.ops) {
		if (op.action === 'delete') {
			deletedRecordPaths.push(op.path)
			continue
		}

		const recordCid = optionalCidString(op.cid)
		if (recordCid == null)
			throw new Error(`AtprotoSync_Xrpc: #commit ${op.action} op missing record CID`)

		if (op.action === 'create')
			createdRecordCids.push(recordCid)
		else
			updatedRecordCids.push(recordCid)

		if (op.path.startsWith('app.bsky.feed.post/'))
			posts.push({
				uri: `at://${wire.repo}/${op.path}`,
			})
	}

	const blobCids = wire.blobs.map((blob) => {
		const cid = atprotoCidString(blob)
		if (cid == null)
			throw new Error('AtprotoSync_Xrpc: malformed blob CID in #commit body')
		return cid
	})

	const timeMs = Date.parse(wire.time)

	return {
		repoDid: wire.repo,
		rev: wire.rev,
		source: Source.AtprotoSync_Xrpc,
		commitCid,
		...(wire.since != null && wire.since !== '' && {
			previousRev: wire.since,
		}),
		...(previousDataCid != null && {
			previousDataCid,
		}),
		sequence: BigInt(wire.seq),
		...(host != null && (
			hostKind === 'pds' ?
				{
					pdsHost: host,
				}
			:
				{
					relayHost: host,
				}
		)),
		...(Number.isFinite(timeMs) && {
			time: timeMs,
		}),
		tooBig: wire.tooBig,
		rebase: wire.rebase,
		operationCount: wire.ops.length,
		blobCount: blobCids.length,
		carByteLength: wire.blocks.byteLength,
		operationPaths: wire.ops.map((op) => op.path),
		createdRecordCids,
		updatedRecordCids,
		deletedRecordPaths,
		$$posts: posts,
	}
}


const latestCommitWire = type({
	cid: 'string',
	rev: 'string',
})

const repoStatusWire = type({
	did: 'string',
	active: 'boolean',
	'rev?': 'string',
	'status?': 'string',
})


export const parseGetLatestCommitResponse = (
	body: unknown
) => {
	const wire = latestCommitWire(body)
	if (wire instanceof type.errors)
		throw new Error(`AtprotoSync_Xrpc: malformed getLatestCommit response: ${wire.summary}`)

	const commitCid = atprotoCidString(wire.cid)
	if (commitCid == null)
		throw new Error('AtprotoSync_Xrpc: getLatestCommit returned a malformed cid')

	return {
		commitCid,
		rev: wire.rev,
	}
}


export const parseGetRepoStatusResponse = (
	body: unknown
) => {
	const wire = repoStatusWire(body)
	if (wire instanceof type.errors)
		throw new Error(`AtprotoSync_Xrpc: malformed getRepoStatus response: ${wire.summary}`)

	return {
		did: wire.did,
		active: wire.active,
		...(wire.rev != null && wire.rev !== '' && {
			rev: wire.rev,
		}),
		...(wire.status != null && wire.status !== '' && {
			status: wire.status,
		}),
	}
}

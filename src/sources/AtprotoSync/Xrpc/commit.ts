import { type } from 'arktype'
import { decode } from 'cborg'
import { CID } from 'multiformats/cid'
import { sha256 } from 'multiformats/hashes/sha2'

import {
	atprotoCidLinkTag,
	atprotoCidLinkTagDecoder,
	atprotoCidString,
} from '$/sources/AtprotoSync/Xrpc/cid.ts'
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

const repoCommitBlockWire = type({
	did: 'string',
	version: 'number.integer',
	data: 'unknown',
	rev: 'string',
	prev: 'unknown | null',
	sig: type.instanceOf(Uint8Array),
}).onUndeclaredKey('delete')

const carHeaderWire = type({
	version: '1',
	roots: 'unknown[]',
}).onUndeclaredKey('delete')


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


const readUnsignedVarint = (
	bytes: Uint8Array,
	offset: number
) => {
	let value = 0
	let multiplier = 1
	for (let index = offset; index < bytes.byteLength && index < offset + 10; index++) {
		const byte = bytes[index]
		value += (byte & 0x7f) * multiplier
		if ((byte & 0x80) === 0) {
			if (!Number.isSafeInteger(value))
				throw new Error('AtprotoSync_Xrpc: CAR section length exceeds safe integer range')

			return {
				value,
				nextOffset: index + 1,
			}
		}
		multiplier *= 128
	}

	throw new Error('AtprotoSync_Xrpc: malformed CAR section length')
}

export const projectAtprotoRepoCommitBlock = async ({
	car,
	repoDid,
	rev,
	commitCid,
}: {
	car: Uint8Array
	repoDid: string
	rev?: string
	commitCid: string
}) => {
	const headerLength = readUnsignedVarint(car, 0)
	const headerEnd = headerLength.nextOffset + headerLength.value
	if (headerEnd > car.byteLength)
		throw new Error('AtprotoSync_Xrpc: truncated CAR header')

	let decodedHeader
	try {
		decodedHeader = decode(car.subarray(headerLength.nextOffset, headerEnd), {
			tags: {
				[atprotoCidLinkTag]: atprotoCidLinkTagDecoder,
			},
		})
	} catch (error) {
		throw new Error('AtprotoSync_Xrpc: malformed CAR header', { cause: error })
	}
	const header = carHeaderWire(decodedHeader)
	if (header instanceof type.errors)
		throw new Error(`AtprotoSync_Xrpc: malformed CAR header: ${header.summary}`)
	if (!header.roots.some((root) => atprotoCidString(root) === commitCid))
		throw new Error('AtprotoSync_Xrpc: CAR root does not match requested commit CID')

	let offset = headerEnd
	while (offset < car.byteLength) {
		const sectionLength = readUnsignedVarint(car, offset)
		const sectionEnd = sectionLength.nextOffset + sectionLength.value
		if (sectionEnd > car.byteLength)
			throw new Error('AtprotoSync_Xrpc: truncated CAR block')
		const [blockCid, blockBytes] = CID.decodeFirst(
			car.subarray(sectionLength.nextOffset, sectionEnd)
		)
		offset = sectionEnd
		if (blockCid.toString() !== commitCid)
			continue
		const blockDigest = await sha256.digest(blockBytes)
		if (
			blockCid.multihash.code !== blockDigest.code
			|| blockCid.multihash.digest.byteLength !== blockDigest.digest.byteLength
			|| !blockCid.multihash.digest.every((byte, index) => byte === blockDigest.digest[index])
		)
			throw new Error('AtprotoSync_Xrpc: repository commit block does not match its CID digest')

		let decodedCommit
		try {
			decodedCommit = decode(blockBytes, {
				tags: {
					[atprotoCidLinkTag]: atprotoCidLinkTagDecoder,
				},
			})
		} catch (error) {
			throw new Error('AtprotoSync_Xrpc: malformed repository commit block', { cause: error })
		}
		const commit = repoCommitBlockWire(decodedCommit)
		if (commit instanceof type.errors)
			throw new Error(`AtprotoSync_Xrpc: malformed repository commit block: ${commit.summary}`)
		if (commit.did !== repoDid || (rev != null && commit.rev !== rev))
			throw new Error('AtprotoSync_Xrpc: repository commit block identity does not match request')
		if (commit.version !== 3)
			throw new Error(`AtprotoSync_Xrpc: unsupported repository commit version ${commit.version}`)
		const dataCid = atprotoCidString(commit.data)
		if (dataCid == null)
			throw new Error('AtprotoSync_Xrpc: repository commit block has malformed data CID')
		const previousCommitCid = optionalCidString(commit.prev)

		return {
			rev: commit.rev,
			dataCid,
			...(previousCommitCid != null && { previousCommitCid }),
			carByteLength: car.byteLength,
		}
	}

	throw new Error('AtprotoSync_Xrpc: CAR is missing the requested repository commit block')
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


const listReposRepoWire = type({
	did: 'string',
	head: 'string',
	rev: 'string',
	'active?': 'boolean',
	'status?': 'string',
}).onUndeclaredKey('delete')

const listReposWire = type({
	repos: listReposRepoWire.array(),
	'cursor?': 'string',
}).onUndeclaredKey('delete')

const listHostsHostWire = type({
	hostname: 'string',
	'seq?': 'number.integer',
	'accountCount?': 'number.integer',
	'status?': 'string',
}).onUndeclaredKey('delete')

const listHostsWire = type({
	hosts: listHostsHostWire.array(),
	'cursor?': 'string',
}).onUndeclaredKey('delete')

const getHostStatusWire = type({
	hostname: 'string',
	'seq?': 'number.integer',
	'accountCount?': 'number.integer',
	'status?': 'string',
}).onUndeclaredKey('delete')


export const parseListReposResponse = (
	body: unknown
) => {
	const wire = listReposWire(body)
	if (wire instanceof type.errors)
		throw new Error(`AtprotoSync_Xrpc: malformed listRepos response: ${wire.summary}`)

	return {
		repos: wire.repos.map((repo) => {
			const commitCid = atprotoCidString(repo.head)
			if (commitCid == null)
				throw new Error('AtprotoSync_Xrpc: listRepos returned a malformed head CID')

			return {
				did: repo.did,
				commitCid,
				rev: repo.rev,
				...(repo.active != null && {
					active: repo.active,
				}),
				...(repo.status != null && repo.status !== '' && {
					status: repo.status,
				}),
			}
		}),
		...(wire.cursor != null && wire.cursor !== '' && {
			cursor: wire.cursor,
		}),
	}
}


export const parseListHostsResponse = (
	body: unknown
) => {
	const wire = listHostsWire(body)
	if (wire instanceof type.errors)
		throw new Error(`AtprotoSync_Xrpc: malformed listHosts response: ${wire.summary}`)

	return {
		hosts: wire.hosts.map((host) => ({
			hostname: host.hostname,
			...(host.seq != null && {
				seq: host.seq,
			}),
			...(host.accountCount != null && {
				accountCount: host.accountCount,
			}),
			...(host.status != null && host.status !== '' && {
				status: host.status,
			}),
		})),
		...(wire.cursor != null && wire.cursor !== '' && {
			cursor: wire.cursor,
		}),
	}
}


export const parseGetHostStatusResponse = (
	body: unknown
) => {
	const wire = getHostStatusWire(body)
	if (wire instanceof type.errors)
		throw new Error(`AtprotoSync_Xrpc: malformed getHostStatus response: ${wire.summary}`)

	return {
		hostname: wire.hostname,
		...(wire.seq != null && {
			seq: wire.seq,
		}),
		...(wire.accountCount != null && {
			accountCount: wire.accountCount,
		}),
		...(wire.status != null && wire.status !== '' && {
			status: wire.status,
		}),
	}
}

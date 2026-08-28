import { type } from 'arktype'
import {
	decode,
	decodeFirst,
} from 'cborg'

import {
	atprotoCidLinkTag,
	atprotoCidLinkTagDecoder,
} from '$/sources/AtprotoSync/Xrpc/cid.ts'
import type { AtprotoSyncSubscribeReposMessage } from '$/sources/AtprotoSync/Xrpc/types.ts'


const frameHeader = type({
	op: 'number.integer',
	't?': 'string',
})
const frameBody = type('object')
const errorFrameBody = type({
	error: 'string',
	'message?': 'string',
})
const knownMessageType = type.enumerated(
	'#account',
	'#commit',
	'#identity',
	'#info',
	'#sync'
)

const atprotoSyncCborTags = {
	[atprotoCidLinkTag]: atprotoCidLinkTagDecoder,
}


export const decodeAtprotoSyncFrame = (
	frame: Uint8Array
): AtprotoSyncSubscribeReposMessage | undefined => {
	let decodedHeader
	let bodyBytes
	try {
		[decodedHeader, bodyBytes] = decodeFirst(frame)
	} catch (error) {
		throw new Error('AtprotoSync_Xrpc: malformed subscribeRepos frame header', {
			cause: error,
		})
	}

	const header = frameHeader(decodedHeader)
	if (header instanceof type.errors)
		throw new Error(`AtprotoSync_Xrpc: malformed subscribeRepos frame header: ${header.summary}`)

	let decodedBody
	try {
		decodedBody = decode(bodyBytes, {
			tags: atprotoSyncCborTags,
		})
	} catch (error) {
		throw new Error('AtprotoSync_Xrpc: malformed subscribeRepos frame body', {
			cause: error,
		})
	}

	if (header.op === -1) {
		const body = errorFrameBody(decodedBody)
		if (body instanceof type.errors)
			throw new Error(`AtprotoSync_Xrpc: malformed subscribeRepos error frame: ${body.summary}`)

		throw new Error(`AtprotoSync_Xrpc: ${body.error}${body.message == null ? '' : `: ${body.message}`}`)
	}

	if (
		header.op !== 1
		|| header.t == null
	)
		return undefined

	const messageType = knownMessageType(header.t)
	if (messageType instanceof type.errors)
		return undefined

	const body = frameBody(decodedBody)
	if (body instanceof type.errors)
		throw new Error(`AtprotoSync_Xrpc: malformed subscribeRepos frame body: ${body.summary}`)

	return {
		type: messageType,
		body,
	}
}

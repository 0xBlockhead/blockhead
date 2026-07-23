import { schnorr } from '@noble/curves/secp256k1.js'
import * as Bytes from 'ox/Bytes'
import * as Hash from 'ox/Hash'
import * as Hex from 'ox/Hex'

import {
	isJsonArray,
	isJsonNumber,
	isJsonString,
	type JsonValue,
} from '$/typescript/JsonValue.ts'


// Types
export type NostrEventEnvelope = {
	id: string
	pubkey: string
	created_at: number
	kind: number
	tags: string[][]
	content: string
	sig: string
}

export type NostrEventCandidate = {
	id?: JsonValue
	pubkey?: JsonValue
	created_at?: JsonValue
	kind?: JsonValue
	tags?: JsonValue
	content?: JsonValue
	sig?: JsonValue
}

export type NostrEventExpectation = {
	eventId?: string
	pubkey?: string
	kinds?: readonly number[]
	identifier?: string
}


// Functions
export const nostrEventId = (event: Pick<
	NostrEventEnvelope,
	| 'pubkey'
	| 'created_at'
	| 'kind'
	| 'tags'
	| 'content'
>) => Hex.fromBytes(Hash.sha256(Bytes.fromString(JSON.stringify([
	0,
	event.pubkey,
	event.created_at,
	event.kind,
	event.tags,
	event.content,
])), { as: 'Bytes' })).slice(2)

export const validateNostrEvent = (
	event: NostrEventCandidate,
	expectation: NostrEventExpectation = {}
) => {
	if (!isJsonString(event.id) || !/^[0-9a-f]{64}$/.test(event.id))
		throw new Error('NIP-01 event id must be 32-byte lowercase hex')
	if (!isJsonString(event.pubkey) || !/^[0-9a-f]{64}$/.test(event.pubkey))
		throw new Error('NIP-01 pubkey must be 32-byte lowercase hex')
	if (!isJsonString(event.sig) || !/^[0-9a-f]{128}$/.test(event.sig))
		throw new Error('NIP-01 signature must be 64-byte lowercase hex')
	if (!isJsonNumber(event.created_at) || !Number.isSafeInteger(event.created_at))
		throw new Error('NIP-01 created_at must be a safe integer')
	if (!isJsonNumber(event.kind) || !Number.isSafeInteger(event.kind) || event.kind < 0 || event.kind > 65_535)
		throw new Error('NIP-01 kind must be a safe integer from 0 through 65535')
	if (
		!isJsonArray(event.tags)
		|| !event.tags.every((tag) => (
			isJsonArray(tag)
			&& tag.every(isJsonString)
		))
	)
		throw new Error('NIP-01 tags must be arrays containing only strings')
	if (!isJsonString(event.content))
		throw new Error('NIP-01 content must be a string')

	const validatedEvent = {
		id: event.id,
		pubkey: event.pubkey,
		created_at: event.created_at,
		kind: event.kind,
		tags: event.tags.map((tag) => (
			isJsonArray(tag) ? tag.filter(isJsonString) : []
		)),
		content: event.content,
		sig: event.sig,
	}

	const canonicalEventId = nostrEventId(validatedEvent)
	if (validatedEvent.id !== canonicalEventId)
		throw new Error('NIP-01 event id does not match canonical serialization')
	if (!schnorr.verify(
		Hex.toBytes(`0x${validatedEvent.sig}`),
		Hex.toBytes(`0x${canonicalEventId}`),
		Hex.toBytes(`0x${validatedEvent.pubkey}`)
	))
		throw new Error('NIP-01 event signature is invalid')
	if (expectation.eventId != null && validatedEvent.id !== expectation.eventId)
		throw new Error('NIP-01 event does not match the requested event id')
	if (expectation.pubkey != null && validatedEvent.pubkey !== expectation.pubkey)
		throw new Error('NIP-01 event does not match the requested pubkey')
	if (expectation.kinds != null && !expectation.kinds.includes(validatedEvent.kind))
		throw new Error('NIP-01 event kind is not valid for the requested entity')
	if (
		expectation.identifier != null
		&& !validatedEvent.tags.some((tag) => (
			tag[0] === 'd'
			&& tag[1] === expectation.identifier
		))
	)
		throw new Error('NIP-01 event does not match the requested identifier')
	return validatedEvent
}

export const validatedNostrEventFromContent = (
	content: string,
	expectation: NostrEventExpectation = {}
) => {
	try {
		return validateNostrEvent(JSON.parse(content), expectation)
	} catch {
		return undefined
	}
}

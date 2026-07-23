import { schnorr } from '@noble/curves/secp256k1.js'
import * as Hex from 'ox/Hex'
import {
	describe,
	expect,
	it,
} from 'vitest'

import {
	nostrEventId,
	type NostrEventEnvelope,
	validateNostrEvent,
} from '$/sources/NostrRelay/Nip01/event.ts'


const secretKey = Hex.toBytes(`0x${'01'.repeat(32)}`)
const pubkey = Hex.fromBytes(schnorr.getPublicKey(secretKey)).slice(2)
const signedEvent = (
	kind: number,
	overrides: Partial<Omit<NostrEventEnvelope, 'id' | 'sig'>> = {}
) => {
	const unsignedEvent = {
		pubkey,
		created_at: 1_700_000_000,
		kind,
		tags: kind === 30_023 ? [['d', 'article']] : [['t', 'blockhead']],
		content: 'Signed Nostr event',
		...overrides,
	}
	const id = nostrEventId(unsignedEvent)
	return {
		...unsignedEvent,
		id,
		sig: Hex.fromBytes(schnorr.sign(Hex.toBytes(`0x${id}`), secretKey, new Uint8Array(32))).slice(2),
	}
}

describe('NIP-01 event validation', () => {
	it.each([
		0,
		1,
		6,
		7,
		16,
		30_023,
	])('validates a canonical signed kind %s envelope', (kind) => {
		const event = signedEvent(kind)
		expect(validateNostrEvent(event, {
			eventId: event.id,
			pubkey,
			kinds: [kind],
			...(kind === 30_023 && { identifier: 'article' }),
		})).toEqual(event)
	})

	it.each([
		['content', (event: NostrEventEnvelope) => ({ ...event, content: 'mutated' })],
		['tag', (event: NostrEventEnvelope) => ({ ...event, tags: [['t', 'mutated']] })],
		['pubkey', (event: NostrEventEnvelope) => ({ ...event, pubkey: '02'.repeat(32) })],
		['id', (event: NostrEventEnvelope) => ({ ...event, id: '03'.repeat(32) })],
		['signature', (event: NostrEventEnvelope) => ({ ...event, sig: '04'.repeat(64) })],
		['kind', (event: NostrEventEnvelope) => ({ ...event, kind: 7 })],
	] as const)('rejects a signed-envelope %s mutation', (_label, mutate) => {
		expect(() => validateNostrEvent(mutate(signedEvent(1)))).toThrow()
	})

	it.each([
		{ id: 'AA'.repeat(32) },
		{ pubkey: 'AA'.repeat(32) },
		{ sig: 'AA'.repeat(64) },
		{ created_at: 1.5 },
		{ created_at: Number.MAX_SAFE_INTEGER + 1 },
		{ kind: -1 },
		{ kind: 65_536 },
		{ tags: [['e', null]] },
		{ tags: [['e', 1]] },
	])('rejects malformed canonical fields %#', (override) => {
		expect(() => validateNostrEvent({
			...signedEvent(1),
			...override,
		})).toThrow()
	})

	it('accepts empty tags and empty relay-hint placeholders', () => {
		expect(validateNostrEvent(signedEvent(1, {
			tags: [
				[],
				['e', '01'.repeat(32), '', 'reply'],
			],
	}))).toBeDefined()
	})

	it('accepts a signed safe-integer clock before the Unix epoch', () => {
		expect(validateNostrEvent(signedEvent(1, {
			created_at: -1,
		}))).toBeDefined()
	})

	it('rejects selector, kind, author, and addressable-coordinate disagreement', () => {
		const event = signedEvent(30_023)
		for (const expectation of [
			{ eventId: '05'.repeat(32) },
			{ pubkey: '06'.repeat(32) },
			{ kinds: [1] },
			{ identifier: 'different' },
		])
			expect(() => validateNostrEvent(event, expectation)).toThrow()
	})
})

import {
	beforeEach,
	describe,
	expect,
	it,
	vi,
} from 'vitest'
import { schnorr } from '@noble/curves/secp256k1.js'
import * as Hex from 'ox/Hex'

import {
	EntityMetaKey,
	entityFieldAddressKey,
} from '$/schema/$schema.ts'
import { EntityType } from '$/schema/EntityType.ts'
import { nostrEventId } from '$/sources/NostrRelay/Nip01/event.ts'
import { Source } from '$/sources/Source.ts'

const getNoteActions = vi.hoisted(() => vi.fn())
const getProfileNotes = vi.hoisted(() => vi.fn())
const search = vi.hoisted(() => vi.fn())

vi.mock('$/sources/Primal/Rest/queries.ts', async (importOriginal) => {
	const original = await importOriginal<typeof import('$/sources/Primal/Rest/queries.ts')>()
	return {
		...original,
		getNoteActions,
		getProfileNotes,
		search,
	}
})

const { default: primalRest } = await import('$/resolvers/Primal-Rest.ts')

const context = {
	filters: [],
	sorts: [],
	pagination: {
		limit: 16,
		offset: 0,
	},
	selectorKeys: [],
	parentSelectorKeys: [],
	sources: [],
	publicEnv: {},
}

const resolver = (
	entityType: EntityType,
	projection?: string
) => {
	const match = primalRest.resolvers.find((entry) => (
		entry.entityType === entityType
		&& (
			projection == null
			|| projection in entry.projections
		)
	))
	if (match == null)
		throw new Error(`missing Primal resolver for ${entityType}${projection == null ? '' : ` ${projection}`}`)
	return match
}

const secretKey = Hex.toBytes(`0x${'02'.repeat(32)}`)
const pubkey = Hex.fromBytes(schnorr.getPublicKey(secretKey)).slice(2)
const signedEvent = (
	tags: string[][],
	kind = 1,
	content = 'fixture',
	createdAt = 1_700_000_000
) => {
	const unsignedEvent = {
		pubkey,
		kind,
		created_at: createdAt,
		content,
		tags,
	}
	const id = nostrEventId(unsignedEvent)
	return {
		...unsignedEvent,
		id,
		sig: Hex.fromBytes(schnorr.sign(Hex.toBytes(`0x${id}`), secretKey, new Uint8Array(32))).slice(2),
	}
}

beforeEach(() => {
	getNoteActions.mockReset()
	getProfileNotes.mockReset()
	search.mockReset()
})

describe('Primal Rest enrolled leftovers', () => {
	it('exposes authoritative reply/reaction counts from complete windows', async () => {
		const noteId = '3'.repeat(64)
		const reply = signedEvent([
			['e', noteId, '', 'reply'],
		])
		const reaction = signedEvent([
			['e', noteId],
		], 7, '+')
		getNoteActions
			.mockResolvedValueOnce({
				actions: [
					reply,
				],
			})
			.mockResolvedValueOnce({
				actions: [
					reaction,
				],
			})

		const replies = resolver(
			EntityType.NostrNote,
			'$$replies'
		)
		const reactions = resolver(
			EntityType.NostrNote,
			'$$reactions'
		)
		const replyRows = await replies.resolve.CanonicalEventId.resolve({
			eventId: noteId,
		}, context)
		const reactionRows = await reactions.resolve.CanonicalEventId.resolve({
			eventId: noteId,
		}, context)

		expect(replyRows).toMatchObject([{
			[EntityMetaKey.Selector]: {
				eventId: reply.id,
			},
			[EntityMetaKey.Fields]: {
				[entityFieldAddressKey(EntityType.NostrNote, [], 'content')]: 'fixture',
				[entityFieldAddressKey(EntityType.NostrNote, [], 'createdAt')]: 1_700_000_000_000,
				[entityFieldAddressKey(EntityType.NostrNote, [], '$author')]: {
					[EntityMetaKey.Selector]: { pubkey },
				},
				[entityFieldAddressKey(EntityType.NostrNote, [], '$replyToNote')]: {
					[EntityMetaKey.Selector]: { eventId: noteId },
				},
			},
		}])
		expect(reactionRows).toEqual([{
			[EntityMetaKey.Selector]: {
				eventId: reaction.id,
			},
		}])
		expect(replies.projections.$$replies.resolveCount(replyRows)).toBe(1)
		expect(reactions.projections.$$reactions.resolveCount(reactionRows)).toBe(1)
	})

	it('materializes profile note cards from the bounded source timeline', async () => {
		const note = signedEvent([], 1, 'Readable profile card')
		getProfileNotes.mockResolvedValueOnce({
			notes: [note],
		})
		const notes = resolver(
			EntityType.NostrProfile,
			'$$notes'
		)

		await expect(notes.resolve.CanonicalPubkey.resolve({
			pubkey,
		}, context)).resolves.toMatchObject([{
			[EntityMetaKey.Selector]: {
				eventId: note.id,
			},
			[EntityMetaKey.Fields]: {
				[entityFieldAddressKey(EntityType.NostrNote, [], 'content')]: 'Readable profile card',
				[entityFieldAddressKey(EntityType.NostrNote, [], 'createdAt')]: 1_700_000_000_000,
				[entityFieldAddressKey(EntityType.NostrNote, [], '$author')]: {
					[EntityMetaKey.Selector]: { pubkey },
				},
			},
		}])
		expect(getProfileNotes).toHaveBeenCalledWith(pubkey, 16)
	})

	it('projects hub tip observed counts from the search window', async () => {
		vi.spyOn(Date, 'now').mockReturnValueOnce(1_700_000_000_100)
		const note = signedEvent([], 1, 'note')
		const repost = signedEvent([
			['e', note.id],
		], 6, '')
		const article = signedEvent([
			['d', 'essay'],
		], 30_023, 'body')
		const profile = signedEvent([], 0, '{}')
		search.mockResolvedValueOnce({
			events: [
				note,
				repost,
				article,
				profile,
			],
		})

		expect(
			await resolver(
				EntityType._GlobalNostrNetwork,
				'$$timestamps'
			).resolve.Scope.resolve({
				scope: '_GlobalNostrNetwork',
			}, context)
		).toEqual([{
			[EntityMetaKey.Selector]: {
				$hub: {
					scope: '_GlobalNostrNetwork',
				},
				timestampMs: 1_700_000_000_100,
				source: Source.Primal_Rest,
			},
			[EntityMetaKey.Fields]: {
				[entityFieldAddressKey(EntityType._GlobalNostrNetwork_Timestamp, [], 'observedProfileCount')]: 1,
				[entityFieldAddressKey(EntityType._GlobalNostrNetwork_Timestamp, [], 'observedNoteCount')]: 1,
				[entityFieldAddressKey(EntityType._GlobalNostrNetwork_Timestamp, [], 'observedRepostCount')]: 1,
				[entityFieldAddressKey(EntityType._GlobalNostrNetwork_Timestamp, [], 'observedArticleCount')]: 1,
				[entityFieldAddressKey(EntityType._GlobalNostrNetwork_Timestamp, [], 'reachable')]: true,
			},
		}])
	})

	it('marks the hub unreachable when search fails', async () => {
		vi.spyOn(Date, 'now').mockReturnValueOnce(1_700_000_000_200)
		search.mockRejectedValueOnce(new Error('upstream'))

		expect(
			await resolver(
				EntityType._GlobalNostrNetwork,
				'$$timestamps'
			).resolve.Scope.resolve({
				scope: '_GlobalNostrNetwork',
			}, context)
		).toEqual([{
			[EntityMetaKey.Selector]: {
				$hub: {
					scope: '_GlobalNostrNetwork',
				},
				timestampMs: 1_700_000_000_200,
				source: Source.Primal_Rest,
			},
			[EntityMetaKey.Fields]: {
				[entityFieldAddressKey(EntityType._GlobalNostrNetwork_Timestamp, [], 'reachable')]: false,
			},
		}])
	})

	it('does not register a direct global observation resolver', () => {
		expect(primalRest.resolvers.some((candidate) => (
			candidate.entityType === EntityType._GlobalNostrNetwork_Timestamp
		))).toBe(false)
	})
})

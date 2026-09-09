import { createResolverContext } from '../../tests/resolverContext.ts'
import {
	describe,
	expect,
	it,
	vi,
} from 'vitest'
import { schnorr } from '@noble/curves/secp256k1.js'
import * as Hex from 'ox/Hex'

import { EntityMetaKey, entityFieldAddressKey } from '$/schema/$schema.ts'
import { EntityType } from '$/schema/EntityType.ts'
import { nostrEventId } from '$/sources/NostrRelay/Nip01/event.ts'

const getPrimalEventById = vi.hoisted(() => vi.fn())
const getPrimalProfile = vi.hoisted(() => vi.fn())
const listNostrRelayEvents = vi.hoisted(() => vi.fn())
const nostrRelaySnapshotBindings = vi.hoisted(() => vi.fn(() => [{
	target: {
		key: 'wss://relay.nostr.band',
	},
}]))
const getPrimalProfileArticles = vi.hoisted(() => vi.fn())
const getPrimalNoteActions = vi.hoisted(() => vi.fn())

vi.mock('$/sources/NostrRelay/WebSocket/queries.ts', () => ({
	listNostrRelayEvents,
	listNostrRelayEventsForOperationGroup: listNostrRelayEvents,
	nostrRelaySnapshotBindings,
}))
vi.mock('$/sources/Primal/Rest/queries.ts', () => ({
	getEventById: getPrimalEventById,
	getProfile: getPrimalProfile,
	getNoteActions: getPrimalNoteActions,
	getProfileArticles: getPrimalProfileArticles,
}))

const [
	{ default: nostrRelay },
	{ default: primal },
] = await Promise.all([
	import('$/resolvers/NostrRelay-WebSocket.ts'),
	import('$/resolvers/Primal-Rest.ts'),
])

const resolverContext = createResolverContext()
const secretKey = Hex.toBytes(`0x${'02'.repeat(32)}`)
const pubkey = Hex.fromBytes(schnorr.getPublicKey(secretKey)).slice(2)
const rootEventId = '3'.repeat(64)
const replyEventId = '4'.repeat(64)
const mentionEventId = '5'.repeat(64)
const signedEvent = (
	tags: string[][],
	kind = 1,
	content = 'thread fixture',
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

describe('Nostr thread references', () => {
	for (const {
		source,
		resolvers,
		getEventById,
		wire,
	} of [
		{
			source: 'NostrRelay',
			resolvers: nostrRelay.resolvers,
			getEventById: listNostrRelayEvents,
			wire: (event: object) => [event],
		},
		{
			source: 'Primal',
			resolvers: primal.resolvers,
			getEventById: getPrimalEventById,
			wire: (event: object) => ({ event }),
		},
	]) {
		const resolver = resolvers.find((candidate) => (
			candidate.entityType === EntityType.NostrNote
			&& '$rootNote' in candidate.projections
		))

		if (resolver == null)
			throw new Error(`${source} spec missing NostrNote thread resolver`)
		const repliesResolver = resolvers.find((candidate) => '$$replies' in candidate.projections)
		const reactionsResolver = resolvers.find((candidate) => '$$reactions' in candidate.projections)
		const articleResolver = resolvers.find((candidate) => candidate.entityType === EntityType.NostrArticle)
		const reactionResolver = resolvers.find((candidate) => candidate.entityType === EntityType.NostrReaction)
		const repostResolver = resolvers.find((candidate) => candidate.entityType === EntityType.NostrRepost)

		if (
			repliesResolver == null
			|| reactionsResolver == null
			|| articleResolver == null
			|| reactionResolver == null
			|| repostResolver == null
		)
			throw new Error(`${source} spec missing collection or article resolver`)

		for (const {
			label,
			tags,
			expectedRootEventId,
			expectedReplyEventId,
		} of [
			{
				label: 'keeps marked root and reply distinct and ignores a mention',
				tags: [
					['e', mentionEventId, '', 'mention'],
					['e', replyEventId, '', 'reply'],
					['e', rootEventId, '', 'root'],
				],
				expectedRootEventId: rootEventId,
				expectedReplyEventId: replyEventId,
			},
			{
				label: 'does not fabricate a direct reply from a marked root',
				tags: [
					['e', rootEventId, '', 'root'],
					['e', replyEventId, '', 'mention'],
				],
				expectedRootEventId: rootEventId,
				expectedReplyEventId: undefined,
			},
			{
				label: 'keeps marked and legacy tags from contaminating each other',
				tags: [
					['e', rootEventId, '', 'root'],
					['e', mentionEventId],
				],
				expectedRootEventId: rootEventId,
				expectedReplyEventId: undefined,
			},
			{
				label: 'does not fabricate a root from a marked direct reply',
				tags: [
					['e', replyEventId, '', 'reply'],
					['e', rootEventId],
				],
				expectedRootEventId: undefined,
				expectedReplyEventId: replyEventId,
			},
			{
				label: 'uses first and last unmarked tags for legacy threads',
				tags: [
					['e', rootEventId],
					['e', mentionEventId, '', 'mention'],
					['e', replyEventId],
				],
				expectedRootEventId: rootEventId,
				expectedReplyEventId: replyEventId,
			},
			{
				label: 'does not turn mention-only tags into thread references',
				tags: [['e', mentionEventId, '', 'mention']],
				expectedRootEventId: undefined,
				expectedReplyEventId: undefined,
			},
		]) {
			it(`${source} ${label}`, async () => {
				const event = signedEvent(tags)
				getEventById.mockResolvedValueOnce(wire(event))

				const note = await resolver.resolve['CanonicalEventId'].resolve({
					eventId: event.id,
				}, resolverContext)

				expect(note.tags).toEqual(tags)
				expect(note.$rootNote).toEqual(
					expectedRootEventId == null ?
						undefined
					:
						{
							[EntityMetaKey.Selector]: {
								eventId: expectedRootEventId,
							},
						}
				)
				expect(note.$replyToNote).toEqual(
					expectedReplyEventId == null ?
						undefined
					:
						{
							[EntityMetaKey.Selector]: {
								eventId: expectedReplyEventId,
							},
						}
				)
			})
		}

		it(`${source} validates generic repost targets before assigning a typed reference`, async () => {
			const targetNote = signedEvent([], 1, 'target note')
			const genericRepost = signedEvent([['e', targetNote.id]], 16, '')
			const forgedTarget = {
				...targetNote,
				content: 'forged target',
			}
			getEventById
				.mockResolvedValueOnce(wire(genericRepost))
				.mockResolvedValueOnce(wire(forgedTarget))

			const unvalidatedRepost = await repostResolver.resolve['CanonicalEventId'].resolve({
				eventId: genericRepost.id,
			}, resolverContext)
			expect(unvalidatedRepost.repostedEventId).toBe(targetNote.id)
			expect(unvalidatedRepost).not.toHaveProperty('$repostedNote')
			expect(unvalidatedRepost).not.toHaveProperty('$repostedArticle')

			getEventById
				.mockResolvedValueOnce(wire(genericRepost))
				.mockResolvedValueOnce(wire(targetNote))
			await expect(repostResolver.resolve['CanonicalEventId'].resolve({
				eventId: genericRepost.id,
			}, resolverContext)).resolves.toEqual(expect.objectContaining({
				$repostedNote: expect.objectContaining({
					[EntityMetaKey.Selector]: { eventId: targetNote.id },
					[EntityMetaKey.Fields]: expect.objectContaining({
						[entityFieldAddressKey(EntityType.NostrNote, [], 'content')]: 'target note',
					}),
				}),
			}))

			const noteRepost = signedEvent([['e', targetNote.id]], 6, '')
			getEventById.mockResolvedValueOnce(wire(noteRepost))
			await expect(repostResolver.resolve['CanonicalEventId'].resolve({
				eventId: noteRepost.id,
			}, resolverContext)).resolves.toEqual(expect.objectContaining({
				$repostedNote: {
					[EntityMetaKey.Selector]: { eventId: targetNote.id },
				},
			}))

			const targetArticle = signedEvent([['d', 'validated-article']], 30_023, 'article')
			const embeddedArticleRepost = signedEvent([], 16, JSON.stringify(targetArticle))
			getEventById
				.mockResolvedValueOnce(wire(embeddedArticleRepost))
				.mockResolvedValueOnce(undefined)
			await expect(repostResolver.resolve['CanonicalEventId'].resolve({
				eventId: embeddedArticleRepost.id,
			}, resolverContext)).resolves.toEqual(expect.objectContaining({
				repostedEventId: targetArticle.id,
				$repostedArticle: expect.objectContaining({
					[EntityMetaKey.Selector]: {
						kind: 30_023,
						pubkey,
						identifier: 'validated-article',
					},
				}),
			}))
		})

		it(`${source} validates reaction targets before assigning a typed reference`, async () => {
			const wrongKindTarget = signedEvent([], 0, '{}')
			const reaction = signedEvent([['e', wrongKindTarget.id]], 7, '+')
			getEventById
				.mockResolvedValueOnce(wire(reaction))
				.mockResolvedValueOnce(wire(wrongKindTarget))

			const unvalidatedReaction = await reactionResolver.resolve['CanonicalEventId'].resolve({
				eventId: reaction.id,
			}, resolverContext)
			expect(unvalidatedReaction).not.toHaveProperty('$targetNote')
			expect(unvalidatedReaction).not.toHaveProperty('$targetArticle')
		})

		it(`${source} rejects mutated envelopes and selector or kind disagreement`, async () => {
			const event = signedEvent([])
			getEventById.mockResolvedValueOnce(wire({
				...event,
				content: 'mutated after signing',
			}))
			await expect(resolver.resolve['CanonicalEventId'].resolve({
				eventId: event.id,
			}, resolverContext)).rejects.toThrow()

			getEventById.mockResolvedValueOnce(wire(event))
			await expect(resolver.resolve['CanonicalEventId'].resolve({
				eventId: '6'.repeat(64),
			}, resolverContext)).rejects.toThrow(
				source === 'NostrRelay' ?
					/note not found/
				:
					/requested event id/
			)

			const reaction = signedEvent([], 7)
			getEventById.mockResolvedValueOnce(wire(reaction))
			await expect(resolver.resolve['CanonicalEventId'].resolve({
				eventId: reaction.id,
			}, resolverContext)).rejects.toThrow(
				source === 'NostrRelay' ?
					/note not found/
				:
					/kind/
			)
		})

		it(`${source} filters invalid collection rows and uses protocol target semantics`, async () => {
			const validReply = signedEvent([
				['e', mentionEventId, '', 'mention'],
				['e', rootEventId, '', 'root'],
				['e', replyEventId, '', 'reply'],
			])
			const invalidReply = {
				...signedEvent([['e', replyEventId, '', 'reply']]),
				content: 'mutated after signing',
			}
			const wrongReply = signedEvent([
				['e', replyEventId, '', 'mention'],
				['e', rootEventId, '', 'reply'],
			])
			const validReaction = signedEvent([
				['e', mentionEventId],
				['e', replyEventId],
			], 7, '+')
			const wrongReaction = signedEvent([
				['e', replyEventId],
				['e', rootEventId],
			], 7, '+')

			if (source === 'NostrRelay') {
				listNostrRelayEvents
					.mockResolvedValueOnce([invalidReply, wrongReply, validReply])
					.mockResolvedValueOnce([wrongReaction, validReaction])
			} else {
				getPrimalNoteActions
					.mockResolvedValueOnce({ events: [invalidReply, wrongReply, validReply] })
					.mockResolvedValueOnce({ events: [wrongReaction, validReaction] })
			}

			await expect(repliesResolver.resolve['CanonicalEventId'].resolve({
				eventId: replyEventId,
			}, resolverContext)).resolves.toEqual([expect.objectContaining({
				[EntityMetaKey.Selector]: { eventId: validReply.id },
			})])
			await expect(reactionsResolver.resolve['CanonicalEventId'].resolve({
				eventId: replyEventId,
			}, resolverContext)).resolves.toEqual([expect.objectContaining({
				[EntityMetaKey.Selector]: { eventId: validReaction.id },
			})])
			if (source === 'Primal') {
				expect(getPrimalNoteActions).toHaveBeenNthCalledWith(
					1,
					replyEventId,
					1,
					expect.any(Number)
				)
				expect(getPrimalNoteActions).toHaveBeenNthCalledWith(
					2,
					replyEventId,
					7,
					expect.any(Number)
				)
			} else {
				expect(listNostrRelayEvents.mock.calls.slice(-2)).toEqual([
					[{
						operationGroup: 'NostrRelayRead',
						filters: [{
							'#e': [replyEventId],
							kinds: [1],
							limit: expect.any(Number),
						}],
					}],
					[{
						operationGroup: 'NostrRelayRead',
						filters: [{
							'#e': [replyEventId],
							kinds: [7],
							limit: expect.any(Number),
						}],
					}],
				])
			}
		})

		it(`${source} selects an article coordinate after validating sibling rows`, async () => {
			const sibling = signedEvent([['d', 'sibling']], 30_023, 'sibling')
			const invalidTarget = {
				...signedEvent([['d', 'target']], 30_023, 'target'),
				content: 'mutated after signing',
			}
			const target = signedEvent([['d', 'target']], 30_023, 'target')
			if (source === 'NostrRelay')
				listNostrRelayEvents.mockResolvedValueOnce([sibling, invalidTarget, target])
			else
				getPrimalProfileArticles.mockResolvedValueOnce({ events: [sibling, invalidTarget, target] })

			const resolvedArticle = articleResolver.resolve['CanonicalCoordinate'].resolve({
				identifier: 'target',
				kind: 30_023,
				pubkey,
			}, resolverContext)
			await expect(resolvedArticle).resolves.toEqual(expect.objectContaining({
				identifier: 'target',
			}))
			if (source === 'NostrRelay')
				expect(listNostrRelayEvents).toHaveBeenLastCalledWith({
					operationGroup: 'NostrRelayRead',
					filters: [{
						'#d': ['target'],
						authors: [pubkey],
						kinds: [30_023],
						limit: 1,
					}],
				})
			if (source === 'NostrRelay')
				listNostrRelayEvents.mockResolvedValueOnce([sibling, invalidTarget])
			else
				getPrimalProfileArticles.mockResolvedValueOnce({ events: [sibling, invalidTarget] })

			await expect(articleResolver.resolve['CanonicalCoordinate'].resolve({
				identifier: 'target',
				kind: 30_023,
				pubkey,
			}, resolverContext)).rejects.toThrow(/article not found/)
		})
	}

	it('Nostr relay materializes signed latest profile and article events', async () => {
		const articleVersions = [
			signedEvent([['d', 'target'], ['title', 'Version B'], ['image', 'https://images.example/article-b.png']], 30_023, 'article B', 1_700_000_010),
			signedEvent([['d', 'target'], ['title', 'Version A'], ['image', 'https://images.example/article-b.png']], 30_023, 'article A'),
		].sort((left, right) => (
			right.created_at - left.created_at
			|| left.id.localeCompare(right.id)
		))
		const profileVersions = [
			signedEvent([], 0, JSON.stringify({ display_name: 'Profile B', lud06: 'lnurl-b' }), 1_700_000_010),
			signedEvent([], 0, JSON.stringify({ display_name: 'Profile A', lud06: 'lnurl-a' })),
		].sort((left, right) => (
			right.created_at - left.created_at
			|| left.id.localeCompare(right.id)
		))
		const articleResolver = nostrRelay.resolvers.find((candidate) => (
			candidate.entityType === EntityType.NostrArticle
			&& '$latestEvent' in candidate.projections
		))
		const articleEventResolver = nostrRelay.resolvers.find((candidate) => (
			candidate.entityType === EntityType.NostrArticleEvent
		))
		const profileResolver = nostrRelay.resolvers.find((candidate) => (
			candidate.entityType === EntityType.NostrProfile
			&& '$latestMetadataEvent' in candidate.projections
		))
		const profileEventResolver = nostrRelay.resolvers.find((candidate) => (
			candidate.entityType === EntityType.NostrProfileMetadataEvent
		))
		if (
			articleResolver == null
			|| articleEventResolver == null
			|| profileResolver == null
			|| profileEventResolver == null
		) throw new Error('Nostr relay spec missing latest event materialization resolver')

		listNostrRelayEvents.mockResolvedValueOnce(articleVersions.toReversed())
		const article = await articleResolver.resolve['CanonicalCoordinate'].resolve({
			identifier: 'target',
			kind: 30_023,
			pubkey,
		}, resolverContext)
		expect(article).not.toHaveProperty('content')
		expect(article.$latestEvent[EntityMetaKey.Selector]).toEqual({ eventId: articleVersions[0].id })
		expect(listNostrRelayEvents).toHaveBeenLastCalledWith({
			operationGroup: 'NostrRelayRead',
			filters: [{
				'#d': ['target'],
				authors: [pubkey],
				kinds: [30_023],
				limit: 1,
			}],
		})

		listNostrRelayEvents.mockResolvedValueOnce([articleVersions[0]])
		await expect(articleEventResolver.resolve['CanonicalEventId'].resolve({
			eventId: articleVersions[0].id,
		}, resolverContext)).resolves.toEqual(expect.objectContaining({
			eventId: articleVersions[0].id,
			signature: articleVersions[0].sig,
			content: articleVersions[0].content,
			tags: articleVersions[0].tags,
			$image: expect.objectContaining({
				[EntityMetaKey.Selector]: {
					url: 'https://images.example/article-b.png',
				},
			}),
		}))

		listNostrRelayEvents.mockResolvedValueOnce(profileVersions.toReversed())
		const profile = await profileResolver.resolve['CanonicalPubkey'].resolve({
			pubkey,
		}, resolverContext)
		expect(profile).not.toHaveProperty('displayName')
		expect(profile.$latestMetadataEvent[EntityMetaKey.Selector]).toEqual({ eventId: profileVersions[0].id })
		expect(listNostrRelayEvents).toHaveBeenLastCalledWith({
			operationGroup: 'NostrRelayRead',
			filters: [{
				authors: [pubkey],
				kinds: [0],
				limit: 1,
			}],
		})

		listNostrRelayEvents.mockResolvedValueOnce([profileVersions[0]])
		await expect(profileEventResolver.resolve['CanonicalEventId'].resolve({
			eventId: profileVersions[0].id,
		}, resolverContext)).resolves.toEqual(expect.objectContaining({
			eventId: profileVersions[0].id,
			signature: profileVersions[0].sig,
			content: profileVersions[0].content,
			tags: profileVersions[0].tags,
		}))
	})

	it('Primal materializes signed profile and article versions with deterministic latest references', async () => {
		const articleVersions = [
			signedEvent([['d', 'target'], ['title', 'Version B'], ['image', 'https://images.example/article-b.png']], 30_023, 'article B'),
			signedEvent([['d', 'target'], ['title', 'Version A'], ['image', 'https://images.example/article-b.png']], 30_023, 'article A'),
		].sort((left, right) => left.id.localeCompare(right.id))
		const profileVersions = [
			signedEvent([], 0, JSON.stringify({
				display_name: 'Profile B',
				lud06: 'lnurl-b',
				picture: 'https://images.example/profile-b.png',
				banner: 'https://images.example/profile-b-banner.png',
			}), 1_700_000_010),
			signedEvent([], 0, JSON.stringify({ display_name: 'Profile A', lud06: 'lnurl-a' })),
		].sort((left, right) => (
			right.created_at - left.created_at
			|| left.id.localeCompare(right.id)
		))
		const articleResolver = primal.resolvers.find((candidate) => (
			candidate.entityType === EntityType.NostrArticle
			&& '$$events' in candidate.projections
		))
		const articleEventResolver = primal.resolvers.find((candidate) => (
			candidate.entityType === EntityType.NostrArticleEvent
		))
		const profileResolver = primal.resolvers.find((candidate) => (
			candidate.entityType === EntityType.NostrProfile
			&& '$$metadataEvents' in candidate.projections
		))
		const profileEventResolver = primal.resolvers.find((candidate) => (
			candidate.entityType === EntityType.NostrProfileMetadataEvent
		))
		if (
			articleResolver == null
			|| articleEventResolver == null
			|| profileResolver == null
			|| profileEventResolver == null
		) throw new Error('Primal spec missing version materialization resolver')

		getPrimalProfileArticles.mockResolvedValueOnce({ events: articleVersions.toReversed() })
		const article = await articleResolver.resolve['CanonicalCoordinate'].resolve({
			identifier: 'target',
			kind: 30_023,
			pubkey,
		}, resolverContext)
		expect(article).not.toHaveProperty('content')
		expect(article.$latestEvent[EntityMetaKey.Selector]).toEqual({ eventId: articleVersions[0].id })
		expect(article.$$events.map((event) => event[EntityMetaKey.Selector])).toEqual(
			articleVersions.map((event) => ({ eventId: event.id }))
		)

		getPrimalEventById.mockResolvedValueOnce({ event: articleVersions[0] })
		await expect(articleEventResolver.resolve['CanonicalEventId'].resolve({
			eventId: articleVersions[0].id,
		}, resolverContext)).resolves.toEqual(expect.objectContaining({
			eventId: articleVersions[0].id,
			signature: articleVersions[0].sig,
			content: articleVersions[0].content,
			tags: articleVersions[0].tags,
			$image: expect.objectContaining({
				[EntityMetaKey.Selector]: {
					url: 'https://images.example/article-b.png',
				},
			}),
			title: articleVersions[0].tags.find((tag) => tag[0] === 'title')?.[1],
		}))

		getPrimalProfile.mockResolvedValueOnce({ events: profileVersions.toReversed() })
		const profile = await profileResolver.resolve['CanonicalPubkey'].resolve({
			pubkey,
		}, resolverContext)
		expect(profile).not.toHaveProperty('displayName')
		expect(profile.$latestMetadataEvent[EntityMetaKey.Selector]).toEqual({ eventId: profileVersions[0].id })
		expect(profile.$$metadataEvents.map((event) => event[EntityMetaKey.Selector])).toEqual(
			profileVersions.map((event) => ({ eventId: event.id }))
		)

		getPrimalEventById.mockResolvedValueOnce({ event: profileVersions[0] })
		await expect(profileEventResolver.resolve['CanonicalEventId'].resolve({
			eventId: profileVersions[0].id,
		}, resolverContext)).resolves.toEqual(expect.objectContaining({
			eventId: profileVersions[0].id,
			signature: profileVersions[0].sig,
			content: profileVersions[0].content,
			displayName: JSON.parse(profileVersions[0].content).display_name,
			lud06: JSON.parse(profileVersions[0].content).lud06,
			iconUrl: JSON.parse(profileVersions[0].content).picture,
			bannerUrl: JSON.parse(profileVersions[0].content).banner,
			$icon: expect.objectContaining({
				[EntityMetaKey.Selector]: { url: JSON.parse(profileVersions[0].content).picture },
			}),
			$banner: expect.objectContaining({
				[EntityMetaKey.Selector]: { url: JSON.parse(profileVersions[0].content).banner },
			}),
		}))
	})
})

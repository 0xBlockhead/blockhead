import {
	describe,
	expect,
	it,
	vi,
} from 'vitest'
import { schnorr } from '@noble/curves/secp256k1.js'
import * as Hex from 'ox/Hex'

import { EntityMetaKey } from '$/schema/$schema.ts'
import { EntityType } from '$/schema/EntityType.ts'
import { nostrEventId } from '$/sources/NostrRelay/Nip01/event.ts'

const getNostrBandEventById = vi.hoisted(() => vi.fn())
const getPrimalEventById = vi.hoisted(() => vi.fn())
const getPrimalProfile = vi.hoisted(() => vi.fn())
const listNostrBandAuthorArticles = vi.hoisted(() => vi.fn())
const listNostrBandAuthorMetadataEvents = vi.hoisted(() => vi.fn())
const listNostrBandRecentTextNotes = vi.hoisted(() => vi.fn())
const listNostrBandTopProfiles = vi.hoisted(() => vi.fn())
const listNostrBandNoteReactions = vi.hoisted(() => vi.fn())
const listNostrBandNoteReplies = vi.hoisted(() => vi.fn())
const getPrimalProfileArticles = vi.hoisted(() => vi.fn())
const getPrimalNoteReactions = vi.hoisted(() => vi.fn())
const getPrimalNoteReplies = vi.hoisted(() => vi.fn())

vi.mock('$/sources/NostrBand/Rest/queries.ts', () => ({
	getEventById: getNostrBandEventById,
	listAuthorArticles: listNostrBandAuthorArticles,
	listAuthorMetadataEvents: listNostrBandAuthorMetadataEvents,
	listRecentTextNotes: listNostrBandRecentTextNotes,
	listTopProfiles: listNostrBandTopProfiles,
	listNoteReactions: listNostrBandNoteReactions,
	listNoteReplies: listNostrBandNoteReplies,
}))
vi.mock('$/sources/Primal/Rest/queries.ts', () => ({
	getEventById: getPrimalEventById,
	getProfile: getPrimalProfile,
	getNoteReactions: getPrimalNoteReactions,
	getNoteReplies: getPrimalNoteReplies,
	getProfileArticles: getPrimalProfileArticles,
}))

const [
	{ default: nostrBand },
	{ default: primal },
] = await Promise.all([
	import('$/resolvers/NostrBand-Rest.ts'),
	import('$/resolvers/Primal-Rest.ts'),
])

const resolverContext = {
	filters: [],
	sorts: [],
	pagination: {},
	selectorKeys: [],
	parentSelectorKeys: [],
	sources: [],
	publicEnv: {},
}
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
			source: 'NostrBand',
			resolvers: nostrBand.resolvers,
			getEventById: getNostrBandEventById,
			wire: (event: object) => ({ event }),
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
				label: 'uses a marked root as the direct reply when no reply marker exists',
				tags: [
					['e', rootEventId, '', 'root'],
					['e', replyEventId, '', 'mention'],
					['e', mentionEventId],
				],
				expectedRootEventId: rootEventId,
				expectedReplyEventId: rootEventId,
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
				$repostedNote: {
					[EntityMetaKey.Selector]: { eventId: targetNote.id },
				},
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
				$repostedArticle: {
					[EntityMetaKey.Selector]: {
						kind: 30_023,
						pubkey,
						identifier: 'validated-article',
					},
				},
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
			}, resolverContext)).rejects.toThrow(/requested event id/)

			const reaction = signedEvent([], 7)
			getEventById.mockResolvedValueOnce(wire(reaction))
			await expect(resolver.resolve['CanonicalEventId'].resolve({
				eventId: reaction.id,
			}, resolverContext)).rejects.toThrow(/kind/)
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

			if (source === 'NostrBand') {
				listNostrBandNoteReplies.mockResolvedValueOnce({ events: [invalidReply, wrongReply, validReply] })
				listNostrBandNoteReactions.mockResolvedValueOnce({ events: [wrongReaction, validReaction] })
			} else {
				getPrimalNoteReplies.mockResolvedValueOnce({ events: [invalidReply, wrongReply, validReply] })
				getPrimalNoteReactions.mockResolvedValueOnce({ events: [wrongReaction, validReaction] })
			}

			await expect(repliesResolver.resolve['CanonicalEventId'].resolve({
				eventId: replyEventId,
			}, resolverContext)).resolves.toEqual([{
				[EntityMetaKey.Selector]: { eventId: validReply.id },
			}])
			await expect(reactionsResolver.resolve['CanonicalEventId'].resolve({
				eventId: replyEventId,
			}, resolverContext)).resolves.toEqual([{
				[EntityMetaKey.Selector]: { eventId: validReaction.id },
			}])
		})

		it(`${source} selects an article coordinate after validating sibling rows`, async () => {
			const sibling = signedEvent([['d', 'sibling']], 30_023, 'sibling')
			const invalidTarget = {
				...signedEvent([['d', 'target']], 30_023, 'target'),
				content: 'mutated after signing',
			}
			const target = signedEvent([['d', 'target']], 30_023, 'target')
			if (source === 'NostrBand')
				listNostrBandAuthorArticles.mockResolvedValueOnce({ events: [sibling, invalidTarget, target] })
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
			if (source === 'NostrBand')
				listNostrBandAuthorArticles.mockResolvedValueOnce({ events: [sibling, invalidTarget] })
			else
				getPrimalProfileArticles.mockResolvedValueOnce({ events: [sibling, invalidTarget] })

			await expect(articleResolver.resolve['CanonicalCoordinate'].resolve({
				identifier: 'target',
				kind: 30_023,
				pubkey,
			}, resolverContext)).rejects.toThrow(/article not found/)
		})
	}

	it('NostrBand discovery keeps valid profile and note rows beside invalid signed envelopes', async () => {
		const validProfile = signedEvent([], 0, JSON.stringify({ display_name: 'Valid profile' }))
		const invalidProfile = {
			...signedEvent([], 0, JSON.stringify({ display_name: 'Invalid profile' })),
			id: '6'.repeat(64),
		}
		const validNote = signedEvent([], 1, 'Valid note')
		const invalidNote = {
			...signedEvent([], 1, 'Invalid note'),
			sig: '7'.repeat(128),
		}
		const profilesResolver = nostrBand.resolvers.find((candidate) => '$$observedProfiles' in candidate.projections)
		const notesResolver = nostrBand.resolvers.find((candidate) => '$$observedNotes' in candidate.projections)
		if (profilesResolver == null || notesResolver == null)
			throw new Error('NostrBand spec missing discovery resolvers')

		listNostrBandTopProfiles.mockResolvedValueOnce({
			profiles: [
				{ pubkey: invalidProfile.pubkey, profile: invalidProfile },
				{ pubkey: validProfile.pubkey, profile: validProfile },
			],
		})
		listNostrBandRecentTextNotes.mockResolvedValueOnce({ events: [invalidNote, validNote] })

		await expect(profilesResolver.resolve['Scope'].resolve(
			{},
			resolverContext
		)).resolves.toEqual([{
			[EntityMetaKey.Selector]: { pubkey: validProfile.pubkey },
		}])
		await expect(notesResolver.resolve['Scope'].resolve(
			{},
			resolverContext
		)).resolves.toEqual([{
			[EntityMetaKey.Selector]: { eventId: validNote.id },
		}])
	})

	it('NostrBand materializes signed profile and article versions with deterministic latest references', async () => {
		const articleVersions = [
			signedEvent([['d', 'target'], ['title', 'Version A']], 30_023, 'article A'),
			signedEvent([['d', 'target'], ['title', 'Version B']], 30_023, 'article B'),
		].sort((left, right) => right.id.localeCompare(left.id))
		const profileVersions = [
			signedEvent([], 0, JSON.stringify({ display_name: 'Profile A', lud06: 'lnurl-a' })),
			signedEvent([], 0, JSON.stringify({ display_name: 'Profile B', lud06: 'lnurl-b' })),
		].sort((left, right) => right.id.localeCompare(left.id))
		const articleResolver = nostrBand.resolvers.find((candidate) => (
			candidate.entityType === EntityType.NostrArticle
			&& '$$events' in candidate.projections
		))
		const articleEventResolver = nostrBand.resolvers.find((candidate) => (
			candidate.entityType === EntityType.NostrArticleEvent
		))
		const profileResolver = nostrBand.resolvers.find((candidate) => (
			candidate.entityType === EntityType.NostrProfile
			&& '$$metadataEvents' in candidate.projections
		))
		const profileEventResolver = nostrBand.resolvers.find((candidate) => (
			candidate.entityType === EntityType.NostrProfileMetadataEvent
		))
		if (
			articleResolver == null
			|| articleEventResolver == null
			|| profileResolver == null
			|| profileEventResolver == null
		) throw new Error('NostrBand spec missing version materialization resolver')

		listNostrBandAuthorArticles.mockResolvedValueOnce({ events: articleVersions.toReversed() })
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

		getNostrBandEventById.mockResolvedValueOnce({ event: articleVersions[0] })
		await expect(articleEventResolver.resolve['CanonicalEventId'].resolve({
			eventId: articleVersions[0].id,
		}, resolverContext)).resolves.toEqual(expect.objectContaining({
			eventId: articleVersions[0].id,
			signature: articleVersions[0].sig,
			content: articleVersions[0].content,
			tags: articleVersions[0].tags,
		}))

		listNostrBandAuthorMetadataEvents.mockResolvedValueOnce({ events: profileVersions.toReversed() })
		const profile = await profileResolver.resolve['CanonicalPubkey'].resolve({
			pubkey,
		}, resolverContext)
		expect(profile).not.toHaveProperty('displayName')
		expect(profile.$latestMetadataEvent[EntityMetaKey.Selector]).toEqual({ eventId: profileVersions[0].id })
		expect(profile.$$metadataEvents.map((event) => event[EntityMetaKey.Selector])).toEqual(
			profileVersions.map((event) => ({ eventId: event.id }))
		)

		getNostrBandEventById.mockResolvedValueOnce({ event: profileVersions[0] })
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
			signedEvent([['d', 'target'], ['title', 'Version B']], 30_023, 'article B'),
			signedEvent([['d', 'target'], ['title', 'Version A']], 30_023, 'article A'),
		].sort((left, right) => right.id.localeCompare(left.id))
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
			|| right.id.localeCompare(left.id)
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

import {
	describe,
	expect,
	it,
	vi,
} from 'vitest'

import { EntityMetaKey } from '$/schema/$schema.ts'
import { EntityType } from '$/schema/EntityType.ts'
import { NostrNoteSelector } from '$/schema/NostrNote.ts'

const getNostrBandEventById = vi.hoisted(() => vi.fn())
const getPrimalEventById = vi.hoisted(() => vi.fn())

vi.mock('$/sources/NostrBand/Rest/queries.ts', () => ({
	getEventById: getNostrBandEventById,
}))
vi.mock('$/sources/Primal/Rest/queries.ts', () => ({
	getEventById: getPrimalEventById,
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
const eventId = '1'.repeat(64)
const pubkey = '2'.repeat(64)
const rootEventId = '3'.repeat(64)
const replyEventId = '4'.repeat(64)
const mentionEventId = '5'.repeat(64)

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
				getEventById.mockResolvedValueOnce(wire({
					id: eventId,
					pubkey,
					kind: 1,
					content: 'thread fixture',
					tags,
				}))

				const note = await resolver.resolve[NostrNoteSelector.CanonicalEventId].resolve({
					eventId,
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
	}
})

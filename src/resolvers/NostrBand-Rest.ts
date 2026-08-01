import { resolverContextRowLimit } from '$/resolvers/$resolvers.ts'
import {
	defineResolver,
} from '$/resolvers/defineResolver.ts'
import { optionalNonemptyString } from '$/lib/string.ts'
import {
	optionalTimestampMs,
	timestampMsFromUnixSeconds,
} from '$/lib/time.ts'
import { mediaFromUrl } from '$/resolvers/media.ts'
import {
	entityFieldAddressKey,
	EntityMetaKey,
} from '$/schema/$schema.ts'
import { MediaType } from '$/schema/MediaType.ts'
import { EntityType } from '$/schema/EntityType.ts'
import { Source } from '$/sources/Source.ts'
import type {
	NostrEvent,
	NostrProfileMetadata,
	NostrBandRelayStats,
} from '$/sources/NostrBand/Rest/types.ts'
import type { JsonObject } from '$/typescript/JsonValue.ts'
import { UrlString } from '$/schema/UrlString.ts'
import {
	type NostrEventExpectation,
	validateNostrEvent,
	validatedNostrEventFromContent,
} from '$/sources/NostrRelay/Nip01/event.ts'


const normalizePubkey = (value: string | undefined | null) => {
	const normalized = value?.toLowerCase()
	return (
		normalized != null && normalized !== '' && /^[0-9a-f]{64}$/.test(normalized) ?
			normalized
		:
			undefined
	)
}

const normalizeEventId = (value: string | undefined | null) => {
	const normalized = value?.toLowerCase()
	return (
		normalized != null && /^[0-9a-f]{64}$/.test(normalized) ?
			normalized
		:
			undefined
	)
}

const normalizeRelayUrl = (value: string | undefined) => {
	if (value == null || value === '') return undefined
	try {
		const url = new URL(
			value.includes('://') ?
				value
			:
				`wss://${value}`
		)
		if (url.protocol !== 'wss:' && url.protocol !== 'ws:') return undefined
		const pathname = url.pathname.replace(/\/$/, '')
		return `wss://${url.host}${pathname}`
	} catch {
		return undefined
	}
}

const profileMetadataFromContent = (content: string | undefined): NostrProfileMetadata | undefined => {
	if (content == null || content === '') return undefined
	try {
		const parsed: NostrProfileMetadata = JSON.parse(content)
		return parsed
	} catch {
		return undefined
	}
}

const optionalUrlString = (value: string | undefined) => (
	value != null && UrlString.allows(value) ? value : undefined
)

const tagValueFromTags = (
	tags: NostrEvent['tags'],
	tagName: string
) => (
	tags?.flatMap((tag) => (
		tag[0] === tagName
		&& tag[1] !== '' ?
			[tag[1]]
		:
			[]
	)).at(0)
)

const eTagEventIdsFromTags = (tags: NostrEvent['tags']) => (
	tags?.flatMap((tag) => (
		tag[0] === 'e' ?
			normalizeEventId(tag[1]) ?? []
		:
			[]
	))
	?? []
)

const reactionTargetEventIdFromTags = (tags: NostrEvent['tags']) => {
	const eventIds = eTagEventIdsFromTags(tags)
	if (eventIds.length === 0)
		throw new Error('NostrBand_Rest: no event IDs found in tags')
	return eventIds[eventIds.length - 1]
}

const replyToEventIdFromTags = (tags: NostrEvent['tags']) => {
	const eventIds = tags?.flatMap((tag) => (
		tag[0] === 'e'
		&& tag[3] !== 'mention' ?
			[normalizeEventId(tag[1])]
		:
			[]
	)).filter((eventId) => eventId != null) ?? []
	const markedReply = tags?.flatMap((tag) => (
		tag[0] === 'e'
		&& tag[3] === 'reply' ?
			[normalizeEventId(tag[1])]
		:
			[]
	)).at(0)
	if (markedReply != null)
		return markedReply
	const markedRoot = tags?.flatMap((tag) => (
		tag[0] === 'e'
		&& tag[3] === 'root' ?
			[normalizeEventId(tag[1])]
		:
			[]
	)).at(0)
	if (markedRoot != null)
		return markedRoot
	if (eventIds.length === 0)
		return undefined
	if (eventIds.length === 1)
		return eventIds.at(0)
	return eventIds.at(-1)
}

const rootEventIdFromTags = (tags: NostrEvent['tags']) => (
	(
		(markedRoot) => (
				markedRoot
				?? tags?.flatMap((tag) => (
					tag[0] === 'e'
					&& tag[3] !== 'mention' ?
						[normalizeEventId(tag[1])]
					:
						[]
				)).filter((eventId) => eventId != null).at(0)
		)
	)(tags?.flatMap((tag) => (
			tag[0] === 'e'
			&& tag[3] === 'root' ?
				[normalizeEventId(tag[1])]
			:
				[]
	)).at(0))
)

const isNostrRepostKind = (kind: number | undefined): kind is 6 | 16 => (
	kind === 6 || kind === 16
)

const articleRefFromEvent = (event: NostrEvent) => (
	event.kind !== 30023 ?
		[]
	:
		(
		(pubkey, identifier) => (
				pubkey == null || identifier == null ?
					[]
				:
					[
						{
							[EntityMetaKey.Selector]: {
								kind: 30023,
								pubkey,
								identifier,
							},
						},
					]
		)
		)(
			normalizePubkey(event.pubkey),
			tagValueFromTags(event.tags, 'd')
		)
)

const profileFieldValuesFromMetadata = (
	metadata: NostrProfileMetadata | undefined,
	profileEvent: NostrEvent | undefined
) => {
	const pubkey = normalizePubkey(profileEvent?.pubkey)
	if (pubkey == null)
		throw new Error('NostrBand_Rest: invalid profile pubkey')

	return {
		pubkey,
		displayName: optionalNonemptyString(metadata?.display_name ?? metadata?.name),
		about: optionalNonemptyString(metadata?.about),
		nip05: optionalNonemptyString(metadata?.nip05),
		lud16: optionalNonemptyString(metadata?.lud16),
		lud06: optionalNonemptyString(metadata?.lud06),
		website: optionalNonemptyString(metadata?.website),
		...(timestampMsFromUnixSeconds(profileEvent?.created_at) != null && {
			metadataUpdatedAt: timestampMsFromUnixSeconds(profileEvent?.created_at),
		}),
			...((
				iconMedia
			) => (
				iconMedia != null && {
					$icon: iconMedia,
				}
			))(mediaFromUrl(optionalNonemptyString(metadata?.picture), MediaType.Image)),
			...((
				bannerMedia
			) => (
				bannerMedia != null && {
					$banner: bannerMedia,
				}
			))(mediaFromUrl(optionalNonemptyString(metadata?.banner), MediaType.Image)),
	}
}

export const nostrNoteFieldValuesFromEvent = (event: NostrEvent) => {
	const eventPubkey = normalizePubkey(event.pubkey)
	const eventId = normalizeEventId(String(event.id))
	if (eventPubkey == null) throw new Error('NostrBand_Rest: invalid event pubkey')
	if (eventId == null) throw new Error('NostrBand_Rest: invalid note event id')
	return (
		((replyToEventId, rootEventId) => ({
			eventId,
			kind: 1,
			pubkey: eventPubkey,
			content: optionalNonemptyString(event.content),
			sensitive: event.tags?.some((tag) => tag[0] === 'content-warning') === true,
			contentWarning: optionalNonemptyString(tagValueFromTags(event.tags, 'content-warning')),
			...(event.tags != null && { tags: event.tags }),
			...(timestampMsFromUnixSeconds(event.created_at) != null && {
				createdAt: timestampMsFromUnixSeconds(event.created_at),
			}),
			$author: {
				[EntityMetaKey.Selector]: { pubkey: eventPubkey },
			},
			...(replyToEventId != null && {
				replyToEventId,
			}),
			...(rootEventId != null && {
				rootEventId,
			}),
			...(replyToEventId != null && {
				$replyToNote: {
					[EntityMetaKey.Selector]: { eventId: replyToEventId },
				},
			}),
			...(rootEventId != null && {
				$rootNote: {
					[EntityMetaKey.Selector]: { eventId: rootEventId },
				},
			}),
		}))(replyToEventIdFromTags(event.tags), rootEventIdFromTags(event.tags))
	)
}

const repostFieldValuesFromEvent = (event: NostrEvent) => {
	const kind = event.kind
	if (!isNostrRepostKind(kind)) throw new Error('NostrBand_Rest: not a repost event')
	const eventPubkey = normalizePubkey(event.pubkey)
	if (eventPubkey == null) throw new Error('NostrBand_Rest: invalid event pubkey')
	const eventId = normalizeEventId(String(event.id))
	if (eventId == null) throw new Error('NostrBand_Rest: invalid repost event id')
	return (
		((repostedEventId) => ({
			eventId,
			kind,
			pubkey: eventPubkey,
			...(event.tags != null && { tags: event.tags }),
			...(timestampMsFromUnixSeconds(event.created_at) != null && {
				createdAt: timestampMsFromUnixSeconds(event.created_at),
			}),
			$author: {
				[EntityMetaKey.Selector]: { pubkey: eventPubkey },
			},
			...(repostedEventId != null && {
				repostedEventId,
				...(kind === 6 && {
					$repostedNote: {
						[EntityMetaKey.Selector]: { eventId: repostedEventId },
					},
				}),
			}),
		}))(eTagEventIdsFromTags(event.tags).at(0))
	)
}

const repostFieldValuesFromTargetEvent = (
	repostValues: ReturnType<typeof repostFieldValuesFromEvent>,
	targetEvent: NostrEvent | undefined
) => (
	repostValues.kind === 6 || targetEvent == null ?
		repostValues
	:
		targetEvent.kind === 1 ?
			{
				...repostValues,
				$repostedNote: {
					[EntityMetaKey.Selector]: { eventId: targetEvent.id },
				},
			}
		: targetEvent.kind === 30023 ?
			((repostedArticle) => (
			repostedArticle == null ?
				repostValues
			:
				{
					...repostValues,
					$repostedArticle: repostedArticle,
					$repostedNote: undefined,
				}
			))(articleRefFromEvent(targetEvent).at(0))
		:
			repostValues
)

const reactionFieldValuesFromEvent = (event: NostrEvent) => {
	const eventPubkey = normalizePubkey(event.pubkey)
	if (eventPubkey == null) throw new Error('NostrBand_Rest: invalid event pubkey')
	const eventId = normalizeEventId(String(event.id))
	if (eventId == null) throw new Error('NostrBand_Rest: invalid reaction event id')
	return {
		eventId,
		kind: 7,
		pubkey: eventPubkey,
		...(event.tags != null && { tags: event.tags }),
		...(timestampMsFromUnixSeconds(event.created_at) != null && {
			createdAt: timestampMsFromUnixSeconds(event.created_at),
		}),
		$author: {
			[EntityMetaKey.Selector]: { pubkey: eventPubkey },
		},
		content: optionalNonemptyString(event.content),
	}
}

const reactionFieldValuesFromTargetEvent = (
	reactionValues: ReturnType<typeof reactionFieldValuesFromEvent>,
	targetEvent: NostrEvent | undefined
) => (
	targetEvent?.kind === 1 ?
		{
			...reactionValues,
			$targetNote: {
				[EntityMetaKey.Selector]: { eventId: targetEvent.id },
			},
		}
	: targetEvent?.kind === 30023 ?
		((targetArticle) => (
			targetArticle == null ?
				reactionValues
			:
				{
					...reactionValues,
					$targetArticle: targetArticle,
				}
		))(articleRefFromEvent(targetEvent).at(0))
	:
		reactionValues
)

const articlePublishedAtMs = (event: NostrEvent) => (
	((publishedAtTag) => (
		publishedAtTag == null ?
			timestampMsFromUnixSeconds(event.created_at)
		:
			(
			Number.isFinite(Number(publishedAtTag)) ?
				Number(publishedAtTag) * 1000
			:
				optionalTimestampMs(publishedAtTag)
			)
	))(tagValueFromTags(event.tags, 'published_at'))
)

const articleFieldValuesFromEvent = (event: NostrEvent) => {
	const eventPubkey = normalizePubkey(event.pubkey)
	if (eventPubkey == null) throw new Error('NostrBand_Rest: invalid event pubkey')
	const identifier = tagValueFromTags(event.tags, 'd')
	if (identifier == null)
		throw new Error('NostrBand_Rest: article missing identifier')

	return (
		((publishedAt) => ({
			kind: 30023,
			pubkey: eventPubkey,
			identifier,
			title: optionalNonemptyString(tagValueFromTags(event.tags, 'title')),
			summary: optionalNonemptyString(tagValueFromTags(event.tags, 'summary')),
			imageUrl: optionalNonemptyString(tagValueFromTags(event.tags, 'image')),
			content: optionalNonemptyString(event.content),
			sensitive: event.tags?.some((tag) => tag[0] === 'content-warning') === true,
			contentWarning: optionalNonemptyString(tagValueFromTags(event.tags, 'content-warning')),
			...(event.tags != null && { tags: event.tags }),
			...(publishedAt != null && { publishedAt }),
			$author: {
				[EntityMetaKey.Selector]: { pubkey: eventPubkey },
			},
		}))(articlePublishedAtMs(event))
	)
}

type ValidatedNostrEvent = ReturnType<typeof validateNostrEvent>

const newestNostrEventFirst = (
	left: ValidatedNostrEvent,
	right: ValidatedNostrEvent
) => (
	right.created_at - left.created_at
	|| right.id.localeCompare(left.id)
)

const profileMetadataEventFieldValues = (event: ValidatedNostrEvent) => {
	const metadata = profileMetadataFromContent(event.content)
	const displayName = optionalNonemptyString(metadata?.display_name ?? metadata?.name)
	const about = optionalNonemptyString(metadata?.about)
	const nip05 = optionalNonemptyString(metadata?.nip05)
	const lud16 = optionalNonemptyString(metadata?.lud16)
	const lud06 = optionalNonemptyString(metadata?.lud06)
	const website = optionalUrlString(optionalNonemptyString(metadata?.website))
	const iconUrl = optionalUrlString(optionalNonemptyString(metadata?.picture))
	const bannerUrl = optionalUrlString(optionalNonemptyString(metadata?.banner))
	return {
		eventId: event.id,
		$profile: {
			[EntityMetaKey.Selector]: { pubkey: event.pubkey },
		},
		pubkey: event.pubkey,
		kind: event.kind,
		createdAt: event.created_at * 1000,
		signature: event.sig,
		content: event.content,
		tags: event.tags,
		...(displayName != null && { displayName }),
		...(about != null && { about }),
		...(nip05 != null && { nip05 }),
		...(lud16 != null && { lud16 }),
		...(lud06 != null && { lud06 }),
		...(website != null && { website }),
		...(iconUrl != null && {
			iconUrl,
			$icon: mediaFromUrl(iconUrl, MediaType.Image),
		}),
		...(bannerUrl != null && {
			bannerUrl,
			$banner: mediaFromUrl(bannerUrl, MediaType.Image),
		}),
	}
}

const articleEventFieldValues = (event: ValidatedNostrEvent) => {
	const identifier = tagValueFromTags(event.tags, 'd')
	if (identifier == null)
		throw new Error('NostrBand_Rest: article event missing identifier')
	const title = optionalNonemptyString(tagValueFromTags(event.tags, 'title'))
	const summary = optionalNonemptyString(tagValueFromTags(event.tags, 'summary'))
	const imageUrl = optionalUrlString(optionalNonemptyString(tagValueFromTags(event.tags, 'image')))
	const content = optionalNonemptyString(event.content)
	const contentWarning = optionalNonemptyString(tagValueFromTags(event.tags, 'content-warning'))
	const publishedAt = articlePublishedAtMs(event)

	return {
		eventId: event.id,
		$article: {
			[EntityMetaKey.Selector]: {
				kind: 30_023,
				pubkey: event.pubkey,
				identifier,
			},
		},
		pubkey: event.pubkey,
		identifier,
		kind: event.kind,
		createdAt: event.created_at * 1000,
		signature: event.sig,
		tags: event.tags,
		...(title != null && { title }),
		...(summary != null && { summary }),
		...(imageUrl != null && { imageUrl }),
		...(content != null && { content }),
		sensitive: event.tags.some((tag) => tag[0] === 'content-warning'),
		...(contentWarning != null && { contentWarning }),
		...(publishedAt != null && { publishedAt }),
		$author: {
			[EntityMetaKey.Selector]: { pubkey: event.pubkey },
		},
	}
}

const profileMetadataEventReference = (event: ValidatedNostrEvent) => ({
	[EntityMetaKey.Selector]: { eventId: event.id },
	[EntityMetaKey.Fields]: Object.fromEntries(
		Object.entries(profileMetadataEventFieldValues(event)).map(([field, value]) => [
			entityFieldAddressKey(EntityType.NostrProfileMetadataEvent, [], field),
			value,
		])
	),
})

const articleEventReference = (event: ValidatedNostrEvent) => ({
	[EntityMetaKey.Selector]: { eventId: event.id },
	[EntityMetaKey.Fields]: Object.fromEntries(
		Object.entries(articleEventFieldValues(event)).map(([field, value]) => [
			entityFieldAddressKey(EntityType.NostrArticleEvent, [], field),
			value,
		])
	),
})

const validatedEvents = (
	events: NostrEvent[],
	expectation: NostrEventExpectation
) => events.flatMap((event) => {
	try {
		return [validateNostrEvent(event, expectation)]
	} catch {
		return []
	}
})

const eventFromWire = (wire: {
	event?: JsonObject
	events?: JsonObject[]
	profile?: JsonObject
} | undefined, expectation: NostrEventExpectation = {}) => (
	((event) => event == null ? undefined : validateNostrEvent(event, expectation))(
		wire?.event
		?? wire?.events?.[0]
		?? wire?.profile
	)
)

const relayUrlFromWire = (relay: NostrBandRelayStats) => (
	normalizeRelayUrl(
		relay.url
		?? relay.relay_url
		?? relay.relay
		?? (
			relay.domain == null ?
				undefined
			:
				`wss://${relay.domain}`
		)
	)
)

export default {
	source: Source.NostrBand_Rest,

	resolvers: [
		defineResolver(Source.NostrBand_Rest, {
			entityType: EntityType.NostrSearchQuery,
			resolve: {
				Query: {
					resolve: async ({ query }, context) => {
						const {
							normalizeNostrBandProfileSearchQuery,
							searchProfiles,
						} = await import('$/sources/NostrBand/Rest/queries.ts')
						const normalizedQuery = normalizeNostrBandProfileSearchQuery(query)
						const profiles = [...new Map(
							validatedEvents(
								(await searchProfiles(normalizedQuery, resolverContextRowLimit(context))).events ?? [],
								{ kinds: [0] }
							)
								.flatMap((event) => {
									const pubkey = event.kind === 0 ? normalizePubkey(event.pubkey) : undefined
									return pubkey == null ?
										[]
									:
										[[
											pubkey,
											{
												[EntityMetaKey.Selector]: { pubkey },
											},
										] as const]
								})
						).values()]
						return {
							query: normalizedQuery,
							profiles,
							resultCount: profiles.length,
							completed: true,
						}
					},
				},
			},
		})({
			query: (search) => search.query,
			resultCount: (search) => search.resultCount,
			completed: (search) => search.completed,
			$$profiles: {
				select: (search) => search.profiles,
				resolveCount: (search) => search.resultCount,
				continuation: () => ({
					operation: 'profile-search',
					target: 'api',
					terminal: true,
				}),
			},
		}),

		defineResolver(Source.NostrBand_Rest, {
			entityType: EntityType.NostrProfile,
			resolve: {
				CanonicalPubkey: {
					resolve: async ({ pubkey }, context) => {
						const { listAuthorEvents } = await import('$/sources/NostrBand/Rest/queries.ts')
						const events = [...new Map(
							validatedEvents(
								(await listAuthorEvents(pubkey, resolverContextRowLimit(context), [0])).events ?? [],
								{
									kinds: [0],
									pubkey,
								}
							).map((event) => [event.id, event])
						).values()].sort(newestNostrEventFirst)
						return {
							pubkey,
							$latestMetadataEvent: (
								events.length === 0 ?
									undefined
								:
									profileMetadataEventReference(events[0])
							),
							$$metadataEvents: events.map(profileMetadataEventReference),
						}
					},
				}
			},
		})({
			pubkey: (profile) => profile.pubkey,
			$latestMetadataEvent: (profile) => profile.$latestMetadataEvent,
			$$metadataEvents: (profile) => profile.$$metadataEvents,
		}),

		defineResolver(Source.NostrBand_Rest, {
			entityType: EntityType.NostrProfileMetadataEvent,
			resolve: {
				CanonicalEventId: {
					resolve: async ({ eventId }) => {
						const { getEventById } = await import('$/sources/NostrBand/Rest/queries.ts')
						const event = eventFromWire(await getEventById(eventId), {
							eventId,
							kinds: [0],
						})
						if (event == null)
							throw new Error('NostrBand_Rest: profile metadata event not found')
						return profileMetadataEventFieldValues(event)
					},
				},
			},
		})({
			eventId: (event) => event.eventId,
			$profile: (event) => event.$profile,
			pubkey: (event) => event.pubkey,
			kind: (event) => event.kind,
			createdAt: (event) => event.createdAt,
			signature: (event) => event.signature,
			content: (event) => event.content,
			tags: (event) => event.tags,
			displayName: (event) => event.displayName,
			about: (event) => event.about,
			nip05: (event) => event.nip05,
			lud16: (event) => event.lud16,
			lud06: (event) => event.lud06,
			website: (event) => event.website,
			iconUrl: (event) => event.iconUrl,
			$icon: (event) => event.$icon,
			bannerUrl: (event) => event.bannerUrl,
			$banner: (event) => event.$banner,
		}),

		defineResolver(Source.NostrBand_Rest, {
			entityType: EntityType.NostrNote,
			resolve: {
				CanonicalEventId: {
					resolve: async ({ eventId: eventIdSelector }, context) => {
						const { getEventById } = await import('$/sources/NostrBand/Rest/queries.ts')
						const event = eventFromWire(await getEventById(eventIdSelector), {
							eventId: eventIdSelector,
							kinds: [1],
						})
						if (event == null || event.kind !== 1)
							throw new Error('NostrBand_Rest: note not found')
						const eventId = normalizeEventId(String(event.id))
						if (eventId == null || eventId !== eventIdSelector)
							throw new Error('NostrBand_Rest: note event id mismatch')
						return nostrNoteFieldValuesFromEvent(event)
					},
				}
			},
		})({
				eventId: (note) => note.eventId,
				kind: (note) => note.kind,
				pubkey: (note) => note.pubkey,
				content: (note) => note.content,
				sensitive: (note) => note.sensitive,
				contentWarning: (note) => note.contentWarning,
				createdAt: (note) => note.createdAt,
				tags: (note) => note.tags,
				$author: (note) => note.$author,
				replyToEventId: (note) => note.replyToEventId,
				rootEventId: (note) => note.rootEventId,
				$replyToNote: (note) => note.$replyToNote,
				$rootNote: (note) => note.$rootNote,
			}),

		defineResolver(Source.NostrBand_Rest, {
			entityType: EntityType.NostrRelay,
			resolve: {
				RelayUrl: {
					resolve: ({ relayUrl: relayUrlSelector }) => {
						const relayUrl = normalizeRelayUrl(relayUrlSelector)
						if (relayUrl == null)
							throw new Error('NostrBand_Rest: relay url invalid')

						return {
							relayUrl,
							$$timestamps: [{
								[EntityMetaKey.Selector]: {
									$relay: { relayUrl },
									timestampMs: Date.now(),
									source: Source.NostrBand_Rest,
								},
							}],
						}
					},
				}
			},
		})({
			relayUrl: (relay) => relay.relayUrl,
			$$timestamps: (relay) => relay.$$timestamps,
		}),

		defineResolver(Source.NostrBand_Rest, {
			entityType: EntityType.NostrRelay_Timestamp,
			resolve: {
				RelayTimestampMsSource: {
					appliesTo: [{
						source: Source.NostrBand_Rest,
					}],
					resolve: async ({
						$relay,
						timestampMs,
						source,
					}) => {
						if (source !== Source.NostrBand_Rest)
							throw new Error(`NostrBand_Rest: unsupported source ${source}`)

						const relayUrl = normalizeRelayUrl($relay.relayUrl)
						if (relayUrl == null)
							throw new Error('NostrBand_Rest: relay url invalid')

						try {
							const { listTopRelays } = await import('$/sources/NostrBand/Rest/queries.ts')
							const relays = (await listTopRelays(100)).relays ?? []
							const relayIndex = relays.findIndex((relay) => relayUrlFromWire(relay) === relayUrl)
							if (relayIndex < 0)
								return {
									$relay: { [EntityMetaKey.Selector]: { relayUrl } },
									timestampMs,
									source,
									reachable: false,
									error: 'NostrBand_Rest: relay not found',
								}

							const relay = relays[relayIndex]
							return {
								$relay: { [EntityMetaKey.Selector]: { relayUrl } },
								timestampMs,
								source,
								reachable: true,
								name: optionalNonemptyString(relay.name),
								description: optionalNonemptyString(relay.description),
								software: optionalNonemptyString(relay.software),
								version: optionalNonemptyString(relay.version),
								...(relay.nips != null && { supportedNips: relay.nips }),
								...(relay.is_paid != null && { isPaid: relay.is_paid }),
								...(relay.is_paid == null && relay.paid != null && { isPaid: relay.paid }),
								...(relay.limit != null && { limitation: { maxLimit: relay.limit } }),
								...(relay.users != null && { activeUsers: relay.users }),
								...(relay.users == null && relay.users_count != null && { activeUsers: relay.users_count }),
								...(relay.events != null && { eventsPerDay: relay.events }),
								...(relay.events == null && relay.events_count != null && { eventsPerDay: relay.events_count }),
								rank: relayIndex + 1,
							}
						} catch (error) {
							return {
								$relay: { [EntityMetaKey.Selector]: { relayUrl } },
								timestampMs,
								source,
								name: undefined,
								description: undefined,
								software: undefined,
								version: undefined,
								supportedNips: undefined,
								limitation: undefined,
								isPaid: undefined,
								activeUsers: undefined,
								eventsPerDay: undefined,
								rank: undefined,
								reachable: false,
								error: error instanceof Error ? error.message : String(error),
							}
						}
					},
				},
			},
		})({
			$relay: (observation) => observation.$relay,
			timestampMs: (observation) => observation.timestampMs,
			source: (observation) => observation.source,
			name: (observation) => observation.name,
			description: (observation) => observation.description,
			software: (observation) => observation.software,
			version: (observation) => observation.version,
			supportedNips: (observation) => observation.supportedNips,
			limitation: (observation) => observation.limitation,
			isPaid: (observation) => observation.isPaid,
			activeUsers: (observation) => observation.activeUsers,
			eventsPerDay: (observation) => observation.eventsPerDay,
			rank: (observation) => observation.rank,
			reachable: (observation) => observation.reachable,
			error: (observation) => observation.error,
		}),

		defineResolver(Source.NostrBand_Rest, {
			entityType: EntityType.NostrRepost,
			resolve: {
				CanonicalEventId: {
					resolve: async ({ eventId: eventIdSelector }, context) => {
						const { getEventById } = await import('$/sources/NostrBand/Rest/queries.ts')
						const event = eventFromWire(await getEventById(eventIdSelector), {
							eventId: eventIdSelector,
							kinds: [6, 16],
						})
						if (event == null || !isNostrRepostKind(event.kind))
							throw new Error('NostrBand_Rest: repost not found')
						const eventId = normalizeEventId(String(event.id))
						if (eventId == null || eventId !== eventIdSelector)
							throw new Error('NostrBand_Rest: repost event id mismatch')
						const values = repostFieldValuesFromEvent(event)
						if (values.kind === 6) return values
						const embeddedTargetEvent = validatedNostrEventFromContent(event.content)
						const targetEventId = values.repostedEventId ?? embeddedTargetEvent?.id
						if (targetEventId == null) return values
						const valuesWithTargetIdentity = values.repostedEventId == null ?
							{
								...values,
								repostedEventId: targetEventId,
							}
						:
							values
						let targetEvent
						try {
							targetEvent = eventFromWire(await getEventById(targetEventId), {
								eventId: targetEventId,
							})
						} catch {
							targetEvent = embeddedTargetEvent?.id === targetEventId ? embeddedTargetEvent : undefined
						}
						targetEvent ??= embeddedTargetEvent?.id === targetEventId ? embeddedTargetEvent : undefined
						return repostFieldValuesFromTargetEvent(
							valuesWithTargetIdentity,
							targetEvent
						)
					},
				}
			},
		})({
				eventId: (repost) => repost.eventId,
				kind: (repost) => repost.kind,
				pubkey: (repost) => repost.pubkey,
				createdAt: (repost) => repost.createdAt,
				tags: (repost) => repost.tags,
				repostedEventId: (repost) => repost.repostedEventId,
				$author: (repost) => repost.$author,
				$repostedNote: (repost) => repost.$repostedNote,
				$repostedArticle: (repost) => repost.$repostedArticle,
			}),

		defineResolver(Source.NostrBand_Rest, {
			entityType: EntityType.NostrReaction,
			resolve: {
				CanonicalEventId: {
					resolve: async ({ eventId: eventIdSelector }, context) => {
						const { getEventById } = await import('$/sources/NostrBand/Rest/queries.ts')
						const event = eventFromWire(await getEventById(eventIdSelector), {
							eventId: eventIdSelector,
							kinds: [7],
						})
						if (event == null || event.kind !== 7)
							throw new Error('NostrBand_Rest: reaction not found')
						const eventId = normalizeEventId(String(event.id))
						if (eventId == null || eventId !== eventIdSelector)
							throw new Error('NostrBand_Rest: reaction event id mismatch')
						const values = reactionFieldValuesFromEvent(event)
						const targetEventId = reactionTargetEventIdFromTags(event.tags)
						let targetEvent
						try {
							targetEvent = eventFromWire(await getEventById(targetEventId), {
								eventId: targetEventId,
							})
						} catch {
							targetEvent = undefined
						}
						return reactionFieldValuesFromTargetEvent(
							values,
							targetEvent
						)
					},
				}
			},
		})({
				eventId: (reaction) => reaction.eventId,
				kind: (reaction) => reaction.kind,
				pubkey: (reaction) => reaction.pubkey,
				createdAt: (reaction) => reaction.createdAt,
				tags: (reaction) => reaction.tags,
				$author: (reaction) => reaction.$author,
				$targetNote: (reaction) => reaction.$targetNote,
				$targetArticle: (reaction) => reaction.$targetArticle,
				content: (reaction) => reaction.content,
			}),

		defineResolver(Source.NostrBand_Rest, {
			entityType: EntityType.NostrArticle,
			resolve: {
				CanonicalCoordinate: {
					resolve: async ({ identifier: identifierSelector, kind, pubkey: pubkeySelector }, context) => {
						const { listAuthorEvents } = await import('$/sources/NostrBand/Rest/queries.ts')
						const pubkey = normalizePubkey(pubkeySelector)
						const identifier = identifierSelector
						if (pubkey == null || identifier === '' || kind !== 30023)
							throw new Error('NostrBand_Rest: article id invalid')
						const events = [...new Map(
							validatedEvents(
								(await listAuthorEvents(pubkey, resolverContextRowLimit(context), [30_023])).events ?? [],
								{
									pubkey,
									kinds: [30_023],
								}
							)
								.filter((event) => tagValueFromTags(event.tags, 'd') === identifier)
								.map((event) => [event.id, event])
						).values()].sort(newestNostrEventFirst)
						if (events.length === 0)
							throw new Error('NostrBand_Rest: article not found')
						return {
							kind: 30_023,
							pubkey,
							identifier,
							$latestEvent: articleEventReference(events[0]),
							$$events: events.map(articleEventReference),
						}
					},
				}
			},
		})({
			pubkey: (article) => article.pubkey,
			identifier: (article) => article.identifier,
			kind: (article) => article.kind,
			$latestEvent: (article) => article.$latestEvent,
			$$events: (article) => article.$$events,
		}),

		defineResolver(Source.NostrBand_Rest, {
			entityType: EntityType.NostrArticleEvent,
			resolve: {
				CanonicalEventId: {
					resolve: async ({ eventId }) => {
						const { getEventById } = await import('$/sources/NostrBand/Rest/queries.ts')
						const event = eventFromWire(await getEventById(eventId), {
							eventId,
							kinds: [30_023],
						})
						if (event == null)
							throw new Error('NostrBand_Rest: article event not found')
						return articleEventFieldValues(event)
					},
				},
			},
		})({
			eventId: (event) => event.eventId,
			$article: (event) => event.$article,
			pubkey: (event) => event.pubkey,
			identifier: (event) => event.identifier,
			kind: (event) => event.kind,
			createdAt: (event) => event.createdAt,
			signature: (event) => event.signature,
			tags: (event) => event.tags,
			title: (event) => event.title,
			summary: (event) => event.summary,
			imageUrl: (event) => event.imageUrl,
			content: (event) => event.content,
			sensitive: (event) => event.sensitive,
			contentWarning: (event) => event.contentWarning,
			publishedAt: (event) => event.publishedAt,
			$author: (event) => event.$author,
		}),

		defineResolver(Source.NostrBand_Rest, {
			entityType: EntityType._GlobalNostrNetwork,
			resolve: {
				Scope: {
					resolve: async (_entitySelector, context) => {
						const { listTopProfiles } = await import('$/sources/NostrBand/Rest/queries.ts')
						const limit = resolverContextRowLimit(context)
						return (
							((await listTopProfiles(limit)).profiles ?? [])
								.flatMap((topProfile) => {
									if (topProfile.profile == null) return []
									const event = validatedEvents([topProfile.profile], { kinds: [0] }).at(0)
									if (event == null) return []
									const pubkey = normalizePubkey(topProfile.pubkey ?? event.pubkey)
									if (pubkey == null || event.pubkey !== pubkey) return []
									return [{
										[EntityMetaKey.Selector]: { pubkey },
									}]
								})
						)
					},
				},
			},
		})({
			$$observedProfiles: (profiles) => profiles,
		}),

		defineResolver(Source.NostrBand_Rest, {
			entityType: EntityType._GlobalNostrNetwork,
			resolve: {
				Scope: {
					resolve: async (_entitySelector, context) => {
						const { listRecentEvents } = await import('$/sources/NostrBand/Rest/queries.ts')
						const limit = resolverContextRowLimit(context)
						return (
							validatedEvents(
								(await listRecentEvents(limit, [1])).events ?? [],
								{ kinds: [1] }
							)
								.map((event) => ({
									[EntityMetaKey.Selector]: { eventId: event.id },
								}))
						)
					},
				},
			},
		})({
			$$observedNotes: (notes) => notes,
		}),

		defineResolver(Source.NostrBand_Rest, {
			entityType: EntityType._GlobalNostrNetwork,
			resolve: {
				Scope: {
					resolve: async (_entitySelector, context) => {
						const { listTopRelays } = await import('$/sources/NostrBand/Rest/queries.ts')
						const limit = resolverContextRowLimit(context)
						return (
							((await listTopRelays(limit)).relays ?? [])
								.flatMap((relay) => {
									const relayUrl = relayUrlFromWire(relay)
									if (relayUrl == null) return []
									return [{
										[EntityMetaKey.Selector]: { relayUrl },
									}]
								})
						)
					},
				},
			},
		})({
			$$observedRelays: (relays) => relays,
		}),

		defineResolver(Source.NostrBand_Rest, {
			entityType: EntityType._GlobalNostrNetwork,
			resolve: {
				Scope: {
					resolve: async (_entitySelector, context) => {
						const { listRecentEvents } = await import('$/sources/NostrBand/Rest/queries.ts')
						const limit = resolverContextRowLimit(context)
						return (
							validatedEvents(
								(await listRecentEvents(limit, [6, 16])).events ?? [],
								{ kinds: [6, 16] }
							)
								.map((event) => ({
									[EntityMetaKey.Selector]: { eventId: event.id },
								}))
						)
					},
				},
			},
		})({
			$$observedReposts: (reposts) => reposts,
		}),

		defineResolver(Source.NostrBand_Rest, {
			entityType: EntityType._GlobalNostrNetwork,
			resolve: {
				Scope: {
					resolve: async (_entitySelector, context) => {
						const { listRecentEvents } = await import('$/sources/NostrBand/Rest/queries.ts')
						const limit = resolverContextRowLimit(context)
						return (
							validatedEvents(
								(await listRecentEvents(limit, [30_023])).events ?? [],
								{ kinds: [30_023] }
							)
								.flatMap((event) => articleRefFromEvent(event))
						)
					},
				},
			},
		})({
			$$observedArticles: (articles) => articles,
		}),

		defineResolver(Source.NostrBand_Rest, {
			entityType: EntityType.NostrProfile,
			resolve: {
				CanonicalPubkey: {
					resolve: async ({ pubkey }, context) => {
						const { listAuthorEvents } = await import('$/sources/NostrBand/Rest/queries.ts')
						const limit = resolverContextRowLimit(context)
						return (
							validatedEvents(
								(await listAuthorEvents(pubkey, limit, [1])).events ?? [],
								{
									pubkey,
									kinds: [1],
								}
							)
								.map((event) => ({
									[EntityMetaKey.Selector]: { eventId: event.id },
								}))
						)
					},
				}
			},
		})({
				$$notes: (notes) => notes,
			}),

		defineResolver(Source.NostrBand_Rest, {
			entityType: EntityType.NostrProfile,
			resolve: {
				CanonicalPubkey: {
					resolve: async ({ pubkey }, context) => {
						const { listAuthorEvents } = await import('$/sources/NostrBand/Rest/queries.ts')
						const limit = resolverContextRowLimit(context)
						return (
							validatedEvents(
								(await listAuthorEvents(pubkey, limit, [30_023])).events ?? [],
								{
									pubkey,
									kinds: [30_023],
								}
							)
								.flatMap((event) => articleRefFromEvent(event))
						)
					},
				}
			},
		})({
				$$articles: (articles) => articles,
			}),

		defineResolver(Source.NostrBand_Rest, {
			entityType: EntityType.NostrProfile,
			resolve: {
				CanonicalPubkey: {
					resolve: async ({ pubkey }, context) => {
						const { listAuthorEvents } = await import('$/sources/NostrBand/Rest/queries.ts')
						const limit = resolverContextRowLimit(context)
						return (
							validatedEvents(
								(await listAuthorEvents(pubkey, limit, [6, 16])).events ?? [],
								{
									pubkey,
									kinds: [6, 16],
								}
							)
								.map((event) => ({
									[EntityMetaKey.Selector]: { eventId: event.id },
								}))
						)
					},
				}
			},
		})({
				$$reposts: (reposts) => reposts,
			}),

		defineResolver(Source.NostrBand_Rest, {
			entityType: EntityType.NostrNote,
			resolve: {
				CanonicalEventId: {
					resolve: async ({ eventId }, context) => {
						const { listNoteReplies } = await import('$/sources/NostrBand/Rest/queries.ts')
						const limit = resolverContextRowLimit(context)
						return (
							validatedEvents(
								(await listNoteReplies(eventId, limit)).events ?? [],
								{ kinds: [1] }
							)
								.filter((event) => replyToEventIdFromTags(event.tags) === eventId)
								.map((event) => ({
									[EntityMetaKey.Selector]: { eventId: event.id },
								}))
						)
					},
				}
			},
		})({
				$$replies: (replies) => replies,
			}),

		defineResolver(Source.NostrBand_Rest, {
			entityType: EntityType.NostrNote,
			resolve: {
				CanonicalEventId: {
					resolve: async ({ eventId }, context) => {
						const { listNoteReactions } = await import('$/sources/NostrBand/Rest/queries.ts')
						const limit = resolverContextRowLimit(context)
						return (
							validatedEvents(
								(await listNoteReactions(eventId, limit)).events ?? [],
								{ kinds: [7] }
							)
								.filter((event) => reactionTargetEventIdFromTags(event.tags) === eventId)
								.map((event) => ({
									[EntityMetaKey.Selector]: { eventId: event.id },
								}))
						)
					},
				}
			},
		})({
				$$reactions: (reactions) => reactions,
			}),

	],
}

import { optionalNonemptyString } from '$/lib/string.ts'
import { mediaFromUrl } from '$/resolvers/media.ts'
import {
	entityFieldAddressKey,
	EntityMetaKey,
} from '$/schema/$schema.ts'
import { EntityType } from '$/schema/EntityType.ts'
import { MediaType } from '$/schema/MediaType.ts'
import { UrlString } from '$/schema/UrlString.ts'
import type { NostrEventEnvelope } from '$/sources/NostrRelay/Nip01/event.ts'
import type {
	JsonObject,
	JsonValue,
} from '$/typescript/JsonValue.ts'
import {
	isJsonObject,
	isJsonString,
} from '$/typescript/JsonValue.ts'


export const normalizeNostrPubkey = (value: string | undefined | null) => {
	const normalized = value?.toLowerCase()
	return (
		normalized != null && normalized !== '' && /^[0-9a-f]{64}$/.test(normalized) ?
			normalized
		:
			undefined
	)
}

export const normalizeNostrEventId = (value: string | undefined | null) => {
	const normalized = value?.toLowerCase()
	return (
		normalized != null && /^[0-9a-f]{64}$/.test(normalized) ?
			normalized
		:
			undefined
	)
}

export const nostrTagValue = (
	tags: string[][],
	tagName: string
) => tags.flatMap((tag) => (
	tag[0] === tagName
	&& tag[1] !== '' ?
		[tag[1]]
	:
		[]
)).at(0)

const nostrEventIdsFromTags = (tags: string[][]) => tags.flatMap((tag) => (
	tag[0] === 'e' ?
		normalizeNostrEventId(tag[1]) ?? []
	:
		[]
))

export const nostrReactionTargetEventId = (tags: string[][]) => (
	nostrEventIdsFromTags(tags).at(-1)
)

const hasNostrMarkedThreadTags = (tags: string[][]) => tags.some((tag) => (
	tag[0] === 'e'
	&& (tag[3] === 'root' || tag[3] === 'reply')
))

export const nostrReplyToEventId = (tags: string[][]) => {
	const unmarkedEventIds = tags.flatMap((tag) => (
		tag[0] === 'e'
		&& tag[3] == null ?
			[normalizeNostrEventId(tag[1])]
		:
			[]
	)).filter((eventId) => eventId != null)
	return (
		tags.flatMap((tag) => (
			tag[0] === 'e'
			&& tag[3] === 'reply' ?
				[normalizeNostrEventId(tag[1])]
			:
				[]
		)).at(0)
		?? (
			hasNostrMarkedThreadTags(tags) ?
				undefined
			:
				unmarkedEventIds.at(-1)
		)
	)
}

const nostrRootEventId = (tags: string[][]) => {
	const unmarkedEventIds = tags.flatMap((tag) => (
		tag[0] === 'e'
		&& tag[3] == null ?
			[normalizeNostrEventId(tag[1])]
		:
			[]
	)).filter((eventId) => eventId != null)
	return (
		tags.flatMap((tag) => (
			tag[0] === 'e'
			&& tag[3] === 'root' ?
				[normalizeNostrEventId(tag[1])]
			:
				[]
		)).at(0)
		?? (
			hasNostrMarkedThreadTags(tags) ?
				undefined
			:
				unmarkedEventIds.at(0)
		)
	)
}

export const isNostrRepostKind = (kind: number): kind is 6 | 16 => (
	kind === 6 || kind === 16
)

const nostrArticleReference = (
	pubkey: string,
	identifier: string
) => ({
	[EntityMetaKey.Selector]: {
		kind: 30_023,
		pubkey,
		identifier,
	},
})

const nostrArticleReferenceFromCoordinate = (coordinate: string | undefined) => {
	if (coordinate == null)
		return undefined

	const [kind, pubkey, ...identifierParts] = coordinate.split(':')
	const identifier = identifierParts.join(':')
	const normalizedPubkey = normalizeNostrPubkey(pubkey)
	return (
		kind === '30023'
		&& normalizedPubkey != null
		&& identifier !== '' ?
			nostrArticleReference(normalizedPubkey, identifier)
		:
			undefined
	)
}

export const nostrArticleReferencesFromEvent = (event: NostrEventEnvelope) => {
	if (event.kind !== 30_023)
		return []

	const identifier = nostrTagValue(event.tags, 'd')
	return identifier == null ? [] : [nostrArticleReference(event.pubkey, identifier)]
}

export const nostrNoteFieldValues = (event: NostrEventEnvelope) => {
	const replyToEventId = nostrReplyToEventId(event.tags)
	const rootEventId = nostrRootEventId(event.tags)
	return {
		eventId: event.id,
		kind: 1,
		pubkey: event.pubkey,
		content: optionalNonemptyString(event.content),
		sensitive: event.tags.some((tag) => tag[0] === 'content-warning'),
		contentWarning: optionalNonemptyString(nostrTagValue(event.tags, 'content-warning')),
		tags: event.tags,
		createdAt: event.created_at * 1000,
		$author: {
			[EntityMetaKey.Selector]: { pubkey: event.pubkey },
		},
		...(replyToEventId != null && {
			replyToEventId,
			$replyToNote: {
				[EntityMetaKey.Selector]: { eventId: replyToEventId },
			},
		}),
		...(rootEventId != null && {
			rootEventId,
			$rootNote: {
				[EntityMetaKey.Selector]: { eventId: rootEventId },
			},
		}),
	}
}

export const nostrNoteFieldValuesWithThreadTargets = (
	note: ReturnType<typeof nostrNoteFieldValues>,
	targets: {
		replyToEvent?: NostrEventEnvelope
		rootEvent?: NostrEventEnvelope
	}
) => ({
	...note,
	...(note.replyToEventId != null && targets.replyToEvent?.kind === 1 && {
		$replyToNote: nostrNoteReference(targets.replyToEvent),
	}),
	...(note.rootEventId != null && targets.rootEvent?.kind === 1 && {
		$rootNote: nostrNoteReference(targets.rootEvent),
	}),
})

export const nostrNoteReference = (event: NostrEventEnvelope) => {
	const note = nostrNoteFieldValues(event)
	return {
		[EntityMetaKey.Selector]: {
			eventId: note.eventId,
		},
		[EntityMetaKey.Fields]: {
			[entityFieldAddressKey(EntityType.NostrNote, [], 'eventId')]: note.eventId,
			[entityFieldAddressKey(EntityType.NostrNote, [], 'kind')]: note.kind,
			[entityFieldAddressKey(EntityType.NostrNote, [], 'pubkey')]: note.pubkey,
			...(note.content != null && {
				[entityFieldAddressKey(EntityType.NostrNote, [], 'content')]: note.content,
			}),
			[entityFieldAddressKey(EntityType.NostrNote, [], 'sensitive')]: note.sensitive,
			...(note.contentWarning != null && {
				[entityFieldAddressKey(EntityType.NostrNote, [], 'contentWarning')]: note.contentWarning,
			}),
			[entityFieldAddressKey(EntityType.NostrNote, [], 'tags')]: note.tags,
			[entityFieldAddressKey(EntityType.NostrNote, [], 'createdAt')]: note.createdAt,
			[entityFieldAddressKey(EntityType.NostrNote, [], '$author')]: note.$author,
			...(note.replyToEventId != null && {
				[entityFieldAddressKey(EntityType.NostrNote, [], 'replyToEventId')]: note.replyToEventId,
			}),
			...(note.rootEventId != null && {
				[entityFieldAddressKey(EntityType.NostrNote, [], 'rootEventId')]: note.rootEventId,
			}),
			...(note.$replyToNote != null && {
				[entityFieldAddressKey(EntityType.NostrNote, [], '$replyToNote')]: note.$replyToNote,
			}),
			...(note.$rootNote != null && {
				[entityFieldAddressKey(EntityType.NostrNote, [], '$rootNote')]: note.$rootNote,
			}),
		},
	}
}

export const nostrRepostReference = (event: NostrEventEnvelope) => {
	const repost = nostrRepostFieldValues(event)
	return {
		[EntityMetaKey.Selector]: {
			eventId: repost.eventId,
		},
		[EntityMetaKey.Fields]: {
			[entityFieldAddressKey(EntityType.NostrRepost, [], 'eventId')]: repost.eventId,
			[entityFieldAddressKey(EntityType.NostrRepost, [], 'kind')]: repost.kind,
			[entityFieldAddressKey(EntityType.NostrRepost, [], 'pubkey')]: repost.pubkey,
			[entityFieldAddressKey(EntityType.NostrRepost, [], 'tags')]: repost.tags,
			[entityFieldAddressKey(EntityType.NostrRepost, [], 'createdAt')]: repost.createdAt,
			[entityFieldAddressKey(EntityType.NostrRepost, [], '$author')]: repost.$author,
			...(repost.repostedEventId != null && {
				[entityFieldAddressKey(EntityType.NostrRepost, [], 'repostedEventId')]: repost.repostedEventId,
			}),
			...(repost.$repostedNote != null && {
				[entityFieldAddressKey(EntityType.NostrRepost, [], '$repostedNote')]: repost.$repostedNote,
			}),
			...(repost.$repostedArticle != null && {
				[entityFieldAddressKey(EntityType.NostrRepost, [], '$repostedArticle')]: repost.$repostedArticle,
			}),
		},
	}
}

export const nostrReactionReference = (
	event: NostrEventEnvelope,
	targetNoteEventId?: string
) => {
	const reaction = nostrReactionFieldValues(event)
	return {
		[EntityMetaKey.Selector]: {
			eventId: reaction.eventId,
		},
		[EntityMetaKey.Fields]: {
			[entityFieldAddressKey(EntityType.NostrReaction, [], 'eventId')]: reaction.eventId,
			[entityFieldAddressKey(EntityType.NostrReaction, [], 'kind')]: reaction.kind,
			[entityFieldAddressKey(EntityType.NostrReaction, [], 'pubkey')]: reaction.pubkey,
			[entityFieldAddressKey(EntityType.NostrReaction, [], 'tags')]: reaction.tags,
			[entityFieldAddressKey(EntityType.NostrReaction, [], 'createdAt')]: reaction.createdAt,
			[entityFieldAddressKey(EntityType.NostrReaction, [], '$author')]: reaction.$author,
			...(reaction.content != null && {
				[entityFieldAddressKey(EntityType.NostrReaction, [], 'content')]: reaction.content,
			}),
			...(
				targetNoteEventId != null
				&& nostrReactionTargetEventId(event.tags) === targetNoteEventId
				&& {
					[entityFieldAddressKey(EntityType.NostrReaction, [], '$targetNote')]: {
						[EntityMetaKey.Selector]: { eventId: targetNoteEventId },
					},
				}
			),
			...(reaction.$targetArticle != null && {
				[entityFieldAddressKey(EntityType.NostrReaction, [], '$targetArticle')]: reaction.$targetArticle,
			}),
		},
	}
}

export const nostrRepostFieldValues = (event: NostrEventEnvelope) => {
	if (!isNostrRepostKind(event.kind))
		throw new Error('Nostr event is not a repost')
	const repostedEventId = nostrEventIdsFromTags(event.tags).at(0)
	const repostedArticle = (
		event.kind === 16 ?
			nostrArticleReferenceFromCoordinate(nostrTagValue(event.tags, 'a'))
		:
			undefined
	)
	return {
		eventId: event.id,
		kind: event.kind,
		pubkey: event.pubkey,
		tags: event.tags,
		createdAt: event.created_at * 1000,
		$author: {
			[EntityMetaKey.Selector]: { pubkey: event.pubkey },
		},
		...(repostedEventId != null && {
			repostedEventId,
			...(event.kind === 6 && {
				$repostedNote: {
					[EntityMetaKey.Selector]: { eventId: repostedEventId },
				},
			}),
		}),
		...(repostedArticle != null && {
			$repostedArticle: repostedArticle,
		}),
	}
}

export const nostrRepostFieldValuesWithTarget = (
	repostValues: ReturnType<typeof nostrRepostFieldValues>,
	targetEvent: NostrEventEnvelope | undefined
) => {
	if (targetEvent == null)
		return repostValues
	if (targetEvent.kind === 1)
		return {
			...repostValues,
			$repostedNote: nostrNoteReference(targetEvent),
		}
	if (targetEvent.kind !== 30_023)
		return repostValues

	const repostedArticle = nostrArticleReferencesFromEvent(targetEvent).at(0)
	return repostedArticle == null ?
		repostValues
	:
		{
			...repostValues,
			$repostedArticle: repostedArticle,
			$repostedNote: undefined,
		}
}

export const nostrReactionFieldValues = (event: NostrEventEnvelope) => {
	const targetEventId = nostrReactionTargetEventId(event.tags)
	const targetArticle = nostrArticleReferenceFromCoordinate(nostrTagValue(event.tags, 'a'))
	if (targetEventId == null && targetArticle == null)
		throw new Error('Nostr reaction is missing an event or address target')
	return {
		eventId: event.id,
		kind: 7,
		pubkey: event.pubkey,
		tags: event.tags,
		createdAt: event.created_at * 1000,
		$author: {
			[EntityMetaKey.Selector]: { pubkey: event.pubkey },
		},
		...(targetArticle != null && {
			$targetArticle: targetArticle,
		}),
		content: optionalNonemptyString(event.content),
	}
}

export const nostrReactionFieldValuesWithTarget = (
	reactionValues: ReturnType<typeof nostrReactionFieldValues>,
	targetEvent: NostrEventEnvelope | undefined
) => {
	if (targetEvent?.kind === 1)
		return {
			...reactionValues,
			$targetNote: nostrNoteReference(targetEvent),
		}
	if (targetEvent?.kind !== 30_023)
		return reactionValues

	const targetArticle = nostrArticleReferencesFromEvent(targetEvent).at(0)
	return targetArticle == null ?
		reactionValues
	:
		{
			...reactionValues,
			$targetArticle: targetArticle,
		}
}

const nostrArticlePublishedAtMs = (event: NostrEventEnvelope) => {
	const publishedAt = Number(nostrTagValue(event.tags, 'published_at'))
	return Number.isSafeInteger(publishedAt) && publishedAt >= 0 ?
		publishedAt * 1000
	:
		event.created_at * 1000
}

export const nostrArticleFieldValues = (event: NostrEventEnvelope) => {
	const identifier = nostrTagValue(event.tags, 'd')
	if (identifier == null)
		throw new Error('Nostr article is missing its identifier')
	const imageUrl = nostrTagValue(event.tags, 'image')
	return {
		kind: 30_023,
		pubkey: event.pubkey,
		identifier,
		title: optionalNonemptyString(nostrTagValue(event.tags, 'title')),
		summary: optionalNonemptyString(nostrTagValue(event.tags, 'summary')),
		imageUrl: imageUrl != null && UrlString.allows(imageUrl) ? imageUrl : undefined,
		content: optionalNonemptyString(event.content),
		sensitive: event.tags.some((tag) => tag[0] === 'content-warning'),
		contentWarning: optionalNonemptyString(nostrTagValue(event.tags, 'content-warning')),
		tags: event.tags,
		publishedAt: nostrArticlePublishedAtMs(event),
		$author: {
			[EntityMetaKey.Selector]: { pubkey: event.pubkey },
		},
	}
}

export const nostrArticleEventFieldValues = (event: NostrEventEnvelope) => {
	const article = nostrArticleFieldValues(event)
	return {
		eventId: event.id,
		$article: nostrArticleReference(article.pubkey, article.identifier),
		...article,
		createdAt: event.created_at * 1000,
		signature: event.sig,
	}
}

const nostrProfileMetadata = (content: string) => {
	try {
		const metadata: JsonValue = JSON.parse(content)
		return isJsonObject(metadata) ? metadata : undefined
	} catch {
		return undefined
	}
}

const nostrMetadataString = (
	metadata: JsonObject | undefined,
	field: string
) => (
	isJsonString(metadata?.[field]) ? metadata[field] : undefined
)

export const nostrProfileMetadataEventFieldValues = (event: NostrEventEnvelope) => {
	const metadata = nostrProfileMetadata(event.content)
	const displayName = optionalNonemptyString(
		nostrMetadataString(metadata, 'display_name')
		?? nostrMetadataString(metadata, 'name')
	)
	const about = optionalNonemptyString(nostrMetadataString(metadata, 'about'))
	const nip05 = optionalNonemptyString(nostrMetadataString(metadata, 'nip05'))
	const lud16 = optionalNonemptyString(nostrMetadataString(metadata, 'lud16'))
	const lud06 = optionalNonemptyString(nostrMetadataString(metadata, 'lud06'))
	const website = optionalNonemptyString(nostrMetadataString(metadata, 'website'))
	const iconUrl = optionalNonemptyString(nostrMetadataString(metadata, 'picture'))
	const bannerUrl = optionalNonemptyString(nostrMetadataString(metadata, 'banner'))
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
		...(website != null && UrlString.allows(website) && { website }),
		...(iconUrl != null && UrlString.allows(iconUrl) && {
			iconUrl,
			$icon: mediaFromUrl(iconUrl, MediaType.Image),
		}),
		...(bannerUrl != null && UrlString.allows(bannerUrl) && {
			bannerUrl,
			$banner: mediaFromUrl(bannerUrl, MediaType.Image),
		}),
	}
}

export const nostrArticleEventReference = (event: NostrEventEnvelope) => ({
	[EntityMetaKey.Selector]: { eventId: event.id },
	[EntityMetaKey.Fields]: Object.fromEntries(
		Object.entries(nostrArticleEventFieldValues(event)).map(([field, value]) => [
			entityFieldAddressKey(EntityType.NostrArticleEvent, [], field),
			value,
		])
	),
})

export const nostrProfileMetadataEventReference = (event: NostrEventEnvelope) => ({
	[EntityMetaKey.Selector]: { eventId: event.id },
	[EntityMetaKey.Fields]: Object.fromEntries(
		Object.entries(nostrProfileMetadataEventFieldValues(event)).map(([field, value]) => [
			entityFieldAddressKey(EntityType.NostrProfileMetadataEvent, [], field),
			value,
		])
	),
})

export const nostrEventsNewestFirst = (events: NostrEventEnvelope[]) => (
	[...new Map(events.map((event) => [event.id, event])).values()]
		.sort((left, right) => (
			right.created_at - left.created_at
			|| left.id.localeCompare(right.id)
		))
)

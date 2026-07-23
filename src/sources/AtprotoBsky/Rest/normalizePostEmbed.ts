import type {
	BskyAppViewPostEmbed,
	BskyAppViewRecordEmbed,
} from '$/sources/AtprotoBsky/Rest/types.ts'
import { isJsonObject } from '$/typescript/JsonValue.ts'

const postAtUriPattern = /^at:\/\/[^/]+\/app\.bsky\.feed\.post\/[^/]+$/
const isTrue = (value: boolean) => value

const normalizeRecord = (
	record: BskyAppViewRecordEmbed['record']
): BskyAppViewRecordEmbed['record'] | undefined => {
	switch (record.$type) {
		case 'app.bsky.embed.record#viewRecord':
			if (
				!postAtUriPattern.test(record.uri)
				|| record.cid.length === 0
				|| record.author.did.length === 0
				|| record.author.handle.length === 0
				|| !isJsonObject(record.value)
				|| record.value.$type !== 'app.bsky.feed.post'
				|| record.indexedAt.length === 0
			)
				return undefined
			return {
				...record,
				...(record.embeds != null && {
					embeds: record.embeds.flatMap((embed) => {
						const normalizedEmbed = normalizeBskyPostEmbed(embed)
						return normalizedEmbed == null ? [] : [normalizedEmbed]
					}),
				}),
			}
		case 'app.bsky.embed.record#viewNotFound':
			return postAtUriPattern.test(record.uri) && isTrue(record.notFound) ?
				record
			:
				undefined
		case 'app.bsky.embed.record#viewBlocked':
			return (
				postAtUriPattern.test(record.uri)
				&& isTrue(record.blocked)
				&& record.author.did.length > 0
			) ?
				record
			:
				undefined
		case 'app.bsky.embed.record#viewDetached':
			return postAtUriPattern.test(record.uri) && isTrue(record.detached) ?
				record
			:
				undefined
		default:
			return undefined
	}
}

export const normalizeBskyPostEmbed = (
	embed: BskyAppViewPostEmbed
): BskyAppViewPostEmbed | undefined => {
	try {
		switch (embed.$type) {
			case 'app.bsky.embed.images#view':
				return embed.images.every((image) => (
					image.thumb.length > 0
					&& image.fullsize.length > 0
					&& image.alt.startsWith('')
					&& (
						image.aspectRatio == null
						|| (
							Number.isInteger(image.aspectRatio.width)
							&& image.aspectRatio.width > 0
							&& Number.isInteger(image.aspectRatio.height)
							&& image.aspectRatio.height > 0
						)
					)
				)) ?
					embed
				:
					undefined
			case 'app.bsky.embed.video#view':
				return (
					embed.cid.length > 0
					&& embed.playlist.length > 0
					&& (
						embed.aspectRatio == null
						|| (
							Number.isInteger(embed.aspectRatio.width)
							&& embed.aspectRatio.width > 0
							&& Number.isInteger(embed.aspectRatio.height)
							&& embed.aspectRatio.height > 0
						)
					)
				) ?
					embed
				:
					undefined
			case 'app.bsky.embed.external#view':
				return (
					embed.external.uri.length > 0
					&& embed.external.title.startsWith('')
					&& embed.external.description.startsWith('')
					&& (
						embed.external.source == null
						|| (
							embed.external.source.uri.length > 0
							&& embed.external.source.title.startsWith('')
						)
					)
					&& (embed.external.associatedRefs ?? []).every((reference) => (
						reference.uri.length > 0
						&& reference.cid.length > 0
					))
					&& (embed.external.associatedProfiles ?? []).every((profile) => (
						profile.did.length > 0
						&& profile.handle.length > 0
					))
				) ?
					embed
				:
					undefined
			case 'app.bsky.embed.record#view': {
				const record = normalizeRecord(embed.record)
				return record == null ? undefined : {
					...embed,
					record,
				}
			}
			case 'app.bsky.embed.recordWithMedia#view': {
				const record = normalizeRecord(embed.record.record)
				const media = normalizeBskyPostEmbed(embed.media)
				return record == null || media == null || media.$type === 'app.bsky.embed.record#view' || media.$type === 'app.bsky.embed.recordWithMedia#view' ?
					undefined
				:
					{
						...embed,
						record: {
							...embed.record,
							record,
						},
						media,
					}
			}
			default:
				return undefined
		}
	} catch {
		// AppView JSON is an external wire boundary; malformed union members are omitted.
		return undefined
	}
}

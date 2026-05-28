import {
	defineEntityFieldResolver,
	defineEntityResolver,
	resolverLoadSubsetRowLimit,
	sourcePublicEnv,
} from '$/resolvers/$resolvers.ts'
import { mediaFromUrl } from '$/lib/media.ts'
import { singleFlight } from '$/lib/singleFlight.ts'
import { EntityMetaKey } from '$/schema/$EntityDefinition.ts'
import { EntityType } from '$/schema/$EntityType.ts'
import type { EntityFieldValues } from '$/schema/$schema.ts'
import type { schema } from '$/schema/index.ts'
import { MediaType } from '$/schema/Media.ts'
import { Source } from '$/sources/$Source.ts'
import type {
	MastodonApiV1Account,
	MastodonApiV1MediaAttachment,
	MastodonApiV1Status,
} from '$/sources/Mastodon/Rest/types.ts'

const optionalTrimmedString = (value: string | undefined) => (
	value?.trim() || undefined
)

const optionalFiniteNumber = (value: number | undefined) => (
	value != null && Number.isFinite(value) ? value : undefined
)

const optionalTimestampMs = (value: string | undefined) => (
	((parsed) => (
		Number.isFinite(parsed) ? parsed : undefined
	))(Date.parse(value ?? ''))
)

const mastodonLocalAccountId = (
	account: MastodonApiV1Account | null | undefined,
) => (
	optionalTrimmedString(account?.acct)
	?? (
		account?.id != null ?
			String(account.id)
		:
			undefined
	)
)

const mastodonMediaTypeFromWire = (wireType: string | undefined) => (
	wireType === 'video' || wireType === 'gifv' ?
		MediaType.Video
	: wireType === 'audio' ?
		MediaType.Audio
	:
		MediaType.Image
)

const mediaUrlFromMastodonAttachment = (
	attachment: MastodonApiV1MediaAttachment,
) => {
	const wireType = attachment.type
	const url = optionalTrimmedString(attachment.url)
	const previewUrl = optionalTrimmedString(attachment.preview_url)
	return (
		wireType === 'video' || wireType === 'gifv' || wireType === 'audio' ?
			url
		: wireType === 'image' ?
			url ?? previewUrl
		:
			url ?? previewUrl
	)
}

const mediaEntitiesFromMastodonAttachments = (
	attachments: MastodonApiV1MediaAttachment[] | undefined,
) => (
	(attachments ?? []).flatMap((attachment) => {
		const media = mediaFromUrl(
			mediaUrlFromMastodonAttachment(attachment),
			mastodonMediaTypeFromWire(attachment.type),
		)
		return media == null ? [] : [media]
	})
)

const activityPubNoteFieldsFromMastodonStatus = (
	status: MastodonApiV1Status,
	instanceOrigin: string,
): Partial<EntityFieldValues<typeof schema, EntityType.ActivityPubNote>> => {
	const createdAt = Date.parse(status.created_at ?? '')
	const editedAt = optionalTimestampMs(
		status.edited_at ?? undefined,
	)
	return {
		content: optionalTrimmedString(status.content),
		...(Number.isFinite(createdAt) && { createdAt }),
		...(editedAt != null && { editedAt }),
		favouriteCount: optionalFiniteNumber(status.favourites_count),
		reblogCount: optionalFiniteNumber(status.reblogs_count),
		replyCount: optionalFiniteNumber(status.replies_count),
		visibility: (
				status.visibility === 'public' ?
					'public' as const
				: status.visibility === 'unlisted' ?
					'unlisted' as const
				: status.visibility === 'private' ?
					'private' as const
				: status.visibility === 'direct' ?
					'direct' as const
				:
					undefined
			),
		...(status.sensitive != null && { sensitive: status.sensitive }),
		...(optionalTrimmedString(status.language ?? undefined) != null && {
			language: optionalTrimmedString(status.language ?? undefined),
		}),
		spoilerText: optionalTrimmedString(status.spoiler_text),
		...(optionalTrimmedString(status.url) != null && {
			statusUrl: optionalTrimmedString(status.url),
		}),
		...(optionalTrimmedString(status.uri) != null && {
			activityStreamsUri: optionalTrimmedString(status.uri),
		}),
		$$media: mediaEntitiesFromMastodonAttachments(status.media_attachments),
		$author: (
			(() => {
				const localAccountId = mastodonLocalAccountId(status.account)
				return (
					localAccountId == null ?
						undefined
					:	{
							[EntityMetaKey.Id]: {
								instanceOrigin,
								localAccountId,
							},
						}
				)
			})()
		),
		$inReplyTo: (
			status.in_reply_to_id == null || status.in_reply_to_id === '' ?
				undefined
			:	{
					[EntityMetaKey.Id]: {
						instanceOrigin,
						localStatusId: String(status.in_reply_to_id),
					},
				}
		),
		...(status.reblog?.id != null && {
			$reblogOf: {
				[EntityMetaKey.Id]: {
					instanceOrigin,
					localStatusId: String(status.reblog.id),
				},
			},
		}),
	}
}

const activityPubActorFieldsFromMastodonAccount = (
	account: MastodonApiV1Account,
	instanceOrigin: string,
	resolveAvatarUrl: (
		value: string | null | undefined,
		options?: { siteOrigin?: string },
	) => string | undefined,
) => ({
	username: optionalTrimmedString(account.username),
	acct: optionalTrimmedString(account.acct),
	displayName: optionalTrimmedString(account.display_name),
	note: optionalTrimmedString(account.note),
	...((
		iconMedia,
	) => (
		iconMedia != null && {
			$icon: iconMedia,
		}
	))(mediaFromUrl(resolveAvatarUrl(account.avatar, { siteOrigin: instanceOrigin }), MediaType.Image)),
	...((
		headerMedia,
	) => (
		headerMedia != null && {
			$headerImage: headerMedia,
		}
	))(mediaFromUrl(resolveAvatarUrl(account.header, { siteOrigin: instanceOrigin }), MediaType.Image)),
	...(optionalTrimmedString(account.url) != null && {
		profileUrl: optionalTrimmedString(account.url),
	}),
	...(optionalTrimmedString(account.uri) != null && {
		activityStreamsUri: optionalTrimmedString(account.uri),
	}),
	...(optionalTrimmedString(account.website ?? undefined) != null && {
		website: optionalTrimmedString(account.website ?? undefined),
	}),
	followersCount: optionalFiniteNumber(account.followers_count),
	followingCount: optionalFiniteNumber(account.following_count),
	statusesCount: optionalFiniteNumber(account.statuses_count),
	...(account.bot != null && { bot: account.bot }),
	...(account.locked != null && { locked: account.locked }),
	...(optionalTimestampMs(account.created_at) != null && {
		createdAt: optionalTimestampMs(account.created_at),
	}),
})

const fediAvatarUrl = (
	value: string | null | undefined,
	options?: { siteOrigin?: string },
) => {
	const raw = value?.trim() ?? ''
	if (raw.length === 0) return undefined
	const withOrigin = (
		raw.startsWith('/') && options?.siteOrigin != null ?
			new URL(raw, options.siteOrigin).toString()
		:
			raw
	)
	return withOrigin
}

export default {
	source: Source.Fedi_Rest,

	entityResolvers: [
		defineEntityResolver({
			entityType: EntityType.ActivityPubActor,
			resolve: async (entityId, context) => {
				const publicEnv = sourcePublicEnv(context, Source.Fedi_Rest)
				const { assertInstanceMatches, fediGetAccount } = await import('$/sources/Fedi/Rest/queries.ts')
				assertInstanceMatches(entityId.instanceOrigin)
				const a = await singleFlight(fediGetAccount)(publicEnv, entityId.localAccountId)
				if (a == null) throw new Error('Fedi_Rest: account not found')
				return activityPubActorFieldsFromMastodonAccount(
					a,
					entityId.instanceOrigin,
					fediAvatarUrl,
				)
			},
		}),

		defineEntityResolver({
			entityType: EntityType.ActivityPubNote,
			resolve: async (entityId, context) => {
				const publicEnv = sourcePublicEnv(context, Source.Fedi_Rest)
				const {
					assertInstanceMatches,
					fediGetStatus,
				} = await import('$/sources/Fedi/Rest/queries.ts')
				assertInstanceMatches(entityId.instanceOrigin)
				const s = await singleFlight(fediGetStatus)(publicEnv, entityId.localStatusId)
				if (s == null) throw new Error('Fedi_Rest: status not found')
				return activityPubNoteFieldsFromMastodonStatus(s, entityId.instanceOrigin)
			},
		}),
	],

	entityFieldResolvers: [
		defineEntityFieldResolver({
			entityType: EntityType.ActivityPubNetwork,
			fieldName: 'fediInstanceTitle',
			resolve: async (_entityId, context) => {
				const publicEnv = sourcePublicEnv(context, Source.Fedi_Rest)
				const { fediGetInstance } = await import('$/sources/Fedi/Rest/queries.ts')
				const instance = await singleFlight(fediGetInstance)(publicEnv)
				if (instance == null) throw new Error('Fedi_Rest: instance not found')
				return optionalTrimmedString(instance.title)
			},
		}),

		defineEntityFieldResolver({
			entityType: EntityType.ActivityPubNetwork,
			fieldName: 'fediInstanceDescription',
			resolve: async (_entityId, context) => {
				const publicEnv = sourcePublicEnv(context, Source.Fedi_Rest)
				const { fediGetInstance } = await import('$/sources/Fedi/Rest/queries.ts')
				const instance = await singleFlight(fediGetInstance)(publicEnv)
				if (instance == null) throw new Error('Fedi_Rest: instance not found')
				return (
					optionalTrimmedString(instance.description)
					?? optionalTrimmedString(instance.short_description)
				)
			},
		}),

		defineEntityFieldResolver({
			entityType: EntityType.ActivityPubNetwork,
			fieldName: 'fediInstanceVersion',
			resolve: async (_entityId, context) => {
				const publicEnv = sourcePublicEnv(context, Source.Fedi_Rest)
				const { fediGetInstance } = await import('$/sources/Fedi/Rest/queries.ts')
				const instance = await singleFlight(fediGetInstance)(publicEnv)
				if (instance == null) throw new Error('Fedi_Rest: instance not found')
				return optionalTrimmedString(instance.version)
			},
		}),

		defineEntityFieldResolver({
			entityType: EntityType.ActivityPubNetwork,
			fieldName: '$$activityPubActors',
			resolve: async (_entityId, context) => {
				const publicEnv = sourcePublicEnv(context, Source.Fedi_Rest)
				const { fediInstanceOrigin } = await import('$/sources/Fedi/Rest/constants.ts')
				const { fediListPublicTimeline } = await import('$/sources/Fedi/Rest/queries.ts')
				const limit = resolverLoadSubsetRowLimit(context)
				return (
					(await singleFlight(fediListPublicTimeline)(publicEnv, limit))
						.flatMap((status) => {
							const localAccountId = mastodonLocalAccountId(status.account)
							if (localAccountId == null) return []
							return [{
								[EntityMetaKey.Id]: {
									instanceOrigin: fediInstanceOrigin,
									localAccountId,
								},
							}]
						})
				)
			},
		}),

		defineEntityFieldResolver({
			entityType: EntityType.ActivityPubNetwork,
			fieldName: '$$activityPubNotes',
			resolve: async (_entityId, context) => {
				const publicEnv = sourcePublicEnv(context, Source.Fedi_Rest)
				const { fediInstanceOrigin } = await import('$/sources/Fedi/Rest/constants.ts')
				const { fediListPublicTimeline } = await import('$/sources/Fedi/Rest/queries.ts')
				const limit = resolverLoadSubsetRowLimit(context)
				return (
					(await singleFlight(fediListPublicTimeline)(publicEnv, limit))
						.flatMap((status) => (
							status.id == null ?
								[]
							:	[
								{
									[EntityMetaKey.Id]: {
										instanceOrigin: fediInstanceOrigin,
										localStatusId: String(status.id),
									},
								},
							]
						))
				)
			},
		}),

		defineEntityFieldResolver({
			entityType: EntityType.ActivityPubActor,
			fieldName: '$$notes',
			resolve: async (entityId, context) => {
				const publicEnv = sourcePublicEnv(context, Source.Fedi_Rest)
				const { assertInstanceMatches, fediListAccountStatuses } = await import('$/sources/Fedi/Rest/queries.ts')
				assertInstanceMatches(entityId.instanceOrigin)
				const limit = resolverLoadSubsetRowLimit(context)
				return (
					(await singleFlight(fediListAccountStatuses)(publicEnv, entityId.localAccountId, limit))
						.flatMap((s) => (
							s.id == null ?
								[]
							:	[
								{
									[EntityMetaKey.Id]: {
										instanceOrigin: entityId.instanceOrigin,
										localStatusId: String(s.id),
									},
								},
							]
						))
				)
			},
		}),

		defineEntityFieldResolver({
			entityType: EntityType.ActivityPubNote,
			fieldName: '$$thread',
			resolve: async (entityId, context) => {
				const publicEnv = sourcePublicEnv(context, Source.Fedi_Rest)
				const {
					assertInstanceMatches,
					fediGetStatusContext,
				} = await import('$/sources/Fedi/Rest/queries.ts')
				assertInstanceMatches(entityId.instanceOrigin)
				const { ancestors = [], descendants = [] } = await singleFlight(fediGetStatusContext)(publicEnv, entityId.localStatusId)
				return (
					[...ancestors, ...descendants]
						.flatMap((s) => (
							s.id == null || String(s.id) === entityId.localStatusId ?
								[]
							:	[
								{
									[EntityMetaKey.Id]: {
										instanceOrigin: entityId.instanceOrigin,
										localStatusId: String(s.id),
									},
								},
							]
						))
				)
			},
		}),
	],
}

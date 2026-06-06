import {
	defineEntityFieldResolver,
	defineEntityResolver,
	resolverLoadSubsetRowLimit,
	sourcePublicEnv,
} from '$/resolvers/$resolvers.ts'
import { mediaFromUrl } from '$/lib/media.ts'
import { optionalNonemptyString } from '$/lib/string.ts'
import { singleFlight } from '$/lib/singleFlight.ts'
import { optionalTimestampMs } from '$/lib/time.ts'
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


const mastodonLocalAccountId = (
	account: MastodonApiV1Account | null | undefined,
) => (
	optionalNonemptyString(account?.acct)
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
	const url = optionalNonemptyString(attachment.url)
	const previewUrl = optionalNonemptyString(attachment.preview_url)
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
	const editedAt = optionalTimestampMs(status.edited_at ?? undefined)
	const content = optionalNonemptyString(status.content)
	const language = optionalNonemptyString(status.language ?? undefined)
	const spoilerText = optionalNonemptyString(status.spoiler_text)
	const statusUrl = optionalNonemptyString(status.url)
	const activityStreamsUri = optionalNonemptyString(status.uri)
	const visibility = (
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
	)
	return {
		...(content != null && { content }),
		...(Number.isFinite(createdAt) && { createdAt }),
		...(editedAt != null && { editedAt }),
		...(status.favourites_count != null && { favouriteCount: status.favourites_count }),
		...(status.reblogs_count != null && { reblogCount: status.reblogs_count }),
		...(status.replies_count != null && { replyCount: status.replies_count }),
		...(visibility != null && { visibility }),
		...(status.sensitive != null && { sensitive: status.sensitive }),
		...(language != null && { language }),
		...(spoilerText != null && { spoilerText }),
		...(statusUrl != null && { statusUrl }),
		...(activityStreamsUri != null && { activityStreamsUri }),
		$$media: mediaEntitiesFromMastodonAttachments(status.media_attachments),
		$author: (
			(() => {
				const localAccountId = mastodonLocalAccountId(status.account)
				return (
					localAccountId == null ?
						undefined
					:
						{
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
			:
				{
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
) => {
	const username = optionalNonemptyString(account.username)
	const acct = optionalNonemptyString(account.acct)
	const displayName = optionalNonemptyString(account.display_name)
	const note = optionalNonemptyString(account.note)
	const profileUrl = optionalNonemptyString(account.url)
	const activityStreamsUri = optionalNonemptyString(account.uri)
	const website = optionalNonemptyString(account.website ?? undefined)
	const createdAt = optionalTimestampMs(account.created_at)
	return {
		instanceOrigin,
		localAccountId: String(account.id),
		...(username != null && { username }),
		...(acct != null && { acct }),
		...(displayName != null && { displayName }),
		...(note != null && { note }),
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
		...(profileUrl != null && { profileUrl }),
		...(activityStreamsUri != null && { activityStreamsUri }),
		...(website != null && { website }),
		...(account.followers_count != null && { followersCount: account.followers_count }),
		...(account.following_count != null && { followingCount: account.following_count }),
		...(account.statuses_count != null && { statusesCount: account.statuses_count }),
		...(account.bot != null && { bot: account.bot }),
		...(account.locked != null && { locked: account.locked }),
		...(createdAt != null && { createdAt }),
	}
}

const fediAvatarUrl = (
	value: string | null | undefined,
	options?: { siteOrigin?: string },
) => {
	const raw = value ?? ''
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
				const { assertInstanceMatches, getAccount } = await import('$/sources/Fedi/Rest/queries.ts')
				assertInstanceMatches(entityId.instanceOrigin)
				const a = await singleFlight(getAccount)(publicEnv, 'localAccountId' in entityId ? entityId.localAccountId : entityId.acct)
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
					getStatus,
				} = await import('$/sources/Fedi/Rest/queries.ts')
				assertInstanceMatches(entityId.instanceOrigin)
				const s = await singleFlight(getStatus)(publicEnv, entityId.localStatusId)
				return activityPubNoteFieldsFromMastodonStatus(s, entityId.instanceOrigin)
			},
		}),

		defineEntityResolver({
			entityType: EntityType.ActivityPubActor_Timestamp,
			resolve: async (entityId, context) => {
				const publicEnv = sourcePublicEnv(context, Source.Fedi_Rest)
				const { assertInstanceMatches, getAccount } = await import('$/sources/Fedi/Rest/queries.ts')
				assertInstanceMatches(entityId.$actor.instanceOrigin)
				if (!('localAccountId' in entityId.$actor))
					throw new Error('Fedi_Rest: ActivityPubActor_Timestamp acct lookup is unsupported')

				const account = await singleFlight(getAccount)(publicEnv, entityId.$actor.localAccountId)
				return {
					...(account.followers_count != null && { followersCount: account.followers_count }),
					...(account.following_count != null && { followingCount: account.following_count }),
					...(account.statuses_count != null && { statusesCount: account.statuses_count }),
				}
			},
		}),

		defineEntityResolver({
			entityType: EntityType.ActivityPubNote_Timestamp,
			resolve: async (entityId, context) => {
				const publicEnv = sourcePublicEnv(context, Source.Fedi_Rest)
				const {
					assertInstanceMatches,
					getStatus,
				} = await import('$/sources/Fedi/Rest/queries.ts')
				assertInstanceMatches(entityId.$note.instanceOrigin)
				const status = await singleFlight(getStatus)(publicEnv, entityId.$note.localStatusId)
				return {
					...(status.favourites_count != null && { favouriteCount: status.favourites_count }),
					...(status.reblogs_count != null && { reblogCount: status.reblogs_count }),
					...(status.replies_count != null && { replyCount: status.replies_count }),
				}
			},
		}),
	],

	entityFieldResolvers: [
		defineEntityFieldResolver({
			entityType: EntityType.ActivityPubNetwork,
			fieldName: 'fediInstanceTitle',
			resolve: async (_entityId, context) => {
				const publicEnv = sourcePublicEnv(context, Source.Fedi_Rest)
				const { getInstance } = await import('$/sources/Fedi/Rest/queries.ts')
				const instance = await singleFlight(getInstance)(publicEnv)
				return optionalNonemptyString(instance.title)
			},
		}),

		defineEntityFieldResolver({
			entityType: EntityType.ActivityPubNetwork,
			fieldName: 'fediInstanceDescription',
			resolve: async (_entityId, context) => {
				const publicEnv = sourcePublicEnv(context, Source.Fedi_Rest)
				const { getInstance } = await import('$/sources/Fedi/Rest/queries.ts')
				const instance = await singleFlight(getInstance)(publicEnv)
				return (
					optionalNonemptyString(instance.description)
					?? optionalNonemptyString(instance.short_description)
				)
			},
		}),

		defineEntityFieldResolver({
			entityType: EntityType.ActivityPubNetwork,
			fieldName: 'fediInstanceVersion',
			resolve: async (_entityId, context) => {
				const publicEnv = sourcePublicEnv(context, Source.Fedi_Rest)
				const { getInstance } = await import('$/sources/Fedi/Rest/queries.ts')
				const instance = await singleFlight(getInstance)(publicEnv)
				return optionalNonemptyString(instance.version)
			},
		}),

		defineEntityFieldResolver({
			entityType: EntityType.ActivityPubNetwork,
			fieldName: '$$activityPubActors',
			resolve: async (_entityId, context) => {
				const publicEnv = sourcePublicEnv(context, Source.Fedi_Rest)
				const { fediInstanceOrigin } = await import('$/sources/Fedi/Rest/constants.ts')
				const { listPublicTimeline } = await import('$/sources/Fedi/Rest/queries.ts')
				const limit = resolverLoadSubsetRowLimit(context)
				return (
					(await singleFlight(listPublicTimeline)(publicEnv, limit))
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
				const { listPublicTimeline } = await import('$/sources/Fedi/Rest/queries.ts')
				const limit = resolverLoadSubsetRowLimit(context)
				return (
					(await singleFlight(listPublicTimeline)(publicEnv, limit))
						.flatMap((status) => (
							status.id == null ?
								[]
							:
								[
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
			fieldName: '$$timestamps',
			resolve: async (entityId, context) => {
				const publicEnv = sourcePublicEnv(context, Source.Fedi_Rest)
				const { assertInstanceMatches, getAccount } = await import('$/sources/Fedi/Rest/queries.ts')
				assertInstanceMatches(entityId.instanceOrigin)
				const account = await singleFlight(getAccount)(publicEnv, 'localAccountId' in entityId ? entityId.localAccountId : entityId.acct)
				return [
					{
						[EntityMetaKey.Id]: {
							$actor: {
								instanceOrigin: entityId.instanceOrigin,
								localAccountId: String(account.id),
							},
							timestampMs: Date.now(),
						},
						...(account.followers_count != null && { followersCount: account.followers_count }),
						...(account.following_count != null && { followingCount: account.following_count }),
						...(account.statuses_count != null && { statusesCount: account.statuses_count }),
					},
				]
			},
		}),

		defineEntityFieldResolver({
			entityType: EntityType.ActivityPubActor,
			fieldName: '$$notes',
			resolve: async (entityId, context) => {
				const publicEnv = sourcePublicEnv(context, Source.Fedi_Rest)
				const { assertInstanceMatches, listAccountStatuses } = await import('$/sources/Fedi/Rest/queries.ts')
				assertInstanceMatches(entityId.instanceOrigin)
				if (!('localAccountId' in entityId))
					throw new Error('Fedi_Rest: ActivityPubActor.$$notes acct lookup is unsupported')

				const limit = resolverLoadSubsetRowLimit(context)
				return (
					(await singleFlight(listAccountStatuses)(publicEnv, entityId.localAccountId, limit))
						.flatMap((s) => (
							s.id == null ?
								[]
							:
								[
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
			fieldName: '$$timestamps',
			resolve: async (entityId, context) => {
				const publicEnv = sourcePublicEnv(context, Source.Fedi_Rest)
				const {
					assertInstanceMatches,
					getStatus,
				} = await import('$/sources/Fedi/Rest/queries.ts')
				assertInstanceMatches(entityId.instanceOrigin)
				const status = await singleFlight(getStatus)(publicEnv, entityId.localStatusId)
				return [
					{
						[EntityMetaKey.Id]: {
							$note: entityId,
							timestampMs: Date.now(),
						},
						...(status.favourites_count != null && { favouriteCount: status.favourites_count }),
						...(status.reblogs_count != null && { reblogCount: status.reblogs_count }),
						...(status.replies_count != null && { replyCount: status.replies_count }),
					},
				]
			},
		}),

		defineEntityFieldResolver({
			entityType: EntityType.ActivityPubNote,
			fieldName: '$$thread',
			resolve: async (entityId, context) => {
				const publicEnv = sourcePublicEnv(context, Source.Fedi_Rest)
				const {
					assertInstanceMatches,
					getStatusContext,
				} = await import('$/sources/Fedi/Rest/queries.ts')
				assertInstanceMatches(entityId.instanceOrigin)
				const { ancestors = [], descendants = [] } = await singleFlight(getStatusContext)(publicEnv, entityId.localStatusId)
				return (
					[...ancestors, ...descendants]
						.flatMap((s) => (
							s.id == null || String(s.id) === entityId.localStatusId ?
								[]
							:
								[
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

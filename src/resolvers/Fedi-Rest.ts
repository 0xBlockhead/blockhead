import { resolverContextRowLimit } from '$/resolvers/$resolvers.ts'
import {
	defineResolver,
} from '$/resolvers/defineResolver.ts'
import { mediaFromUrl } from '$/lib/media.ts'
import { optionalNonemptyString } from '$/lib/string.ts'
import { singleFlight } from '$/lib/singleFlight.ts'
import { optionalTimestampMs } from '$/lib/time.ts'
import {
	EntityMetaKey,
} from '$/schema/$schema.ts'
import { EntityType } from '$/schema/EntityType.ts'
import type { EntityFieldValues } from '$/schema/$schema.ts'
import type { schema } from '$/schema/index.ts'
import { MediaType } from '$/schema/Media.ts'
import { Source } from '$/sources/Source.ts'
import type {
	MastodonApiV1Account,
	MastodonApiV1MediaAttachment,
	MastodonApiV1Status,
} from '$/sources/Mastodon/Rest/types.ts'
import { ActivityPubActorSelector } from '$/schema/ActivityPubActor.ts'
import { ActivityPubNoteSelector } from '$/schema/ActivityPubNote.ts'
import { ActivityPubActor_TimestampSelector } from '$/schema/ActivityPubActor_Timestamp.ts'
import { ActivityPubNote_TimestampSelector } from '$/schema/ActivityPubNote_Timestamp.ts'
import { ActivityPubNetworkSelector } from '$/schema/ActivityPubNetwork.ts'


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
							[EntityMetaKey.Selector]: {
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
					[EntityMetaKey.Selector]: {
						instanceOrigin,
						localStatusId: String(status.in_reply_to_id),
					},
				}
		),
		...(status.reblog?.id != null && {
			$reblogOf: {
				[EntityMetaKey.Selector]: {
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

	resolvers: [
		defineResolver(Source.Fedi_Rest, {
			entityType: EntityType.ActivityPubActor,
			resolve: {
				[ActivityPubActorSelector.LocalAccountId]: async ({ instanceOrigin, localAccountId }, context) => {
				const publicEnv = context.publicEnv
				const { assertInstanceMatches, getAccount } = await import('$/sources/Fedi/Rest/queries.ts')
				assertInstanceMatches(instanceOrigin)
				const a = await singleFlight(getAccount)(publicEnv, localAccountId)
				return activityPubActorFieldsFromMastodonAccount(
					a,
					instanceOrigin,
					fediAvatarUrl,
				)
			},
				[ActivityPubActorSelector.Acct]: async ({ instanceOrigin, acct }, context) => {
				const publicEnv = context.publicEnv
				const { assertInstanceMatches, getAccount } = await import('$/sources/Fedi/Rest/queries.ts')
				assertInstanceMatches(instanceOrigin)
				const a = await singleFlight(getAccount)(publicEnv, acct)
				return activityPubActorFieldsFromMastodonAccount(
					a,
					instanceOrigin,
					fediAvatarUrl,
				)
			}
			},
		})({
				fields: {
				instanceOrigin: (actor) => actor.instanceOrigin,
				localAccountId: (actor) => actor.localAccountId,
				username: (actor) => actor.username,
				acct: (actor) => actor.acct,
				displayName: (actor) => actor.displayName,
				note: (actor) => actor.note,
				$icon: (actor) => actor.$icon,
				$headerImage: (actor) => actor.$headerImage,
				profileUrl: (actor) => actor.profileUrl,
				activityStreamsUri: (actor) => actor.activityStreamsUri,
				website: (actor) => actor.website,
				followersCount: (actor) => actor.followersCount,
				followingCount: (actor) => actor.followingCount,
				statusesCount: (actor) => actor.statusesCount,
				bot: (actor) => actor.bot,
				locked: (actor) => actor.locked,
				createdAt: (actor) => actor.createdAt,
			},
			}),

		defineResolver(Source.Fedi_Rest, {
			entityType: EntityType.ActivityPubNote,
			resolve: {
				[ActivityPubNoteSelector.InstanceOriginLocalStatusId]: async ({ instanceOrigin, localStatusId }, context) => {
				const publicEnv = context.publicEnv
				const {
					assertInstanceMatches,
					getStatus,
				} = await import('$/sources/Fedi/Rest/queries.ts')
				assertInstanceMatches(instanceOrigin)
				const s = await singleFlight(getStatus)(publicEnv, localStatusId)
				return activityPubNoteFieldsFromMastodonStatus(s, instanceOrigin)
			}
			},
		})({
				fields: {
				content: (note) => note.content,
				createdAt: (note) => note.createdAt,
				editedAt: (note) => note.editedAt,
				favouriteCount: (note) => note.favouriteCount,
				reblogCount: (note) => note.reblogCount,
				replyCount: (note) => note.replyCount,
				visibility: (note) => note.visibility,
				sensitive: (note) => note.sensitive,
				language: (note) => note.language,
				spoilerText: (note) => note.spoilerText,
				statusUrl: (note) => note.statusUrl,
				activityStreamsUri: (note) => note.activityStreamsUri,
				$$media: (note) => note.$$media,
				$author: (note) => note.$author,
				$inReplyTo: (note) => note.$inReplyTo,
				$reblogOf: (note) => note.$reblogOf,
			},
			}),

		defineResolver(Source.Fedi_Rest, {
			entityType: EntityType.ActivityPubActor_Timestamp,
			resolve: {
				[ActivityPubActor_TimestampSelector.ActivityPubActorTimestampMs]: async ({ $actor }, context) => {
				const publicEnv = context.publicEnv
				const { assertInstanceMatches, getAccount } = await import('$/sources/Fedi/Rest/queries.ts')
				assertInstanceMatches($actor.instanceOrigin)
				if (!('localAccountId' in $actor))
					throw new Error('Fedi_Rest: ActivityPubActor_Timestamp acct lookup is unsupported')

				const account = await singleFlight(getAccount)(publicEnv, $actor.localAccountId)
				return {
					...(account.followers_count != null && { followersCount: account.followers_count }),
					...(account.following_count != null && { followingCount: account.following_count }),
					...(account.statuses_count != null && { statusesCount: account.statuses_count }),
				}
			}
			},
		})({
				fields: {
				followersCount: (timestamp) => timestamp.followersCount,
				followingCount: (timestamp) => timestamp.followingCount,
				statusesCount: (timestamp) => timestamp.statusesCount,
			},
			}),

		defineResolver(Source.Fedi_Rest, {
			entityType: EntityType.ActivityPubNote_Timestamp,
			resolve: {
				[ActivityPubNote_TimestampSelector.ActivityPubNoteTimestampMs]: async ({ $note }, context) => {
				const publicEnv = context.publicEnv
				const {
					assertInstanceMatches,
					getStatus,
				} = await import('$/sources/Fedi/Rest/queries.ts')
				assertInstanceMatches($note.instanceOrigin)
				const status = await singleFlight(getStatus)(publicEnv, $note.localStatusId)
				return {
					...(status.favourites_count != null && { favouriteCount: status.favourites_count }),
					...(status.reblogs_count != null && { reblogCount: status.reblogs_count }),
					...(status.replies_count != null && { replyCount: status.replies_count }),
				}
			}
			},
		})({
				fields: {
				favouriteCount: (timestamp) => timestamp.favouriteCount,
				reblogCount: (timestamp) => timestamp.reblogCount,
				replyCount: (timestamp) => timestamp.replyCount,
			},
			}),
		defineResolver(Source.Fedi_Rest, {
			entityType: EntityType.ActivityPubNetwork,
			resolve: {
				[ActivityPubNetworkSelector.Scope]: async (_entitySelector, context) => {
				const publicEnv = context.publicEnv
				const { getInstance } = await import('$/sources/Fedi/Rest/queries.ts')
				const instance = await singleFlight(getInstance)(publicEnv)
				return optionalNonemptyString(instance.title)
			}
			},
		})({
				fields: {
				fediInstanceTitle: (network) => network,
			},
			}),

		defineResolver(Source.Fedi_Rest, {
			entityType: EntityType.ActivityPubNetwork,
			resolve: {
				[ActivityPubNetworkSelector.Scope]: async (_entitySelector, context) => {
				const publicEnv = context.publicEnv
				const { getInstance } = await import('$/sources/Fedi/Rest/queries.ts')
				const instance = await singleFlight(getInstance)(publicEnv)
				return (
					optionalNonemptyString(instance.description)
					?? optionalNonemptyString(instance.short_description)
				)
			}
			},
		})({
				fields: {
				fediInstanceDescription: (network) => network,
			},
			}),

		defineResolver(Source.Fedi_Rest, {
			entityType: EntityType.ActivityPubNetwork,
			resolve: {
				[ActivityPubNetworkSelector.Scope]: async (_entitySelector, context) => {
				const publicEnv = context.publicEnv
				const { getInstance } = await import('$/sources/Fedi/Rest/queries.ts')
				const instance = await singleFlight(getInstance)(publicEnv)
				return optionalNonemptyString(instance.version)
			}
			},
		})({
				fields: {
				fediInstanceVersion: (network) => network,
			},
			}),

		defineResolver(Source.Fedi_Rest, {
			entityType: EntityType.ActivityPubNetwork,
			resolve: {
				[ActivityPubNetworkSelector.Scope]: async (_entitySelector, context) => {
				const publicEnv = context.publicEnv
				const { fediInstanceOrigin } = await import('$/sources/Fedi/Rest/constants.ts')
				const { listPublicTimeline } = await import('$/sources/Fedi/Rest/queries.ts')
				const limit = resolverContextRowLimit(context)
				return (
					(await singleFlight(listPublicTimeline)(publicEnv, limit))
						.flatMap((status) => {
							const localAccountId = mastodonLocalAccountId(status.account)
							if (localAccountId == null) return []
							return [{
								[EntityMetaKey.Selector]: {
									instanceOrigin: fediInstanceOrigin,
									localAccountId,
								},
							}]
						})
				)
			}
			},
		})({
				fields: {
				$$activityPubActors: (network) => network,
			},
			}),

		defineResolver(Source.Fedi_Rest, {
			entityType: EntityType.ActivityPubNetwork,
			resolve: {
				[ActivityPubNetworkSelector.Scope]: async (_entitySelector, context) => {
				const publicEnv = context.publicEnv
				const { fediInstanceOrigin } = await import('$/sources/Fedi/Rest/constants.ts')
				const { listPublicTimeline } = await import('$/sources/Fedi/Rest/queries.ts')
				const limit = resolverContextRowLimit(context)
				return (
					(await singleFlight(listPublicTimeline)(publicEnv, limit))
						.flatMap((status) => (
							status.id == null ?
								[]
							:
								[
								{
									[EntityMetaKey.Selector]: {
										instanceOrigin: fediInstanceOrigin,
										localStatusId: String(status.id),
									},
								},
							]
						))
				)
			}
			},
		})({
				fields: {
				$$activityPubNotes: (network) => network,
			},
			}),

		defineResolver(Source.Fedi_Rest, {
			entityType: EntityType.ActivityPubActor,
			resolve: {
				[ActivityPubActorSelector.LocalAccountId]: async ({ instanceOrigin, localAccountId }, context) => {
				const publicEnv = context.publicEnv
				const { assertInstanceMatches, getAccount } = await import('$/sources/Fedi/Rest/queries.ts')
				assertInstanceMatches(instanceOrigin)
				const account = await singleFlight(getAccount)(publicEnv, localAccountId)
				return [
					{
						[EntityMetaKey.Selector]: {
							$actor: {
								instanceOrigin,
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
				[ActivityPubActorSelector.Acct]: async ({ instanceOrigin, acct }, context) => {
				const publicEnv = context.publicEnv
				const { assertInstanceMatches, getAccount } = await import('$/sources/Fedi/Rest/queries.ts')
				assertInstanceMatches(instanceOrigin)
				const account = await singleFlight(getAccount)(publicEnv, acct)
				return [
					{
						[EntityMetaKey.Selector]: {
							$actor: {
								instanceOrigin,
								localAccountId: String(account.id),
							},
							timestampMs: Date.now(),
						},
						...(account.followers_count != null && { followersCount: account.followers_count }),
						...(account.following_count != null && { followingCount: account.following_count }),
						...(account.statuses_count != null && { statusesCount: account.statuses_count }),
					},
				]
			}
			},
		})({
				fields: {
				$$timestamps: (actor) => actor,
			},
			}),

		defineResolver(Source.Fedi_Rest, {
			entityType: EntityType.ActivityPubActor,
			resolve: {
				[ActivityPubActorSelector.LocalAccountId]: async ({ instanceOrigin, localAccountId }, context) => {
				const publicEnv = context.publicEnv
				const { assertInstanceMatches, listAccountStatuses } = await import('$/sources/Fedi/Rest/queries.ts')
				assertInstanceMatches(instanceOrigin)
				const limit = resolverContextRowLimit(context)
				return (
					(await singleFlight(listAccountStatuses)(publicEnv, localAccountId, limit))
						.flatMap((s) => (
							s.id == null ?
								[]
							:
								[
								{
									[EntityMetaKey.Selector]: {
										instanceOrigin,
										localStatusId: String(s.id),
									},
								},
							]
						))
				)
			}
			},
		})({
				fields: {
				$$notes: (actor) => actor,
			},
			}),

		defineResolver(Source.Fedi_Rest, {
			entityType: EntityType.ActivityPubNote,
			resolve: {
				[ActivityPubNoteSelector.InstanceOriginLocalStatusId]: async (entitySelector, context) => {
				const publicEnv = context.publicEnv
				const {
					assertInstanceMatches,
					getStatus,
				} = await import('$/sources/Fedi/Rest/queries.ts')
				assertInstanceMatches(entitySelector.instanceOrigin)
				const status = await singleFlight(getStatus)(publicEnv, entitySelector.localStatusId)
				return [
					{
						[EntityMetaKey.Selector]: {
							$note: entitySelector,
							timestampMs: Date.now(),
						},
						...(status.favourites_count != null && { favouriteCount: status.favourites_count }),
						...(status.reblogs_count != null && { reblogCount: status.reblogs_count }),
						...(status.replies_count != null && { replyCount: status.replies_count }),
					},
				]
			}
			},
		})({
				fields: {
				$$timestamps: (note) => note,
			},
			}),

		defineResolver(Source.Fedi_Rest, {
			entityType: EntityType.ActivityPubNote,
			resolve: {
				[ActivityPubNoteSelector.InstanceOriginLocalStatusId]: async ({ instanceOrigin, localStatusId }, context) => {
				const publicEnv = context.publicEnv
				const {
					assertInstanceMatches,
					getStatusContext,
				} = await import('$/sources/Fedi/Rest/queries.ts')
				assertInstanceMatches(instanceOrigin)
				const { ancestors = [], descendants = [] } = await singleFlight(getStatusContext)(publicEnv, localStatusId)
				return (
					[...ancestors, ...descendants]
						.flatMap((s) => (
							s.id == null || String(s.id) === entitySelector.localStatusId ?
								[]
							:
								[
								{
									[EntityMetaKey.Selector]: {
										instanceOrigin,
										localStatusId: String(s.id),
									},
								},
							]
						))
				)
			}
			},
		})({
				fields: {
				$$thread: (note) => note,
			},
			}),
	],
}

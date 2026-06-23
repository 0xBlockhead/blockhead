import { resolverContextRowLimit } from '$/resolvers/$resolvers.ts'
import {
	defineResolver,
} from '$/resolvers/defineResolver.ts'
import { mediaFromUrl } from '$/resolvers/media.ts'
import { optionalNonemptyString } from '$/lib/string.ts'
import { optionalTimestampMs } from '$/lib/time.ts'
import {
	EntityMetaKey,
} from '$/schema/$schema.ts'
import { EntityType } from '$/schema/EntityType.ts'
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


const mastodonLocalAccountId = (
	account: MastodonApiV1Account | null | undefined
) => (
	account?.id == null ?
		undefined
	:
		String(account.id)
)

const mastodonMediaTypeFromWire = (wireType: string | undefined) => (
	wireType === 'video' || wireType === 'gifv' ?
		MediaType.Video
	:
		wireType === 'audio' ?
			MediaType.Audio
		:
			MediaType.Image
)

const mediaUrlFromMastodonAttachment = (
	attachment: MastodonApiV1MediaAttachment
) => {
	const wireType = attachment.type
	const url = optionalNonemptyString(attachment.url)
	const previewUrl = optionalNonemptyString(attachment.preview_url)
	return (
		wireType === 'video' || wireType === 'gifv' || wireType === 'audio' ?
			url
		:
			wireType === 'image' ?
				url ?? previewUrl
			:
				url ?? previewUrl
	)
}

const mediaEntitiesFromMastodonAttachments = (
	attachments: MastodonApiV1MediaAttachment[] | undefined
) => (
	(attachments ?? []).flatMap((attachment) => {
		const media = mediaFromUrl(
			mediaUrlFromMastodonAttachment(attachment),
			mastodonMediaTypeFromWire(attachment.type)
		)
		return media == null ? [] : [media]
	})
)

const activityPubNoteFieldsFromMastodonStatus = (
	status: MastodonApiV1Status,
	instanceOrigin: string
) => {
	if (status.id == null)
		throw new Error('Mastodon_Rest: ActivityPub note missing local status id')
	const createdAt = Date.parse(status.created_at ?? '')
	const editedAt = optionalTimestampMs(status.edited_at ?? undefined)
	const content = optionalNonemptyString(status.content)
	const language = optionalNonemptyString(status.language ?? undefined)
	const spoilerText = optionalNonemptyString(status.spoiler_text)
	const statusUrl = optionalNonemptyString(status.url)
	const activityStreamsUri = optionalNonemptyString(status.uri)
	if (activityStreamsUri == null)
		throw new Error('Mastodon_Rest: ActivityPub note missing ActivityStreams URI')
	const visibility = (
		status.visibility === 'public' ?
			'public' as const
		:
			status.visibility === 'unlisted' ?
				'unlisted' as const
			:
				status.visibility === 'private' ?
					'private' as const
				:
					status.visibility === 'direct' ?
					'direct' as const
				:
					undefined
	)
	return {
		instanceOrigin,
		localStatusId: String(status.id),
		...(content != null && { content }),
		...(Number.isFinite(createdAt) && { createdAt }),
		...(editedAt != null && { editedAt }),
		...(visibility != null && { visibility }),
		...(status.sensitive != null && { sensitive: status.sensitive }),
		...(language != null && { language }),
		...(spoilerText != null && { spoilerText }),
		...(statusUrl != null && { statusUrl }),
		activityStreamsUri,
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
		options?: { siteOrigin?: string }
	) => string | undefined
) => {
	const username = optionalNonemptyString(account.username)
	const acct = optionalNonemptyString(account.acct)
	const displayName = optionalNonemptyString(account.display_name)
	const note = optionalNonemptyString(account.note)
	const profileUrl = optionalNonemptyString(account.url)
	const activityStreamsUri = optionalNonemptyString(account.uri)
	const website = optionalNonemptyString(account.website ?? undefined)
	const createdAt = optionalTimestampMs(account.created_at)
	if (acct == null)
		throw new Error('Mastodon_Rest: ActivityPub actor account missing acct')
	if (activityStreamsUri == null)
		throw new Error('Mastodon_Rest: ActivityPub actor account missing ActivityStreams URI')

	return {
		instanceOrigin,
		localAccountId: String(account.id),
		...(username != null && { username }),
		acct,
		...(displayName != null && { displayName }),
		...(note != null && { note }),
		...((
			iconMedia
		) => (
			iconMedia != null && {
				$icon: iconMedia,
			}
		))(mediaFromUrl(resolveAvatarUrl(account.avatar, { siteOrigin: instanceOrigin }), MediaType.Image)),
		...((
			headerMedia
		) => (
			headerMedia != null && {
				$headerImage: headerMedia,
			}
		))(mediaFromUrl(resolveAvatarUrl(account.header, { siteOrigin: instanceOrigin }), MediaType.Image)),
		...(profileUrl != null && { profileUrl }),
		activityStreamsUri,
		...(website != null && { website }),
		...(account.bot != null && { bot: account.bot }),
		...(account.locked != null && { locked: account.locked }),
		...(createdAt != null && { createdAt }),
	}
}

const mastodonAvatarUrl = (
	value: string | null | undefined,
	options?: { siteOrigin?: string }
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
	source: Source.Mastodon_Rest,

	resolvers: [
		defineResolver(Source.Mastodon_Rest, {
			entityType: EntityType.ActivityPubActor,
			resolve: {
				[ActivityPubActorSelector.LocalAccountId]: async ({ instanceOrigin, localAccountId }, context) => {
					const publicEnv = context.publicEnv
					const { assertInstanceMatches, getAccountByLocalAccountId } = await import('$/sources/Mastodon/Rest/queries.ts')
					assertInstanceMatches(instanceOrigin)
					const a = await getAccountByLocalAccountId(publicEnv, localAccountId)
					return activityPubActorFieldsFromMastodonAccount(
						a,
						instanceOrigin,
						mastodonAvatarUrl
					)
				},
				[ActivityPubActorSelector.Acct]: async ({ instanceOrigin, acct }, context) => {
					const publicEnv = context.publicEnv
					const { assertInstanceMatches, getAccountByAcct } = await import('$/sources/Mastodon/Rest/queries.ts')
					assertInstanceMatches(instanceOrigin)
					const a = await getAccountByAcct(publicEnv, acct)
					return activityPubActorFieldsFromMastodonAccount(
						a,
						instanceOrigin,
						mastodonAvatarUrl
					)
				},
				[ActivityPubActorSelector.ActivityStreamsUri]: async ({ activityStreamsUri }, context) => {
					const publicEnv = context.publicEnv
					const { getAccountByActivityStreamsUri } = await import('$/sources/Mastodon/Rest/queries.ts')
					const a = await getAccountByActivityStreamsUri(publicEnv, activityStreamsUri)
					return activityPubActorFieldsFromMastodonAccount(
						a,
						new URL(activityStreamsUri).origin,
						mastodonAvatarUrl
					)
				},
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
				bot: (actor) => actor.bot,
				locked: (actor) => actor.locked,
				createdAt: (actor) => actor.createdAt,
			},
		}),

		defineResolver(Source.Mastodon_Rest, {
			entityType: EntityType.ActivityPubNote,
			resolve: {
				[ActivityPubNoteSelector.InstanceOriginLocalStatusId]: async ({ instanceOrigin, localStatusId }, context) => {
					const publicEnv = context.publicEnv
					const {
						assertInstanceMatches,
						getStatus,
					} = await import('$/sources/Mastodon/Rest/queries.ts')
					assertInstanceMatches(instanceOrigin)
					const s = await getStatus(publicEnv, localStatusId)
					return activityPubNoteFieldsFromMastodonStatus(s, instanceOrigin)
				},
				[ActivityPubNoteSelector.ActivityStreamsUri]: async ({ activityStreamsUri }, context) => {
					const publicEnv = context.publicEnv
					const {
						getStatusByActivityStreamsUri,
					} = await import('$/sources/Mastodon/Rest/queries.ts')
					const s = await getStatusByActivityStreamsUri(publicEnv, activityStreamsUri)
					return activityPubNoteFieldsFromMastodonStatus(s, new URL(activityStreamsUri).origin)
				},
			},
		})({
			fields: {
				instanceOrigin: (note) => note.instanceOrigin,
				localStatusId: (note) => note.localStatusId,
				content: (note) => note.content,
				createdAt: (note) => note.createdAt,
				editedAt: (note) => note.editedAt,
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

		defineResolver(Source.Mastodon_Rest, {
			entityType: EntityType.ActivityPubActor_Timestamp,
			resolve: {
				[ActivityPubActor_TimestampSelector.ActivityPubActorTimestampMs]: async ({ $actor }, context) => {
					const publicEnv = context.publicEnv
					const { assertInstanceMatches, getAccountByAcct, getAccountByActivityStreamsUri, getAccountByLocalAccountId } = await import('$/sources/Mastodon/Rest/queries.ts')
					if ('instanceOrigin' in $actor)
						assertInstanceMatches($actor.instanceOrigin)
					const account = await (
						'localAccountId' in $actor ?
							getAccountByLocalAccountId(publicEnv, $actor.localAccountId)
						: 'activityStreamsUri' in $actor ?
							getAccountByActivityStreamsUri(publicEnv, $actor.activityStreamsUri)
						:
							getAccountByAcct(publicEnv, $actor.acct)
					)
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

		defineResolver(Source.Mastodon_Rest, {
			entityType: EntityType.ActivityPubNote_Timestamp,
			resolve: {
				[ActivityPubNote_TimestampSelector.ActivityPubNoteTimestampMs]: async ({ $note }, context) => {
					const publicEnv = context.publicEnv
					const { assertInstanceMatches, getStatus, getStatusByActivityStreamsUri } = await import('$/sources/Mastodon/Rest/queries.ts')
					if ('instanceOrigin' in $note)
						assertInstanceMatches($note.instanceOrigin)
					const status = await (
						'localStatusId' in $note ?
							getStatus(publicEnv, $note.localStatusId)
						:
							getStatusByActivityStreamsUri(publicEnv, $note.activityStreamsUri)
					)
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
		defineResolver(Source.Mastodon_Rest, {
			entityType: EntityType.ActivityPubActor,
			resolve: {
				[ActivityPubActorSelector.LocalAccountId]: async ({ instanceOrigin, localAccountId }, context) => {
					const publicEnv = context.publicEnv
					const { assertInstanceMatches, getAccountByLocalAccountId } = await import('$/sources/Mastodon/Rest/queries.ts')
					assertInstanceMatches(instanceOrigin)
					const account = await getAccountByLocalAccountId(publicEnv, localAccountId)
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
					const { assertInstanceMatches, getAccountByAcct } = await import('$/sources/Mastodon/Rest/queries.ts')
					assertInstanceMatches(instanceOrigin)
					const account = await getAccountByAcct(publicEnv, acct)
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
				[ActivityPubActorSelector.ActivityStreamsUri]: async ({ activityStreamsUri }, context) => {
					const publicEnv = context.publicEnv
					const { getAccountByActivityStreamsUri } = await import('$/sources/Mastodon/Rest/queries.ts')
					const account = await getAccountByActivityStreamsUri(publicEnv, activityStreamsUri)
					return [
						{
							[EntityMetaKey.Selector]: {
								$actor: {
									activityStreamsUri,
								},
								timestampMs: Date.now(),
							},
							...(account.followers_count != null && { followersCount: account.followers_count }),
							...(account.following_count != null && { followingCount: account.following_count }),
							...(account.statuses_count != null && { statusesCount: account.statuses_count }),
						},
					]
				},
			},
		})({
			fields: {
				$$timestamps: (actor) => actor,
			},
		}),

		defineResolver(Source.Mastodon_Rest, {
			entityType: EntityType.ActivityPubActor,
			resolve: {
				[ActivityPubActorSelector.LocalAccountId]: async ({ instanceOrigin, localAccountId }, context) => {
					const publicEnv = context.publicEnv
					const { assertInstanceMatches, listAccountStatusesByLocalAccountId } = await import('$/sources/Mastodon/Rest/queries.ts')
					assertInstanceMatches(instanceOrigin)
					const limit = resolverContextRowLimit(context)
					return (
						(await listAccountStatusesByLocalAccountId(publicEnv, localAccountId, limit))
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
				},
				[ActivityPubActorSelector.ActivityStreamsUri]: async ({ activityStreamsUri }, context) => {
					const publicEnv = context.publicEnv
					const { getAccountByActivityStreamsUri, listAccountStatusesByLocalAccountId } = await import('$/sources/Mastodon/Rest/queries.ts')
					const account = await getAccountByActivityStreamsUri(publicEnv, activityStreamsUri)
					const limit = resolverContextRowLimit(context)
					return (
						(await listAccountStatusesByLocalAccountId(publicEnv, String(account.id), limit))
							.flatMap((s) => (
							s.id == null ?
								[]
							:
								[
									{
										[EntityMetaKey.Selector]: {
											instanceOrigin: new URL(activityStreamsUri).origin,
											localStatusId: String(s.id),
										},
									},
								]
							))
					)
				},
			},
		})({
			fields: {
				$$notes: (actor) => actor,
			},
		}),

		defineResolver(Source.Mastodon_Rest, {
			entityType: EntityType.ActivityPubNote,
			resolve: {
				[ActivityPubNoteSelector.InstanceOriginLocalStatusId]: async (entitySelector, context) => {
					const publicEnv = context.publicEnv
					const {
						assertInstanceMatches,
						getStatus,
					} = await import('$/sources/Mastodon/Rest/queries.ts')
					assertInstanceMatches(entitySelector.instanceOrigin)
					const status = await getStatus(publicEnv, entitySelector.localStatusId)
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
				},
				[ActivityPubNoteSelector.ActivityStreamsUri]: async ({ activityStreamsUri }, context) => {
					const publicEnv = context.publicEnv
					const {
						getStatusByActivityStreamsUri,
					} = await import('$/sources/Mastodon/Rest/queries.ts')
					const status = await getStatusByActivityStreamsUri(publicEnv, activityStreamsUri)
					return [
						{
							[EntityMetaKey.Selector]: {
								$note: {
									activityStreamsUri,
								},
								timestampMs: Date.now(),
							},
							...(status.favourites_count != null && { favouriteCount: status.favourites_count }),
							...(status.reblogs_count != null && { reblogCount: status.reblogs_count }),
							...(status.replies_count != null && { replyCount: status.replies_count }),
						},
					]
				},
			},
		})({
			fields: {
				$$timestamps: (note) => note,
			},
		}),

		defineResolver(Source.Mastodon_Rest, {
			entityType: EntityType.ActivityPubNote,
			resolve: {
				[ActivityPubNoteSelector.InstanceOriginLocalStatusId]: async ({ instanceOrigin, localStatusId }, context) => {
					const publicEnv = context.publicEnv
					const {
						assertInstanceMatches,
						getStatusContext,
					} = await import('$/sources/Mastodon/Rest/queries.ts')
					assertInstanceMatches(instanceOrigin)
					const { ancestors = [], descendants = [] } = await getStatusContext(publicEnv, localStatusId)
					return (
						[
							...ancestors,
							...descendants,
						]
							.flatMap((s) => (
							s.id == null || String(s.id) === localStatusId ?
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
				},
				[ActivityPubNoteSelector.ActivityStreamsUri]: async ({ activityStreamsUri }, context) => {
					const publicEnv = context.publicEnv
					const {
						getStatusByActivityStreamsUri,
						getStatusContext,
					} = await import('$/sources/Mastodon/Rest/queries.ts')
					const status = await getStatusByActivityStreamsUri(publicEnv, activityStreamsUri)
					if (status.id == null)
						return []
					const { ancestors = [], descendants = [] } = await getStatusContext(publicEnv, String(status.id))
					return (
						[
							...ancestors,
							...descendants,
						]
							.flatMap((s) => (
							s.id == null || String(s.id) === String(status.id) ?
								[]
							:
								[
									{
										[EntityMetaKey.Selector]: {
											instanceOrigin: new URL(activityStreamsUri).origin,
											localStatusId: String(s.id),
										},
									},
								]
							))
					)
				},
			},
		})({
			fields: {
				$$thread: (note) => note,
			},
		}),
	],
}

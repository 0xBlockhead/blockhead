import { resolverContextRowLimit } from '$/resolvers/$resolvers.ts'
import { mastodonInstances } from '$/constants/Mastodon.ts'
import {
	defineResolver,
} from '$/resolvers/defineResolver.ts'
import { mediaFromUrl } from '$/resolvers/media.ts'
import { optionalNonemptyString } from '$/lib/string.ts'
import { optionalTimestampMs } from '$/lib/time.ts'
import {
	EntityMetaKey,
	entityFieldAddressKey,
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
import { ActivityPubInstanceSelector } from '$/schema/ActivityPubInstance.ts'
import { ActivityPubInstance_TimestampSelector } from '$/schema/ActivityPubInstance_Timestamp.ts'
import { ActivityPubInstanceModeratedDomainSelector } from '$/schema/ActivityPubInstanceModeratedDomain.ts'
import { ActivityPubInstancePeerSelector } from '$/schema/ActivityPubInstancePeer.ts'
import { ActivityPubNetworkSelector } from '$/schema/ActivityPubNetwork.ts'
import { ActivityPubNoteSelector } from '$/schema/ActivityPubNote.ts'
import { ActivityPubActor_TimestampSelector } from '$/schema/ActivityPubActor_Timestamp.ts'
import { ActivityPubNote_TimestampSelector } from '$/schema/ActivityPubNote_Timestamp.ts'
import { _GlobalActivityPubNetworkSelector } from '$/schema/_GlobalActivityPubNetwork.ts'
import { _GlobalActivityPubNetwork_TimestampSelector } from '$/schema/_GlobalActivityPubNetwork_Timestamp.ts'


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
				const activityStreamsUri = optionalNonemptyString(status.account?.uri)
				const localAccountId = mastodonLocalAccountId(status.account)
				return (
					activityStreamsUri != null ?
						{
							[EntityMetaKey.Selector]: {
								activityStreamsUri,
							},
						}
					: localAccountId != null ?
						{
							[EntityMetaKey.Selector]: {
								instanceOrigin,
								localAccountId,
							},
						}
					:
						undefined
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
					...(
						optionalNonemptyString(status.reblog.uri) != null ?
							{
								activityStreamsUri: String(status.reblog.uri),
							}
						:
							{
								instanceOrigin,
								localStatusId: String(status.reblog.id),
							}
					),
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
			entityType: EntityType._GlobalActivityPubNetwork,
			resolve: {
				[_GlobalActivityPubNetworkSelector.Scope]: {
					resolve: async () => (
						mastodonInstances.map((instance) => ({
							[EntityMetaKey.Selector]: {
								instanceOrigin: instance.origin,
							},
						}))
					),
				},
			},
		})({
				$$instances: (instances) => instances,
			}),

		defineResolver(Source.Mastodon_Rest, {
			entityType: EntityType._GlobalActivityPubNetwork,
			resolve: {
				[_GlobalActivityPubNetworkSelector.Scope]: {
					resolve: async ({ scope }, context) => {
						const timestampMs = Date.now()
						const instanceOrigin = mastodonInstances[0].origin
						const { getInstance } = await import('$/sources/Mastodon/Rest/queries.ts')

						try {
							const instance = await getInstance(context.publicEnv, instanceOrigin)
							return [{
								[EntityMetaKey.Selector]: {
									$hub: { scope },
									timestampMs,
									source: Source.Mastodon_Rest,
								},
								[EntityMetaKey.Fields]: {
									[entityFieldAddressKey(EntityType._GlobalActivityPubNetwork_Timestamp, [], 'instanceOrigin')]: instanceOrigin,
									...(instance.title != null && {
										[entityFieldAddressKey(EntityType._GlobalActivityPubNetwork_Timestamp, [], 'instanceTitle')]: instance.title,
									}),
									...(instance.description != null && {
										[entityFieldAddressKey(EntityType._GlobalActivityPubNetwork_Timestamp, [], 'instanceDescription')]: instance.description,
									}),
									...(instance.version != null && {
										[entityFieldAddressKey(EntityType._GlobalActivityPubNetwork_Timestamp, [], 'instanceVersion')]: instance.version,
									}),
									[entityFieldAddressKey(EntityType._GlobalActivityPubNetwork_Timestamp, [], 'seededInstanceCount')]: mastodonInstances.length,
									[entityFieldAddressKey(EntityType._GlobalActivityPubNetwork_Timestamp, [], 'reachable')]: true,
								},
							}]
						} catch {
							return [{
								[EntityMetaKey.Selector]: {
									$hub: { scope },
									timestampMs,
									source: Source.Mastodon_Rest,
								},
								[EntityMetaKey.Fields]: {
									[entityFieldAddressKey(EntityType._GlobalActivityPubNetwork_Timestamp, [], 'instanceOrigin')]: instanceOrigin,
									[entityFieldAddressKey(EntityType._GlobalActivityPubNetwork_Timestamp, [], 'seededInstanceCount')]: mastodonInstances.length,
									[entityFieldAddressKey(EntityType._GlobalActivityPubNetwork_Timestamp, [], 'reachable')]: false,
								},
							}]
						}
					},
				},
			},
		})({
			$$timestamps: (observations) => observations,
		}),

		defineResolver(Source.Mastodon_Rest, {
			entityType: EntityType._GlobalActivityPubNetwork_Timestamp,
			resolve: {
				[_GlobalActivityPubNetwork_TimestampSelector.HubTimestampMsSource]: {
					resolve: async ({ $hub, timestampMs, source }) => {
						if (source !== Source.Mastodon_Rest)
							throw new Error('Mastodon_Rest: global ActivityPub observation source mismatch')

						return {
							$hub: {
								[EntityMetaKey.Selector]: $hub,
							},
							timestampMs,
							source,
						}
					},
				},
			},
		})({
			$hub: (observation) => observation.$hub,
			timestampMs: (observation) => observation.timestampMs,
			source: (observation) => observation.source,
		}),

		defineResolver(Source.Mastodon_Rest, {
			entityType: EntityType.ActivityPubInstance,
			resolve: {
				[ActivityPubInstanceSelector.InstanceOrigin]: {
					resolve: (selector) => selector,
				},
			},
		})({
				instanceOrigin: (instance) => instance.instanceOrigin,
			}),

		defineResolver(Source.Mastodon_Rest, {
			entityType: EntityType.ActivityPubInstance,
			resolve: {
				[ActivityPubInstanceSelector.InstanceOrigin]: {
					resolve: async ({ instanceOrigin }, context) => {
						const publicEnv = context.publicEnv
						const {
							assertInstanceMatches,
							getInstance,
							listInstanceModeratedDomains,
							listInstancePeerDomains,
						} = await import('$/sources/Mastodon/Rest/queries.ts')
						assertInstanceMatches(instanceOrigin)
						const timestampMs = Date.now()
						const $instance = { instanceOrigin }
						const $observation = {
							$instance,
							timestampMs,
							source: Source.Mastodon_Rest,
						}
						const [instance, peerDomains, moderatedDomains] = await Promise.all([
							getInstance(publicEnv, instanceOrigin),
							listInstancePeerDomains(publicEnv, instanceOrigin).catch(() => Array()),
							listInstanceModeratedDomains(publicEnv, instanceOrigin).catch(() => Array()),
						])
						return [{
							[EntityMetaKey.Selector]: $observation,
							[EntityMetaKey.Fields]: {
								...(instance.title != null && {
									[entityFieldAddressKey(EntityType.ActivityPubInstance_Timestamp, [], 'title')]: instance.title,
								}),
								...(instance.description != null && {
									[entityFieldAddressKey(EntityType.ActivityPubInstance_Timestamp, [], 'description')]: instance.description,
								}),
								...(instance.version != null && {
									[entityFieldAddressKey(EntityType.ActivityPubInstance_Timestamp, [], 'version')]: instance.version,
								}),
								[entityFieldAddressKey(EntityType.ActivityPubInstance_Timestamp, [], '$$peers')]: peerDomains.map((peerDomain) => ({
									[EntityMetaKey.Selector]: {
										$observation,
										peerDomain,
									},
								})),
								[entityFieldAddressKey(EntityType.ActivityPubInstance_Timestamp, [], '$$moderatedDomains')]: moderatedDomains.flatMap((domainBlock) => (
									domainBlock.domain == null ?
										[]
									:
										[{
											[EntityMetaKey.Selector]: {
												$observation,
												domain: domainBlock.domain,
											},
											[EntityMetaKey.Fields]: {
												...(domainBlock.severity != null && {
													[entityFieldAddressKey(EntityType.ActivityPubInstanceModeratedDomain, [], 'severity')]: domainBlock.severity,
												}),
												...(domainBlock.comment != null && {
													[entityFieldAddressKey(EntityType.ActivityPubInstanceModeratedDomain, [], 'comment')]: domainBlock.comment,
												}),
											},
										}]
								)),
							},
						}]
					},
				},
			},
		})({
				$$timestamps: (observations) => observations,
			}),

		defineResolver(Source.Mastodon_Rest, {
			entityType: EntityType.ActivityPubInstance_Timestamp,
			resolve: {
				[ActivityPubInstance_TimestampSelector.InstanceTimestampMsSource]: {
					resolve: (selector) => {
						const { source } = selector
						if (source !== Source.Mastodon_Rest)
							throw new Error('Mastodon_Rest: ActivityPub instance source mismatch')
						return selector
					},
				},
			},
		})({
				$instance: (observation) => observation.$instance,
				timestampMs: (observation) => observation.timestampMs,
				source: (observation) => observation.source,
			}),

		defineResolver(Source.Mastodon_Rest, {
			entityType: EntityType.ActivityPubInstancePeer,
			resolve: {
				[ActivityPubInstancePeerSelector.ObservationPeerDomain]: {
					resolve: (selector) => selector,
				},
			},
		})({
				$observation: (peer) => peer.$observation,
				peerDomain: (peer) => peer.peerDomain,
			}),

		defineResolver(Source.Mastodon_Rest, {
			entityType: EntityType.ActivityPubInstanceModeratedDomain,
			resolve: {
				[ActivityPubInstanceModeratedDomainSelector.ObservationDomain]: {
					resolve: (selector) => {
						if (selector.$observation.source !== Source.Mastodon_Rest)
							throw new Error('Mastodon_Rest: ActivityPub moderated domain source mismatch')
						return selector
					},
				},
			},
		})({
				$observation: (domain) => domain.$observation,
				domain: (domain) => domain.domain,
			}),

		defineResolver(Source.Mastodon_Rest, {
			entityType: EntityType.ActivityPubNetwork,
			resolve: {
				[ActivityPubNetworkSelector.Scope]: {
					resolve: async (_selector, context) => {
						const publicEnv = context.publicEnv
						const { listPublicTimeline } = await import('$/sources/Mastodon/Rest/queries.ts')
						const limit = resolverContextRowLimit(context)
						return (
							await Promise.all(
								mastodonInstances.map(async (instance) => (
									(await listPublicTimeline(publicEnv, instance.origin, limit))
										.flatMap((status) => (
										status.id == null ?
											[]
										:
											[{
												[EntityMetaKey.Selector]: {
													instanceOrigin: instance.origin,
													localStatusId: String(status.id),
												},
											}]
										))
								))
							)
						).flat()
					},
				},
			},
		})({
				$$activityPubNotes: (notes) => notes,
			}),

		defineResolver(Source.Mastodon_Rest, {
			entityType: EntityType.ActivityPubActor,
			resolve: {
				[ActivityPubActorSelector.LocalAccountId]: {
					resolve: async ({ instanceOrigin, localAccountId }, context) => {
						const publicEnv = context.publicEnv
						const { assertInstanceMatches, getAccountByLocalAccountId } = await import('$/sources/Mastodon/Rest/queries.ts')
						assertInstanceMatches(instanceOrigin)
						const a = await getAccountByLocalAccountId(publicEnv, instanceOrigin, localAccountId)
						return activityPubActorFieldsFromMastodonAccount(
							a,
							instanceOrigin,
							mastodonAvatarUrl
						)
					},
				},
				[ActivityPubActorSelector.Acct]: {
					resolve: async ({ instanceOrigin, acct }, context) => {
						const publicEnv = context.publicEnv
						const { assertInstanceMatches, getAccountByAcct } = await import('$/sources/Mastodon/Rest/queries.ts')
						assertInstanceMatches(instanceOrigin)
						const a = await getAccountByAcct(publicEnv, instanceOrigin, acct)
						return activityPubActorFieldsFromMastodonAccount(
							a,
							instanceOrigin,
							mastodonAvatarUrl
						)
					},
				},
				[ActivityPubActorSelector.ActivityStreamsUri]: {
					resolve: async ({ activityStreamsUri }, context) => {
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
			},
		})({
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
			}),

		defineResolver(Source.Mastodon_Rest, {
			entityType: EntityType.ActivityPubNote,
			resolve: {
				[ActivityPubNoteSelector.InstanceOriginLocalStatusId]: {
					resolve: async ({ instanceOrigin, localStatusId }, context) => {
						const publicEnv = context.publicEnv
						const {
							assertInstanceMatches,
							getStatus,
						} = await import('$/sources/Mastodon/Rest/queries.ts')
						assertInstanceMatches(instanceOrigin)
						const s = await getStatus(publicEnv, instanceOrigin, localStatusId)
						return activityPubNoteFieldsFromMastodonStatus(s, instanceOrigin)
					},
				},
				[ActivityPubNoteSelector.ActivityStreamsUri]: {
					resolve: async ({ activityStreamsUri }, context) => {
						const publicEnv = context.publicEnv
						const {
							getStatusByActivityStreamsUri,
						} = await import('$/sources/Mastodon/Rest/queries.ts')
						const s = await getStatusByActivityStreamsUri(publicEnv, activityStreamsUri)
						return activityPubNoteFieldsFromMastodonStatus(s, new URL(activityStreamsUri).origin)
					},
				},
			},
		})({
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
			}),

		defineResolver(Source.Mastodon_Rest, {
			entityType: EntityType.ActivityPubActor_Timestamp,
			resolve: {
				[ActivityPubActor_TimestampSelector.ActivityPubActorTimestampMsSource]: {
					resolve: (selector) => {
						if (selector.source !== Source.Mastodon_Rest)
							throw new Error('Mastodon_Rest: ActivityPub actor observation source mismatch')
						return selector
					},
				}
			},
		})({
				$actor: (timestamp) => timestamp.$actor,
				timestampMs: (timestamp) => timestamp.timestampMs,
				source: (timestamp) => timestamp.source,
			}),

		defineResolver(Source.Mastodon_Rest, {
			entityType: EntityType.ActivityPubNote_Timestamp,
			resolve: {
				[ActivityPubNote_TimestampSelector.ActivityPubNoteTimestampMsSource]: {
					resolve: (selector) => {
						if (selector.source !== Source.Mastodon_Rest)
							throw new Error('Mastodon_Rest: ActivityPub note observation source mismatch')
						return selector
					},
				}
			},
		})({
				$note: (timestamp) => timestamp.$note,
				timestampMs: (timestamp) => timestamp.timestampMs,
				source: (timestamp) => timestamp.source,
			}),
		defineResolver(Source.Mastodon_Rest, {
			entityType: EntityType.ActivityPubActor,
			resolve: {
				[ActivityPubActorSelector.LocalAccountId]: {
					resolve: async ({ instanceOrigin, localAccountId }, context) => {
						const publicEnv = context.publicEnv
						const { assertInstanceMatches, getAccountByLocalAccountId } = await import('$/sources/Mastodon/Rest/queries.ts')
						assertInstanceMatches(instanceOrigin)
						const account = await getAccountByLocalAccountId(publicEnv, instanceOrigin, localAccountId)
						return [
							{
								[EntityMetaKey.Selector]: {
									$actor: {
										instanceOrigin,
										localAccountId: String(account.id),
									},
									timestampMs: Date.now(),
									source: Source.Mastodon_Rest,
								},
								[EntityMetaKey.Fields]: {
									...(account.followers_count != null && {
										[entityFieldAddressKey(EntityType.ActivityPubActor_Timestamp, [], 'followersCount')]: account.followers_count,
									}),
									...(account.following_count != null && {
										[entityFieldAddressKey(EntityType.ActivityPubActor_Timestamp, [], 'followingCount')]: account.following_count,
									}),
									...(account.statuses_count != null && {
										[entityFieldAddressKey(EntityType.ActivityPubActor_Timestamp, [], 'statusesCount')]: account.statuses_count,
									}),
								},
							},
						]
					},
				},
				[ActivityPubActorSelector.Acct]: {
					resolve: async ({ instanceOrigin, acct }, context) => {
						const publicEnv = context.publicEnv
						const { assertInstanceMatches, getAccountByAcct } = await import('$/sources/Mastodon/Rest/queries.ts')
						assertInstanceMatches(instanceOrigin)
						const account = await getAccountByAcct(publicEnv, instanceOrigin, acct)
						return [
							{
								[EntityMetaKey.Selector]: {
									$actor: {
										instanceOrigin,
										localAccountId: String(account.id),
									},
									timestampMs: Date.now(),
									source: Source.Mastodon_Rest,
								},
								[EntityMetaKey.Fields]: {
									...(account.followers_count != null && {
										[entityFieldAddressKey(EntityType.ActivityPubActor_Timestamp, [], 'followersCount')]: account.followers_count,
									}),
									...(account.following_count != null && {
										[entityFieldAddressKey(EntityType.ActivityPubActor_Timestamp, [], 'followingCount')]: account.following_count,
									}),
									...(account.statuses_count != null && {
										[entityFieldAddressKey(EntityType.ActivityPubActor_Timestamp, [], 'statusesCount')]: account.statuses_count,
									}),
								},
							},
						]
					},
				},
				[ActivityPubActorSelector.ActivityStreamsUri]: {
					resolve: async ({ activityStreamsUri }, context) => {
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
									source: Source.Mastodon_Rest,
								},
								[EntityMetaKey.Fields]: {
									...(account.followers_count != null && {
										[entityFieldAddressKey(EntityType.ActivityPubActor_Timestamp, [], 'followersCount')]: account.followers_count,
									}),
									...(account.following_count != null && {
										[entityFieldAddressKey(EntityType.ActivityPubActor_Timestamp, [], 'followingCount')]: account.following_count,
									}),
									...(account.statuses_count != null && {
										[entityFieldAddressKey(EntityType.ActivityPubActor_Timestamp, [], 'statusesCount')]: account.statuses_count,
									}),
								},
							},
						]
					},
				},
			},
		})({
				$$timestamps: (actor) => actor,
			}),

		defineResolver(Source.Mastodon_Rest, {
			entityType: EntityType.ActivityPubActor,
			resolve: {
				[ActivityPubActorSelector.LocalAccountId]: {
					resolve: async ({ instanceOrigin, localAccountId }, context) => {
						const publicEnv = context.publicEnv
						const { assertInstanceMatches, listAccountStatusesByLocalAccountId } = await import('$/sources/Mastodon/Rest/queries.ts')
						assertInstanceMatches(instanceOrigin)
						const limit = resolverContextRowLimit(context)
						return (
							(await listAccountStatusesByLocalAccountId(publicEnv, instanceOrigin, localAccountId, limit))
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
				},
				[ActivityPubActorSelector.ActivityStreamsUri]: {
					resolve: async ({ activityStreamsUri }, context) => {
						const publicEnv = context.publicEnv
						const { getAccountByActivityStreamsUri, listAccountStatusesByLocalAccountId } = await import('$/sources/Mastodon/Rest/queries.ts')
						const account = await getAccountByActivityStreamsUri(publicEnv, activityStreamsUri)
						const limit = resolverContextRowLimit(context)
						return (
							(await listAccountStatusesByLocalAccountId(publicEnv, new URL(activityStreamsUri).origin, String(account.id), limit))
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
			},
		})({
				$$notes: (actor) => actor,
			}),

		defineResolver(Source.Mastodon_Rest, {
			entityType: EntityType.ActivityPubNote,
			resolve: {
				[ActivityPubNoteSelector.InstanceOriginLocalStatusId]: {
					resolve: async (entitySelector, context) => {
						const publicEnv = context.publicEnv
						const {
							assertInstanceMatches,
							getStatus,
						} = await import('$/sources/Mastodon/Rest/queries.ts')
						assertInstanceMatches(entitySelector.instanceOrigin)
						const status = await getStatus(publicEnv, entitySelector.instanceOrigin, entitySelector.localStatusId)
						return [
							{
								[EntityMetaKey.Selector]: {
									$note: entitySelector,
									timestampMs: Date.now(),
									source: Source.Mastodon_Rest,
								},
								[EntityMetaKey.Fields]: {
									...(status.favourites_count != null && {
										[entityFieldAddressKey(EntityType.ActivityPubNote_Timestamp, [], 'favouriteCount')]: status.favourites_count,
									}),
									...(status.reblogs_count != null && {
										[entityFieldAddressKey(EntityType.ActivityPubNote_Timestamp, [], 'reblogCount')]: status.reblogs_count,
									}),
									...(status.replies_count != null && {
										[entityFieldAddressKey(EntityType.ActivityPubNote_Timestamp, [], 'replyCount')]: status.replies_count,
									}),
								},
							},
						]
					},
				},
				[ActivityPubNoteSelector.ActivityStreamsUri]: {
					resolve: async ({ activityStreamsUri }, context) => {
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
									source: Source.Mastodon_Rest,
								},
								[EntityMetaKey.Fields]: {
									...(status.favourites_count != null && {
										[entityFieldAddressKey(EntityType.ActivityPubNote_Timestamp, [], 'favouriteCount')]: status.favourites_count,
									}),
									...(status.reblogs_count != null && {
										[entityFieldAddressKey(EntityType.ActivityPubNote_Timestamp, [], 'reblogCount')]: status.reblogs_count,
									}),
									...(status.replies_count != null && {
										[entityFieldAddressKey(EntityType.ActivityPubNote_Timestamp, [], 'replyCount')]: status.replies_count,
									}),
								},
							},
						]
					},
				},
			},
		})({
				$$timestamps: (note) => note,
			}),

		defineResolver(Source.Mastodon_Rest, {
			entityType: EntityType.ActivityPubNote,
			resolve: {
				[ActivityPubNoteSelector.InstanceOriginLocalStatusId]: {
					resolve: async ({ instanceOrigin, localStatusId }, context) => {
						const publicEnv = context.publicEnv
						const {
							assertInstanceMatches,
							getStatusContext,
						} = await import('$/sources/Mastodon/Rest/queries.ts')
						assertInstanceMatches(instanceOrigin)
						const { ancestors = [], descendants = [] } = await getStatusContext(publicEnv, instanceOrigin, localStatusId)
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
				},
				[ActivityPubNoteSelector.ActivityStreamsUri]: {
					resolve: async ({ activityStreamsUri }, context) => {
						const publicEnv = context.publicEnv
						const {
							getStatusByActivityStreamsUri,
							getStatusContext,
						} = await import('$/sources/Mastodon/Rest/queries.ts')
						const status = await getStatusByActivityStreamsUri(publicEnv, activityStreamsUri)
						if (status.id == null)
							return []
						const { ancestors = [], descendants = [] } = await getStatusContext(publicEnv, new URL(activityStreamsUri).origin, String(status.id))
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
			},
		})({
				$$thread: (note) => note,
			}),
	],
}

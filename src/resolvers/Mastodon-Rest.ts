import { resolverContextRowLimit } from '$/resolvers/$resolvers.ts'
import {
	defineResolver,
	type RegisteredSourceResolverModule,
} from '$/resolvers/defineResolver.ts'
import { mediaFromUrl } from '$/resolvers/media.ts'
import { optionalNonemptyString } from '$/lib/string.ts'
import { optionalTimestampMs } from '$/lib/time.ts'
import {
	EntityMetaKey,
	entityFieldAddressKey,
} from '$/schema/$schema.ts'
import { EntityType } from '$/schema/EntityType.ts'
import { MediaType } from '$/schema/MediaType.ts'
import { Source } from '$/sources/Source.ts'
import {
	mastodonInstanceBindingByOrigin,
	mastodonInstances,
	mastodonPublicTimelines,
} from '$/sources/Mastodon/Rest/queries.ts'
import type {
	MastodonApiV1Account,
	MastodonApiV1MediaAttachment,
	MastodonApiV1Status,
} from '$/sources/Mastodon/Rest/types.ts'

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
	const remoteUrl = optionalNonemptyString(attachment.remote_url ?? undefined)
	const previewUrl = optionalNonemptyString(attachment.preview_url)
	return (
		wireType === 'video' || wireType === 'gifv' || wireType === 'audio' ?
			url ?? remoteUrl
		:
			wireType === 'image' ?
				url ?? remoteUrl ?? previewUrl
			:
				url ?? remoteUrl ?? previewUrl
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
	const createdAt = status.created_at == null ? undefined : Date.parse(status.created_at)
	if (createdAt != null && !Number.isFinite(createdAt))
		throw new Error('Mastodon_Rest: ActivityPub note has an invalid creation timestamp')
	const editedAt = status.edited_at == null ? undefined : Date.parse(status.edited_at)
	if (editedAt != null && !Number.isFinite(editedAt))
		throw new Error('Mastodon_Rest: ActivityPub note has an invalid edit timestamp')
	const content = optionalNonemptyString(status.content)
	const language = optionalNonemptyString(status.language ?? undefined)
	const spoilerText = status.spoiler_text
	const statusUrl = optionalNonemptyString(status.url)
	const activityStreamsUri = optionalNonemptyString(status.uri)
	if (activityStreamsUri == null)
		throw new Error('Mastodon_Rest: ActivityPub note missing ActivityStreams URI')
	const visibility = (
		status.visibility === 'public' ?
			'public'
		:
			status.visibility === 'unlisted' ?
				'unlisted'
			:
				status.visibility === 'private' ?
					'private'
				:
					status.visibility === 'direct' ?
					'direct'
				:
					undefined
	)
	return {
		instanceOrigin,
		localStatusId: String(status.id),
		...(content != null && { content }),
		...(createdAt != null && { createdAt }),
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
							...(status.account != null && localAccountId != null && optionalNonemptyString(status.account.acct) != null && {
								[EntityMetaKey.Fields]: Object.fromEntries(
									Object.entries(activityPubActorFieldsFromMastodonAccount(
										status.account,
										instanceOrigin,
										mastodonAvatarUrl
									)).map(([fieldName, value]) => [
										entityFieldAddressKey(EntityType.ActivityPubActor, [], fieldName),
										value,
									])
								),
							}),
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
				...(optionalNonemptyString(status.reblog.uri) != null && {
					[EntityMetaKey.Fields]: Object.fromEntries(
						Object.entries(activityPubNoteFieldsFromMastodonStatus(
							status.reblog,
							new URL(String(status.reblog.uri)).origin
						)).map(([fieldName, value]) => [
							entityFieldAddressKey(EntityType.ActivityPubNote, [], fieldName),
							value,
						])
					),
				}),
			},
		}),
	}
}

const activityPubNoteCardReferenceFromMastodonStatus = (
	status: MastodonApiV1Status,
	instanceOrigin: string,
	resolvedAtMs: number
) => {
	if (status.id == null)
		return undefined

	return {
		[EntityMetaKey.Selector]: {
			instanceOrigin,
			localStatusId: String(status.id),
		},
		[EntityMetaKey.Fields]: (
			optionalNonemptyString(status.uri) == null ?
				{}
			:
				{
					...Object.fromEntries(Object.entries(
						activityPubNoteFieldsFromMastodonStatus(status, instanceOrigin)
					).map(([fieldName, value]) => [
						entityFieldAddressKey(EntityType.ActivityPubNote, [], fieldName),
						value,
					])),
					[entityFieldAddressKey(EntityType.ActivityPubNote, [], '$$timestamps')]: [
						activityPubNoteTimestampReferenceFromMastodonStatus(
							status,
							resolvedAtMs
						),
					],
				}
		),
	}
}

const activityPubNoteSnapshotFromMastodonStatus = async (
	binding: NonNullable<ReturnType<typeof mastodonInstanceBindingByOrigin.get>>,
	instanceOrigin: string,
	status: MastodonApiV1Status
) => {
	const {
		getStatus,
	} = await import('$/sources/Mastodon/Rest/queries.ts')
	const parentStatus = (
		status.in_reply_to_id == null || status.in_reply_to_id === '' ?
			undefined
		:
			await getStatus(binding, instanceOrigin, String(status.in_reply_to_id)).catch(() => undefined)
	)
	const resolvedAtMs = Date.now()
	const note = {
		...activityPubNoteFieldsFromMastodonStatus(status, instanceOrigin),
		$$timestamps: [
			activityPubNoteTimestampReferenceFromMastodonStatus(
				status,
				resolvedAtMs
			),
		],
	}
	const parentReference = (
		parentStatus == null ?
			undefined
		:
			activityPubNoteCardReferenceFromMastodonStatus(
			parentStatus,
			instanceOrigin,
			resolvedAtMs
		)
	)
	return parentReference == null ?
		note
	:
		{
			...note,
			$inReplyTo: parentReference,
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
	if (account.id == null)
		throw new Error('Mastodon_Rest: ActivityPub actor account missing local account id')

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

const activityPubActorTimestampReferenceFromMastodonAccount = (
	account: MastodonApiV1Account,
	timestampMs: number
) => {
	const activityStreamsUri = optionalNonemptyString(account.uri)
	if (activityStreamsUri == null)
		throw new Error('Mastodon_Rest: ActivityPub actor account missing ActivityStreams URI')

	return {
		[EntityMetaKey.Selector]: {
			$actor: {
				activityStreamsUri,
			},
			timestampMs,
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
	}
}

const activityPubActorCardReferenceFromMastodonStatus = (
	status: MastodonApiV1Status,
	servingInstanceOrigin: string,
	resolvedAtMs: number
) => {
	if (status.account?.id == null)
		throw new Error('Mastodon_Rest: public timeline status missing author')

	const activityStreamsUri = optionalNonemptyString(status.account.uri)
	const acct = optionalNonemptyString(status.account.acct)
	if (activityStreamsUri == null || acct == null)
		throw new Error('Mastodon_Rest: public timeline author missing canonical identity')

	const actorUrl = new URL(activityStreamsUri)
	const statusUri = optionalNonemptyString(status.uri)
	const remoteAcctSeparator = acct.lastIndexOf('@')
	if (
		actorUrl.protocol !== 'https:'
		|| actorUrl.username !== ''
		|| actorUrl.password !== ''
		|| actorUrl.hash !== ''
		|| (
			remoteAcctSeparator < 0 ?
				actorUrl.origin !== servingInstanceOrigin
			:
				remoteAcctSeparator === 0
				|| remoteAcctSeparator === acct.length - 1
				|| acct.slice(remoteAcctSeparator + 1).toLowerCase() !== actorUrl.hostname.toLowerCase()
		)
		|| (
			statusUri != null
			&& new URL(statusUri).origin !== actorUrl.origin
		)
	)
		throw new Error('Mastodon_Rest: public timeline status has foreign author identity')

	return {
		[EntityMetaKey.Selector]: {
			instanceOrigin: servingInstanceOrigin,
			localAccountId: String(status.account.id),
		},
		[EntityMetaKey.Fields]: {
			...Object.fromEntries(Object.entries(
				activityPubActorFieldsFromMastodonAccount(
					status.account,
					servingInstanceOrigin,
					mastodonAvatarUrl
				)
			).map(([fieldName, value]) => [
					entityFieldAddressKey(EntityType.ActivityPubActor, [], fieldName),
					value,
				])),
			[entityFieldAddressKey(EntityType.ActivityPubActor, [], '$$timestamps')]: [
				activityPubActorTimestampReferenceFromMastodonAccount(
					status.account,
					resolvedAtMs
				),
			],
		},
	}
}

const activityPubNoteTimestampReferenceFromMastodonStatus = (
	status: MastodonApiV1Status,
	timestampMs: number
) => {
	const activityStreamsUri = optionalNonemptyString(status.uri)
	if (activityStreamsUri == null)
		throw new Error('Mastodon_Rest: ActivityPub note missing ActivityStreams URI')

	return {
		[EntityMetaKey.Selector]: {
			$note: {
				activityStreamsUri,
			},
			timestampMs,
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
	}
}

const activityPubThreadNoteReferenceFromMastodonStatus = (
	status: MastodonApiV1Status,
	instanceOrigin: string,
	focalLocalStatusId: string,
	resolvedAtMs: number
) => {
	if (status.id == null)
		throw new Error('Mastodon_Rest: ActivityPub thread relative missing local status id')
	if (String(status.id) === focalLocalStatusId)
		throw new Error('Mastodon_Rest: ActivityPub thread relative repeats the focal note')
	if (optionalNonemptyString(status.uri) == null)
		throw new Error('Mastodon_Rest: ActivityPub thread relative missing ActivityStreams URI')
	const reference = activityPubNoteCardReferenceFromMastodonStatus(
		status,
		instanceOrigin,
		resolvedAtMs
	)
	if (reference == null)
		throw new Error('Mastodon_Rest: ActivityPub thread relative missing canonical identity')
	return reference
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
		defineResolver({
			entityType: EntityType._GlobalActivityPubNetwork,
			resolve: {
				Scope: {
					resolve: async (_selector, context) => {
						const { listPublicTimelinePage } = await import('$/sources/Mastodon/Rest/queries.ts')
						const limit = resolverContextRowLimit(context)
						if (limit === 0)
							return {
								actors: [],
								notes: [],
							}

						const timelineStatuses = (
							await Promise.all(
								mastodonPublicTimelines.map(async ({ binding, instanceOrigin }) => (
									(await listPublicTimelinePage(binding, instanceOrigin, limit)).statuses
										.map((status) => ({
											instanceOrigin,
											status,
										}))
								))
							)
						).flat()
						const resolvedAtMs = Date.now()
						const timelineEntries = timelineStatuses.flatMap(({ instanceOrigin, status }) => {
							try {
								return [{
									actor: activityPubActorCardReferenceFromMastodonStatus(
										status,
										instanceOrigin,
										resolvedAtMs
									),
									actorActivityStreamsUri: String(status.account?.uri),
									noteActivityStreamsUri: optionalNonemptyString(status.uri),
									note: activityPubNoteCardReferenceFromMastodonStatus(
										status,
										instanceOrigin,
										resolvedAtMs
									),
								}]
							} catch {
								return []
							}
						})
						const actorByActivityStreamsUri = timelineEntries.reduce((actors, {
							actor,
							actorActivityStreamsUri,
						}) => {
							if (!actors.has(actorActivityStreamsUri))
								actors.set(actorActivityStreamsUri, actor)

							return actors
						}, new Map<string, ReturnType<typeof activityPubActorCardReferenceFromMastodonStatus>>())
						return {
							actors: [...actorByActivityStreamsUri.values()].slice(0, limit),
							notes: [...new Map(timelineEntries.flatMap(({
								note,
								noteActivityStreamsUri,
							}) => (
								note == null || noteActivityStreamsUri == null ?
									[]
								:
									[[
										noteActivityStreamsUri,
										note,
									] as const]
							)).toReversed()).values()].toReversed().slice(0, limit),
						}
					},
				},
			},
		})({
			$$observedActors: (timeline) => timeline.actors,
			$$observedNotes: (timeline) => timeline.notes,
		}),

		defineResolver({
			entityType: EntityType._GlobalActivityPubNetwork,
			resolve: {
				Scope: {
					resolve: () => (
						mastodonInstances.map(({ instanceOrigin }) => ({
							[EntityMetaKey.Selector]: {
								instanceOrigin,
							},
						}))
					),
				},
			},
		})({
				$$instances: (instances) => instances,
			}),

		defineResolver({
			entityType: EntityType._GlobalActivityPubNetwork,
			resolve: {
				Scope: {
					resolve: async ({ scope }) => {
						const [{ binding, instanceOrigin }] = mastodonInstances
						const {
							getInstance,
							getInstanceV2,
							listInstanceModeratedDomains,
							listInstancePeerDomains,
							listPublicTimelinePage,
						} = await import('$/sources/Mastodon/Rest/queries.ts')

						try {
							const instance = await getInstance(binding, instanceOrigin)
							const [
								instanceV2Result,
								peerDomainsResult,
								moderatedDomainsResult,
								timelineResult,
							] = await Promise.allSettled([
								getInstanceV2(binding, instanceOrigin),
								listInstancePeerDomains(binding, instanceOrigin),
								listInstanceModeratedDomains(binding, instanceOrigin),
								Promise.all(
									mastodonPublicTimelines.map(async ({ binding, instanceOrigin }) => (
										(await listPublicTimelinePage(binding, instanceOrigin, 40)).statuses
									))
								),
							])
							const activeUserCount = (
								instanceV2Result.status === 'fulfilled' ?
									instanceV2Result.value.usage?.users?.active_month
								:
									undefined
							)
							const peerDomains = (
								peerDomainsResult.status === 'fulfilled' ?
									peerDomainsResult.value
								:
									undefined
							)
							const moderatedDomains = (
								moderatedDomainsResult.status === 'fulfilled' ?
									moderatedDomainsResult.value
								:
									undefined
							)
							const timelineStatuses = (
								timelineResult.status === 'fulfilled' ?
									timelineResult.value.flat()
								:
									undefined
							)
							const observedActorCount = (
								timelineStatuses == null ?
									undefined
								:
									new Set(
										timelineStatuses.flatMap((status) => {
											const activityStreamsUri = optionalNonemptyString(status.account?.uri)
											return activityStreamsUri == null ? [] : [activityStreamsUri]
										})
									).size
							)
							const observedNoteCount = (
								timelineStatuses == null ?
									undefined
								:
									new Set(
										timelineStatuses.flatMap((status) => {
											const activityStreamsUri = optionalNonemptyString(status.uri)
											return activityStreamsUri == null ? [] : [activityStreamsUri]
										})
									).size
							)
							return [{
								[EntityMetaKey.Selector]: {
									$hub: { scope },
									timestampMs: Date.now(),
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
									...(activeUserCount != null && {
										[entityFieldAddressKey(EntityType._GlobalActivityPubNetwork_Timestamp, [], 'activeUserCount')]: activeUserCount,
									}),
									...(observedActorCount != null && {
										[entityFieldAddressKey(EntityType._GlobalActivityPubNetwork_Timestamp, [], 'observedActorCount')]: observedActorCount,
									}),
									...(observedNoteCount != null && {
										[entityFieldAddressKey(EntityType._GlobalActivityPubNetwork_Timestamp, [], 'observedNoteCount')]: observedNoteCount,
									}),
									[entityFieldAddressKey(EntityType._GlobalActivityPubNetwork_Timestamp, [], 'seededInstanceCount')]: mastodonInstances.length,
									...(peerDomains != null && {
										[entityFieldAddressKey(EntityType._GlobalActivityPubNetwork_Timestamp, [], 'knownPeerDomainCount')]: peerDomains.length,
									}),
									...(moderatedDomains != null && {
										[entityFieldAddressKey(EntityType._GlobalActivityPubNetwork_Timestamp, [], 'moderatedDomainCount')]: moderatedDomains.length,
									}),
									[entityFieldAddressKey(EntityType._GlobalActivityPubNetwork_Timestamp, [], 'reachable')]: true,
								},
							}]
						} catch {
							return [{
								[EntityMetaKey.Selector]: {
									$hub: { scope },
									timestampMs: Date.now(),
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
		defineResolver({
			entityType: EntityType.ActivityPubInstance,
			resolve: {
				InstanceOrigin: {
					resolve: (selector) => selector,
				},
			},
		})({
				instanceOrigin: (instance) => instance.instanceOrigin,
			}),

		defineResolver({
			entityType: EntityType.ActivityPubInstance,
			resolve: {
				InstanceOrigin: {
					resolve: async ({ instanceOrigin }) => {
						const {
							assertInstanceMatches,
							getInstance,
							listInstanceModeratedDomains,
							listInstancePeerDomains,
						} = await import('$/sources/Mastodon/Rest/queries.ts')
						const binding = mastodonInstanceBindingByOrigin.get(new URL(instanceOrigin).origin)
						if (binding == null)
							throw new Error(`Mastodon_Rest: entity instance binding is missing for ${instanceOrigin}`)
						assertInstanceMatches(binding, instanceOrigin)
						const [instance, peerDomains, moderatedDomains] = await Promise.all([
							getInstance(binding, instanceOrigin),
							listInstancePeerDomains(binding, instanceOrigin),
							listInstanceModeratedDomains(binding, instanceOrigin)
								.catch(() => undefined),
						])
						const $instance = { instanceOrigin }
						const $observation = {
							$instance,
							timestampMs: Date.now(),
							source: Source.Mastodon_Rest,
						}
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
								...(moderatedDomains != null && {
									[entityFieldAddressKey(EntityType.ActivityPubInstance_Timestamp, [], '$$moderatedDomains')]: moderatedDomains.map((domainBlock) => ({
										[EntityMetaKey.Selector]: {
											$observation,
											digest: domainBlock.digest.toLowerCase(),
											},
											[EntityMetaKey.Fields]: {
												[entityFieldAddressKey(EntityType.ActivityPubInstanceModeratedDomain, [], 'domain')]: domainBlock.domain,
												[entityFieldAddressKey(EntityType.ActivityPubInstanceModeratedDomain, [], 'severity')]: domainBlock.severity,
												...(domainBlock.comment != null && {
													[entityFieldAddressKey(EntityType.ActivityPubInstanceModeratedDomain, [], 'comment')]: domainBlock.comment,
												}),
											},
									})),
								}),
							},
						}]
					},
				},
			},
		})({
				$$timestamps: (observations) => observations,
			}),
		defineResolver({
			entityType: EntityType.ActivityPubInstancePeer,
			resolve: {
				ObservationPeerDomain: {
					resolve: (selector) => selector,
				},
			},
		})({
				$observation: (peer) => peer.$observation,
				peerDomain: (peer) => peer.peerDomain,
			}),

		defineResolver({
			entityType: EntityType.ActivityPubInstanceModeratedDomain,
			resolve: {
				ObservationDigest: {
					resolve: (selector) => {
						if (selector.$observation.source !== Source.Mastodon_Rest)
							throw new Error('Mastodon_Rest: ActivityPub moderated domain source mismatch')
						return selector
					},
				},
			},
		})({
			$observation: (domain) => domain.$observation,
			digest: (domain) => domain.digest,
		}),

		defineResolver({
			entityType: EntityType.ActivityPubNetwork,
			resolve: {
				Scope: {
					resolve: async (_selector, context) => {
						const { listPublicTimelinePage } = await import('$/sources/Mastodon/Rest/queries.ts')
						const limit = resolverContextRowLimit(context)
						if (context.providerContinuationToken != null && mastodonPublicTimelines.length !== 1)
							throw new Error('Mastodon_Rest: ActivityPub network continuation requires one declared public timeline')
						const pages = await Promise.all(mastodonPublicTimelines.map(async ({
							binding,
							instanceOrigin,
						}) => ({
							...await listPublicTimelinePage(
								binding,
								instanceOrigin,
								limit,
								context.providerContinuationToken
							),
							instanceOrigin,
						})))

						return {
							entries: pages.flatMap((page) => page.statuses.map((status) => ({
								instanceOrigin: page.instanceOrigin,
								status,
							}))),
							continuationToken: pages.length === 1 ? pages[0].continuationToken : undefined,
							continuationTarget: pages.length === 1 ? pages[0].instanceOrigin : 'declared-public-timelines',
							resolvedAtMs: Date.now(),
						}
					},
				},
			},
		})({
				$$activityPubNotes: {
					select: (page) => page.entries.flatMap(({ instanceOrigin, status }) => {
						const reference = activityPubNoteCardReferenceFromMastodonStatus(
							status,
							instanceOrigin,
							page.resolvedAtMs
						)
						return reference == null ? [] : [reference]
					}),
					continuation: (page) => page.continuationToken == null ?
						{
							operation: 'activitypub-network-notes',
							target: page.continuationTarget,
							terminal: true,
						}
					:
						{
							operation: 'activitypub-network-notes',
							target: page.continuationTarget,
							terminal: false,
							token: page.continuationToken,
						},
				},
			}),

		defineResolver({
			entityType: EntityType.ActivityPubActor,
			resolve: {
				LocalAccountId: {
					resolve: async ({ instanceOrigin, localAccountId }) => {
						const { assertInstanceMatches, getAccountByLocalAccountId } = await import('$/sources/Mastodon/Rest/queries.ts')
						const binding = mastodonInstanceBindingByOrigin.get(new URL(instanceOrigin).origin)
						if (binding == null)
							throw new Error(`Mastodon_Rest: entity instance binding is missing for ${instanceOrigin}`)
						assertInstanceMatches(binding, instanceOrigin)
						const a = await getAccountByLocalAccountId(binding, instanceOrigin, localAccountId)
						if (String(a.id) !== localAccountId)
							throw new Error('Mastodon_Rest: ActivityPub actor response does not match the local account subject')

						return {
							...activityPubActorFieldsFromMastodonAccount(
								a,
								instanceOrigin,
								mastodonAvatarUrl
							),
							$$timestamps: [
								activityPubActorTimestampReferenceFromMastodonAccount(
									a,
									Date.now()
								),
							],
						}
					},
				},
				Acct: {
					resolve: async ({ instanceOrigin, acct }) => {
						const { assertInstanceMatches, getAccountByAcct } = await import('$/sources/Mastodon/Rest/queries.ts')
						const binding = mastodonInstanceBindingByOrigin.get(new URL(instanceOrigin).origin)
						if (binding == null)
							throw new Error(`Mastodon_Rest: entity instance binding is missing for ${instanceOrigin}`)
						assertInstanceMatches(binding, instanceOrigin)
						const a = await getAccountByAcct(binding, instanceOrigin, acct)
						if (a.acct !== acct)
							throw new Error('Mastodon_Rest: ActivityPub actor response does not match the acct subject')

						return {
							...activityPubActorFieldsFromMastodonAccount(
								a,
								instanceOrigin,
								mastodonAvatarUrl
							),
							$$timestamps: [
								activityPubActorTimestampReferenceFromMastodonAccount(
									a,
									Date.now()
								),
							],
						}
					},
				},
				ActivityStreamsUri: {
					resolve: async ({ activityStreamsUri }) => {
						const { getAccountByActivityStreamsUri } = await import('$/sources/Mastodon/Rest/queries.ts')
						const binding = mastodonInstanceBindingByOrigin.get(new URL(activityStreamsUri).origin)
						if (binding == null)
							throw new Error(`Mastodon_Rest: entity instance binding is missing for ${activityStreamsUri}`)
						const a = await getAccountByActivityStreamsUri(binding, activityStreamsUri)
						if (a.uri !== activityStreamsUri)
							throw new Error('Mastodon_Rest: ActivityPub actor response does not match the ActivityStreams subject')

						return {
							...activityPubActorFieldsFromMastodonAccount(
								a,
								new URL(activityStreamsUri).origin,
								mastodonAvatarUrl
							),
							$$timestamps: [
								activityPubActorTimestampReferenceFromMastodonAccount(
									a,
									Date.now()
								),
							],
						}
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
				$$timestamps: (actor) => actor.$$timestamps,
			}),

		defineResolver({
			entityType: EntityType.ActivityPubNote,
			resolve: {
				InstanceOriginLocalStatusId: {
					resolve: async ({ instanceOrigin, localStatusId }) => {
						const {
							assertInstanceMatches,
							getStatus,
						} = await import('$/sources/Mastodon/Rest/queries.ts')
						const binding = mastodonInstanceBindingByOrigin.get(new URL(instanceOrigin).origin)
						if (binding == null)
							throw new Error(`Mastodon_Rest: entity instance binding is missing for ${instanceOrigin}`)
						assertInstanceMatches(binding, instanceOrigin)
						const s = await getStatus(binding, instanceOrigin, localStatusId)
						if (String(s.id) !== localStatusId)
							throw new Error('Mastodon_Rest: ActivityPub note response does not match the local status subject')

						return activityPubNoteSnapshotFromMastodonStatus(binding, instanceOrigin, s)
					},
				},
				ActivityStreamsUri: {
					resolve: async ({ activityStreamsUri }) => {
						const {
							getStatusByActivityStreamsUri,
						} = await import('$/sources/Mastodon/Rest/queries.ts')
						const binding = mastodonInstanceBindingByOrigin.get(new URL(activityStreamsUri).origin)
						if (binding == null)
							throw new Error(`Mastodon_Rest: entity instance binding is missing for ${activityStreamsUri}`)
						const s = await getStatusByActivityStreamsUri(binding, activityStreamsUri)
						if (s.uri !== activityStreamsUri)
							throw new Error('Mastodon_Rest: ActivityPub note response does not match the ActivityStreams subject')

						return activityPubNoteSnapshotFromMastodonStatus(
							binding,
							new URL(activityStreamsUri).origin,
							s
						)
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
				$$media: {
					select: (note) => note.$$media,
					resolveCount: (note) => note.$$media.length,
				},
				$author: (note) => note.$author,
				$inReplyTo: (note) => note.$inReplyTo,
				$reblogOf: (note) => note.$reblogOf,
				$$timestamps: (note) => note.$$timestamps,
			}),
		defineResolver({
			entityType: EntityType.ActivityPubActor,
			resolve: {
				LocalAccountId: {
					resolve: async ({ instanceOrigin, localAccountId }, context) => {
						const { assertInstanceMatches, listAccountStatusesPageByLocalAccountId } = await import('$/sources/Mastodon/Rest/queries.ts')
						const binding = mastodonInstanceBindingByOrigin.get(new URL(instanceOrigin).origin)
						if (binding == null)
							throw new Error(`Mastodon_Rest: entity instance binding is missing for ${instanceOrigin}`)
						assertInstanceMatches(binding, instanceOrigin)
						return {
							...await listAccountStatusesPageByLocalAccountId(
								binding,
								instanceOrigin,
								localAccountId,
								resolverContextRowLimit(context),
								context.providerContinuationToken
							),
							instanceOrigin,
							localAccountId,
							resolvedAtMs: Date.now(),
						}
					},
				},
				ActivityStreamsUri: {
					resolve: async ({ activityStreamsUri }, context) => {
						const { getAccountByActivityStreamsUri, listAccountStatusesPageByLocalAccountId } = await import('$/sources/Mastodon/Rest/queries.ts')
						const binding = mastodonInstanceBindingByOrigin.get(new URL(activityStreamsUri).origin)
						if (binding == null)
							throw new Error(`Mastodon_Rest: entity instance binding is missing for ${activityStreamsUri}`)
						const account = await getAccountByActivityStreamsUri(binding, activityStreamsUri)
						if (account.uri !== activityStreamsUri || account.id == null)
							throw new Error('Mastodon_Rest: ActivityPub actor notes response does not match the ActivityStreams subject')

						const instanceOrigin = new URL(activityStreamsUri).origin
						const localAccountId = String(account.id)
						return {
							...await listAccountStatusesPageByLocalAccountId(
								binding,
								instanceOrigin,
								localAccountId,
								resolverContextRowLimit(context),
								context.providerContinuationToken
							),
							instanceOrigin,
							localAccountId,
							resolvedAtMs: Date.now(),
						}
					},
				},
			},
		})({
				$$notes: {
					select: (page, _selector, context) => [...new Map(page.statuses.flatMap((status) => {
						const reference = activityPubNoteCardReferenceFromMastodonStatus(
							status,
							page.instanceOrigin,
							page.resolvedAtMs
						)
						const activityStreamsUri = optionalNonemptyString(status.uri)
						return reference == null || activityStreamsUri == null ? [] : [[
							activityStreamsUri,
							reference,
						] as const]
					}).toReversed()).values()].toReversed().slice(0, resolverContextRowLimit(context)),
					continuation: (page) => page.continuationToken == null ?
						{
							operation: 'activitypub-actor-notes',
							target: 'mastodon-compatible-activitypub',
							viewerScope: `${page.instanceOrigin}/accounts/${page.localAccountId}`,
							terminal: true,
						}
					:
						{
							operation: 'activitypub-actor-notes',
							target: 'mastodon-compatible-activitypub',
							viewerScope: `${page.instanceOrigin}/accounts/${page.localAccountId}`,
							terminal: false,
							token: page.continuationToken,
						},
				},
			}),

		defineResolver({
			entityType: EntityType.ActivityPubNote,
			resolve: {
				InstanceOriginLocalStatusId: {
					resolve: async ({ instanceOrigin, localStatusId }) => {
						const {
							assertInstanceMatches,
							getStatusContext,
						} = await import('$/sources/Mastodon/Rest/queries.ts')
						const binding = mastodonInstanceBindingByOrigin.get(new URL(instanceOrigin).origin)
						if (binding == null)
							throw new Error(`Mastodon_Rest: entity instance binding is missing for ${instanceOrigin}`)
						assertInstanceMatches(binding, instanceOrigin)
						const { ancestors = [], descendants = [] } = await getStatusContext(binding, instanceOrigin, localStatusId)
						const resolvedAtMs = Date.now()
						return (
							[
								...ancestors,
								...descendants,
							]
								.flatMap((status) => (
									status.id != null && String(status.id) === localStatusId ?
										[]
									:
										[activityPubThreadNoteReferenceFromMastodonStatus(
											status,
											instanceOrigin,
											localStatusId,
											resolvedAtMs
										)]
								))
						)
					},
				},
				ActivityStreamsUri: {
					resolve: async ({ activityStreamsUri }) => {
						const {
							getStatusByActivityStreamsUri,
							getStatusContext,
						} = await import('$/sources/Mastodon/Rest/queries.ts')
						const binding = mastodonInstanceBindingByOrigin.get(new URL(activityStreamsUri).origin)
						if (binding == null)
							throw new Error(`Mastodon_Rest: entity instance binding is missing for ${activityStreamsUri}`)
						const status = await getStatusByActivityStreamsUri(binding, activityStreamsUri)
						if (status.id == null)
							throw new Error('Mastodon_Rest: ActivityPub note thread is missing the local status id')
						const instanceOrigin = new URL(activityStreamsUri).origin
						const localStatusId = String(status.id)
						const { ancestors = [], descendants = [] } = await getStatusContext(binding, instanceOrigin, localStatusId)
						const resolvedAtMs = Date.now()
						return (
							[
								...ancestors,
								...descendants,
							]
								.flatMap((threadStatus) => (
									threadStatus.id != null && String(threadStatus.id) === localStatusId ?
										[]
									:
										[activityPubThreadNoteReferenceFromMastodonStatus(
											threadStatus,
											instanceOrigin,
											localStatusId,
											resolvedAtMs
										)]
								))
						)
					},
				},
			},
		})({
				$$thread: {
					select: (notes) => notes,
					continuation: () => ({
						operation: 'activitypub-note-thread',
						target: 'mastodon-compatible-activitypub',
						terminal: true,
					}),
				},
			}),
	],
} satisfies RegisteredSourceResolverModule

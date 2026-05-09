import {
	defineEntityFieldResolver,
	defineEntityResolver,
	resolverLoadSubsetRowLimit,
} from '$/resolvers/$resolvers.ts'
import { singleFlight } from '$/lib/singleFlight.ts'
import { EntityMetaKey } from '$/schema/$EntityDefinition.ts'
import { MediaType } from '$/schema/Media.ts'
import { EntityType } from '$/schema/$EntityType.ts'
import { Source } from '$/sources/$Source.ts'

const optionalTrimmedString = (value: string | undefined) => (
	value?.trim() ? value.trim() : undefined
)

const mastodonAvatarHttpUrl = (
	value: string | null | undefined,
	options?: { siteOrigin?: string },
) => {
	const raw = typeof value === 'string' ? value.trim() : ''
	if (raw.length === 0) return undefined
	const withOrigin = (
		raw.startsWith('/') && options?.siteOrigin != null ?
			new URL(raw, options.siteOrigin).toString()
		:
			raw
	)
	const withProtocol = withOrigin.startsWith('//') ? `https:${withOrigin}` : withOrigin
	try {
		const parsed = new URL(withProtocol)
		return (
			parsed.protocol === 'http:' || parsed.protocol === 'https:' ?
				parsed.toString()
			:
				undefined
		)
	} catch {
		return undefined
	}
}

export default {
	source: Source.Mastodon_Rest,

	entityResolvers: [
		defineEntityResolver({
			entityType: EntityType.ActivityPubActor,
			resolve: async (entityId) => {
				const { assertInstanceMatches, mastodonGetAccount } = await import('$/sources/Mastodon/Rest/queries.ts')
				assertInstanceMatches(entityId.instanceOrigin)
				const a = await singleFlight(mastodonGetAccount)(entityId.localAccountId)
				if (a == null) throw new Error('Mastodon_Rest: account not found')
				const instanceOrigin = entityId.instanceOrigin
				return {
					username: optionalTrimmedString(a.username),
					acct: optionalTrimmedString(a.acct),
					displayName: optionalTrimmedString(a.display_name),
					note: optionalTrimmedString(a.note),
					...((
						t,
					) => (
						t == null ?
							{}
						:	{
								$icon: {
									[EntityMetaKey.Id]: { url: t },
									type: MediaType.Image,
								},
							}
					))(mastodonAvatarHttpUrl(a.avatar, { siteOrigin: instanceOrigin })),
				}
			},
		}),

		defineEntityResolver({
			entityType: EntityType.ActivityPubNote,
			resolve: async (entityId) => {
				const {
					assertInstanceMatches,
					mastodonGetStatus,
				} = await import('$/sources/Mastodon/Rest/queries.ts')
				assertInstanceMatches(entityId.instanceOrigin)
				const s = await singleFlight(mastodonGetStatus)(entityId.localStatusId)
				if (s == null) throw new Error('Mastodon_Rest: status not found')
				const createdAt = Date.parse(s.created_at ?? '')
				return {
					content: optionalTrimmedString(s.content),
					...(Number.isFinite(createdAt) ? { createdAt } : {}),
					$author: (
						s.account == null || s.account.id == null ?
							undefined
						:	{
								[EntityMetaKey.Id]: {
									instanceOrigin: entityId.instanceOrigin,
									localAccountId: String(s.account.id),
								},
							}
					),
					$inReplyTo: (
						s.in_reply_to_id == null || s.in_reply_to_id === '' ?
							undefined
						:	{
								[EntityMetaKey.Id]: {
									instanceOrigin: entityId.instanceOrigin,
									localStatusId: String(s.in_reply_to_id),
								},
							}
					),
				}
			},
		}),
	],

	entityFieldResolvers: [
		defineEntityFieldResolver({
			entityType: EntityType.ActivityPubNetwork,
			fieldName: '$$activityPubActors',
			resolve: async (_entityId, context) => {
				const { mastodonInstanceOrigin } = await import('$/sources/Mastodon/Rest/constants.ts')
				const { mastodonListPublicTimeline } = await import('$/sources/Mastodon/Rest/queries.ts')
				const limit = resolverLoadSubsetRowLimit(context)
				if (limit == null) throw new Error('Mastodon_Rest: ActivityPubNetwork $$activityPubActors requires query limit')
				const byId = new Map<string, { [EntityMetaKey.Id]: { instanceOrigin: string, localAccountId: string } }>()
				for (const status of await singleFlight(mastodonListPublicTimeline)(limit)) {
					const accountId = status.account?.id == null ? undefined : String(status.account.id)
					if (accountId == null) continue
					byId.set(accountId, {
						[EntityMetaKey.Id]: {
							instanceOrigin: mastodonInstanceOrigin,
							localAccountId: accountId,
						},
					})
				}
				return [...byId.values()]
			},
		}),

		defineEntityFieldResolver({
			entityType: EntityType.ActivityPubNetwork,
			fieldName: '$$activityPubNotes',
			resolve: async (_entityId, context) => {
				const { mastodonInstanceOrigin } = await import('$/sources/Mastodon/Rest/constants.ts')
				const { mastodonListPublicTimeline } = await import('$/sources/Mastodon/Rest/queries.ts')
				const limit = resolverLoadSubsetRowLimit(context)
				if (limit == null) throw new Error('Mastodon_Rest: ActivityPubNetwork $$activityPubNotes requires query limit')
				return (
					(await singleFlight(mastodonListPublicTimeline)(limit))
						.flatMap((status) => (
							status.id == null ?
								[]
							:	[
								{
									[EntityMetaKey.Id]: {
										instanceOrigin: mastodonInstanceOrigin,
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
				const { assertInstanceMatches, mastodonListAccountStatuses } = await import('$/sources/Mastodon/Rest/queries.ts')
				assertInstanceMatches(entityId.instanceOrigin)
				const limit = resolverLoadSubsetRowLimit(context)
				if (limit == null) throw new Error('Mastodon_Rest: ActivityPubActor $$notes requires query limit')
				return (
					(await singleFlight(mastodonListAccountStatuses)(entityId.localAccountId, limit))
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
			resolve: async (entityId) => {
				const {
					assertInstanceMatches,
					mastodonGetStatusContext,
				} = await import('$/sources/Mastodon/Rest/queries.ts')
				assertInstanceMatches(entityId.instanceOrigin)
				const { ancestors = [], descendants = [] } = await singleFlight(mastodonGetStatusContext)(entityId.localStatusId)
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

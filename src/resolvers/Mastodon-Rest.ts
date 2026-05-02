import {
	defineEntityFieldResolver,
	defineEntityResolver,
	resolverLoadSubsetRowLimit,
} from '$/resolvers/$resolvers.ts'
import { singleFlight } from '$/lib/singleFlight.ts'
import { EntityMetaKey } from '$/schema/$EntityDefinition.ts'
import { type Entity } from '$/schema/$schema.ts'
import { schema } from '$/schema/index.ts'
import { EntityType } from '$/schema/$EntityType.ts'
import { mastodonInstanceOrigin } from '$/sources/Mastodon/Rest/constants.ts'
import { Source } from '$/sources/$Source.ts'

const trim = (value: string | undefined) => (
	value?.trim() ? value.trim() : undefined
)

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
				return {
					username: trim(a.username),
					acct: trim(a.acct),
					displayName: trim(a.display_name),
					note: trim(a.note),
					avatarUrl: trim(a.avatar),
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
					content: trim(s.content),
					...(Number.isFinite(createdAt) ? { createdAt } : {}),
					$author: (
						s.account == null || s.account.id == null ?
							undefined
						:	(({
								[EntityMetaKey.Id]: {
									instanceOrigin: entityId.instanceOrigin,
									localAccountId: String(s.account.id),
								},
							}) satisfies Entity<typeof schema, EntityType.ActivityPubActor>)
					),
					$inReplyTo: (
						s.in_reply_to_id == null || s.in_reply_to_id === '' ?
							undefined
						:	(({
								[EntityMetaKey.Id]: {
									instanceOrigin: entityId.instanceOrigin,
									localStatusId: String(s.in_reply_to_id),
								},
							}) satisfies Entity<typeof schema, EntityType.ActivityPubNote>)
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
				const { mastodonListPublicTimeline } = await import('$/sources/Mastodon/Rest/queries.ts')
				const limit = resolverLoadSubsetRowLimit(context) ?? 25
				const byId = new Map<string, Entity<typeof schema, EntityType.ActivityPubActor>>()
				for (const status of await singleFlight(mastodonListPublicTimeline)(limit)) {
					const accountId = status.account?.id == null ? undefined : String(status.account.id)
					if (accountId == null) continue
					byId.set(accountId, (({
						[EntityMetaKey.Id]: {
							instanceOrigin: mastodonInstanceOrigin,
							localAccountId: accountId,
						},
					}) satisfies Entity<typeof schema, EntityType.ActivityPubActor>))
				}
				return [...byId.values()]
			},
		}),
		defineEntityFieldResolver({
			entityType: EntityType.ActivityPubNetwork,
			fieldName: '$$activityPubNotes',
			resolve: async (_entityId, context) => {
				const { mastodonListPublicTimeline } = await import('$/sources/Mastodon/Rest/queries.ts')
				const limit = resolverLoadSubsetRowLimit(context) ?? 25
				return (
					(await singleFlight(mastodonListPublicTimeline)(limit))
						.flatMap((status) => (
							status.id == null ?
								[]
							:	[(({
									[EntityMetaKey.Id]: {
										instanceOrigin: mastodonInstanceOrigin,
										localStatusId: String(status.id),
									},
								}) satisfies Entity<typeof schema, EntityType.ActivityPubNote>)]
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
				const limit = resolverLoadSubsetRowLimit(context) ?? 40
				return (
					(await singleFlight(mastodonListAccountStatuses)(entityId.localAccountId, limit))
						.flatMap((s) => (
							s.id == null ?
								[]
							:	[(({
									[EntityMetaKey.Id]: {
										instanceOrigin: entityId.instanceOrigin,
										localStatusId: String(s.id),
									},
								}) satisfies Entity<typeof schema, EntityType.ActivityPubNote>)]
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
							:	[(({
									[EntityMetaKey.Id]: {
										instanceOrigin: entityId.instanceOrigin,
										localStatusId: String(s.id),
									},
								}) satisfies Entity<typeof schema, EntityType.ActivityPubNote>)]
						))
				)
			},
		}),
	],
}

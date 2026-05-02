import {
	defineEntityFieldResolver,
	defineEntityResolver,
	resolverLoadSubsetRowLimit,
	sourcePublicEnv,
} from '$/resolvers/$resolvers.ts'
import { singleFlight } from '$/lib/singleFlight.ts'
import { EntityMetaKey } from '$/schema/$EntityDefinition.ts'
import { EntityType } from '$/schema/$EntityType.ts'
import { Source } from '$/sources/$Source.ts'

const trim = (value: string | undefined) => (
	value?.trim() ? value.trim() : undefined
)

export default {
	source: Source.Atproto_Xrpc,

	entityResolvers: [
		defineEntityResolver({
			entityType: EntityType.AtprotoActor,
			resolve: async (entityId) => {
				const { bskyGetProfile } = await import('$/sources/AtprotoBsky/Rest/queries.ts')
				const profile = await singleFlight(bskyGetProfile)(entityId.did)
				if (profile == null) throw new Error('Atproto_Xrpc: profile missing')
				return {
					displayName: trim(profile.displayName),
					handle: trim(profile.handle),
					avatarUrl: trim(profile.avatar),
					description: trim(profile.description),
				}
			},
		}),
		defineEntityResolver({
			entityType: EntityType.AtprotoPost,
			resolve: async (entityId) => {
				const { bskyGetPosts } = await import('$/sources/AtprotoBsky/Rest/queries.ts')
				const p = (await singleFlight(bskyGetPosts)([entityId.uri])).posts?.[0]
				if (p == null) throw new Error('Atproto_Xrpc: post not found')
				const rec = p.record
				const createdAt = Date.parse(rec?.createdAt ?? '')
				const authorDid = trim(p.author?.did)
				const parentUri = trim(rec?.reply?.parent?.uri)
				const rootUri = trim(rec?.reply?.root?.uri)
				return {
					$author: authorDid == null ? undefined : { [EntityMetaKey.Id]: { did: authorDid } },
					text: trim(rec?.text),
					...(Number.isFinite(createdAt) ? { createdAt } : {}),
					...(parentUri == null ? {} : { $parent: { [EntityMetaKey.Id]: { uri: parentUri } } }),
					...(rootUri == null ? {} : { $root: { [EntityMetaKey.Id]: { uri: rootUri } } }),
				}
			},
		}),
	],

	entityFieldResolvers: [
		defineEntityFieldResolver({
			entityType: EntityType.AtprotoNetwork,
			fieldName: '$$atprotoActors',
			resolve: async (_entityId, context) => {
				const { bskySearchActorsTypeahead, bskySearchPosts } = await import('$/sources/AtprotoBsky/Rest/queries.ts')
				void sourcePublicEnv(context, Source.Atproto_Xrpc)
				const limit = resolverLoadSubsetRowLimit(context) ?? 25
				const byDid = new Map<string, { [EntityMetaKey.Id]: { did: string } }>()
				for (const actor of (await singleFlight(bskySearchActorsTypeahead)({
					limit,
					q: 'a',
				})).actors ?? []) {
					const did = trim(actor.did)
					if (did != null) byDid.set(did, { [EntityMetaKey.Id]: { did } })
				}
				for (const post of (await singleFlight(bskySearchPosts)({
					limit,
					q: 'the',
				})).posts ?? []) {
					const did = trim(post.author?.did)
					if (did != null) byDid.set(did, { [EntityMetaKey.Id]: { did } })
				}
				return [...byDid.values()]
			},
		}),
		defineEntityFieldResolver({
			entityType: EntityType.AtprotoNetwork,
			fieldName: '$$atprotoPosts',
			resolve: async (_entityId, context) => {
				const { bskySearchPosts } = await import('$/sources/AtprotoBsky/Rest/queries.ts')
				void sourcePublicEnv(context, Source.Atproto_Xrpc)
				const limit = resolverLoadSubsetRowLimit(context) ?? 25
				return (
					((await singleFlight(bskySearchPosts)({
						limit,
						q: 'the',
					})).posts ?? [])
						.flatMap((post) => {
							const uri = trim(post.uri)
							return uri == null ? [] : [{ [EntityMetaKey.Id]: { uri } }]
						})
				)
			},
		}),
		defineEntityFieldResolver({
			entityType: EntityType.AtprotoActor,
			fieldName: '$$posts',
			resolve: async (entityId, context) => {
				const { bskyGetAuthorFeed } = await import('$/sources/AtprotoBsky/Rest/queries.ts')
				void sourcePublicEnv(context, Source.Atproto_Xrpc)
				const limit = resolverLoadSubsetRowLimit(context) ?? 30
				const { feed = [] } = await singleFlight(bskyGetAuthorFeed)({
					actor: entityId.did,
					limit,
				})
				return (
					feed
						.flatMap((item) => {
							const uri = trim(item.post?.uri)
							if (uri == null) return []
							return [{ [EntityMetaKey.Id]: { uri } }]
						})
				)
			},
		}),
	],
}

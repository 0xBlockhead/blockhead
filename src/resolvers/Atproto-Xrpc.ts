import {
	defineEntityFieldResolver,
	defineEntityResolver,
	resolverLoadSubsetRowLimit,
} from '$/resolvers/$resolvers.ts'
import { atprotoNetworkSeedActors } from '$/constants/Social/Atproto.ts'
import { singleFlight } from '$/lib/singleFlight.ts'
import { mediaFromUrl } from '$/lib/media.ts'
import { EntityMetaKey } from '$/schema/$EntityDefinition.ts'
import { MediaType } from '$/schema/Media.ts'
import { EntityType } from '$/schema/$EntityType.ts'
import { Source } from '$/sources/$Source.ts'
import type {
	BskyAppViewPostView,
	BskyAppViewProfile,
} from '$/sources/AtprotoBsky/Rest/types.ts'

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

const mapBskyProfileTimestampFields = (profile: BskyAppViewProfile) => ({
	followersCount: optionalFiniteNumber(profile.followersCount),
	followsCount: optionalFiniteNumber(profile.followsCount),
	postsCount: optionalFiniteNumber(profile.postsCount),
})

const mapBskyPostTimestampFields = (p: BskyAppViewPostView) => ({
	likeCount: optionalFiniteNumber(p.likeCount),
	repostCount: optionalFiniteNumber(p.repostCount),
	replyCount: optionalFiniteNumber(p.replyCount),
	quoteCount: optionalFiniteNumber(p.quoteCount),
})

const mapBskyPostView = (p: BskyAppViewPostView) => {
	const rec = p.record
	const createdAt = Date.parse(rec?.createdAt ?? '')
	const authorDid = optionalTrimmedString(p.author?.did)
	if (authorDid == null) throw new Error('Atproto_Xrpc: post author did missing')
	const parentUri = optionalTrimmedString(rec?.reply?.parent?.uri)
	const rootUri = optionalTrimmedString(rec?.reply?.root?.uri)
	const selfLabelValues = (
		rec?.labels?.values
			?.map((labelValue) => optionalTrimmedString(labelValue.val))
			.filter((value): value is string => value != null)
	)
	return {
		$author: { [EntityMetaKey.Id]: { did: authorDid } },
		text: optionalTrimmedString(rec?.text),
		...(Number.isFinite(createdAt) && { createdAt }),
		...(optionalTimestampMs(p.indexedAt) != null && {
			indexedAt: optionalTimestampMs(p.indexedAt),
		}),
		...mapBskyPostTimestampFields(p),
		...(rec?.langs != null && rec.langs.length > 0 && { langs: rec.langs }),
		...(selfLabelValues != null && selfLabelValues.length > 0 && { selfLabelValues }),
		...(parentUri != null && { $parent: { [EntityMetaKey.Id]: { uri: parentUri } } }),
		...(rootUri != null && { $root: { [EntityMetaKey.Id]: { uri: rootUri } } }),
	}
}

export default {
	source: Source.Atproto_Xrpc,

	entityResolvers: [
		defineEntityResolver({
			entityType: EntityType.AtprotoActor,
			resolve: async (entityId) => {
				const { getProfile } = await import('$/sources/AtprotoBsky/Rest/queries.ts')
				const profile = await singleFlight(getProfile)(entityId.did)
				if (profile == null) throw new Error('Atproto_Xrpc: profile missing')
				return {
					displayName: optionalTrimmedString(profile.displayName),
					handle: optionalTrimmedString(profile.handle),
					...((
						iconMedia,
					) => (
						iconMedia != null && {
							$icon: iconMedia,
						}
					))(mediaFromUrl(profile.avatar, MediaType.Image)),
					...((
						bannerMedia,
					) => (
						bannerMedia != null && {
							$banner: bannerMedia,
						}
					))(mediaFromUrl(profile.banner, MediaType.Image)),
					...mapBskyProfileTimestampFields(profile),
					...(optionalTimestampMs(profile.indexedAt) != null && {
						indexedAt: optionalTimestampMs(profile.indexedAt),
					}),
					description: optionalTrimmedString(profile.description),
				}
			},
		}),

		defineEntityResolver({
			entityType: EntityType.AtprotoPost,
			resolve: async (entityId) => {
				const { getPosts } = await import('$/sources/AtprotoBsky/Rest/queries.ts')
				const p = (await singleFlight(getPosts)([entityId.uri])).posts?.[0]
				if (p == null) throw new Error('Atproto_Xrpc: post not found')
				return mapBskyPostView(p)
			},
		}),

		defineEntityResolver({
			entityType: EntityType.AtprotoActor_Timestamp,
			resolve: async (entityId) => {
				const { getProfile } = await import('$/sources/AtprotoBsky/Rest/queries.ts')
				const profile = await singleFlight(getProfile)(entityId.$actor.did)
				if (profile == null) throw new Error('Atproto_Xrpc: profile missing')
				return mapBskyProfileTimestampFields(profile)
			},
		}),

		defineEntityResolver({
			entityType: EntityType.AtprotoPost_Timestamp,
			resolve: async (entityId) => {
				const { getPosts } = await import('$/sources/AtprotoBsky/Rest/queries.ts')
				const p = (await singleFlight(getPosts)([entityId.$post.uri])).posts?.[0]
				if (p == null) throw new Error('Atproto_Xrpc: post not found')
				return mapBskyPostTimestampFields(p)
			},
		}),
	],

	entityFieldResolvers: [
		defineEntityFieldResolver({
			entityType: EntityType.AtprotoNetwork,
			fieldName: '$$atprotoActors',
			resolve: async (_entityId, context) => {
				const { searchActorsTypeahead } = await import('$/sources/AtprotoBsky/Rest/queries.ts')
				const limit = resolverLoadSubsetRowLimit(context)
				const refs: { [EntityMetaKey.Id]: { did: string } }[] = [
					...atprotoNetworkSeedActors.map((seed) => ({
						[EntityMetaKey.Id]: { did: seed.did },
					})),
					...((await singleFlight(searchActorsTypeahead)({
						limit,
						q: 'bsky',
					})).actors ?? [])
						.flatMap((actor) => {
							const did = optionalTrimmedString(actor.did)
							return did == null ?
								[]
							:
								[{ [EntityMetaKey.Id]: { did } }]
						}),
				]
				return refs.slice(0, limit)
			},
		}),

		defineEntityFieldResolver({
			entityType: EntityType.AtprotoNetwork,
			fieldName: '$$atprotoPosts',
			resolve: async () => {
				throw new Error('Atproto_Xrpc: $$atprotoPosts is unsupported; use $$atprotoActors and AtprotoActor.$$posts')
			},
		}),

		defineEntityFieldResolver({
			entityType: EntityType.AtprotoActor,
			fieldName: '$$timestamps',
			resolve: async (entityId) => {
				const { getProfile } = await import('$/sources/AtprotoBsky/Rest/queries.ts')
				const profile = await singleFlight(getProfile)(entityId.did)
				if (profile == null) throw new Error('Atproto_Xrpc: profile missing')
				return [
					{
						[EntityMetaKey.Id]: {
							$actor: entityId,
							timestampMs: Date.now(),
						},
						...mapBskyProfileTimestampFields(profile),
					},
				]
			},
		}),

		defineEntityFieldResolver({
			entityType: EntityType.AtprotoActor,
			fieldName: '$$posts',
			resolve: async (entityId, context) => {
				const { getAuthorFeed } = await import('$/sources/AtprotoBsky/Rest/queries.ts')
				const limit = resolverLoadSubsetRowLimit(context)
				const { feed = [] } = await singleFlight(getAuthorFeed)({
					actor: entityId.did,
					limit,
					includePins: true,
				})
				return (
					feed
						.flatMap((feedItem) => {
							const authorDid = optionalTrimmedString(feedItem.post?.author?.did)
							if (authorDid !== entityId.did) return []
							const uri = optionalTrimmedString(feedItem.post?.uri)
							if (uri == null) return []
							return [{ [EntityMetaKey.Id]: { uri } }]
						})
				)
			},
		}),

		defineEntityFieldResolver({
			entityType: EntityType.AtprotoPost,
			fieldName: '$$timestamps',
			resolve: async (entityId) => {
				const { getPosts } = await import('$/sources/AtprotoBsky/Rest/queries.ts')
				const p = (await singleFlight(getPosts)([entityId.uri])).posts?.[0]
				if (p == null) throw new Error('Atproto_Xrpc: post not found')
				return [
					{
						[EntityMetaKey.Id]: {
							$post: entityId,
							timestampMs: Date.now(),
						},
						...mapBskyPostTimestampFields(p),
					},
				]
			},
		}),

		defineEntityFieldResolver({
			entityType: EntityType.AtprotoPost,
			fieldName: '$$thread',
			resolve: async (entityId, context) => {
				const { getPostThread } = await import('$/sources/AtprotoBsky/Rest/queries.ts')
				const limit = resolverLoadSubsetRowLimit(context)
				const { thread } = await singleFlight(getPostThread)(entityId.uri)
				if (thread == null || optionalTrimmedString(thread.post?.uri) == null) {
					throw new Error(`Atproto_Xrpc: post thread not found for ${entityId.uri}`)
				}
				const ancestors: { [EntityMetaKey.Id]: { uri: string } }[] = []
				let parent = thread?.parent
				while (parent != null) {
					const uri = optionalTrimmedString(parent.post?.uri)
					if (uri == null) break
					if (uri !== entityId.uri) {
						ancestors.unshift({ [EntityMetaKey.Id]: { uri } })
					}
					parent = parent.parent
				}
				const descendants: { [EntityMetaKey.Id]: { uri: string } }[] = []
				const walkReplies = (node: NonNullable<typeof thread>) => {
					for (const reply of node.replies ?? []) {
						const uri = optionalTrimmedString(reply?.post?.uri)
						if (uri != null && uri !== entityId.uri) {
							descendants.push({ [EntityMetaKey.Id]: { uri } })
						}
						if (optionalTrimmedString(reply?.post?.uri) != null) walkReplies(reply)
					}
				}
				walkReplies(thread)
				return [...ancestors, ...descendants].slice(0, limit)
			},
		}),
	],
}

import {
	defineEntityFieldResolver,
	defineEntityResolver,
	resolverLoadSubsetRowLimit,
} from '$/resolvers/$resolvers.ts'
import { atprotoNetworkSeedActors } from '$/constants/Social/Atproto.ts'
import { singleFlight } from '$/lib/singleFlight.ts'
import { optionalNonemptyString } from '$/lib/string.ts'
import { optionalTimestampMs } from '$/lib/time.ts'
import { mediaFromUrl } from '$/lib/media.ts'
import { EntityMetaKey } from '$/schema/$EntityDefinition.ts'
import { MediaType } from '$/schema/Media.ts'
import { EntityType } from '$/schema/$EntityType.ts'
import { Source } from '$/sources/$Source.ts'
export default {
	source: Source.Atproto_Xrpc,

	entityResolvers: [
		defineEntityResolver({
			entityType: EntityType.AtprotoActor,
			resolve: async (entityId) => {
				const { getProfile } = await import('$/sources/AtprotoBsky/Rest/queries.ts')
				const profile = await singleFlight(getProfile)('did' in entityId ? entityId.did : entityId.handle)
				const displayName = optionalNonemptyString(profile.displayName)
				const description = optionalNonemptyString(profile.description)
				const indexedAt = optionalTimestampMs(profile.indexedAt)
				return {
					did: profile.did,
					...(displayName != null && { displayName }),
					handle: profile.handle,
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
					...(profile.followersCount != null && { followersCount: profile.followersCount }),
					...(profile.followsCount != null && { followsCount: profile.followsCount }),
					...(profile.postsCount != null && { postsCount: profile.postsCount }),
					...(indexedAt != null && { indexedAt }),
					...(description != null && { description }),
				}
			},
		}),

		defineEntityResolver({
			entityType: EntityType.AtprotoPost,
			resolve: async (entityId) => {
				const { getPosts } = await import('$/sources/AtprotoBsky/Rest/queries.ts')
				const postView = (await singleFlight(getPosts)([entityId.uri])).posts.at(0)
				if (postView == null) throw new Error('Atproto_Xrpc: post not found')
				const atprotoRecord = postView.record
				const createdAt = Date.parse(atprotoRecord.createdAt)
				const parentUri = optionalNonemptyString(atprotoRecord.reply?.parent?.uri)
				const rootUri = optionalNonemptyString(atprotoRecord.reply?.root?.uri)
				const text = optionalNonemptyString(atprotoRecord.text)
				const indexedAt = optionalTimestampMs(postView.indexedAt)
				const selfLabelValues = (
					atprotoRecord.labels?.values
						?.map((labelValue) => optionalNonemptyString(labelValue.val))
						.filter((value): value is string => value != null)
				)
				return {
					$author: { [EntityMetaKey.Id]: { did: postView.author.did } },
					...(text != null && { text }),
					...(Number.isFinite(createdAt) && { createdAt }),
					...(indexedAt != null && { indexedAt }),
					...(postView.likeCount != null && { likeCount: postView.likeCount }),
					...(postView.repostCount != null && { repostCount: postView.repostCount }),
					...(postView.replyCount != null && { replyCount: postView.replyCount }),
					...(postView.quoteCount != null && { quoteCount: postView.quoteCount }),
					...(atprotoRecord.langs != null && atprotoRecord.langs.length > 0 && { langs: atprotoRecord.langs }),
					...(selfLabelValues != null && selfLabelValues.length > 0 && { selfLabelValues }),
					...(parentUri != null && { $parent: { [EntityMetaKey.Id]: { uri: parentUri } } }),
					...(rootUri != null && { $root: { [EntityMetaKey.Id]: { uri: rootUri } } }),
				}
			},
		}),

		defineEntityResolver({
			entityType: EntityType.AtprotoActor_Timestamp,
			resolve: async (entityId) => {
				if (!('did' in entityId.$actor))
					throw new Error('Atproto_Xrpc: AtprotoActor_Timestamp handle lookup is unsupported')

				const { getProfile } = await import('$/sources/AtprotoBsky/Rest/queries.ts')
				const profile = await singleFlight(getProfile)(entityId.$actor.did)
				return {
					...(profile.followersCount != null && { followersCount: profile.followersCount }),
					...(profile.followsCount != null && { followsCount: profile.followsCount }),
					...(profile.postsCount != null && { postsCount: profile.postsCount }),
				}
			},
		}),

		defineEntityResolver({
			entityType: EntityType.AtprotoPost_Timestamp,
			resolve: async (entityId) => {
				const { getPosts } = await import('$/sources/AtprotoBsky/Rest/queries.ts')
				const postView = (await singleFlight(getPosts)([entityId.$post.uri])).posts.at(0)
				if (postView == null) throw new Error('Atproto_Xrpc: post not found')
				return {
					...(postView.likeCount != null && { likeCount: postView.likeCount }),
					...(postView.repostCount != null && { repostCount: postView.repostCount }),
					...(postView.replyCount != null && { replyCount: postView.replyCount }),
					...(postView.quoteCount != null && { quoteCount: postView.quoteCount }),
				}
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
					...atprotoNetworkSeedActors.flatMap((seed) => (
						'did' in seed ?
							[{ [EntityMetaKey.Id]: { did: seed.did } }]
						:
							[]
					)),
					...((await singleFlight(searchActorsTypeahead)({
						limit,
						q: 'bsky',
					})).actors ?? [])
						.flatMap((actor) => {
							const did = optionalNonemptyString(actor.did)
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
				if (!('did' in entityId))
					throw new Error('Atproto_Xrpc: AtprotoActor.$$timestamps handle lookup is unsupported')

				const { getProfile } = await import('$/sources/AtprotoBsky/Rest/queries.ts')
				const profile = await singleFlight(getProfile)(entityId.did)
				return [
					{
						[EntityMetaKey.Id]: {
							$actor: {
								did: profile.did,
							},
							timestampMs: Date.now(),
						},
						...(profile.followersCount != null && { followersCount: profile.followersCount }),
						...(profile.followsCount != null && { followsCount: profile.followsCount }),
						...(profile.postsCount != null && { postsCount: profile.postsCount }),
					},
				]
			},
		}),

		defineEntityFieldResolver({
			entityType: EntityType.AtprotoActor,
			fieldName: '$$posts',
			resolve: async (entityId, context) => {
				if (!('did' in entityId))
					throw new Error('Atproto_Xrpc: AtprotoActor.$$posts handle lookup is unsupported')

				const { getAuthorFeed } = await import('$/sources/AtprotoBsky/Rest/queries.ts')
				const limit = resolverLoadSubsetRowLimit(context)
				const { feed } = await singleFlight(getAuthorFeed)({
					actor: entityId.did,
					limit,
					includePins: true,
				})
				return (
					feed
						.flatMap((feedItem) => {
							if (feedItem.post.author.did !== entityId.did) return []
							return [{ [EntityMetaKey.Id]: { uri: feedItem.post.uri } }]
						})
				)
			},
		}),

		defineEntityFieldResolver({
			entityType: EntityType.AtprotoPost,
			fieldName: '$$timestamps',
			resolve: async (entityId) => {
				const { getPosts } = await import('$/sources/AtprotoBsky/Rest/queries.ts')
				const postView = (await singleFlight(getPosts)([entityId.uri])).posts.at(0)
				if (postView == null) throw new Error('Atproto_Xrpc: post not found')
				return [
					{
						[EntityMetaKey.Id]: {
							$post: entityId,
							timestampMs: Date.now(),
						},
						...(postView.likeCount != null && { likeCount: postView.likeCount }),
						...(postView.repostCount != null && { repostCount: postView.repostCount }),
						...(postView.replyCount != null && { replyCount: postView.replyCount }),
						...(postView.quoteCount != null && { quoteCount: postView.quoteCount }),
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
					if (thread == null)
						throw new Error(`Atproto_Xrpc: post thread not found for ${entityId.uri}`)

					const threadPostUri = optionalNonemptyString(thread.post.uri)
					if (threadPostUri == null) {
						throw new Error(`Atproto_Xrpc: post thread not found for ${entityId.uri}`)
					}
				const ancestors: { [EntityMetaKey.Id]: { uri: string } }[] = []
				let parent = thread.parent
				while (parent != null) {
					const uri = optionalNonemptyString(parent.post.uri)
					if (uri == null) break
					if (uri !== entityId.uri) {
						ancestors.unshift({ [EntityMetaKey.Id]: { uri } })
					}
					parent = parent.parent
				}
				const descendants: { [EntityMetaKey.Id]: { uri: string } }[] = []
				const walkReplies = (node: NonNullable<typeof thread>) => {
					for (const reply of node.replies ?? []) {
						const uri = optionalNonemptyString(reply.post.uri)
						if (uri != null && uri !== entityId.uri) {
							descendants.push({ [EntityMetaKey.Id]: { uri } })
						}
						if (uri != null) walkReplies(reply)
					}
				}
				walkReplies(thread)
				return [...ancestors, ...descendants].slice(0, limit)
			},
		}),
	],
}

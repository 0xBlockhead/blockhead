import {
	defineResolver,
	resolverContextRowLimit,
} from '$/resolvers/$resolvers.ts'
import { atprotoNetworkSeedActors } from '$/constants/Social/Atproto.ts'
import { singleFlight } from '$/lib/singleFlight.ts'
import { optionalNonemptyString } from '$/lib/string.ts'
import { optionalTimestampMs } from '$/lib/time.ts'
import { mediaFromUrl } from '$/lib/media.ts'
import {
	EntityIdProjection,
	EntityMetaKey,
} from '$/schema/$EntityDefinition.ts'
import { MediaType } from '$/schema/Media.ts'
import { EntityType } from '$/schema/$EntityType.ts'
import { Source } from '$/sources/$Source.ts'
export default {
	source: Source.Atproto_Xrpc,

	resolvers: [
		defineResolver(Source.Atproto_Xrpc, {
			entityType: EntityType.AtprotoActor,
			resolve: {
				[EntityIdProjection.Identity]: async (entityId) => {
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
				['did']: async (entityId) => {
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
			}
			},
			fields: {
			did: (actor) => actor.did,
			displayName: (actor) => actor.displayName,
			handle: (actor) => actor.handle,
			$icon: (actor) => actor.$icon,
			$banner: (actor) => actor.$banner,
			followersCount: (actor) => actor.followersCount,
			followsCount: (actor) => actor.followsCount,
			postsCount: (actor) => actor.postsCount,
			indexedAt: (actor) => actor.indexedAt,
			description: (actor) => actor.description,
		}
		}),

		defineResolver(Source.Atproto_Xrpc, {
			entityType: EntityType.AtprotoPost,
			resolve: {
				[EntityIdProjection.Identity]: async (entityId) => {
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
			}
			},
			fields: {
			$author: (post) => post.$author,
			text: (post) => post.text,
			createdAt: (post) => post.createdAt,
			indexedAt: (post) => post.indexedAt,
			likeCount: (post) => post.likeCount,
			repostCount: (post) => post.repostCount,
			replyCount: (post) => post.replyCount,
			quoteCount: (post) => post.quoteCount,
			langs: (post) => post.langs,
			selfLabelValues: (post) => post.selfLabelValues,
			$parent: (post) => post.$parent,
			$root: (post) => post.$root,
		}
		}),

		defineResolver(Source.Atproto_Xrpc, {
			entityType: EntityType.AtprotoActor_Timestamp,
			resolve: {
				[EntityIdProjection.Identity]: async (entityId) => {
				if (!('did' in entityId.$actor))
					throw new Error('Atproto_Xrpc: AtprotoActor_Timestamp handle lookup is unsupported')

				const { getProfile } = await import('$/sources/AtprotoBsky/Rest/queries.ts')
				const profile = await singleFlight(getProfile)(entityId.$actor.did)
				return {
					...(profile.followersCount != null && { followersCount: profile.followersCount }),
					...(profile.followsCount != null && { followsCount: profile.followsCount }),
					...(profile.postsCount != null && { postsCount: profile.postsCount }),
				}
			}
			},
			fields: {
			followersCount: (timestamp) => timestamp.followersCount,
			followsCount: (timestamp) => timestamp.followsCount,
			postsCount: (timestamp) => timestamp.postsCount,
		}
		}),

		defineResolver(Source.Atproto_Xrpc, {
			entityType: EntityType.AtprotoPost_Timestamp,
			resolve: {
				[EntityIdProjection.Identity]: async (entityId) => {
				const { getPosts } = await import('$/sources/AtprotoBsky/Rest/queries.ts')
				const postView = (await singleFlight(getPosts)([entityId.$post.uri])).posts.at(0)
				if (postView == null) throw new Error('Atproto_Xrpc: post not found')
				return {
					...(postView.likeCount != null && { likeCount: postView.likeCount }),
					...(postView.repostCount != null && { repostCount: postView.repostCount }),
					...(postView.replyCount != null && { replyCount: postView.replyCount }),
					...(postView.quoteCount != null && { quoteCount: postView.quoteCount }),
				}
			}
			},
			fields: {
			likeCount: (timestamp) => timestamp.likeCount,
			repostCount: (timestamp) => timestamp.repostCount,
			replyCount: (timestamp) => timestamp.replyCount,
			quoteCount: (timestamp) => timestamp.quoteCount,
		}
		}),

		defineResolver(Source.Atproto_Xrpc, {
			entityType: EntityType.AtprotoNetwork,
			resolve: {
				[EntityIdProjection.Identity]: async (_entityId, context) => {
				const { searchActorsTypeahead } = await import('$/sources/AtprotoBsky/Rest/queries.ts')
				const limit = resolverContextRowLimit(context)
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
			}
			},
			fields: {
			$$atprotoActors: (actors) => actors,
		}
		}),

		defineResolver(Source.Atproto_Xrpc, {
			entityType: EntityType.AtprotoNetwork,
			resolve: {
				[EntityIdProjection.Identity]: async () => {
				throw new Error('Atproto_Xrpc: $$atprotoPosts is unsupported; use $$atprotoActors and AtprotoActor.$$posts')
			}
			},
			fields: {
			$$atprotoPosts: (posts) => posts,
		}
		}),

		defineResolver(Source.Atproto_Xrpc, {
			entityType: EntityType.AtprotoActor,
			resolve: {
				[EntityIdProjection.Identity]: async (entityId) => {
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
				['did']: async (entityId) => {
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
			}
			},
			fields: {
			$$timestamps: (timestamps) => timestamps,
		}
		}),

		defineResolver(Source.Atproto_Xrpc, {
			entityType: EntityType.AtprotoActor,
			resolve: {
				[EntityIdProjection.Identity]: async (entityId, context) => {
				if (!('did' in entityId))
					throw new Error('Atproto_Xrpc: AtprotoActor.$$posts handle lookup is unsupported')

				const { getAuthorFeed } = await import('$/sources/AtprotoBsky/Rest/queries.ts')
				const limit = resolverContextRowLimit(context)
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
				['did']: async (entityId, context) => {
				if (!('did' in entityId))
					throw new Error('Atproto_Xrpc: AtprotoActor.$$posts handle lookup is unsupported')

				const { getAuthorFeed } = await import('$/sources/AtprotoBsky/Rest/queries.ts')
				const limit = resolverContextRowLimit(context)
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
			}
			},
			fields: {
			$$posts: (posts) => posts,
		}
		}),

		defineResolver(Source.Atproto_Xrpc, {
			entityType: EntityType.AtprotoPost,
			resolve: {
				[EntityIdProjection.Identity]: async (entityId) => {
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
			}
			},
			fields: {
			$$timestamps: (timestamps) => timestamps,
		}
		}),

		defineResolver(Source.Atproto_Xrpc, {
			entityType: EntityType.AtprotoPost,
			resolve: {
				[EntityIdProjection.Identity]: async (entityId, context) => {
					const { getPostThread } = await import('$/sources/AtprotoBsky/Rest/queries.ts')
					const limit = resolverContextRowLimit(context)
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
			}
			},
			fields: {
			$$thread: (thread) => thread,
		}
		}),
	],
}

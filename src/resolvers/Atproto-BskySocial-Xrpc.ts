import { resolverContextRowLimit } from '$/resolvers/$resolvers.ts'
import {
	defineResolver,
} from '$/resolvers/defineResolver.ts'
import { atprotoNetworkSeedActors } from '$/constants/Social/Atproto.ts'
import { optionalNonemptyString } from '$/lib/string.ts'
import { optionalTimestampMs } from '$/lib/time.ts'
import { mediaFromUrl } from '$/resolvers/media.ts'
import {
	EntityMetaKey,
} from '$/schema/$schema.ts'
import { MediaType } from '$/schema/Media.ts'
import { EntityType } from '$/schema/EntityType.ts'
import { Source } from '$/sources/Source.ts'
import { AtprotoActorSelector } from '$/schema/AtprotoActor.ts'
import { AtprotoPostSelector } from '$/schema/AtprotoPost.ts'
import { AtprotoActor_TimestampSelector } from '$/schema/AtprotoActor_Timestamp.ts'
import { AtprotoPost_TimestampSelector } from '$/schema/AtprotoPost_Timestamp.ts'
import { AtprotoNetworkSelector } from '$/schema/AtprotoNetwork.ts'


export default {
	source: Source.Atproto_BskySocial_Xrpc,

	resolvers: [
		defineResolver(Source.Atproto_BskySocial_Xrpc, {
			entityType: EntityType.AtprotoActor,
			resolve: {
				[AtprotoActorSelector.Did]: async ({ did }) => {
					const { getProfile } = await import('$/sources/AtprotoBskySocial/Rest/queries.ts')
					const profile = await getProfile(did)
					const displayName = optionalNonemptyString(profile.displayName)
					const description = optionalNonemptyString(profile.description)
					const indexedAt = optionalTimestampMs(profile.indexedAt)
					return {
						did: profile.did,
						...(displayName != null && { displayName }),
						handle: profile.handle,
						...((
							iconMedia
					) => (
						iconMedia != null && {
							$icon: iconMedia,
						}
					))(mediaFromUrl(profile.avatar, MediaType.Image)),
						...((
							bannerMedia
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
				[AtprotoActorSelector.Handle]: async ({ handle }) => {
					const { getProfile } = await import('$/sources/AtprotoBskySocial/Rest/queries.ts')
					const profile = await getProfile(handle)
					const displayName = optionalNonemptyString(profile.displayName)
					const description = optionalNonemptyString(profile.description)
					const indexedAt = optionalTimestampMs(profile.indexedAt)
					return {
						did: profile.did,
						...(displayName != null && { displayName }),
						handle: profile.handle,
						...((
							iconMedia
					) => (
						iconMedia != null && {
							$icon: iconMedia,
						}
					))(mediaFromUrl(profile.avatar, MediaType.Image)),
						...((
							bannerMedia
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
			},
		})({
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
			},
		}),

		defineResolver(Source.Atproto_BskySocial_Xrpc, {
			entityType: EntityType.AtprotoPost,
			resolve: {
				[AtprotoPostSelector.Uri]: async ({ uri }) => {
					const { getPosts } = await import('$/sources/AtprotoBskySocial/Rest/queries.ts')
					const postView = (await getPosts([uri])).posts.at(0)
					if (postView == null) throw new Error('Atproto_BskySocial_Xrpc: post not found')
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
						$author: { [EntityMetaKey.Selector]: { did: postView.author.did } },
						...(text != null && { text }),
						...(Number.isFinite(createdAt) && { createdAt }),
						...(indexedAt != null && { indexedAt }),
						...(postView.likeCount != null && { likeCount: postView.likeCount }),
						...(postView.repostCount != null && { repostCount: postView.repostCount }),
						...(postView.replyCount != null && { replyCount: postView.replyCount }),
						...(postView.quoteCount != null && { quoteCount: postView.quoteCount }),
						...(atprotoRecord.langs != null && atprotoRecord.langs.length > 0 && { langs: atprotoRecord.langs }),
						...(selfLabelValues != null && selfLabelValues.length > 0 && { selfLabelValues }),
						...(parentUri != null && { $parent: { [EntityMetaKey.Selector]: { uri: parentUri } } }),
						...(rootUri != null && { $root: { [EntityMetaKey.Selector]: { uri: rootUri } } }),
					}
				}
			},
		})({
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
			},
		}),

		defineResolver(Source.Atproto_BskySocial_Xrpc, {
			entityType: EntityType.AtprotoActor_Timestamp,
			resolve: {
				[AtprotoActor_TimestampSelector.AtprotoActorTimestampMs]: async ({ $actor }) => {
					const { getProfile } = await import('$/sources/AtprotoBskySocial/Rest/queries.ts')
					const profile = await getProfile('did' in $actor ? $actor.did : $actor.handle)
					return {
						...(profile.followersCount != null && { followersCount: profile.followersCount }),
						...(profile.followsCount != null && { followsCount: profile.followsCount }),
						...(profile.postsCount != null && { postsCount: profile.postsCount }),
					}
				}
			},
		})({
			fields: {
				followersCount: (timestamp) => timestamp.followersCount,
				followsCount: (timestamp) => timestamp.followsCount,
				postsCount: (timestamp) => timestamp.postsCount,
			},
		}),

		defineResolver(Source.Atproto_BskySocial_Xrpc, {
			entityType: EntityType.AtprotoPost_Timestamp,
			resolve: {
				[AtprotoPost_TimestampSelector.AtprotoPostTimestampMs]: async ({ $post }) => {
					const { getPosts } = await import('$/sources/AtprotoBskySocial/Rest/queries.ts')
					const postView = (await getPosts([$post.uri])).posts.at(0)
					if (postView == null) throw new Error('Atproto_BskySocial_Xrpc: post not found')
					return {
						...(postView.likeCount != null && { likeCount: postView.likeCount }),
						...(postView.repostCount != null && { repostCount: postView.repostCount }),
						...(postView.replyCount != null && { replyCount: postView.replyCount }),
						...(postView.quoteCount != null && { quoteCount: postView.quoteCount }),
					}
				}
			},
		})({
			fields: {
				likeCount: (timestamp) => timestamp.likeCount,
				repostCount: (timestamp) => timestamp.repostCount,
				replyCount: (timestamp) => timestamp.replyCount,
				quoteCount: (timestamp) => timestamp.quoteCount,
			},
		}),

		defineResolver(Source.Atproto_BskySocial_Xrpc, {
			entityType: EntityType.AtprotoNetwork,
			resolve: {
				[AtprotoNetworkSelector.Scope]: async (_entitySelector, context) => {
					const { searchActorsTypeahead } = await import('$/sources/AtprotoBskySocial/Rest/queries.ts')
					const limit = resolverContextRowLimit(context)
					const refs: { [EntityMetaKey.Selector]: { did: string } }[] = [
						...atprotoNetworkSeedActors.map((seed) => ({
							[EntityMetaKey.Selector]: { did: seed.did },
						})),
						...((await searchActorsTypeahead({
							limit,
							q: 'bsky',
						})).actors ?? [])
							.flatMap((actor) => {
							const did = optionalNonemptyString(actor.did)
							return did == null ?
								[]
							:
								[{ [EntityMetaKey.Selector]: { did } }]
							}),
					]
					return refs.slice(0, limit)
				}
			},
		})({
			fields: {
				$$atprotoActors: (actors) => actors,
			},
		}),

		defineResolver(Source.Atproto_BskySocial_Xrpc, {
			entityType: EntityType.AtprotoNetwork,
			resolve: {
				[AtprotoNetworkSelector.Scope]: async (_entitySelector, context) => {
					const { searchPosts } = await import('$/sources/AtprotoBskySocial/Rest/queries.ts')
					const limit = resolverContextRowLimit(context)
					return (
						((await searchPosts({
							limit,
							q: 'bsky',
						})).posts ?? [])
							.flatMap((post) => {
							const uri = optionalNonemptyString(post.uri)
							return uri == null ?
								[]
							:
								[{ [EntityMetaKey.Selector]: { uri } }]
							})
					)
				}
			},
		})({
			fields: {
				$$atprotoPosts: (posts) => posts,
			},
		}),

		defineResolver(Source.Atproto_BskySocial_Xrpc, {
			entityType: EntityType.AtprotoActor,
			resolve: {
				[AtprotoActorSelector.Did]: async ({ did }) => {
					const { getProfile } = await import('$/sources/AtprotoBskySocial/Rest/queries.ts')
					const profile = await getProfile(did)
					return [
						{
							[EntityMetaKey.Selector]: {
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
				[AtprotoActorSelector.Handle]: async ({ handle }) => {
					const { getProfile } = await import('$/sources/AtprotoBskySocial/Rest/queries.ts')
					const profile = await getProfile(handle)
					return [
						{
							[EntityMetaKey.Selector]: {
								$actor: {
									handle,
								},
								timestampMs: Date.now(),
							},
							...(profile.followersCount != null && { followersCount: profile.followersCount }),
							...(profile.followsCount != null && { followsCount: profile.followsCount }),
							...(profile.postsCount != null && { postsCount: profile.postsCount }),
						},
					]
				},
			},
		})({
			fields: {
				$$timestamps: (timestamps) => timestamps,
			},
		}),

		defineResolver(Source.Atproto_BskySocial_Xrpc, {
			entityType: EntityType.AtprotoActor,
			resolve: {
				[AtprotoActorSelector.Did]: async ({ did }, context) => {
					const { getAuthorFeed } = await import('$/sources/AtprotoBskySocial/Rest/queries.ts')
					const limit = resolverContextRowLimit(context)
					const { feed } = await getAuthorFeed({
						actor: did,
						limit,
						includePins: true,
					})
					return (
						feed
							.flatMap((feedItem) => {
							if (feedItem.post.author.did !== did) return []
							return [{ [EntityMetaKey.Selector]: { uri: feedItem.post.uri } }]
							})
					)
				},
				[AtprotoActorSelector.Handle]: async ({ handle }, context) => {
					const { getAuthorFeed } = await import('$/sources/AtprotoBskySocial/Rest/queries.ts')
					const limit = resolverContextRowLimit(context)
					const { feed } = await getAuthorFeed({
						actor: handle,
						limit,
						includePins: true,
					})
					return (
						feed
							.flatMap((feedItem) => {
							if (feedItem.post.author.handle !== handle) return []
							return [{ [EntityMetaKey.Selector]: { uri: feedItem.post.uri } }]
							})
					)
				},
			},
		})({
			fields: {
				$$posts: (posts) => posts,
			},
		}),

		defineResolver(Source.Atproto_BskySocial_Xrpc, {
			entityType: EntityType.AtprotoPost,
			resolve: {
				[AtprotoPostSelector.Uri]: async (entitySelector) => {
					const { getPosts } = await import('$/sources/AtprotoBskySocial/Rest/queries.ts')
					const postView = (await getPosts([entitySelector.uri])).posts.at(0)
					if (postView == null) throw new Error('Atproto_BskySocial_Xrpc: post not found')
					return [
						{
							[EntityMetaKey.Selector]: {
								$post: entitySelector,
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
		})({
			fields: {
				$$timestamps: (timestamps) => timestamps,
			},
		}),

		defineResolver(Source.Atproto_BskySocial_Xrpc, {
			entityType: EntityType.AtprotoPost,
			resolve: {
				[AtprotoPostSelector.Uri]: async ({ uri }, context) => {
					const { getPostThread } = await import('$/sources/AtprotoBskySocial/Rest/queries.ts')
					const limit = resolverContextRowLimit(context)
					const { thread } = await getPostThread(uri)
					if (thread == null)
						throw new Error(`Atproto_BskySocial_Xrpc: post thread not found for ${uri}`)

					const threadPostUri = optionalNonemptyString(thread.post.uri)
					if (threadPostUri == null)
						throw new Error(`Atproto_BskySocial_Xrpc: post thread not found for ${uri}`)
					const ancestors: { [EntityMetaKey.Selector]: { uri: string } }[] = []
					let parent = thread.parent
					while (parent != null) {
						const parentUri = optionalNonemptyString(parent.post.uri)
						if (parentUri == null) break
						if (parentUri !== uri)
							ancestors.unshift({ [EntityMetaKey.Selector]: { uri: parentUri } })
						parent = parent.parent
					}
					const descendants: { [EntityMetaKey.Selector]: { uri: string } }[] = []
					const walkReplies = (node: NonNullable<typeof thread>) => {
						for (const reply of node.replies ?? []) {
							const replyUri = optionalNonemptyString(reply.post.uri)
							if (replyUri != null && replyUri !== uri)
								descendants.push({ [EntityMetaKey.Selector]: { uri: replyUri } })
							if (replyUri != null) walkReplies(reply)
						}
					}
					walkReplies(thread)
					return [
						...ancestors,
						...descendants,
					].slice(0, limit)
				}
			},
		})({
			fields: {
				$$thread: (thread) => thread,
			},
		}),
	],
}

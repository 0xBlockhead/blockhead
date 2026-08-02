import { resolverContextRowLimit } from '$/resolvers/$resolvers.ts'
import {
	defineResolver,
	type RegisteredSourceResolverModule,
} from '$/resolvers/defineResolver.ts'
import { optionalNonemptyString } from '$/lib/string.ts'
import { optionalTimestampMs } from '$/lib/time.ts'
import { mediaFromUrl } from '$/resolvers/media.ts'
import {
	entityFieldAddressKey,
	EntityMetaKey,
} from '$/schema/$schema.ts'
import { MediaType } from '$/schema/MediaType.ts'
import { EntityType } from '$/schema/EntityType.ts'
import { Source } from '$/sources/Source.ts'
import type { BskyAppViewPostView } from '$/sources/_shared/interfaces/BskyAppViewXrpc/types.ts'

const atprotoPostFieldsFromPostView = (postView: BskyAppViewPostView) => {
	const atprotoRecord = postView.record
	const createdAt = optionalTimestampMs(atprotoRecord.createdAt)
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
		uri: postView.uri,
		$author: { [EntityMetaKey.Selector]: { did: postView.author.did } },
		...(text != null && { text }),
		...(createdAt != null && { createdAt }),
		...(indexedAt != null && { indexedAt }),
		...(atprotoRecord.langs != null && atprotoRecord.langs.length > 0 && { langs: atprotoRecord.langs }),
		...(selfLabelValues != null && selfLabelValues.length > 0 && { selfLabelValues }),
		...(parentUri != null && { $parent: { [EntityMetaKey.Selector]: { uri: parentUri } } }),
		...(rootUri != null && { $root: { [EntityMetaKey.Selector]: { uri: rootUri } } }),
	}
}

const atprotoPostReferenceFromPostView = (postView: BskyAppViewPostView) => {
	const fields = atprotoPostFieldsFromPostView(postView)
	return {
		[EntityMetaKey.Selector]: { uri: postView.uri },
		[EntityMetaKey.Fields]: {
			[entityFieldAddressKey(EntityType.AtprotoPost, [], 'uri')]: fields.uri,
			[entityFieldAddressKey(EntityType.AtprotoPost, [], '$author')]: fields.$author,
			...(fields.text != null && {
				[entityFieldAddressKey(EntityType.AtprotoPost, [], 'text')]: fields.text,
			}),
			...(fields.createdAt != null && {
				[entityFieldAddressKey(EntityType.AtprotoPost, [], 'createdAt')]: fields.createdAt,
			}),
			...(fields.indexedAt != null && {
				[entityFieldAddressKey(EntityType.AtprotoPost, [], 'indexedAt')]: fields.indexedAt,
			}),
			...(fields.langs != null && {
				[entityFieldAddressKey(EntityType.AtprotoPost, [], 'langs')]: fields.langs,
			}),
			...(fields.selfLabelValues != null && {
				[entityFieldAddressKey(EntityType.AtprotoPost, [], 'selfLabelValues')]: fields.selfLabelValues,
			}),
			...(fields.$parent != null && {
				[entityFieldAddressKey(EntityType.AtprotoPost, [], '$parent')]: fields.$parent,
			}),
			...(fields.$root != null && {
				[entityFieldAddressKey(EntityType.AtprotoPost, [], '$root')]: fields.$root,
			}),
		},
	}
}

export default {
	source: Source.Atproto_Xrpc,

	resolvers: [
		defineResolver({
			entityType: EntityType.AtprotoActor,
			resolve: {
				Did: {
					resolve: async ({ did }) => ({
						did,
					}),
				},
			},
		})({
				did: (actor) => actor.did,
			}),

		defineResolver({
			entityType: EntityType.AtprotoActor,
			resolve: {
				Handle: {
					resolve: async ({ handle }) => {
						const { resolveHandle } = await import('$/sources/AtprotoBsky/Rest/queries.ts')
						return {
							did: (await resolveHandle(handle)).did,
							handle,
						}
					},
				},
			},
		})({
				did: (actor) => actor.did,
				handle: (actor) => actor.handle,
			}),

		defineResolver({
			entityType: EntityType.AtprotoPost,
			resolve: {
				Uri: {
					resolve: async ({ uri }) => {
						const { getPosts } = await import('$/sources/AtprotoBsky/Rest/queries.ts')
						const postView = (await getPosts([uri])).posts.at(0)
						if (postView == null) throw new Error('Atproto_Xrpc: post not found')
						return {
							...atprotoPostFieldsFromPostView(postView),
							$$timestamps: [{
								[EntityMetaKey.Selector]: {
									$post: { uri },
									timestampMs: Date.now(),
								},
							}],
						}
					},
				}
			},
		})({
				uri: (post) => post.uri,
				$author: (post) => post.$author,
				text: (post) => post.text,
				createdAt: (post) => post.createdAt,
				indexedAt: (post) => post.indexedAt,
				langs: (post) => post.langs,
				selfLabelValues: (post) => post.selfLabelValues,
				$parent: (post) => post.$parent,
				$root: (post) => post.$root,
				$$timestamps: (post) => post.$$timestamps,
			}),

		defineResolver({
			entityType: EntityType.AtprotoPost_Timestamp,
			resolve: {
				AtprotoPostTimestampMs: {
					resolve: async ({ $post }) => {
						const { getPosts } = await import('$/sources/AtprotoBsky/Rest/queries.ts')
						const postView = (await getPosts([$post.uri])).posts.at(0)
						if (postView == null) throw new Error('Atproto_Xrpc: post not found')
						return {
							...(postView.likeCount != null && { likeCount: postView.likeCount }),
							...(postView.repostCount != null && { repostCount: postView.repostCount }),
							...(postView.replyCount != null && { replyCount: postView.replyCount }),
							...(postView.quoteCount != null && { quoteCount: postView.quoteCount }),
						}
					},
				}
			},
		})({
				likeCount: (timestamp) => timestamp.likeCount,
				repostCount: (timestamp) => timestamp.repostCount,
				replyCount: (timestamp) => timestamp.replyCount,
				quoteCount: (timestamp) => timestamp.quoteCount,
			}),

		defineResolver({
			entityType: EntityType._GlobalAtprotoNetwork,
			resolve: {
				Scope: {
					resolve: async (_entitySelector, context) => {
						const { searchActorsTypeahead } = await import('$/sources/AtprotoBsky/Rest/queries.ts')
						const limit = resolverContextRowLimit(context)
						return (
							((await searchActorsTypeahead({
								limit,
								q: 'bsky',
							})).actors ?? [])
								.flatMap((actor) => {
								const did = optionalNonemptyString(actor.did)
								return did == null ?
									[]
								:
									[{ [EntityMetaKey.Selector]: { did } }]
								})
								.slice(0, limit)
						)
					},
				}
			},
		})({
				$$observedActors: (actors) => actors,
			}),

		defineResolver({
			entityType: EntityType._GlobalAtprotoNetwork,
			resolve: {
				Scope: {
					resolve: async (_entitySelector, context) => {
						const { searchPosts } = await import('$/sources/AtprotoBsky/Rest/queries.ts')
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
					},
				}
			},
		})({
				$$observedPosts: (posts) => posts,
			}),

		defineResolver({
			entityType: EntityType.AtprotoActor,
			resolve: {
				Did: {
					resolve: async ({ did }) => {
						const { getProfile } = await import('$/sources/AtprotoBsky/Rest/queries.ts')
						const profile = await getProfile(did)
						const displayName = optionalNonemptyString(profile.displayName)
						const description = optionalNonemptyString(profile.description)
						const indexedAt = optionalTimestampMs(profile.indexedAt)
						const icon = mediaFromUrl(profile.avatar, MediaType.Image)
						const banner = mediaFromUrl(profile.banner, MediaType.Image)
						return [
							{
								[EntityMetaKey.Selector]: {
									$actor: {
										did,
									},
									timestampMs: Date.now(),
									source: Source.Atproto_Xrpc,
								},
								[EntityMetaKey.Fields]: {
									[entityFieldAddressKey(EntityType.AtprotoActor_Timestamp, [], 'source')]: Source.Atproto_Xrpc,
									[entityFieldAddressKey(EntityType.AtprotoActor_Timestamp, [], 'handle')]: profile.handle,
									...(displayName != null && { [entityFieldAddressKey(EntityType.AtprotoActor_Timestamp, [], 'displayName')]: displayName }),
									...(description != null && { [entityFieldAddressKey(EntityType.AtprotoActor_Timestamp, [], 'description')]: description }),
									...(indexedAt != null && { [entityFieldAddressKey(EntityType.AtprotoActor_Timestamp, [], 'indexedAt')]: indexedAt }),
									...(icon != null && { [entityFieldAddressKey(EntityType.AtprotoActor_Timestamp, [], '$icon')]: icon }),
									...(banner != null && { [entityFieldAddressKey(EntityType.AtprotoActor_Timestamp, [], '$banner')]: banner }),
									...(profile.followersCount != null && { [entityFieldAddressKey(EntityType.AtprotoActor_Timestamp, [], 'followersCount')]: profile.followersCount }),
									...(profile.followsCount != null && { [entityFieldAddressKey(EntityType.AtprotoActor_Timestamp, [], 'followsCount')]: profile.followsCount }),
									...(profile.postsCount != null && { [entityFieldAddressKey(EntityType.AtprotoActor_Timestamp, [], 'postsCount')]: profile.postsCount }),
								},
							},
						]
					},
				},
			},
		})({
				$$timestamps: (timestamps) => timestamps,
			}),

		defineResolver({
			entityType: EntityType.AtprotoActor,
			resolve: {
				Did: {
					resolve: async ({ did }, context) => {
						const { getAuthorFeed } = await import('$/sources/AtprotoBsky/Rest/queries.ts')
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
					return [atprotoPostReferenceFromPostView(feedItem.post)]
								})
						)
					},
				},
			},
		})({
				$$posts: (posts) => posts,
			}),

		defineResolver({
			entityType: EntityType.AtprotoPost,
			resolve: {
				Uri: {
					resolve: async ({ uri }, context) => {
						const { getPostThread } = await import('$/sources/AtprotoBsky/Rest/queries.ts')
						const limit = resolverContextRowLimit(context)
						const { thread } = await getPostThread(uri)
						if (thread == null)
							throw new Error(`Atproto_Xrpc: post thread not found for ${uri}`)

						const threadPostUri = optionalNonemptyString(thread.post.uri)
						if (threadPostUri == null)
							throw new Error(`Atproto_Xrpc: post thread not found for ${uri}`)
						const ancestors: ReturnType<typeof atprotoPostReferenceFromPostView>[] = []
						let parent = thread.parent
						while (parent != null) {
							const parentUri = optionalNonemptyString(parent.post.uri)
							if (parentUri == null) break
							if (parentUri !== uri) {
								ancestors.unshift(atprotoPostReferenceFromPostView(parent.post))
							}
							parent = parent.parent
						}
						const descendants: ReturnType<typeof atprotoPostReferenceFromPostView>[] = []
						const walkReplies = (node: NonNullable<typeof thread>) => {
							for (const reply of node.replies ?? []) {
								const replyUri = optionalNonemptyString(reply.post.uri)
								if (replyUri != null && replyUri !== uri) {
									descendants.push(atprotoPostReferenceFromPostView(reply.post))
								}
								if (replyUri != null) walkReplies(reply)
							}
						}
						walkReplies(thread)
						return [
							...ancestors,
							...descendants,
						].slice(0, limit)
					},
				}
			},
		})({
				$$thread: (thread) => thread,
			}),
	],
} satisfies RegisteredSourceResolverModule

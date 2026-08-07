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
import { firstHttpUrlForBinding } from '$/sources/_runtime/http.ts'
import type { bskyAppViewXrpc } from '$/sources/_shared/interfaces/BskyAppViewXrpc/queries.ts'
import {
	isBskyAppViewThreadViewPost,
	type BskyAppViewPostView,
	type BskyAppViewThreadViewPost,
} from '$/sources/_shared/interfaces/BskyAppViewXrpc/types.ts'


const atprotoPostEngagementFromPostView = (postView: BskyAppViewPostView) => ({
	...(postView.likeCount != null && { likeCount: postView.likeCount }),
	...(postView.repostCount != null && { repostCount: postView.repostCount }),
	...(postView.replyCount != null && { replyCount: postView.replyCount }),
	...(postView.quoteCount != null && { quoteCount: postView.quoteCount }),
	...(postView.bookmarkCount != null && { bookmarkCount: postView.bookmarkCount }),
})

const atprotoPostTipTimestampFromPostView = (postView: BskyAppViewPostView) => {
	const engagement = atprotoPostEngagementFromPostView(postView)
	return {
		[EntityMetaKey.Selector]: {
			$post: { uri: postView.uri },
			timestampMs: Date.now(),
		},
		[EntityMetaKey.Fields]: {
			...(engagement.likeCount != null && {
				[entityFieldAddressKey(EntityType.AtprotoPost_Timestamp, [], 'likeCount')]: engagement.likeCount,
			}),
			...(engagement.repostCount != null && {
				[entityFieldAddressKey(EntityType.AtprotoPost_Timestamp, [], 'repostCount')]: engagement.repostCount,
			}),
			...(engagement.replyCount != null && {
				[entityFieldAddressKey(EntityType.AtprotoPost_Timestamp, [], 'replyCount')]: engagement.replyCount,
			}),
			...(engagement.quoteCount != null && {
				[entityFieldAddressKey(EntityType.AtprotoPost_Timestamp, [], 'quoteCount')]: engagement.quoteCount,
			}),
			...(engagement.bookmarkCount != null && {
				[entityFieldAddressKey(EntityType.AtprotoPost_Timestamp, [], 'bookmarkCount')]: engagement.bookmarkCount,
			}),
		},
	}
}

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
		$$timestamps: [atprotoPostTipTimestampFromPostView(postView)],
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
			[entityFieldAddressKey(EntityType.AtprotoPost, [], '$$timestamps')]: fields.$$timestamps,
		},
	}
}

export const bskyAppViewResolvers = (
	source: Source.Atproto_Xrpc | Source.Atproto_BskySocial_Xrpc,
	loadQueries: () => Promise<ReturnType<typeof bskyAppViewXrpc>>
) => {
	const loadAppViewBinding = async () => {
		const bindings = (
			source === Source.Atproto_Xrpc ?
				(await import('$/sources/AtprotoBsky/bindings.ts')).default
			:
				(await import('$/sources/AtprotoBskySocial/bindings.ts')).default
		)
		const binding = bindings[source]?.[0]
		if (binding == null)
			throw new Error(`${source}: missing AppView binding`)
		return binding
	}

	const atprotoNetworkHubObservation = async () => {
		const [
			{ searchActors, searchPosts },
			binding,
		] = await Promise.all([
			loadQueries(),
			loadAppViewBinding(),
		])
		const [
			actorsResponse,
			postsResponse,
		] = await Promise.all([
			searchActors({
				limit: 25,
				q: 'bsky',
			}),
			searchPosts({
				limit: 25,
				q: 'bsky',
			}),
		])
		return {
			observedActorCount: (actorsResponse.actors ?? []).length,
			observedPostCount: (postsResponse.posts ?? []).length,
			relayHost: new URL(firstHttpUrlForBinding(binding)).host,
			reachable: true as const,
		}
	}

	return {
		source,

		resolvers: [
		defineResolver({
			entityType: EntityType.AtprotoActor,
			resolve: {
				Did: {
					resolve: async ({ did }) => {
						const { getProfile } = await loadQueries()
						const profile = await getProfile(did)
						if (profile.did !== did)
							throw new Error(`${source}: profile did mismatch for ${did}`)
						return {
							did,
							handle: profile.handle,
						}
					},
				},
			},
		})({
				did: (actor) => actor.did,
				handle: (actor) => actor.handle,
			}),

		defineResolver({
			entityType: EntityType.AtprotoActor,
			resolve: {
				Handle: {
					resolve: async ({ handle }) => {
						const { resolveHandle } = await loadQueries()
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
						const { getPosts } = await loadQueries()
						const postView = (await getPosts([uri])).posts.at(0)
						if (postView == null) throw new Error(`${source}: post not found`)
						return atprotoPostFieldsFromPostView(postView)
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
						const { getPosts } = await loadQueries()
						const postView = (await getPosts([$post.uri])).posts.at(0)
						if (postView == null) throw new Error(`${source}: post not found`)
						return atprotoPostEngagementFromPostView(postView)
					},
				}
			},
		})({
				likeCount: (timestamp) => timestamp.likeCount,
				repostCount: (timestamp) => timestamp.repostCount,
				replyCount: (timestamp) => timestamp.replyCount,
				quoteCount: (timestamp) => timestamp.quoteCount,
				bookmarkCount: (timestamp) => timestamp.bookmarkCount,
			}),

		defineResolver({
			entityType: EntityType._GlobalAtprotoNetwork,
			resolve: {
				Scope: {
					resolve: async (_entitySelector, context) => {
						const { searchActors } = await loadQueries()
						const limit = resolverContextRowLimit(context)
						return (
							((await searchActors({
								limit,
								q: 'bsky',
							})).actors ?? [])
								.flatMap((actor) => {
									const did = optionalNonemptyString(actor.did)
									const handle = optionalNonemptyString(actor.handle)
									if (did == null || handle == null)
										return []
									const displayName = optionalNonemptyString(actor.displayName)
									const description = optionalNonemptyString(actor.description)
									const indexedAt = optionalTimestampMs(actor.indexedAt)
									const icon = mediaFromUrl(actor.avatar, MediaType.Image)
									return [{
										[EntityMetaKey.Selector]: { did },
										[EntityMetaKey.Fields]: {
											[entityFieldAddressKey(EntityType.AtprotoActor, [], 'did')]: did,
											[entityFieldAddressKey(EntityType.AtprotoActor, [], 'handle')]: handle,
											[entityFieldAddressKey(EntityType.AtprotoActor, [], '$$timestamps')]: [{
												[EntityMetaKey.Selector]: {
													$actor: { did },
													timestampMs: Date.now(),
													source,
												},
												[EntityMetaKey.Fields]: {
													[entityFieldAddressKey(EntityType.AtprotoActor_Timestamp, [], 'source')]: source,
													[entityFieldAddressKey(EntityType.AtprotoActor_Timestamp, [], 'handle')]: handle,
													...(displayName != null && {
														[entityFieldAddressKey(EntityType.AtprotoActor_Timestamp, [], 'displayName')]: displayName,
													}),
													...(description != null && {
														[entityFieldAddressKey(EntityType.AtprotoActor_Timestamp, [], 'description')]: description,
													}),
													...(indexedAt != null && {
														[entityFieldAddressKey(EntityType.AtprotoActor_Timestamp, [], 'indexedAt')]: indexedAt,
													}),
													...(icon != null && {
														[entityFieldAddressKey(EntityType.AtprotoActor_Timestamp, [], '$icon')]: icon,
													}),
												},
											}],
										},
									}]
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
						const { searchPosts } = await loadQueries()
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
										[atprotoPostReferenceFromPostView(post)]
								})
								.slice(0, limit)
						)
					},
				}
			},
		})({
				$$observedPosts: (posts) => posts,
			}),

		defineResolver({
			entityType: EntityType._GlobalAtprotoNetwork,
			resolve: {
				Scope: {
					resolve: async ({ scope }) => {
						const timestampMs = Date.now()
						const observation = await atprotoNetworkHubObservation()
						return {
							$$timestamps: [{
								[EntityMetaKey.Selector]: {
									$hub: { scope },
									timestampMs,
									source,
								},
								[EntityMetaKey.Fields]: {
									[entityFieldAddressKey(EntityType._GlobalAtprotoNetwork_Timestamp, [], 'source')]: source,
									[entityFieldAddressKey(EntityType._GlobalAtprotoNetwork_Timestamp, [], 'observedActorCount')]: observation.observedActorCount,
									[entityFieldAddressKey(EntityType._GlobalAtprotoNetwork_Timestamp, [], 'observedPostCount')]: observation.observedPostCount,
									[entityFieldAddressKey(EntityType._GlobalAtprotoNetwork_Timestamp, [], 'relayHost')]: observation.relayHost,
									[entityFieldAddressKey(EntityType._GlobalAtprotoNetwork_Timestamp, [], 'reachable')]: observation.reachable,
								},
							}],
						}
					},
				}
			},
		})({
				$$timestamps: {
					select: (hub) => hub.$$timestamps,
					resolveCount: (hub) => hub.$$timestamps.length,
				},
			}),

		defineResolver({
			entityType: EntityType._GlobalAtprotoNetwork_Timestamp,
			resolve: {
				HubTimestampMsSource: {
					resolve: async ({
						$hub,
						timestampMs,
						source: observationSource,
					}) => {
						if (observationSource !== source)
							throw new Error(`${source}: unsupported source ${observationSource}`)

						return {
							$hub,
							timestampMs,
							source,
							...(await atprotoNetworkHubObservation()),
						}
					},
				},
			},
		})({
				$hub: (observation) => observation.$hub,
				timestampMs: (observation) => observation.timestampMs,
				source: (observation) => observation.source,
				observedActorCount: (observation) => observation.observedActorCount,
				observedPostCount: (observation) => observation.observedPostCount,
				relayHost: (observation) => observation.relayHost,
				reachable: (observation) => observation.reachable,
			}),

		defineResolver({
			entityType: EntityType.AtprotoActor,
			resolve: {
				Did: {
					resolve: async ({ did }) => {
						const { getProfile } = await loadQueries()
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
									source,
								},
								[EntityMetaKey.Fields]: {
									[entityFieldAddressKey(EntityType.AtprotoActor_Timestamp, [], 'source')]: source,
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
						const { getAuthorFeed } = await loadQueries()
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
						const { getPostThread } = await loadQueries()
						const limit = resolverContextRowLimit(context)
						const { thread } = await getPostThread(uri)
						if (thread == null || !isBskyAppViewThreadViewPost(thread))
							throw new Error(`${source}: post thread not found for ${uri}`)

						const ancestors: ReturnType<typeof atprotoPostReferenceFromPostView>[] = []
						let parent = thread.parent
						while (parent != null) {
							if (!isBskyAppViewThreadViewPost(parent)) break
							if (parent.post.uri !== uri)
								ancestors.unshift(atprotoPostReferenceFromPostView(parent.post))
							parent = parent.parent
						}
						const descendants: ReturnType<typeof atprotoPostReferenceFromPostView>[] = []
						const walkReplies = (node: BskyAppViewThreadViewPost) => {
							for (const reply of node.replies ?? []) {
								if (!isBskyAppViewThreadViewPost(reply)) continue
								if (reply.post.uri !== uri)
									descendants.push(atprotoPostReferenceFromPostView(reply.post))
								walkReplies(reply)
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
}

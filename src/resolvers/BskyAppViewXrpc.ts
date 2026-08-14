import { resolverContextRowLimit, resolverSourceBinding } from '$/resolvers/$resolvers.ts'
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
import {
	isBskyAppViewThreadViewPost,
	type BskyAppViewProfile,
	type BskyAppViewPostView,
	type BskyAppViewThreadViewPost,
} from '$/sources/_shared/interfaces/BskyAppViewXrpc/types.ts'

const atprotoActorReference = (
	profile: BskyAppViewProfile,
	source: Source.Atproto_Xrpc | Source.Atproto_BskySocial_Xrpc
) => {
	const displayName = optionalNonemptyString(profile.displayName)
	const description = optionalNonemptyString(profile.description)
	const indexedAt = optionalTimestampMs(profile.indexedAt)
	const icon = mediaFromUrl(profile.avatar, MediaType.Image)
	const banner = mediaFromUrl(profile.banner, MediaType.Image)
	return {
		[EntityMetaKey.Selector]: { did: profile.did },
		[EntityMetaKey.Fields]: {
			[entityFieldAddressKey(EntityType.AtprotoActor, [], 'did')]: profile.did,
			[entityFieldAddressKey(EntityType.AtprotoActor, [], 'handle')]: profile.handle,
			[entityFieldAddressKey(EntityType.AtprotoActor, [], '$$timestamps')]: [{
				[EntityMetaKey.Selector]: {
					$actor: { did: profile.did },
					timestampMs: Date.now(),
					source,
				},
				[EntityMetaKey.Fields]: {
					[entityFieldAddressKey(EntityType.AtprotoActor_Timestamp, [], 'source')]: source,
					[entityFieldAddressKey(EntityType.AtprotoActor_Timestamp, [], 'handle')]: profile.handle,
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
					...(banner != null && {
						[entityFieldAddressKey(EntityType.AtprotoActor_Timestamp, [], '$banner')]: banner,
					}),
					...(profile.followersCount != null && {
						[entityFieldAddressKey(EntityType.AtprotoActor_Timestamp, [], 'followersCount')]: profile.followersCount,
					}),
					...(profile.followsCount != null && {
						[entityFieldAddressKey(EntityType.AtprotoActor_Timestamp, [], 'followsCount')]: profile.followsCount,
					}),
					...(profile.postsCount != null && {
						[entityFieldAddressKey(EntityType.AtprotoActor_Timestamp, [], 'postsCount')]: profile.postsCount,
					}),
				},
			}],
		},
	}
}

const atprotoActorListContinuation = ({
	operation,
	target,
	nextCursor,
}: {
	operation: string
	target: string
	nextCursor?: string
}) => (
	nextCursor == null || nextCursor === '' ?
		{
			operation,
			target,
			terminal: true,
		}
	:
		{
			operation,
			target,
			terminal: false,
			token: nextCursor,
		}
)


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
	loadQueries: () => Promise<typeof import('$/sources/AtprotoBsky/Rest/queries.ts')>
) => {
	const loadBindingAndQueries = async (context: Parameters<typeof resolverSourceBinding>[0]) => Promise.all([
		resolverSourceBinding(context),
		loadQueries(),
	])

	const atprotoNetworkHubObservation = async (context: Parameters<typeof resolverSourceBinding>[0]) => {
		const [
			binding,
			{ searchActors, searchPosts },
		] = await loadBindingAndQueries(context)
		const [
			actorsResponse,
			postsResponse,
		] = await Promise.all([
			searchActors(binding, {
				limit: 25,
				q: 'bsky',
			}),
			searchPosts(binding, {
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

	const atprotoPostSnapshotFromPostView = async (
		binding: Awaited<ReturnType<typeof resolverSourceBinding>>,
		getPosts: Awaited<ReturnType<typeof loadQueries>>['getPosts'],
		postView: BskyAppViewPostView
	) => {
		const fields = atprotoPostFieldsFromPostView(postView)
		const parentUri = optionalNonemptyString(postView.record.reply?.parent?.uri)
		const rootUri = optionalNonemptyString(postView.record.reply?.root?.uri)
		const relatedUris = [...new Set(
			[parentUri, rootUri].filter((uri) => uri != null)
		)]
		if (relatedUris.length === 0)
			return fields

		const relatedPostsByUri = new Map(
			(await getPosts(binding, relatedUris)).posts.map((relatedPost) => [
				relatedPost.uri,
				relatedPost,
			] as const)
		)
		const parentPost = parentUri == null ? undefined : relatedPostsByUri.get(parentUri)
		const rootPost = rootUri == null ? undefined : relatedPostsByUri.get(rootUri)
		return {
			...fields,
			...(parentPost != null && {
				$parent: atprotoPostReferenceFromPostView(parentPost),
			}),
			...(rootPost != null && {
				$root: atprotoPostReferenceFromPostView(rootPost),
			}),
		}
	}

	return {
		source,

		resolvers: [
		defineResolver({
			entityType: EntityType.AtprotoActor,
			resolve: {
				Did: {
					resolve: async ({ did }, context) => {
						const [binding, { getProfile }] = await loadBindingAndQueries(context)
						const profile = await getProfile(binding, did)
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
				Did: {
					resolve: async ({ did }, context) => {
						const [binding, { getFollowers }] = await loadBindingAndQueries(context)
						const response = await getFollowers(binding, {
							actor: did,
							limit: resolverContextRowLimit(context),
							cursor: context.providerContinuationToken,
						})
						if (response.subject.did !== did)
							throw new Error(`${source}: followers response subject mismatch for ${did}`)
						return {
							rows: response.actors.map((actor) => atprotoActorReference(actor, source)),
							nextCursor: response.cursor,
						}
					},
				},
			},
		})({
				$$followers: {
					select: (snapshot) => snapshot.rows,
					continuation: (snapshot) => atprotoActorListContinuation({
						operation: 'followers',
						target: 'appview',
						nextCursor: snapshot.nextCursor,
					}),
				},
			}),

		defineResolver({
			entityType: EntityType.AtprotoActor,
			resolve: {
				Did: {
					resolve: async ({ did }, context) => {
						const [binding, { getFollows }] = await loadBindingAndQueries(context)
						const response = await getFollows(binding, {
							actor: did,
							limit: resolverContextRowLimit(context),
							cursor: context.providerContinuationToken,
						})
						if (response.subject.did !== did)
							throw new Error(`${source}: follows response subject mismatch for ${did}`)
						return {
							rows: response.actors.map((actor) => atprotoActorReference(actor, source)),
							nextCursor: response.cursor,
						}
					},
				},
			},
		})({
				$$follows: {
					select: (snapshot) => snapshot.rows,
					continuation: (snapshot) => atprotoActorListContinuation({
						operation: 'follows',
						target: 'appview',
						nextCursor: snapshot.nextCursor,
					}),
				},
			}),

		defineResolver({
			entityType: EntityType.AtprotoActor,
			resolve: {
				Handle: {
					resolve: async ({ handle }, context) => {
						const [binding, { resolveHandle }] = await loadBindingAndQueries(context)
						return {
							did: (await resolveHandle(binding, handle)).did,
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
					resolve: async ({ uri }, context) => {
						const [binding, { getLikes }] = await loadBindingAndQueries(context)
						const response = await getLikes(binding, {
							uri,
							limit: resolverContextRowLimit(context),
							cursor: context.providerContinuationToken,
						})
						if (response.uri !== uri)
							throw new Error(`${source}: likes response subject mismatch for ${uri}`)
						return {
							rows: response.likes.map(({ actor }) => atprotoActorReference(actor, source)),
							nextCursor: response.cursor,
						}
					},
				},
			},
		})({
				$$likers: {
					select: (snapshot) => snapshot.rows,
					continuation: (snapshot) => atprotoActorListContinuation({
						operation: 'likes',
						target: 'appview',
						nextCursor: snapshot.nextCursor,
					}),
				},
			}),

		defineResolver({
			entityType: EntityType.AtprotoPost,
			resolve: {
				Uri: {
					resolve: async ({ uri }, context) => {
						const [binding, { getRepostedBy }] = await loadBindingAndQueries(context)
						const response = await getRepostedBy(binding, {
							uri,
							limit: resolverContextRowLimit(context),
							cursor: context.providerContinuationToken,
						})
						if (response.uri !== uri)
							throw new Error(`${source}: reposted-by response subject mismatch for ${uri}`)
						return {
							rows: response.repostedBy.map((actor) => atprotoActorReference(actor, source)),
							nextCursor: response.cursor,
						}
					},
				},
			},
		})({
				$$reposters: {
					select: (snapshot) => snapshot.rows,
					continuation: (snapshot) => atprotoActorListContinuation({
						operation: 'reposted-by',
						target: 'appview',
						nextCursor: snapshot.nextCursor,
					}),
				},
			}),

		defineResolver({
			entityType: EntityType.AtprotoPost,
			resolve: {
				Uri: {
					resolve: async ({ uri }, context) => {
						const [binding, { getPosts }] = await loadBindingAndQueries(context)
						const postView = (await getPosts(binding, [uri])).posts.find((post) => post.uri === uri)
						if (postView == null) throw new Error(`${source}: post not found`)
						return atprotoPostSnapshotFromPostView(binding, getPosts, postView)
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
			entityType: EntityType._GlobalAtprotoNetwork,
			resolve: {
				Scope: {
					resolve: async (_entitySelector, context) => {
						const [binding, { searchActors }] = await loadBindingAndQueries(context)
						const limit = resolverContextRowLimit(context)
						const response = await searchActors(binding, {
							limit,
							q: 'bsky',
							cursor: context.providerContinuationToken,
						})
						return {
							rows: (response.actors ?? [])
								.flatMap((actor) => (
									optionalNonemptyString(actor.did) == null
									|| optionalNonemptyString(actor.handle) == null ?
										[]
									:
										[atprotoActorReference(actor, source)]
								))
								.slice(0, limit),
							nextCursor: response.cursor,
						}
					},
				}
			},
		})({
				$$observedActors: {
					select: (snapshot) => snapshot.rows,
					continuation: (snapshot) => (
						snapshot.nextCursor == null || snapshot.nextCursor === '' ?
							{
								operation: 'search-actors',
								target: 'appview',
								terminal: true,
							}
						:
							{
								operation: 'search-actors',
								target: 'appview',
								terminal: false,
								token: snapshot.nextCursor,
							}
					),
				},
			}),

		defineResolver({
			entityType: EntityType._GlobalAtprotoNetwork,
			resolve: {
				Scope: {
					resolve: async (_entitySelector, context) => {
						const [binding, { searchPosts }] = await loadBindingAndQueries(context)
						const limit = resolverContextRowLimit(context)
						const response = await searchPosts(binding, {
							limit,
							q: 'bsky',
							cursor: context.providerContinuationToken,
						})
						return {
							rows: (response.posts ?? [])
								.flatMap((post) => {
									const uri = optionalNonemptyString(post.uri)
									return uri == null ?
										[]
									:
										[atprotoPostReferenceFromPostView(post)]
								})
								.slice(0, limit),
							nextCursor: response.cursor,
						}
					},
				}
			},
		})({
				$$observedPosts: {
					select: (snapshot) => snapshot.rows,
					continuation: (snapshot) => (
						snapshot.nextCursor == null || snapshot.nextCursor === '' ?
							{
								operation: 'search-posts',
								target: 'appview',
								terminal: true,
							}
						:
							{
								operation: 'search-posts',
								target: 'appview',
								terminal: false,
								token: snapshot.nextCursor,
							}
					),
				},
			}),

		defineResolver({
			entityType: EntityType._GlobalAtprotoNetwork,
			resolve: {
				Scope: {
					resolve: async ({ scope }, context) => {
						const timestampMs = Date.now()
						const observation = await atprotoNetworkHubObservation(context)
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
			entityType: EntityType.AtprotoActor,
			resolve: {
				Did: {
					resolve: async ({ did }, context) => {
						const [binding, { getProfile }] = await loadBindingAndQueries(context)
						const profile = await getProfile(binding, did)
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
						const [binding, { getAuthorFeed }] = await loadBindingAndQueries(context)
						const limit = resolverContextRowLimit(context)
						const response = await getAuthorFeed(binding, {
							actor: did,
							limit,
							cursor: context.providerContinuationToken,
							includePins: true,
						})
						return {
							rows: response.feed
								.flatMap((feedItem) => {
									if (feedItem.post.author.did !== did) return []
									return [atprotoPostReferenceFromPostView(feedItem.post)]
								}),
							nextCursor: response.cursor,
						}
					},
				},
			},
		})({
				$$posts: {
					select: (snapshot) => snapshot.rows,
					continuation: (snapshot) => (
						snapshot.nextCursor == null || snapshot.nextCursor === '' ?
							{
								operation: 'author-feed',
								target: 'appview',
								terminal: true,
							}
						:
							{
								operation: 'author-feed',
								target: 'appview',
								terminal: false,
								token: snapshot.nextCursor,
							}
					),
				},
			}),

		defineResolver({
			entityType: EntityType.AtprotoPost,
			resolve: {
				Uri: {
					resolve: async ({ uri }, context) => {
						const [binding, { getPostThread }] = await loadBindingAndQueries(context)
						const limit = resolverContextRowLimit(context)
						const { thread } = await getPostThread(binding, uri)
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

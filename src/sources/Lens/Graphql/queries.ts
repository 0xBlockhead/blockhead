import type { VariablesOf } from 'gql.tada'

import {
	graphql,
	queryLens,
} from '$/sources/Lens/Graphql/client.ts'

type LensPageSize = 'TEN' | 'FIFTY'
type LensPageInfo = {
	prev?: string | null
	next?: string | null
}

const queryLensPages = async <_Item>(
	limit: number,
	loadPage: (
		pageSize: LensPageSize,
		cursor?: string
	) => Promise<{
		items: readonly _Item[]
		pageInfo: LensPageInfo
	}>,
	itemKey: (item: _Item) => string
) => {
	if (!Number.isSafeInteger(limit) || limit < 0)
		throw new Error('Lens_Graphql: page limit must be a nonnegative safe integer')

	const itemByKey = new Map<string, _Item>()
	const seenCursors = new Set<string>()
	let cursor: string | undefined
	let pageInfo: LensPageInfo = {}
	let nonProgressPageCount = 0
	while (itemByKey.size < limit) {
		const previousItemCount = itemByKey.size
		const page = await loadPage(limit - itemByKey.size > 10 ? 'FIFTY' : 'TEN', cursor)
		pageInfo = page.pageInfo
		for (const item of page.items)
			if (itemByKey.size < limit)
				itemByKey.set(itemKey(item), item)
		nonProgressPageCount = itemByKey.size === previousItemCount ? nonProgressPageCount + 1 : 0

		if (
			page.items.length === 0
			|| pageInfo.next == null
			|| pageInfo.next === ''
			|| nonProgressPageCount >= 2
			|| seenCursors.has(pageInfo.next)
		)
			break

		seenCursors.add(pageInfo.next)
		cursor = pageInfo.next
	}

	return {
		items: [...itemByKey.values()],
		pageInfo,
	}
}

const LensUsername = graphql(`
	fragment LensUsername on Username @_unmask {
		id
		value
		namespace
		localName
		linkedTo
		ownedBy
		timestamp
	}
`)

const LensAccount = graphql(`
	fragment LensAccount on Account @_unmask {
		address
		owner
		createdAt
		score
		username {
			...LensUsername
		}
		metadata {
			name
			bio
			picture
		}
	}
`, [LensUsername])

const LensFeed = graphql(`
	fragment LensFeed on Feed @_unmask {
		address
		owner
		createdAt
		metadata {
			name
			description
		}
		rules {
			required {
				id
				type
				address
				executesOn
			}
			anyOf {
				id
				type
				address
				executesOn
			}
		}
	}
`)

const LensUsernameNamespace = graphql(`
	fragment LensUsernameNamespace on UsernameNamespace @_unmask {
		address
		namespace
		owner
		tokenName
		tokenSymbol
		createdAt
		metadata {
			description
		}
		stats {
			totalUsernames
		}
		rules {
			required {
				id
				type
				address
				executesOn
			}
			anyOf {
				id
				type
				address
				executesOn
			}
		}
	}
`)

const LensPostMetadataContent = graphql(`
	fragment LensPostMetadataContent on PostMetadata @_unmask {
		__typename
		... on TextOnlyMetadata {
			content
		}
		... on ArticleMetadata {
			content
		}
		... on AudioMetadata {
			content
		}
		... on ImageMetadata {
			content
		}
		... on VideoMetadata {
			content
		}
		... on LinkMetadata {
			content
		}
		... on EmbedMetadata {
			content
		}
		... on EventMetadata {
			content
		}
		... on LivestreamMetadata {
			content
		}
		... on CheckingInMetadata {
			content
		}
		... on MintMetadata {
			content
		}
		... on SpaceMetadata {
			content
		}
		... on StoryMetadata {
			content
		}
		... on ThreeDMetadata {
			content
		}
		... on TransactionMetadata {
			content
		}
	}
`)

const LensPostCard = graphql(`
	fragment LensPostCard on Post @_unmask {
		slug
		timestamp
		isDeleted
		author {
			address
			createdAt
			username {
				localName
			}
			metadata {
				name
			}
		}
		metadata {
			...LensPostMetadataContent
		}
		contentUri
		commentOn {
			slug
		}
		feed {
			address
			metadata {
				name
				description
			}
		}
	}
`, [LensPostMetadataContent])

const LensRepostCard = graphql(`
	fragment LensRepostCard on Repost @_unmask {
		slug
		timestamp
		isDeleted
		author {
			address
			createdAt
			username {
				localName
			}
			metadata {
				name
			}
		}
		repostOf {
			slug
		}
	}
`)

const LensPostDetail = graphql(`
	fragment LensPostDetail on Post @_unmask {
		slug
		timestamp
		isEdited
		isDeleted
		author {
			address
		}
		commentOn {
			slug
		}
		quoteOf {
			slug
		}
		root {
			slug
		}
		stats {
			comments
			reposts
			quotes
			bookmarks
			collects
			reactions
		}
		metadata {
			...LensPostMetadataContent
		}
		contentUri
		feed {
			address
			metadata {
				name
				description
			}
		}
	}
`, [LensPostMetadataContent])

const LensRepostDetail = graphql(`
	fragment LensRepostDetail on Repost @_unmask {
		slug
		timestamp
		isDeleted
		author {
			address
		}
		repostOf {
			slug
		}
	}
`)

const LensAccountDocument = graphql(`
	query LensAccount(
		$request: AccountRequest!
	) {
		account(
			request: $request
		) {
			...LensAccount
		}
	}
`, [LensAccount])

const LensAccountStatsDocument = graphql(`
	query LensAccountStats(
		$address: EvmAddress!
	) {
		accountStats(
			request: {
				account: $address
			}
		) {
			graphFollowStats {
				followers
				following
			}
		}
	}
`)

const LensPostDocument = graphql(`
	query LensPost(
		$post: PostId!
	) {
		post(
			request: {
				post: $post
			}
		) {
			__typename
			... on Post {
				...LensPostDetail
			}
			... on Repost {
				...LensRepostDetail
			}
		}
	}
`, [
	LensPostDetail,
	LensRepostDetail,
])

const LensPostsByAuthorDocument = graphql(`
	query LensPostsByAuthor(
		$address: EvmAddress!
		$pageSize: PageSize!
		$cursor: Cursor
	) {
		posts(
			request: {
				pageSize: $pageSize
				cursor: $cursor
				filter: {
					authors: [$address]
				}
			}
		) {
			items {
				__typename
				... on Post {
					...LensPostCard
				}
				... on Repost {
					...LensRepostCard
				}
			}
			pageInfo {
				prev
				next
			}
		}
	}
`, [
	LensPostCard,
	LensRepostCard,
])

const LensPostCommentsDocument = graphql(`
	query LensPostComments(
		$post: PostId!
		$pageSize: PageSize!
		$cursor: Cursor
	) {
		postReferences(
			request: {
				referencedPost: $post
				referenceTypes: [COMMENT_ON]
				visibilityFilter: VISIBLE
				relevancyFilter: ALL
				pageSize: $pageSize
				cursor: $cursor
			}
		) {
			items {
				__typename
				... on Post {
					...LensPostCard
				}
				... on Repost {
					...LensRepostCard
				}
			}
			pageInfo {
				prev
				next
			}
		}
	}
`, [
	LensPostCard,
	LensRepostCard,
])

const LensLatestPostsDocument = graphql(`
	query LensLatestPosts(
		$pageSize: PageSize!
		$cursor: Cursor
	) {
		posts(
			request: {
				pageSize: $pageSize
				cursor: $cursor
			}
		) {
			items {
				__typename
				... on Post {
					...LensPostCard
				}
				... on Repost {
					...LensRepostCard
				}
			}
			pageInfo {
				prev
				next
			}
		}
	}
`, [
	LensPostCard,
	LensRepostCard,
])

const LensFeedPostsDocument = graphql(`
	query LensFeedPosts(
		$feed: EvmAddress!
		$pageSize: PageSize!
		$cursor: Cursor
	) {
		posts(
			request: {
				pageSize: $pageSize
				cursor: $cursor
				filter: {
					feeds: [{ feed: $feed }]
				}
			}
		) {
			items {
				__typename
				... on Post {
					...LensPostCard
				}
				... on Repost {
					...LensRepostCard
				}
			}
			pageInfo {
				prev
				next
			}
		}
	}
`, [
	LensPostCard,
	LensRepostCard,
])

const LensAccountsDocument = graphql(`
	query LensAccounts(
		$pageSize: PageSize!
		$cursor: Cursor
	) {
		accounts(
			request: {
				pageSize: $pageSize
				cursor: $cursor
			}
		) {
			items {
				...LensAccount
			}
			pageInfo {
				prev
				next
			}
		}
	}
`, [LensAccount])

const LensFeedDocument = graphql(`
	query LensFeed(
		$address: EvmAddress!
	) {
		feed(
			request: {
				feed: $address
			}
		) {
			...LensFeed
		}
	}
`, [LensFeed])

const LensFeedsDocument = graphql(`
	query LensFeeds(
		$pageSize: PageSize!
		$cursor: Cursor
	) {
		feeds(
			request: {
				pageSize: $pageSize
				cursor: $cursor
			}
		) {
			items {
				...LensFeed
			}
			pageInfo {
				prev
				next
			}
		}
	}
`, [LensFeed])

const LensUsernameDocument = graphql(`
	query LensUsername(
		$request: UsernameRequest!
	) {
		username(
			request: $request
		) {
			...LensUsername
		}
	}
`, [LensUsername])

const LensUsernamesDocument = graphql(`
	query LensUsernames(
		$owner: EvmAddress
		$linkedTo: EvmAddress
		$namespace: EvmAddress
		$localNameQuery: String
		$pageSize: PageSize!
		$cursor: Cursor
	) {
		usernames(
			request: {
				filter: {
					owner: $owner
					linkedTo: $linkedTo
					namespace: $namespace
					localNameQuery: $localNameQuery
				}
				pageSize: $pageSize
				cursor: $cursor
			}
		) {
			items {
				...LensUsername
			}
			pageInfo {
				prev
				next
			}
		}
	}
`, [LensUsername])

const LensNamespaceDocument = graphql(`
	query LensNamespace(
		$address: EvmAddress!
	) {
		namespace(
			request: {
				namespace: $address
			}
		) {
			...LensUsernameNamespace
		}
	}
`, [LensUsernameNamespace])

const LensNamespacesDocument = graphql(`
	query LensNamespaces(
		$pageSize: PageSize!
		$cursor: Cursor
	) {
		namespaces(
			request: {
				pageSize: $pageSize
				cursor: $cursor
			}
		) {
			items {
				...LensUsernameNamespace
			}
			pageInfo {
				prev
				next
			}
		}
	}
`, [LensUsernameNamespace])

export const queryAccount = async (
	request: VariablesOf<typeof LensAccountDocument>['request']
) => queryLens(
	LensAccountDocument,
	{ request }
)

export const queryAccountStats = async (
	address: `0x${string}`
) => {
	return queryLens(
		LensAccountStatsDocument,
		{ address }
	)
}

export const queryPost = async (
	postId: string
) => {
	if (postId.trim() === '')
		throw new Error('Lens_Graphql: post identity must not be empty')

	const response = await queryLens(
		LensPostDocument,
		{
			post: postId,
		}
	)
	if (response.post != null && response.post.slug !== postId)
		throw new Error('Lens_Graphql: post response does not match request')

	return response
}

export const queryPostsByAuthor = async (
	address: `0x${string}`,
	limit: number | LensPageSize = 10
) => ({
	posts: await queryLensPages(
		limit === 'TEN' ? 10 : limit === 'FIFTY' ? 50 : limit,
		async (pageSize, cursor) => (
			(await queryLens(
				LensPostsByAuthorDocument,
				{
					address,
					pageSize,
					cursor,
				}
			)).posts
		),
		(post) => post.slug
	),
})

export const queryLatestPosts = async (
	limit: number | LensPageSize = 10
) => ({
	posts: await queryLensPages(
		limit === 'TEN' ? 10 : limit === 'FIFTY' ? 50 : limit,
		async (pageSize, cursor) => (
			(await queryLens(
				LensLatestPostsDocument,
				{
					pageSize,
					cursor,
				}
			)).posts
		),
		(post) => post.slug
	),
})

export const queryPostComments = async (
	postId: string,
	limit: number | LensPageSize = 10
) => ({
	postReferences: await queryLensPages(
		limit === 'TEN' ? 10 : limit === 'FIFTY' ? 50 : limit,
		async (pageSize, cursor) => (
			(await queryLens(
				LensPostCommentsDocument,
				{
					post: postId,
					pageSize,
					cursor,
				}
			)).postReferences
		),
		(post) => post.slug
	),
})

export const queryAccounts = async (
	limit = 10
) => ({
	accounts: await queryLensPages(
		limit,
		async (pageSize, cursor) => (
			(await queryLens(
				LensAccountsDocument,
				{
					pageSize,
					cursor,
				}
			)).accounts
		),
		(account) => account.address
	),
})

export const queryFeed = async (
	address: `0x${string}`
) => {
	return queryLens(
		LensFeedDocument,
		{ address }
	)
}

export const queryFeedPosts = async (
	address: `0x${string}`,
	limit = 10
) => {
	return {
		posts: await queryLensPages(
			limit,
			async (pageSize, cursor) => (
				(await queryLens(
					LensFeedPostsDocument,
					{
						feed: address,
						pageSize,
						cursor,
					}
				)).posts
			),
			(post) => post.slug
		),
	}
}

export const queryFeeds = async (
	limit = 10
) => ({
	feeds: await queryLensPages(
		limit,
		async (pageSize, cursor) => (
			(await queryLens(
				LensFeedsDocument,
				{
					pageSize,
					cursor,
				}
			)).feeds
		),
		(feed) => feed.address
	),
})

export const queryUsername = async (
	request: VariablesOf<typeof LensUsernameDocument>['request']
) => queryLens(
	LensUsernameDocument,
	{ request }
)

export const queryUsernames = async (
	limit = 10,
	filter: {
		owner?: `0x${string}`
		linkedTo?: `0x${string}`
		namespace?: `0x${string}`
		localNameQuery?: string
	} = {}
) => ({
	usernames: await queryLensPages(
		limit,
		async (pageSize, cursor) => (
			(await queryLens(
				LensUsernamesDocument,
				{
					...filter,
					pageSize,
					cursor,
				}
			)).usernames
		),
		(username) => username.id
	),
})

export const queryNamespace = async (
	address: `0x${string}`
) => {
	return queryLens(
		LensNamespaceDocument,
		{ address }
	)
}

export const queryNamespaces = async (
	limit = 10
) => ({
	namespaces: await queryLensPages(
		limit,
		async (pageSize, cursor) => (
			(await queryLens(
				LensNamespacesDocument,
				{
					pageSize,
					cursor,
				}
			)).namespaces
		),
		(namespace) => namespace.address
	),
})

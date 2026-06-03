import { Source } from '$/sources/$Source.ts'
import type { SourcePublicEnvFor } from '$/sources/index.ts'
import {
	graphql,
	queryLens,
} from '$/sources/Lens/Graphql/client.ts'

const LensPostSlug = graphql(`
	fragment LensPostSlug on Post @_unmask {
		slug
	}
`)

const LensRepostSlug = graphql(`
	fragment LensRepostSlug on Repost @_unmask {
		slug
	}
`)

const LensPostWithAuthor = graphql(`
	fragment LensPostWithAuthor on Post @_unmask {
		slug
		author {
			address
		}
	}
`)

const LensRepostWithAuthor = graphql(`
	fragment LensRepostWithAuthor on Repost @_unmask {
		slug
		author {
			address
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
	}
`)

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
		$address: EvmAddress!
	) {
		account(
			request: {
				address: $address
			}
		) {
			address
			createdAt
			username {
				localName
			}
			metadata {
				name
				bio
				picture
			}
		}
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
	) {
		posts(
			request: {
				pageSize: $pageSize
				filter: {
					authors: [$address]
				}
			}
		) {
			items {
				__typename
				... on Post {
					...LensPostSlug
				}
				... on Repost {
					...LensRepostSlug
				}
			}
		}
	}
`, [
	LensPostSlug,
	LensRepostSlug,
])

const LensPostCommentsDocument = graphql(`
	query LensPostComments(
		$post: PostId!
		$pageSize: PageSize!
	) {
		postReferences(
			request: {
				referencedPost: $post
				referenceTypes: [COMMENT_ON]
				visibilityFilter: VISIBLE
				relevancyFilter: ALL
				pageSize: $pageSize
			}
		) {
			items {
				__typename
				... on Post {
					...LensPostSlug
				}
				... on Repost {
					...LensRepostSlug
				}
			}
		}
	}
`, [
	LensPostSlug,
	LensRepostSlug,
])

const LensLatestPostsDocument = graphql(`
	query LensLatestPosts(
		$pageSize: PageSize!
	) {
		posts(
			request: {
				pageSize: $pageSize
			}
		) {
			items {
				__typename
				... on Post {
					...LensPostWithAuthor
				}
				... on Repost {
					...LensRepostWithAuthor
				}
			}
		}
	}
`, [
	LensPostWithAuthor,
	LensRepostWithAuthor,
])

export const queryAccount = async (
	publicEnv: SourcePublicEnvFor<Source.Lens_Graphql>,
	address: `0x${string}`,
) => (
	queryLens(
		publicEnv,
		LensAccountDocument,
		{
			address,
		},
	)
)

export const queryPost = async (
	publicEnv: SourcePublicEnvFor<Source.Lens_Graphql>,
	postId: string,
) => (
	queryLens(
		publicEnv,
		LensPostDocument,
		{
			post: postId,
		},
	)
)

export const queryPostsByAuthor = async (
	publicEnv: SourcePublicEnvFor<Source.Lens_Graphql>,
	address: `0x${string}`,
	pageSize: 'TEN' | 'FIFTY' = 'TEN',
) => (
	queryLens(
		publicEnv,
		LensPostsByAuthorDocument,
		{
			address,
			pageSize,
		},
	)
)

export const queryLatestPosts = async (
	publicEnv: SourcePublicEnvFor<Source.Lens_Graphql>,
	pageSize: 'TEN' | 'FIFTY' = 'TEN',
) => (
	queryLens(
		publicEnv,
		LensLatestPostsDocument,
		{
			pageSize,
		},
	)
)

export const queryPostComments = async (
	publicEnv: SourcePublicEnvFor<Source.Lens_Graphql>,
	postId: string,
	pageSize: 'TEN' | 'FIFTY' = 'TEN',
) => (
	queryLens(
		publicEnv,
		LensPostCommentsDocument,
		{
			post: postId,
			pageSize,
		},
	)
)

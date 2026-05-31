import { Source } from '$/sources/$Source.ts'
import type { SourcePublicEnvFor } from '$/sources/index.ts'
import { graphql } from '$/sources/Lens/Graphql/client.ts'
import { queryHey } from '$/sources/Hey/Graphql/client.ts'

const HeyPostSlug = graphql(`
	fragment HeyPostSlug on Post @_unmask {
		slug
	}
`)

const HeyRepostSlug = graphql(`
	fragment HeyRepostSlug on Repost @_unmask {
		slug
	}
`)

const HeyPostWithAuthor = graphql(`
	fragment HeyPostWithAuthor on Post @_unmask {
		slug
		author {
			address
		}
	}
`)

const HeyRepostWithAuthor = graphql(`
	fragment HeyRepostWithAuthor on Repost @_unmask {
		slug
		author {
			address
		}
	}
`)

const HeyPostDetail = graphql(`
	fragment HeyPostDetail on Post @_unmask {
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

const HeyRepostDetail = graphql(`
	fragment HeyRepostDetail on Repost @_unmask {
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

const HeyAccountDocument = graphql(`
	query HeyAccount(
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

const HeyPostDocument = graphql(`
	query HeyPost(
		$post: PostId!
	) {
		post(
			request: {
				post: $post
			}
		) {
			__typename
			... on Post {
				...HeyPostDetail
			}
			... on Repost {
				...HeyRepostDetail
			}
		}
	}
`, [
	HeyPostDetail,
	HeyRepostDetail,
])

const HeyPostsByAuthorDocument = graphql(`
	query HeyPostsByAuthor(
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
					...HeyPostSlug
				}
				... on Repost {
					...HeyRepostSlug
				}
			}
		}
	}
`, [
	HeyPostSlug,
	HeyRepostSlug,
])

const HeyPostCommentsDocument = graphql(`
	query HeyPostComments(
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
					...HeyPostSlug
				}
				... on Repost {
					...HeyRepostSlug
				}
			}
		}
	}
`, [
	HeyPostSlug,
	HeyRepostSlug,
])

const HeyLatestPostsDocument = graphql(`
	query HeyLatestPosts(
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
					...HeyPostWithAuthor
				}
				... on Repost {
					...HeyRepostWithAuthor
				}
			}
		}
	}
`, [
	HeyPostWithAuthor,
	HeyRepostWithAuthor,
])

export const heyQueryAccount = async (
	publicEnv: SourcePublicEnvFor<Source.Hey_Graphql>,
	address: `0x${string}`,
) => (
	queryHey(
		publicEnv,
		HeyAccountDocument,
		{
			address,
		},
	)
)

export const heyQueryPost = async (
	publicEnv: SourcePublicEnvFor<Source.Hey_Graphql>,
	postId: string,
) => (
	queryHey(
		publicEnv,
		HeyPostDocument,
		{
			post: postId,
		},
	)
)

export const heyQueryPostsByAuthor = async (
	publicEnv: SourcePublicEnvFor<Source.Hey_Graphql>,
	address: `0x${string}`,
	pageSize: 'TEN' | 'FIFTY' = 'TEN',
) => (
	queryHey(
		publicEnv,
		HeyPostsByAuthorDocument,
		{
			address,
			pageSize,
		},
	)
)

export const heyQueryLatestPosts = async (
	publicEnv: SourcePublicEnvFor<Source.Hey_Graphql>,
	pageSize: 'TEN' | 'FIFTY' = 'TEN',
) => (
	queryHey(
		publicEnv,
		HeyLatestPostsDocument,
		{
			pageSize,
		},
	)
)

export const heyQueryPostComments = async (
	publicEnv: SourcePublicEnvFor<Source.Hey_Graphql>,
	postId: string,
	pageSize: 'TEN' | 'FIFTY' = 'TEN',
) => (
	queryHey(
		publicEnv,
		HeyPostCommentsDocument,
		{
			post: postId,
			pageSize,
		},
	)
)

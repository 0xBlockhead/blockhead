import { Source } from '$/sources/$Source.ts'
import type { SourcePublicEnvFor } from '$/sources/index.ts'
import { graphql, queryLens } from '$/sources/Lens/Graphql/client.ts'

const LensPostSlug = graphql(`
	fragment LensPostSlug on Post @_unmask {
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

const LensPostDetail = graphql(`
	fragment LensPostDetail on Post @_unmask {
		slug
		timestamp
		author {
			address
		}
		commentOn {
			slug
		}
		stats {
			comments
			reposts
			bookmarks
		}
		metadata {
			... on TextOnlyMetadata {
				content
			}
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
			username {
				localName
			}
			metadata {
				name
				bio
				picture
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
		}
	}
`, [
	LensPostDetail,
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
			}
		}
	}
`, [
	LensPostSlug,
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
			}
		}
	}
`, [
	LensPostSlug,
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
			}
		}
	}
`, [
	LensPostWithAuthor,
])

export const lensQueryAccount = async (
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

export const lensQueryPost = async (
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

export const lensQueryPostsByAuthor = async (
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

export const lensQueryLatestPosts = async (
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

export const lensQueryPostComments = async (
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

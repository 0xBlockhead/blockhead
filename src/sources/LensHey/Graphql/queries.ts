import { Source } from '$/sources/$Source.ts'
import type { SourcePublicEnvFor } from '$/sources/index.ts'
import { graphql } from '$/sources/Lens/Graphql/client.ts'
import { queryLensHey } from '$/sources/LensHey/Graphql/client.ts'

const LensHeyPostSlug = graphql(`
	fragment LensHeyPostSlug on Post @_unmask {
		slug
	}
`)

const LensHeyPostWithAuthor = graphql(`
	fragment LensHeyPostWithAuthor on Post @_unmask {
		slug
		author {
			address
		}
	}
`)

const LensHeyPostDetail = graphql(`
	fragment LensHeyPostDetail on Post @_unmask {
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

const LensHeyAccountDocument = graphql(`
	query LensHeyAccount(
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

const LensHeyPostDocument = graphql(`
	query LensHeyPost(
		$post: PostId!
	) {
		post(
			request: {
				post: $post
			}
		) {
			__typename
			... on Post {
				...LensHeyPostDetail
			}
		}
	}
`, [
	LensHeyPostDetail,
])

const LensHeyPostsByAuthorDocument = graphql(`
	query LensHeyPostsByAuthor(
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
					...LensHeyPostSlug
				}
			}
		}
	}
`, [
	LensHeyPostSlug,
])

const LensHeyPostCommentsDocument = graphql(`
	query LensHeyPostComments(
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
					...LensHeyPostSlug
				}
			}
		}
	}
`, [
	LensHeyPostSlug,
])

const LensHeyLatestPostsDocument = graphql(`
	query LensHeyLatestPosts(
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
					...LensHeyPostWithAuthor
				}
			}
		}
	}
`, [
	LensHeyPostWithAuthor,
])

export const lensHeyQueryAccount = async (
	publicEnv: SourcePublicEnvFor<Source.Lens_HeyGraphql>,
	address: `0x${string}`,
) => (
	queryLensHey(
		publicEnv,
		LensHeyAccountDocument,
		{
			address,
		},
	)
)

export const lensHeyQueryPost = async (
	publicEnv: SourcePublicEnvFor<Source.Lens_HeyGraphql>,
	postId: string,
) => (
	queryLensHey(
		publicEnv,
		LensHeyPostDocument,
		{
			post: postId,
		},
	)
)

export const lensHeyQueryPostsByAuthor = async (
	publicEnv: SourcePublicEnvFor<Source.Lens_HeyGraphql>,
	address: `0x${string}`,
	pageSize: 'TEN' | 'FIFTY' = 'TEN',
) => (
	queryLensHey(
		publicEnv,
		LensHeyPostsByAuthorDocument,
		{
			address,
			pageSize,
		},
	)
)

export const lensHeyQueryLatestPosts = async (
	publicEnv: SourcePublicEnvFor<Source.Lens_HeyGraphql>,
	pageSize: 'TEN' | 'FIFTY' = 'TEN',
) => (
	queryLensHey(
		publicEnv,
		LensHeyLatestPostsDocument,
		{
			pageSize,
		},
	)
)

export const lensHeyQueryPostComments = async (
	publicEnv: SourcePublicEnvFor<Source.Lens_HeyGraphql>,
	postId: string,
	pageSize: 'TEN' | 'FIFTY' = 'TEN',
) => (
	queryLensHey(
		publicEnv,
		LensHeyPostCommentsDocument,
		{
			post: postId,
			pageSize,
		},
	)
)

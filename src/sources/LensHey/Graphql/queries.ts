import { lensHeyGraphql } from '$/sources/LensHey/Graphql/client.ts'
import type {
	LensHeyGraphqlAccountQueryData,
	LensHeyGraphqlPostQueryData,
	LensHeyGraphqlPostsQueryData,
} from '$/sources/LensHey/Graphql/types.ts'
import type { SourcePublicEnvFor } from '$/sources/index.ts'
import { Source } from '$/sources/$Source.ts'

const gqlAccount = `
	query LensHeyAccount($address: EvmAddress!) {
		account(request: { address: $address }) {
			address
			username { localName }
			metadata {
				name
				bio
				picture
			}
		}
	}
`

const gqlPost = `
	query LensHeyPost($post: PostId!) {
		post(request: { post: $post }) {
			__typename
			... on Post {
				slug
				timestamp
				author { address }
				commentOn { slug }
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
		}
	}
`

const gqlPostsByAuthor = `
	query LensHeyPostsByAuthor($address: EvmAddress!, $pageSize: PageSize!) {
		posts(request: { pageSize: $pageSize, filter: { authors: [$address] } }) {
			items {
				__typename
				... on Post {
					slug
				}
			}
		}
	}
`

const gqlPostComments = `
	query LensHeyPostComments($post: PostId!, $pageSize: PageSize!) {
		postReferences(request: {
			referencedPost: $post
			referenceTypes: [COMMENT_ON]
			visibilityFilter: VISIBLE
			relevancyFilter: ALL
			pageSize: $pageSize
		}) {
			items {
				__typename
				... on Post {
					slug
				}
			}
		}
	}
`

const gqlLatestPosts = `
	query LensHeyLatestPosts($pageSize: PageSize!) {
		posts(request: { pageSize: $pageSize }) {
			items {
				__typename
				... on Post {
					slug
					author {
						address
					}
				}
			}
		}
	}
`

export const lensHeyQueryAccount = async (
	publicEnv: SourcePublicEnvFor<Source.Lens_HeyGraphql>,
	address: `0x${string}`,
) => (
	lensHeyGraphql<LensHeyGraphqlAccountQueryData>(publicEnv, {
		query: gqlAccount,
		variables: { address },
	})
)

export const lensHeyQueryPost = async (
	publicEnv: SourcePublicEnvFor<Source.Lens_HeyGraphql>,
	postId: string,
) => (
	lensHeyGraphql<LensHeyGraphqlPostQueryData>(publicEnv, {
		query: gqlPost,
		variables: { post: postId },
	})
)

export const lensHeyQueryPostsByAuthor = async (
	publicEnv: SourcePublicEnvFor<Source.Lens_HeyGraphql>,
	address: `0x${string}`,
	pageSize: 'TEN' | 'FIFTY' = 'TEN',
) => (
	lensHeyGraphql<LensHeyGraphqlPostsQueryData>(publicEnv, {
		query: gqlPostsByAuthor,
		variables: { address, pageSize },
	})
)

export const lensHeyQueryLatestPosts = async (
	publicEnv: SourcePublicEnvFor<Source.Lens_HeyGraphql>,
	pageSize: 'TEN' | 'FIFTY' = 'TEN',
) => (
	lensHeyGraphql<LensHeyGraphqlPostsQueryData>(publicEnv, {
		query: gqlLatestPosts,
		variables: { pageSize },
	})
)

export const lensHeyQueryPostComments = async (
	publicEnv: SourcePublicEnvFor<Source.Lens_HeyGraphql>,
	postId: string,
	pageSize: 'TEN' | 'FIFTY' = 'TEN',
) => (
	lensHeyGraphql<{
		postReferences?: {
			items?: {
				__typename?: string
				slug?: string
			}[]
		} | null
	}>(publicEnv, {
		query: gqlPostComments,
		variables: {
			post: postId,
			pageSize,
		},
	})
)

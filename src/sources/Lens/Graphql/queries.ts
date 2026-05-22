import { lensGraphql } from '$/sources/Lens/Graphql/client.ts'
import type {
	LensGraphqlAccountQueryData,
	LensGraphqlPostQueryData,
	LensGraphqlPostsQueryData,
} from '$/sources/Lens/Graphql/types.ts'
import type { SourcePublicEnvFor } from '$/sources/index.ts'
import { Source } from '$/sources/$Source.ts'

const gqlAccount = `
	query LensAccount($address: EvmAddress!) {
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
	query LensPost($post: PostId!) {
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
	query LensPostsByAuthor($address: EvmAddress!, $pageSize: PageSize!) {
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
	query LensPostComments($post: PostId!, $pageSize: PageSize!) {
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
	query LensLatestPosts($pageSize: PageSize!) {
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

export const lensQueryAccount = async (
	publicEnv: SourcePublicEnvFor<Source.Lens_Graphql>,
	address: `0x${string}`,
) => (
	lensGraphql<LensGraphqlAccountQueryData>(publicEnv, {
		query: gqlAccount,
		variables: { address },
	})
)

export const lensQueryPost = async (
	publicEnv: SourcePublicEnvFor<Source.Lens_Graphql>,
	postId: string,
) => (
	lensGraphql<LensGraphqlPostQueryData>(publicEnv, {
		query: gqlPost,
		variables: { post: postId },
	})
)

export const lensQueryPostsByAuthor = async (
	publicEnv: SourcePublicEnvFor<Source.Lens_Graphql>,
	address: `0x${string}`,
	pageSize: 'TEN' | 'FIFTY' = 'TEN',
) => (
	lensGraphql<LensGraphqlPostsQueryData>(publicEnv, {
		query: gqlPostsByAuthor,
		variables: { address, pageSize },
	})
)

export const lensQueryLatestPosts = async (
	publicEnv: SourcePublicEnvFor<Source.Lens_Graphql>,
	pageSize: 'TEN' | 'FIFTY' = 'TEN',
) => (
	lensGraphql<{
		posts?: {
			items?: {
				__typename?: string
				slug?: string
				author?: {
					address?: string
				}
			}[]
		} | null
	}>(publicEnv, {
		query: gqlLatestPosts,
		variables: { pageSize },
	})
)

export const lensQueryPostComments = async (
	publicEnv: SourcePublicEnvFor<Source.Lens_Graphql>,
	postId: string,
	pageSize: 'TEN' | 'FIFTY' = 'TEN',
) => (
	lensGraphql<{
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

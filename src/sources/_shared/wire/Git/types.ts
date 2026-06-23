export type GitRepositoryLocator = {
	url: string
}

export type GitObjectRequest = GitRepositoryLocator & {
	ref: string
	path: string
}

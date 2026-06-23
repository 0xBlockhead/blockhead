export type GithubRepositoryTarget = {
	owner: string
	repo: string
	ref: string
	path: string
}

export type GithubContentsEntry = {
	name: string
	path: string
	sha: string
	type: 'file' | 'dir'
	download_url: string | null
}

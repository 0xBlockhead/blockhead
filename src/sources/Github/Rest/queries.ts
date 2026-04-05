import { githubApiOrigin, githubRawContentOrigin } from '$/sources/Github/Rest/constants.ts'

const encodePathSegments = (pathInRepo: string) => (
	pathInRepo
		.split('/')
		.map((segment) => encodeURIComponent(segment))
		.join('/')
)

export const getGithubRestRepoContentsUrl = ({
	owner,
	repo,
	pathInRepo,
	ref,
}: {
	owner: string
	repo: string
	pathInRepo: string
	ref: string
}) => (
	`${githubApiOrigin}/repos/${encodeURIComponent(owner)}/${encodeURIComponent(repo)}/contents/${encodePathSegments(pathInRepo)}?ref=${encodeURIComponent(ref)}`
)

export const getGithubRawUserContentUrl = ({
	owner,
	repo,
	ref,
	pathInRepo,
}: {
	owner: string
	repo: string
	ref: string
	pathInRepo: string
}) => (
	`${githubRawContentOrigin}/${owner}/${repo}/${ref}/${pathInRepo}`
)

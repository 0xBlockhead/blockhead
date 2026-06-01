import { rawOrigin, restOrigin } from '$/sources/Github/Rest/constants.ts'

const encodePathSegments = (pathInRepo: string) => (
	pathInRepo
		.split('/')
		.map((segment) => encodeURIComponent(segment))
		.join('/')
)

export const getRestRepoContentsUrl = ({
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
	`${restOrigin}/repos/${encodeURIComponent(owner)}/${encodeURIComponent(repo)}/contents/${encodePathSegments(pathInRepo)}?ref=${encodeURIComponent(ref)}`
)

export const getRawUserContentUrl = ({
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
	`${rawOrigin}/${owner}/${repo}/${ref}/${pathInRepo}`
)

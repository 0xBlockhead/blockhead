import { getGithubContents, getGithubRawText, githubContentsUrl, githubRawUrl } from '$/sources/_shared/hosts/Github/Http/client.ts'
import { githubHttpEndpoints } from '$/sources/_shared/hosts/Github/Http/constants.ts'
import type { FilecoinFipsGithubContents } from '$/sources/FilecoinFips/Github/types.ts'

const filecoinFipsGithubRepo = {
	owner: 'filecoin-project',
	repo: 'FIPs',
	path: 'FIPS',
	ref: 'master',
} as const

export const getContentsUrl = () => (
	githubContentsUrl(filecoinFipsGithubRepo)
)

export const getMarkdownUrl = ({ number }: { number: number }) => (
	githubRawUrl({
		...filecoinFipsGithubRepo,
		path: `${filecoinFipsGithubRepo.path}/fip-${number.toString().padStart(4, '0')}.md`,
	})
)

export const getContents = (): Promise<FilecoinFipsGithubContents> => (
	getGithubContents({
		endpoints: githubHttpEndpoints,
		target: filecoinFipsGithubRepo,
	})
)

export const getMarkdownText = ({ number }: { number: number }) => (
	getGithubRawText({
		endpoints: githubHttpEndpoints,
		target: {
			...filecoinFipsGithubRepo,
			path: `${filecoinFipsGithubRepo.path}/fip-${number.toString().padStart(4, '0')}.md`,
		},
	})
)

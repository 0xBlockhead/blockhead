import { getGithubContents, getGithubRawText, githubContentsUrl, githubRawUrl } from '$/sources/_shared/hosts/Github/Http/client.ts'
import { filecoinFipsBindings } from '$/sources/FilecoinFips/bindings.ts'
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
		endpoints: filecoinFipsBindings[0].endpoints,
		target: filecoinFipsGithubRepo,
	}) as Promise<FilecoinFipsGithubContents>
)

export const getMarkdownText = ({ number }: { number: number }) => (
	getGithubRawText({
		endpoints: filecoinFipsBindings[0].endpoints,
		target: {
			...filecoinFipsGithubRepo,
			path: `${filecoinFipsGithubRepo.path}/fip-${number.toString().padStart(4, '0')}.md`,
		},
	})
)

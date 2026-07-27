import { getGithubContents, getGithubRawText, githubContentsUrl, githubRawUrl } from '$/sources/_shared/hosts/Github/Http/client.ts'
import bindings from '$/sources/FilecoinFips/bindings.ts'
import type { FilecoinFipsGithubContents } from '$/sources/FilecoinFips/Github/types.ts'
import { Source } from '$/sources/Source.ts'

const binding = bindings[Source.FilecoinFips_Github]

const filecoinFipsGithubRepo = {
	owner: 'filecoin-project',
	repo: 'FIPs',
	path: 'FIPS',
	ref: 'master',
}

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
		binding,
		target: filecoinFipsGithubRepo,
	})
)

export const getMarkdownText = ({
	number,
}: {
	number: number
}) => (
	getGithubRawText({
		binding,
		target: {
			...filecoinFipsGithubRepo,
			path: `${filecoinFipsGithubRepo.path}/fip-${number.toString().padStart(4, '0')}.md`,
		},
	})
)

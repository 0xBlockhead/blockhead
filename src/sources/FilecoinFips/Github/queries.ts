import { getText, githubHttp } from '$/sources/Github/Rest/client.ts'
import {
	getRawUserContentUrl,
	getRestRepoContentsUrl,
} from '$/sources/Github/Rest/queries.ts'
import { throwHttpError } from '$/lib/http.ts'
import FilecoinFips from '$/sources/FilecoinFips/index.ts'
import type { FilecoinFipsGithubContents } from '$/sources/FilecoinFips/Github/types.ts'

const filecoinFipsGithubRepo = {
	owner: 'filecoin-project',
	repo: 'FIPs',
	path: 'FIPS',
	ref: 'master',
} as const

export const getContentsUrl = () => (
	getRestRepoContentsUrl({
		owner: filecoinFipsGithubRepo.owner,
		repo: filecoinFipsGithubRepo.repo,
		pathInRepo: filecoinFipsGithubRepo.path,
		ref: filecoinFipsGithubRepo.ref,
	})
)

export const getMarkdownUrl = ({ number }: { number: number }) => (
	getRawUserContentUrl({
		owner: filecoinFipsGithubRepo.owner,
		repo: filecoinFipsGithubRepo.repo,
		ref: filecoinFipsGithubRepo.ref,
		pathInRepo: `${filecoinFipsGithubRepo.path}/fip-${number.toString().padStart(4, '0')}.md`,
	})
)

export const getContents = async (): Promise<FilecoinFipsGithubContents> => {
	const response = await githubHttp({
		url: getContentsUrl(),
		origins: FilecoinFips.origins,
	})
	if (!response.ok) await throwHttpError('FilecoinFips GitHub contents', response)
	return response.json<FilecoinFipsGithubContents>()
}

export const getMarkdownText = ({ number }: { number: number }) => (
	getText({
		url: getMarkdownUrl({ number }),
		origins: FilecoinFips.origins,
	})
)

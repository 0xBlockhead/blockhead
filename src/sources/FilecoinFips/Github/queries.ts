import { getText, githubHttp } from '$/sources/Github/Rest/client.ts'
import {
	getGithubRawUserContentUrl,
	getGithubRestRepoContentsUrl,
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

export const getFilecoinFipsGithubContentsUrl = () => (
	getGithubRestRepoContentsUrl({
		owner: filecoinFipsGithubRepo.owner,
		repo: filecoinFipsGithubRepo.repo,
		pathInRepo: filecoinFipsGithubRepo.path,
		ref: filecoinFipsGithubRepo.ref,
	})
)

export const getFilecoinFipMarkdownUrl = ({ number }: { number: number }) => (
	getGithubRawUserContentUrl({
		owner: filecoinFipsGithubRepo.owner,
		repo: filecoinFipsGithubRepo.repo,
		ref: filecoinFipsGithubRepo.ref,
		pathInRepo: `${filecoinFipsGithubRepo.path}/fip-${number.toString().padStart(4, '0')}.md`,
	})
)

export const getFilecoinFipsGithubContents = async (): Promise<FilecoinFipsGithubContents> => {
	const response = await githubHttp({
		url: getFilecoinFipsGithubContentsUrl(),
		origins: FilecoinFips.origins ?? [],
	})
	if (!response.ok) await throwHttpError('FilecoinFips GitHub contents', response)
	return response.json<FilecoinFipsGithubContents>()
}

export const getFilecoinFipMarkdownText = ({ number }: { number: number }) => (
	getText({
		url: getFilecoinFipMarkdownUrl({ number }),
		origins: FilecoinFips.origins ?? [],
	})
)

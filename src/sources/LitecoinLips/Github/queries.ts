import { getText, githubHttp } from '$/sources/Github/Rest/client.ts'
import { throwHttpError } from '$/lib/http.ts'
import {
	getRawUserContentUrl,
	getRestRepoContentsUrl,
} from '$/sources/Github/Rest/queries.ts'
import LitecoinLips from '$/sources/LitecoinLips/index.ts'
import type { LitecoinLipsGithubContents } from '$/sources/LitecoinLips/Github/types.ts'

const litecoinLipsGithubRepo = {
	owner: 'litecoin-project',
	repo: 'lips',
	path: '',
	ref: 'master',
} as const

export const getContents = async (): Promise<LitecoinLipsGithubContents> => {
	const response = await githubHttp({
		url: getRestRepoContentsUrl({
			owner: litecoinLipsGithubRepo.owner,
			repo: litecoinLipsGithubRepo.repo,
			pathInRepo: litecoinLipsGithubRepo.path,
			ref: litecoinLipsGithubRepo.ref,
		}),
		origins: LitecoinLips.origins ?? [],
	})
	if (!response.ok) await throwHttpError('LitecoinLips GitHub contents', response)
	return response.json<LitecoinLipsGithubContents>()
}

export const getMediaWikiText = ({ number }: { number: number }) => (
	getText({
		url: getRawUserContentUrl({
			owner: litecoinLipsGithubRepo.owner,
			repo: litecoinLipsGithubRepo.repo,
			ref: litecoinLipsGithubRepo.ref,
			pathInRepo: `lip-${number.toString().padStart(4, '0')}.mediawiki`,
		}),
		origins: LitecoinLips.origins ?? [],
	})
)

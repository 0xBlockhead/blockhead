import { getText, githubHttp } from '$/sources/Github/Rest/client.ts'
import { throwHttpError } from '$/lib/http.ts'
import {
	getRawUserContentUrl,
	getRestRepoContentsUrl,
} from '$/sources/Github/Rest/queries.ts'
import NearNeps from '$/sources/NearNeps/index.ts'
import type { NearNepsGithubContents } from '$/sources/NearNeps/Github/types.ts'

const nearNepsGithubRepo = {
	owner: 'near',
	repo: 'NEPs',
	path: 'neps',
	ref: 'master',
} as const

export const getContents = async (): Promise<NearNepsGithubContents> => {
	const response = await githubHttp({
		url: getRestRepoContentsUrl({
			owner: nearNepsGithubRepo.owner,
			repo: nearNepsGithubRepo.repo,
			pathInRepo: nearNepsGithubRepo.path,
			ref: nearNepsGithubRepo.ref,
		}),
		origins: NearNeps.origins ?? [],
	})
	if (!response.ok) await throwHttpError('NearNeps GitHub contents', response)
	return response.json<NearNepsGithubContents>()
}

export const getMarkdownText = ({ number }: { number: number }) => (
	getText({
		url: getRawUserContentUrl({
			owner: nearNepsGithubRepo.owner,
			repo: nearNepsGithubRepo.repo,
			ref: nearNepsGithubRepo.ref,
			pathInRepo: `${nearNepsGithubRepo.path}/nep-${number.toString().padStart(4, '0')}.md`,
		}),
		origins: NearNeps.origins ?? [],
	})
)

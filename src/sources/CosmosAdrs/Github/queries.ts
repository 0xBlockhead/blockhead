import { getText, githubHttp } from '$/sources/Github/Rest/client.ts'
import { throwHttpError } from '$/lib/http.ts'
import {
	getRawUserContentUrl,
	getRestRepoContentsUrl,
} from '$/sources/Github/Rest/queries.ts'
import CosmosAdrs from '$/sources/CosmosAdrs/index.ts'
import type { CosmosAdrsGithubContents } from '$/sources/CosmosAdrs/Github/types.ts'

const cosmosAdrsGithubRepo = {
	owner: 'cosmos',
	repo: 'cosmos-sdk',
	path: 'docs/architecture',
	ref: 'main',
} as const

export const getContents = async (): Promise<CosmosAdrsGithubContents> => {
	const response = await githubHttp({
		url: getRestRepoContentsUrl({
			owner: cosmosAdrsGithubRepo.owner,
			repo: cosmosAdrsGithubRepo.repo,
			pathInRepo: cosmosAdrsGithubRepo.path,
			ref: cosmosAdrsGithubRepo.ref,
		}),
		origins: CosmosAdrs.origins ?? [],
	})
	if (!response.ok) await throwHttpError('CosmosAdrs GitHub contents', response)
	return response.json<CosmosAdrsGithubContents>()
}

export const getMarkdownText = ({ number }: { number: number }) => (
	getText({
		url: getRawUserContentUrl({
			owner: cosmosAdrsGithubRepo.owner,
			repo: cosmosAdrsGithubRepo.repo,
			ref: cosmosAdrsGithubRepo.ref,
			pathInRepo: `${cosmosAdrsGithubRepo.path}/adr-${number.toString().padStart(3, '0')}.md`,
		}),
		origins: CosmosAdrs.origins ?? [],
	})
)

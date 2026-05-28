import { getText, githubHttp } from '$/sources/Github/Rest/client.ts'
import { throwHttpError } from '$/lib/http.ts'
import {
	getGithubRawUserContentUrl,
	getGithubRestRepoContentsUrl,
} from '$/sources/Github/Rest/queries.ts'
import CosmosAdrs from '$/sources/CosmosAdrs/index.ts'
import type { CosmosAdrsGithubContents } from '$/sources/CosmosAdrs/Github/types.ts'

const cosmosAdrsGithubRepo = {
	owner: 'cosmos',
	repo: 'cosmos-sdk',
	path: 'docs/architecture',
	ref: 'main',
} as const

export const getCosmosAdrsGithubContents = async (): Promise<CosmosAdrsGithubContents> => {
	const response = await githubHttp({
		url: getGithubRestRepoContentsUrl({
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

export const getCosmosAdrMarkdownText = ({ number }: { number: number }) => (
	getText({
		url: getGithubRawUserContentUrl({
			owner: cosmosAdrsGithubRepo.owner,
			repo: cosmosAdrsGithubRepo.repo,
			ref: cosmosAdrsGithubRepo.ref,
			pathInRepo: `${cosmosAdrsGithubRepo.path}/adr-${number.toString().padStart(3, '0')}.md`,
		}),
		origins: CosmosAdrs.origins ?? [],
	})
)

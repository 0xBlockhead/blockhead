import type { CosmosAdrsGithubContents } from '$/sources/CosmosAdrs/Github/types.ts'
import {
	getGithubContents,
	getGithubRawText,
} from '$/sources/_shared/hosts/Github/Http/client.ts'
import { githubHttpEndpoints } from '$/sources/_shared/hosts/Github/Http/constants.ts'

const cosmosAdrsGithubRepo = {
	owner: 'cosmos',
	repo: 'cosmos-sdk',
	path: 'docs/architecture',
	ref: 'main',
} as const

export const getContents = (): Promise<CosmosAdrsGithubContents> => (
	getGithubContents({
		endpoints: githubHttpEndpoints,
		target: cosmosAdrsGithubRepo,
	})
)

export const getMarkdownText = ({ number }: { number: number }) => (
	getGithubRawText({
		endpoints: githubHttpEndpoints,
		target: {
			...cosmosAdrsGithubRepo,
			path: `${cosmosAdrsGithubRepo.path}/adr-${number.toString().padStart(3, '0')}.md`,
		},
	})
)

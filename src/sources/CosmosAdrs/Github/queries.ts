import { cosmosAdrsBindings } from '$/sources/CosmosAdrs/bindings.ts'
import type { CosmosAdrsGithubContents } from '$/sources/CosmosAdrs/Github/types.ts'
import {
	getGithubContents,
	getGithubRawText,
} from '$/sources/_shared/hosts/Github/Http/client.ts'

const cosmosAdrsGithubRepo = {
	owner: 'cosmos',
	repo: 'cosmos-sdk',
	path: 'docs/architecture',
	ref: 'main',
} as const

export const getContents = (): Promise<CosmosAdrsGithubContents> => (
	getGithubContents({
		endpoints: cosmosAdrsBindings[0].endpoints,
		target: cosmosAdrsGithubRepo,
	}) as Promise<CosmosAdrsGithubContents>
)

export const getMarkdownText = ({ number }: { number: number }) => (
	getGithubRawText({
		endpoints: cosmosAdrsBindings[0].endpoints,
		target: {
			...cosmosAdrsGithubRepo,
			path: `${cosmosAdrsGithubRepo.path}/adr-${number.toString().padStart(3, '0')}.md`,
		},
	})
)

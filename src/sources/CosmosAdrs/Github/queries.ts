import type { CosmosAdrsGithubContents } from '$/sources/CosmosAdrs/Github/types.ts'
import {
	getGithubContents,
	getGithubRawText,
} from '$/sources/_shared/hosts/Github/Http/client.ts'
import bindings from '$/sources/CosmosAdrs/bindings.ts'
import { Source } from '$/sources/Source.ts'

const binding = bindings[Source.CosmosAdrs_Github]

const cosmosAdrsGithubRepo = {
	owner: 'cosmos',
	repo: 'cosmos-sdk',
	path: 'docs/architecture',
	ref: 'main',
}

export const getContents = (): Promise<CosmosAdrsGithubContents> => (
	getGithubContents({
		binding,
		target: cosmosAdrsGithubRepo,
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
			...cosmosAdrsGithubRepo,
			path: `${cosmosAdrsGithubRepo.path}/adr-${number.toString().padStart(3, '0')}.md`,
		},
	})
)

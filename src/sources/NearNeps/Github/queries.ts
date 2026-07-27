import type { NearNepsGithubContents } from '$/sources/NearNeps/Github/types.ts'
import bindings from '$/sources/NearNeps/bindings.ts'
import {
	getGithubContents,
	getGithubRawText,
} from '$/sources/_shared/hosts/Github/Http/client.ts'
import { Source } from '$/sources/Source.ts'

const binding = bindings[Source.NearNeps_Github]

const nearNepsGithubRepo = {
	owner: 'near',
	repo: 'NEPs',
	path: 'neps',
	ref: 'master',
}

export const getContents = (): Promise<NearNepsGithubContents> => (
	getGithubContents({
		binding,
		target: nearNepsGithubRepo,
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
			...nearNepsGithubRepo,
			path: `${nearNepsGithubRepo.path}/nep-${number.toString().padStart(4, '0')}.md`,
		},
	})
)

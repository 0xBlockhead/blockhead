import type { NearNepsGithubContents } from '$/sources/NearNeps/Github/types.ts'
import {
	getGithubContents,
	getGithubRawText,
} from '$/sources/_shared/hosts/Github/Http/client.ts'
import { githubHttpEndpoints } from '$/sources/_shared/hosts/Github/Http/constants.ts'

const nearNepsGithubRepo = {
	owner: 'near',
	repo: 'NEPs',
	path: 'neps',
	ref: 'master',
} as const

export const getContents = (): Promise<NearNepsGithubContents> => (
	getGithubContents({
		endpoints: githubHttpEndpoints,
		target: nearNepsGithubRepo,
	}) as Promise<NearNepsGithubContents>
)

export const getMarkdownText = ({ number }: { number: number }) => (
	getGithubRawText({
		endpoints: githubHttpEndpoints,
		target: {
			...nearNepsGithubRepo,
			path: `${nearNepsGithubRepo.path}/nep-${number.toString().padStart(4, '0')}.md`,
		},
	})
)

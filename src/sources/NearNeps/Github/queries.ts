import { nearNepsBindings } from '$/sources/NearNeps/bindings.ts'
import type { NearNepsGithubContents } from '$/sources/NearNeps/Github/types.ts'
import {
	getGithubContents,
	getGithubRawText,
} from '$/sources/_shared/hosts/Github/Http/client.ts'

const nearNepsGithubRepo = {
	owner: 'near',
	repo: 'NEPs',
	path: 'neps',
	ref: 'master',
} as const

export const getContents = (): Promise<NearNepsGithubContents> => (
	getGithubContents({
		endpoints: nearNepsBindings[0].endpoints,
		target: nearNepsGithubRepo,
	}) as Promise<NearNepsGithubContents>
)

export const getMarkdownText = ({ number }: { number: number }) => (
	getGithubRawText({
		endpoints: nearNepsBindings[0].endpoints,
		target: {
			...nearNepsGithubRepo,
			path: `${nearNepsGithubRepo.path}/nep-${number.toString().padStart(4, '0')}.md`,
		},
	})
)

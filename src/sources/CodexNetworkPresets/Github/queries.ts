import { getGithubContents, getGithubRawText } from '$/sources/_shared/hosts/Github/Http/client.ts'
import { githubHttpEndpoints } from '$/sources/_shared/hosts/Github/Http/constants.ts'

const target = {
	owner: 'codex-storage-network',
	repo: 'codex-network-presets',
	ref: 'master',
	path: '',
} as const

export const getContents = () => (
	getGithubContents({
		endpoints: githubHttpEndpoints,
		target,
	})
)

export const getRawText = (path: string) => (
	getGithubRawText({
		endpoints: githubHttpEndpoints,
		target: {
			...target,
			path,
		},
	})
)

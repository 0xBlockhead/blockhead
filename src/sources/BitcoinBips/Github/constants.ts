import { githubHttpEndpoints } from '$/sources/_shared/hosts/Github/Http/constants.ts'

export const bitcoinBipsGithubEndpoints = githubHttpEndpoints

export const bitcoinBipsGithubRepo = {
	owner: 'bitcoin',
	repo: 'bips',
	path: '',
	ref: 'master',
} as const

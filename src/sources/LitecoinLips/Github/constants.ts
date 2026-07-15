import { githubHttpEndpoints } from '$/sources/_shared/hosts/Github/Http/constants.ts'

export const litecoinLipsGithubEndpoints = githubHttpEndpoints

export const litecoinLipsGithubRepo = {
	owner: 'litecoin-project',
	repo: 'lips',
	path: '',
	ref: 'master',
} as const

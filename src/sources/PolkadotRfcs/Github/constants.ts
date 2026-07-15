import { githubHttpEndpoints } from '$/sources/_shared/hosts/Github/Http/constants.ts'

export const polkadotRfcsGithubEndpoints = githubHttpEndpoints

export const polkadotRfcsGithubRepo = {
	owner: 'polkadot-fellows',
	repo: 'RFCs',
	path: 'text',
	ref: 'main',
} as const

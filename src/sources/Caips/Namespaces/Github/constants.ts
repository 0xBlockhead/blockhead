import { githubHttpEndpoints } from '$/sources/_shared/hosts/Github/Http/constants.ts'

export const caipNamespacesGithubEndpoints = githubHttpEndpoints

export const caipNamespacesGithubRepo = {
	owner: 'ChainAgnostic',
	repo: 'namespaces',
	path: '',
	ref: 'main',
} as const

export const caipNamespacesHumanBaseUrl = 'https://namespaces.chainagnostic.org'

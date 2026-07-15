import { githubHttpEndpoints } from '$/sources/_shared/hosts/Github/Http/constants.ts'

/**
 * GitHub repo + stable human doc base for CAIP numbers.
 * @see https://standards.chainagnostic.org/CAIPs/caip-2
 */
export const caipsGithubEndpoints = githubHttpEndpoints

export const caipsGithubOrigins = caipsGithubEndpoints.map((endpoint) => ({
	origin: endpoint.origin,
	corsEnabled: endpoint.corsEnabled,
}))

export const caipsGithubRepo = {
	owner: 'ChainAgnostic',
	repo: 'CAIPs',
	path: 'CAIPs',
	ref: 'main',
} as const

export const caipOfficialHumanBaseUrl = 'https://standards.chainagnostic.org/CAIPs/caip-'

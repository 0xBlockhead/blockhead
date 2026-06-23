import { SourceEndpointKind } from '$/sources/SourceBinding.ts'

export const githubHttpEndpoints = [
	{
		endpointKind: SourceEndpointKind.HttpUrl,
		locator: 'https://api.github.com',
		origin: 'https://api.github.com',
		corsEnabled: true,
	},
	{
		endpointKind: SourceEndpointKind.HttpUrl,
		locator: 'https://raw.githubusercontent.com',
		origin: 'https://raw.githubusercontent.com',
		corsEnabled: true,
	},
] as const

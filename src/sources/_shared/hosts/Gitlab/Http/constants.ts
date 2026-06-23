import { SourceEndpointKind } from '$/sources/SourceBinding.ts'

export const gitlabHttpEndpoints = [
	{
		endpointKind: SourceEndpointKind.HttpUrl,
		locator: 'https://gitlab.com',
		origin: 'https://gitlab.com',
		corsEnabled: false,
	},
] as const

import { SourceProvider, type SourceProviderDefinition } from '$/sources/$SourceProvider.ts'
import CometBftRest from '$/sources/CometBft/Rest/index.ts'

export default {
	provider: SourceProvider.CometBft,
	label: 'CometBFT',
	origins: [
		{
			origin: 'https://cosmos-rpc.publicnode.com',
			corsEnabled: true,
		},
	],
	sources: [
		CometBftRest,
	],
} as const satisfies SourceProviderDefinition

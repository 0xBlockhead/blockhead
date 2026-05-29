import { SourceProvider, type SourceProviderDefinition } from '$/sources/$SourceProvider.ts'
import BittensorJsonRpc from '$/sources/Bittensor/JsonRpc/index.ts'

export default {
	provider: SourceProvider.Bittensor,
	label: 'Bittensor',
	origins: [
		{
			origin: 'https://entrypoint-finney.opentensor.ai',
			corsEnabled: true,
		},
		{
			origin: 'https://lite.chain.opentensor.ai',
			corsEnabled: true,
		},
	],
	sources: [
		BittensorJsonRpc,
	],
} as const satisfies SourceProviderDefinition

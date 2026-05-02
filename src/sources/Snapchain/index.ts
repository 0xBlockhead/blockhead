
import { type SourceProviderDefinition, SourceProvider } from '$/sources/$SourceProvider.ts'
import { nodeEndpoints } from '$/sources/Snapchain/Rest/constants.ts'
import SnapchainRestSource from '$/sources/Snapchain/Rest/index.ts'

export default {
	provider: SourceProvider.Snapchain,
	label: 'Snapchain',
	origins: nodeEndpoints.map((endpoint) => ({
		origin: new URL(endpoint.url).origin,
		corsEnabled: false,
	})),
	sources: [
		SnapchainRestSource,
	],
} satisfies SourceProviderDefinition

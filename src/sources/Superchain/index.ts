import {
	type SourceProviderDefinition,
	SourceProvider,
} from '$/sources/$SourceProvider.ts'
import {
	origin,
} from '$/sources/Superchain/Github/constants.ts'
import SuperchainGithubSource from '$/sources/Superchain/Github/index.ts'

export default {
	provider: SourceProvider.Superchain,
	label: 'Superchain',
	origins: [
		{
			origin,
			corsEnabled: true,
		},
	],
	sources: [
		SuperchainGithubSource,
	],
} satisfies SourceProviderDefinition

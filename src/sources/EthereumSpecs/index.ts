import {
	type SourceProviderDefinition,
	SourceProvider,
} from '$/sources/$SourceProvider.ts'
import { rawOrigin } from '$/sources/Github/Rest/constants.ts'
import EthereumSpecsGithubSource from '$/sources/EthereumSpecs/Github/index.ts'

export default {
	provider: SourceProvider.EthereumSpecs,
	label: 'Ethereum specs',
	origins: [
		{
			origin: rawOrigin,
			corsEnabled: true,
		},
	],
	sources: [
		EthereumSpecsGithubSource,
	],
} satisfies SourceProviderDefinition

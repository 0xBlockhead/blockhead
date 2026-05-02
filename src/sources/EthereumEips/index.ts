
import { type SourceProviderDefinition, SourceProvider } from '$/sources/$SourceProvider.ts'
import EthereumEipsGithubSource from '$/sources/EthereumEips/Github/index.ts'

export default {
	provider: SourceProvider.EthereumEips,
	label: 'Ethereum Eips',
	sources: [
		EthereumEipsGithubSource,
	],
} satisfies SourceProviderDefinition

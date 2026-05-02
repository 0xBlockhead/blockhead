
import { type SourceProviderDefinition, SourceProvider } from '$/sources/$SourceProvider.ts'
import EnsipsGithubSource from '$/sources/Ensips/Github/index.ts'

export default {
	provider: SourceProvider.Ensips,
	label: 'Ensips',
	sources: [
		EnsipsGithubSource,
	],
} satisfies SourceProviderDefinition

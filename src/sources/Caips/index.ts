
import { type SourceProviderDefinition, SourceProvider } from '$/sources/$SourceProvider.ts'
import CaipsGithubSource from '$/sources/Caips/Github/index.ts'

export default {
	provider: SourceProvider.Caips,
	label: 'Caips',
	sources: [
		CaipsGithubSource,
	],
} satisfies SourceProviderDefinition

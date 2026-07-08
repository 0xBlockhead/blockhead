import { sourceOriginsFromBindings } from '$/sources/$sources.ts'
import { eigenExplorerBindings } from '$/sources/EigenExplorer/bindings.ts'
import { Source } from '$/sources/Source.ts'
import { SourceProvider, type SourceProviderDefinition } from '$/sources/SourceProvider.ts'

const eigenExplorerOrigins = sourceOriginsFromBindings(eigenExplorerBindings)

const eigenExplorerSourceProviderDefinition = {
	provider: SourceProvider.EigenExplorer,
	label: 'EigenExplorer',
	sources: [
		{
			provider: SourceProvider.EigenExplorer,
			source: Source.EigenExplorer_Rest,
			label: 'EigenExplorer REST',
		},
	],
	bindings: eigenExplorerBindings,
	origins: eigenExplorerOrigins,
} satisfies SourceProviderDefinition

export default eigenExplorerSourceProviderDefinition

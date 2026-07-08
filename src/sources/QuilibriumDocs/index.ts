import { sourceOriginsFromBindings } from '$/sources/$sources.ts'
import { quilibriumDocsBindings } from '$/sources/QuilibriumDocs/bindings.ts'
import { Source } from '$/sources/Source.ts'
import { SourceProvider, type SourceProviderDefinition } from '$/sources/SourceProvider.ts'

const quilibriumDocsOrigins = sourceOriginsFromBindings(quilibriumDocsBindings)

const quilibriumDocsSourceProviderDefinition = {
	provider: SourceProvider.QuilibriumDocs,
	label: 'Quilibrium docs',
	sources: [
		{
			provider: SourceProvider.QuilibriumDocs,
			source: Source.QuilibriumDocs_Rest,
			label: 'Quilibrium docs REST',
		},
	],
	bindings: quilibriumDocsBindings,
	origins: quilibriumDocsOrigins,
} satisfies SourceProviderDefinition

export default quilibriumDocsSourceProviderDefinition

import { Source } from '$/sources/Source.ts'
import {
	SourceProvider,
	type SourceProviderDefinition,
} from '$/sources/SourceProvider.ts'
import {
	quilibriumDocsBindings,
	quilibriumDocsEndpoints,
} from '$/sources/QuilibriumDocs/bindings.ts'

export { quilibriumDocsEndpoints }

export default {
	provider: SourceProvider.QuilibriumDocs,
	label: 'Quilibrium docs',
	sources: [
		{
			provider: SourceProvider.QuilibriumDocs,
			source: Source.QuilibriumDocs_Rest,
			label: 'Quilibrium docs',
		},
	],
	bindings: quilibriumDocsBindings,
} satisfies SourceProviderDefinition

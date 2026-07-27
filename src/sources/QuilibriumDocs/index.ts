// Generated from APP.ts. Do not edit by hand.

import bindings from '$/sources/QuilibriumDocs/bindings.ts'
import { Source } from '$/sources/Source.ts'
import { SourceProvider, type SourceProviderDefinition } from '$/sources/SourceProvider.ts'

export default {
	provider: SourceProvider.QuilibriumDocs,
	label: 'Quilibrium docs',
	sources: [
		{
			source: Source.QuilibriumDocs_Rest,
			label: 'Quilibrium docs REST',
		},
	],
	bindings: [bindings[Source.QuilibriumDocs_Rest]],
} satisfies SourceProviderDefinition

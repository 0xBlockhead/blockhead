// Generated from APP.ts.

import bindings from '$/sources/QuilibriumDocs/bindings.ts'
import { Source } from '$/sources/Source.ts'
import { SourceProvider } from '$/sources/SourceProvider.ts'
import type { SourceProviderDefinition } from '$/sources/SourceProviderDefinition.ts'

export default {
	provider: SourceProvider.QuilibriumDocs,
	label: 'Quilibrium docs',
	sources: [
		{
			source: Source.QuilibriumDocs_Rest,
			label: 'Quilibrium docs REST',
		},
	],
	bindings: Object.values(bindings).flat(),
} satisfies SourceProviderDefinition

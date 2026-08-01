// Generated from APP.ts.

import bindings from '$/sources/InternetIdentity/bindings.ts'
import { Source } from '$/sources/Source.ts'
import { SourceProvider } from '$/sources/SourceProvider.ts'
import type { SourceProviderDefinition } from '$/sources/SourceProviderDefinition.ts'

export default {
	provider: SourceProvider.InternetIdentity,
	label: 'Internet Identity',
	sources: [
		{
			source: Source.InternetIdentity_Delegation,
			label: 'Internet Identity delegation',
		},
	],
	bindings: Object.values(bindings).flat(),
} satisfies SourceProviderDefinition

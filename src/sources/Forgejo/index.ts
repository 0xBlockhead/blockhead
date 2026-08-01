// Generated from APP.ts.

import bindings from '$/sources/Forgejo/bindings.ts'
import { Source } from '$/sources/Source.ts'
import { SourceProvider } from '$/sources/SourceProvider.ts'
import type { SourceProviderDefinition } from '$/sources/SourceProviderDefinition.ts'

export default {
	provider: SourceProvider.Forgejo,
	label: 'Forgejo',
	sources: [
		{
			source: Source.Forgejo_Rest,
			label: 'Forgejo REST',
		},
	],
	bindings: Object.values(bindings).flat(),
} satisfies SourceProviderDefinition

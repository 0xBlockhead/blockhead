// Generated from APP.ts.

import { Source } from '$/sources/Source.ts'
import { SourceProvider } from '$/sources/SourceProvider.ts'
import type { SourceProviderDefinition } from '$/sources/SourceProviderDefinition.ts'
import bindings from '$/sources/Sourcify/bindings.ts'

export default {
	provider: SourceProvider.Sourcify,
	label: 'Sourcify',
	sources: [
		{
			source: Source.Sourcify_Rest,
			label: 'Sourcify REST',
		},
	],
	bindings,
} satisfies SourceProviderDefinition<typeof bindings>

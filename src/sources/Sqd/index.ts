// Generated from APP.ts.

import { Source } from '$/sources/Source.ts'
import { SourceProvider } from '$/sources/SourceProvider.ts'
import type { SourceProviderDefinition } from '$/sources/SourceProviderDefinition.ts'
import bindings from '$/sources/Sqd/bindings.ts'

export default {
	provider: SourceProvider.Sqd,
	label: 'SQD',
	sources: [
		{
			source: Source.SqdPortal_RawHttp,
			label: 'SQD Portal',
		},
	],
	bindings: Object.values(bindings).flat(),
} satisfies SourceProviderDefinition<typeof bindings>

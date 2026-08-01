// Generated from APP.ts.

import bindings from '$/sources/Eip8004Scan/bindings.ts'
import { Source } from '$/sources/Source.ts'
import { SourceProvider } from '$/sources/SourceProvider.ts'
import type { SourceProviderDefinition } from '$/sources/SourceProviderDefinition.ts'

export default {
	provider: SourceProvider.Eip8004Scan,
	label: '8004scan',
	sources: [
		{
			source: Source.Eip8004Scan_Rest,
			label: '8004scan REST',
		},
	],
	bindings: Object.values(bindings).flat(),
} satisfies SourceProviderDefinition

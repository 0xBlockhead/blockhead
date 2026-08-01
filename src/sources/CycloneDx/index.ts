// Generated from APP.ts.

import bindings from '$/sources/CycloneDx/bindings.ts'
import { Source } from '$/sources/Source.ts'
import { SourceProvider } from '$/sources/SourceProvider.ts'
import type { SourceProviderDefinition } from '$/sources/SourceProviderDefinition.ts'

export default {
	provider: SourceProvider.CycloneDx,
	label: 'CycloneDX',
	sources: [
		{
			source: Source.CycloneDxDocument_Local,
			label: 'CycloneDX document',
		},
	],
	bindings: Object.values(bindings).flat(),
} satisfies SourceProviderDefinition

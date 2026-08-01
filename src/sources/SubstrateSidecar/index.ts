// Generated from APP.ts.

import { Source } from '$/sources/Source.ts'
import { SourceProvider } from '$/sources/SourceProvider.ts'
import type { SourceProviderDefinition } from '$/sources/SourceProviderDefinition.ts'
import bindings from '$/sources/SubstrateSidecar/bindings.ts'

export default {
	provider: SourceProvider.SubstrateSidecar,
	label: 'Substrate API Sidecar',
	sources: [
		{
			source: Source.SubstrateSidecar_Rest,
			label: 'Substrate API Sidecar REST',
		},
	],
	bindings: Object.values(bindings).flat(),
} satisfies SourceProviderDefinition

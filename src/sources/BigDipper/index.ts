// Generated from APP.ts. Do not edit by hand.

import bindings from '$/sources/BigDipper/bindings.ts'
import { Source } from '$/sources/Source.ts'
import { SourceProvider } from '$/sources/SourceProvider.ts'
import type { SourceProviderDefinition } from '$/sources/SourceProviderDefinition.ts'

export default {
	provider: SourceProvider.BigDipper,
	label: 'Big Dipper',
	sources: [
		{
			source: Source.BigDipper_Rest,
			label: 'Big Dipper REST',
		},
	],
	bindings: Object.values(bindings).flat(),
} satisfies SourceProviderDefinition

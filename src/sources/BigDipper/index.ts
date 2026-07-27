// Generated from APP.ts. Do not edit by hand.

import bindings from '$/sources/BigDipper/bindings.ts'
import { Source } from '$/sources/Source.ts'
import { SourceProvider, type SourceProviderDefinition } from '$/sources/SourceProvider.ts'

export default {
	provider: SourceProvider.BigDipper,
	label: 'Big Dipper',
	sources: [
		{
			source: Source.BigDipper_Rest,
			label: 'Big Dipper REST',
		},
	],
	bindings: [bindings[Source.BigDipper_Rest]],
} satisfies SourceProviderDefinition

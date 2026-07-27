// Generated from APP.ts. Do not edit by hand.

import { Source } from '$/sources/Source.ts'
import { SourceProvider, type SourceProviderDefinition } from '$/sources/SourceProvider.ts'
import bindings from '$/sources/ThreeXpl/bindings.ts'

export default {
	provider: SourceProvider.ThreeXpl,
	label: '3xpl',
	sources: [
		{
			source: Source.ThreeXpl_Rest,
			label: '3xpl REST',
		},
	],
	bindings: [bindings[Source.ThreeXpl_Rest]],
} satisfies SourceProviderDefinition

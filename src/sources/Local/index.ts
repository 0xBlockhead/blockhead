// Generated from APP.ts. Do not edit by hand.

import bindings from '$/sources/Local/bindings.ts'
import { Source } from '$/sources/Source.ts'
import { SourceProvider, type SourceProviderDefinition } from '$/sources/SourceProvider.ts'

export default {
	provider: SourceProvider.Local,
	label: 'Local',
	sources: [
		{
			source: Source.Local_Internal,
			label: 'Local Internal',
		},
	],
	bindings: [bindings[Source.Local_Internal]],
} satisfies SourceProviderDefinition

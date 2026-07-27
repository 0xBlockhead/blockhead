// Generated from APP.ts. Do not edit by hand.

import bindings from '$/sources/Filfox/bindings.ts'
import { Source } from '$/sources/Source.ts'
import { SourceProvider, type SourceProviderDefinition } from '$/sources/SourceProvider.ts'

export default {
	provider: SourceProvider.Filfox,
	label: 'Filfox',
	sources: [
		{
			source: Source.Filfox_Rest,
			label: 'Filfox REST',
		},
	],
	bindings: [bindings[Source.Filfox_Rest]],
} satisfies SourceProviderDefinition

// Generated from APP.ts. Do not edit by hand.

import { Source } from '$/sources/Source.ts'
import { SourceProvider } from '$/sources/SourceProvider.ts'
import type { SourceProviderDefinition } from '$/sources/SourceProviderDefinition.ts'
import bindings from '$/sources/SpaceAndTime/bindings.ts'

export default {
	provider: SourceProvider.SpaceAndTime,
	label: 'Space and Time',
	sources: [
		{
			source: Source.SpaceAndTime_MakeInfinite,
			label: 'Space and Time MakeInfinite',
		},
	],
	bindings: Object.values(bindings).flat(),
} satisfies SourceProviderDefinition

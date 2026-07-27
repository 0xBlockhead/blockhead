// Generated from APP.ts. Do not edit by hand.

import bindings from '$/sources/Allium/bindings.ts'
import { Source } from '$/sources/Source.ts'
import { SourceProvider, type SourceProviderDefinition } from '$/sources/SourceProvider.ts'
import { type as arktype } from 'arktype'

export default {
	provider: SourceProvider.Allium,
	label: 'Allium',
	env: arktype({
		'PUBLIC_ALLIUM_API_KEY': 'string > 0',
	}),
	sources: [
		{
			source: Source.Allium_Rest,
			label: 'Allium REST',
			env: arktype({
				'PUBLIC_ALLIUM_API_KEY': 'string > 0',
			}),
		},
	],
	bindings: [bindings[Source.Allium_Rest]],
} satisfies SourceProviderDefinition

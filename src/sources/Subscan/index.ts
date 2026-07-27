// Generated from APP.ts. Do not edit by hand.

import { Source } from '$/sources/Source.ts'
import { SourceProvider, type SourceProviderDefinition } from '$/sources/SourceProvider.ts'
import bindings from '$/sources/Subscan/bindings.ts'
import { type as arktype } from 'arktype'

export default {
	provider: SourceProvider.Subscan,
	label: 'Subscan',
	env: arktype({
		'PUBLIC_SUBSCAN_API_KEY': 'string',
	}),
	sources: [
		{
			source: Source.Subscan_Rest,
			label: 'Subscan REST',
			env: arktype({
				'PUBLIC_SUBSCAN_API_KEY': 'string',
			}),
		},
	],
	bindings: [bindings[Source.Subscan_Rest]],
} satisfies SourceProviderDefinition

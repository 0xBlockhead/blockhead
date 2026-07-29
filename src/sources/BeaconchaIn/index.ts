// Generated from APP.ts. Do not edit by hand.

import bindings from '$/sources/BeaconchaIn/bindings.ts'
import { Source } from '$/sources/Source.ts'
import { SourceProvider } from '$/sources/SourceProvider.ts'
import type { SourceProviderDefinition } from '$/sources/SourceProviderDefinition.ts'
import { type as arktype } from 'arktype'

export default {
	provider: SourceProvider.BeaconchaIn,
	label: 'Beaconcha.in',
	env: arktype({
		'PUBLIC_BEACONCHAIN_API_KEY': 'string > 0',
	}),
	sources: [
		{
			source: Source.BeaconchaIn_Rest,
			label: 'Beaconcha.in REST',
			env: arktype({
				'PUBLIC_BEACONCHAIN_API_KEY': 'string > 0',
			}),
		},
	],
	bindings: Object.values(bindings).flat(),
} satisfies SourceProviderDefinition

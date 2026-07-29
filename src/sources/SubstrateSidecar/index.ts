// Generated from APP.ts. Do not edit by hand.

import { Source } from '$/sources/Source.ts'
import { SourceProvider } from '$/sources/SourceProvider.ts'
import type { SourceProviderDefinition } from '$/sources/SourceProviderDefinition.ts'
import bindings from '$/sources/SubstrateSidecar/bindings.ts'
import { type as arktype } from 'arktype'

export default {
	provider: SourceProvider.SubstrateSidecar,
	label: 'Substrate API Sidecar',
	env: arktype({
		'[string]': 'string',
	}),
	sources: [
		{
			source: Source.SubstrateSidecar_Rest,
			label: 'Substrate API Sidecar REST',
			env: arktype({
				'[string]': 'string',
			}),
		},
	],
	bindings: Object.values(bindings).flat(),
} satisfies SourceProviderDefinition

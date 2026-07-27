// Generated from APP.ts. Do not edit by hand.

import { Source } from '$/sources/Source.ts'
import { SourceProvider, type SourceProviderDefinition } from '$/sources/SourceProvider.ts'
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
	bindings: [bindings[Source.SubstrateSidecar_Rest]],
} satisfies SourceProviderDefinition

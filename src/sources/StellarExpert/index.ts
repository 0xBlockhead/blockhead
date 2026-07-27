// Generated from APP.ts. Do not edit by hand.

import { Source } from '$/sources/Source.ts'
import { SourceProvider, type SourceProviderDefinition } from '$/sources/SourceProvider.ts'
import bindings from '$/sources/StellarExpert/bindings.ts'

export default {
	provider: SourceProvider.StellarExpert,
	label: 'StellarExpert',
	sources: [
		{
			source: Source.StellarExpert_Rest,
			label: 'StellarExpert REST',
		},
	],
	bindings: [bindings[Source.StellarExpert_Rest]],
} satisfies SourceProviderDefinition

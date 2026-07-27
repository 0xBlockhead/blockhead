// Generated from APP.ts. Do not edit by hand.

import { Source } from '$/sources/Source.ts'
import { SourceProvider, type SourceProviderDefinition } from '$/sources/SourceProvider.ts'
import bindings from '$/sources/StellarToml/bindings.ts'

export default {
	provider: SourceProvider.StellarToml,
	label: 'Stellar TOML',
	sources: [
		{
			source: Source.StellarToml_Rest,
			label: 'Stellar TOML REST',
		},
	],
	bindings: [bindings[Source.StellarToml_Rest]],
} satisfies SourceProviderDefinition

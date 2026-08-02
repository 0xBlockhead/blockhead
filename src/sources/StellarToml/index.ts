// Generated from APP.ts.

import { Source } from '$/sources/Source.ts'
import { SourceProvider } from '$/sources/SourceProvider.ts'
import type { SourceProviderDefinition } from '$/sources/SourceProviderDefinition.ts'
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
	bindings,
} satisfies SourceProviderDefinition<typeof bindings>

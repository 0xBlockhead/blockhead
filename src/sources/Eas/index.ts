// Generated from APP.ts.

import bindings from '$/sources/Eas/bindings.ts'
import { Source } from '$/sources/Source.ts'
import { SourceProvider } from '$/sources/SourceProvider.ts'
import type { SourceProviderDefinition } from '$/sources/SourceProviderDefinition.ts'

export default {
	provider: SourceProvider.Eas,
	label: 'Ethereum Attestation Service',
	sources: [
		{
			source: Source.EasContracts_Evm,
			label: 'EAS contract catalog',
		},
	],
	bindings: Object.values(bindings).flat(),
} satisfies SourceProviderDefinition<typeof bindings>

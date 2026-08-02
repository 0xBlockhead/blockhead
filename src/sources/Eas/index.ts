// Generated from APP.ts.

import bindings from '$/sources/Eas/bindings.ts'
import { Source } from '$/sources/Source.ts'
import { SourceProvider } from '$/sources/SourceProvider.ts'
import type { SourceProviderDefinition } from '$/sources/SourceProviderDefinition.ts'

export default {
	provider: SourceProvider.Eas,
	label: 'Ethereum Attestation Service',
	sources: {
		[Source.EasContracts_Evm]: {
			label: 'EAS contract catalog',
		},
	},
	bindings,
} satisfies SourceProviderDefinition<typeof bindings>

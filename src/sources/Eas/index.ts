// Generated from APP.ts. Do not edit by hand.

import bindings from '$/sources/Eas/bindings.ts'
import { Source } from '$/sources/Source.ts'
import { SourceProvider, type SourceProviderDefinition } from '$/sources/SourceProvider.ts'

export default {
	provider: SourceProvider.Eas,
	label: 'Ethereum Attestation Service',
	sources: [
		{
			source: Source.EasContracts_Evm,
			label: 'EAS contract catalog',
		},
	],
	bindings: [bindings[Source.EasContracts_Evm]],
} satisfies SourceProviderDefinition

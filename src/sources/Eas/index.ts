import { Source } from '$/sources/Source.ts'
import {
	SourceProvider,
	type SourceProviderDefinition,
} from '$/sources/SourceProvider.ts'
import { easBindings } from '$/sources/Eas/bindings.ts'

export default {
	provider: SourceProvider.Eas,
	label: 'Ethereum Attestation Service',
	sources: [
		{
			provider: SourceProvider.Eas,
			source: Source.EasContracts_Evm,
			label: 'EAS contract catalog',
		},
	],
	bindings: easBindings,
} satisfies SourceProviderDefinition

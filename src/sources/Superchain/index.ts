import { Source } from '$/sources/Source.ts'
import {
	SourceProvider,
	type SourceProviderDefinition,
} from '$/sources/SourceProvider.ts'
import { superchainBindings } from '$/sources/Superchain/bindings.ts'

export default {
	provider: SourceProvider.Superchain,
	label: 'Superchain',
	sources: [
		{
			provider: SourceProvider.Superchain,
			source: Source.Superchain_Github,
			label: 'Superchain GitHub',
		},
	],
	bindings: superchainBindings,
} satisfies SourceProviderDefinition

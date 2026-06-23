import { Source } from '$/sources/Source.ts'
import {
	SourceProvider,
	type SourceProviderDefinition,
} from '$/sources/SourceProvider.ts'
import { martianBindings } from '$/sources/Martian/bindings.ts'

export default {
	provider: SourceProvider.Martian,
	label: 'Martian',
	sources: [
		{
			provider: SourceProvider.Martian,
			source: Source.Martian_WalletApi,
			label: 'Martian wallet API',
		},
	],
	bindings: martianBindings,
} satisfies SourceProviderDefinition

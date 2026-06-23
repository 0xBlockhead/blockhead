import { Source } from '$/sources/Source.ts'
import {
	SourceProvider,
	type SourceProviderDefinition,
} from '$/sources/SourceProvider.ts'
import { celeniumBindings } from '$/sources/Celenium/bindings.ts'

export default {
	provider: SourceProvider.Celenium,
	label: 'Celenium',
	sources: [
		{
			provider: SourceProvider.Celenium,
			source: Source.Celenium_Rest,
			label: 'Celenium REST',
		},
	],
	bindings: celeniumBindings,
} satisfies SourceProviderDefinition

import { Source } from '$/sources/Source.ts'
import {
	SourceProvider,
	type SourceProviderDefinition,
} from '$/sources/SourceProvider.ts'
import { avascanBindings } from '$/sources/Avascan/bindings.ts'

export default {
	provider: SourceProvider.Avascan,
	label: 'Avascan',
	sources: [
		{
			provider: SourceProvider.Avascan,
			source: Source.Avascan_Rest,
			label: 'Avascan REST',
		},
	],
	bindings: avascanBindings,
} satisfies SourceProviderDefinition

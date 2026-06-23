import { Source } from '$/sources/Source.ts'
import {
	SourceProvider,
	type SourceProviderDefinition,
} from '$/sources/SourceProvider.ts'
import { localBindings } from '$/sources/Local/bindings.ts'

export default {
	provider: SourceProvider.Local,
	label: 'Local',
	sources: [
		{
			provider: SourceProvider.Local,
			source: Source.Local_Internal,
			label: 'Local Internal',
		},
	],
	bindings: localBindings,
} satisfies SourceProviderDefinition

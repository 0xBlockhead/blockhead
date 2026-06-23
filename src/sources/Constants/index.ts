import { Source } from '$/sources/Source.ts'
import {
	SourceProvider,
	type SourceProviderDefinition,
} from '$/sources/SourceProvider.ts'
import { constantsBindings } from '$/sources/Constants/bindings.ts'

export default {
	provider: SourceProvider._Constants,
	label: 'Constants',
	sources: [
		{
			provider: SourceProvider._Constants,
			source: Source.Constants_Internal,
			label: 'Checked-in constants',
		},
	],
	bindings: constantsBindings,
} satisfies SourceProviderDefinition

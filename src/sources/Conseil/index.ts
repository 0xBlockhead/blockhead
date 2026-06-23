import { Source } from '$/sources/Source.ts'
import {
	SourceProvider,
	type SourceProviderDefinition,
} from '$/sources/SourceProvider.ts'
import { conseilBindings } from '$/sources/Conseil/bindings.ts'

export default {
	provider: SourceProvider.Conseil,
	label: 'Conseil',
	sources: [
		{
			provider: SourceProvider.Conseil,
			source: Source.Conseil_Postgres,
			label: 'Conseil Postgres',
		},
	],
	bindings: conseilBindings,
} satisfies SourceProviderDefinition

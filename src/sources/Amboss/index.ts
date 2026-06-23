import { Source } from '$/sources/Source.ts'
import {
	SourceProvider,
	type SourceProviderDefinition,
} from '$/sources/SourceProvider.ts'
import { ambossBindings } from '$/sources/Amboss/bindings.ts'

export default {
	provider: SourceProvider.Amboss,
	label: 'Amboss',
	sources: [
		{
			provider: SourceProvider.Amboss,
			source: Source.Amboss_Graphql,
			label: 'Amboss Space GraphQL',
		},
	],
	bindings: ambossBindings,
} satisfies SourceProviderDefinition

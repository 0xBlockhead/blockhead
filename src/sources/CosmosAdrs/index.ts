import { Source } from '$/sources/Source.ts'
import {
	SourceProvider,
	type SourceProviderDefinition,
} from '$/sources/SourceProvider.ts'
import { cosmosAdrsBindings } from '$/sources/CosmosAdrs/bindings.ts'

export default {
	provider: SourceProvider.CosmosAdrs,
	label: 'Cosmos ADRs',
	sources: [
		{
			provider: SourceProvider.CosmosAdrs,
			source: Source.CosmosAdrs_Github,
			label: 'Cosmos ADRs GitHub',
		},
	],
	bindings: cosmosAdrsBindings,
} satisfies SourceProviderDefinition

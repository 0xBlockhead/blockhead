import { Source } from '$/sources/Source.ts'
import {
	SourceProvider,
	type SourceProviderDefinition,
} from '$/sources/SourceProvider.ts'
import { arweaveBindings } from '$/sources/Arweave/bindings.ts'

export default {
	provider: SourceProvider.Arweave,
	label: 'Arweave',
	sources: [
		{
			provider: SourceProvider.Arweave,
			source: Source.Arweave_Rest,
			label: 'Arweave Gateway',
		},
		{
			provider: SourceProvider.Arweave,
			source: Source.Arweave_Graphql,
			label: 'Arweave GraphQL',
		},
	],
	bindings: arweaveBindings,
} satisfies SourceProviderDefinition

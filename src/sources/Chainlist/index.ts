
import {
	type SourceProviderDefinition,
	SourceProvider,
} from '$/sources/SourceProvider.ts'
import { origin } from '$/sources/Chainlist/Rest/constants.ts'
import ChainlistRestSource from '$/sources/Chainlist/Rest/index.ts'

export default {
	provider: SourceProvider.Chainlist,
	label: 'Chainlist',
	origins: [
		{
			origin,
			corsEnabled: false,
		},
	],
	sources: [
		ChainlistRestSource,
	],
} satisfies SourceProviderDefinition

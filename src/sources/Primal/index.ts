import {
	type SourceProviderDefinition,
	SourceProvider,
} from '$/sources/$SourceProvider.ts'
import { primalApiOrigins } from '$/sources/Primal/Rest/constants.ts'
import PrimalRestSource from '$/sources/Primal/Rest/index.ts'

export default {
	provider: SourceProvider.Primal,
	label: 'Primal',
	origins: primalApiOrigins,
	sources: [
		PrimalRestSource,
	],
} satisfies SourceProviderDefinition

import { Source } from '$/sources/Source.ts'
import {
	SourceProvider,
	type SourceProviderDefinition,
} from '$/sources/SourceProvider.ts'
import { betterCallDevBindings } from '$/sources/BetterCallDev/bindings.ts'

export default {
	provider: SourceProvider.BetterCallDev,
	label: 'Better Call Dev',
	sources: [
		{
			provider: SourceProvider.BetterCallDev,
			source: Source.BetterCallDev_Rest,
			label: 'Better Call Dev REST',
		},
	],
	bindings: betterCallDevBindings,
} satisfies SourceProviderDefinition

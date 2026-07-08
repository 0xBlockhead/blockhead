import { sourceOriginsFromBindings } from '$/sources/$sources.ts'
import { betterCallDevBindings } from '$/sources/BetterCallDev/bindings.ts'
import { Source } from '$/sources/Source.ts'
import { SourceProvider, type SourceProviderDefinition } from '$/sources/SourceProvider.ts'

const betterCallDevOrigins = sourceOriginsFromBindings(betterCallDevBindings)

const betterCallDevSourceProviderDefinition = {
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
	origins: betterCallDevOrigins,
} satisfies SourceProviderDefinition

export default betterCallDevSourceProviderDefinition

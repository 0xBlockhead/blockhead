import { sourceOriginsFromBindings } from '$/sources/$sources.ts'
import { a2aBindings } from '$/sources/A2a/bindings.ts'
import { Source } from '$/sources/Source.ts'
import { SourceProvider, type SourceProviderDefinition } from '$/sources/SourceProvider.ts'

const a2aOrigins = sourceOriginsFromBindings(a2aBindings)

const a2aSourceProviderDefinition = {
	provider: SourceProvider.A2a,
	label: 'Agent2Agent',
	sources: [
		{
			provider: SourceProvider.A2a,
			source: Source.A2aWellKnown_Http,
			label: 'A2A well-known agent card',
		},
		{
			provider: SourceProvider.A2a,
			source: Source.A2aService_Http,
			label: 'A2A service HTTP',
		},
	],
	bindings: a2aBindings,
	origins: a2aOrigins,
} satisfies SourceProviderDefinition

export default a2aSourceProviderDefinition

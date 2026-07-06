// Generated from APP.ts. Do not edit by hand.

import type { SourceDefinition as SourceDefinitionTemplate } from '$/sources/$sources.ts'
import { Source } from '$/sources/Source.ts'
import { SourceProvider } from '$/sources/SourceProvider.ts'

const pythBenchmarksRestSourceDefinition = {
	provider: SourceProvider.Pyth,
	source: Source.PythBenchmarks_Rest,
	label: 'Pyth benchmarks REST',
} satisfies SourceDefinitionTemplate<SourceProvider, Source>

export default pythBenchmarksRestSourceDefinition

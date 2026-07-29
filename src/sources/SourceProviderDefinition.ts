import type { Type } from 'arktype'
import type {
	SourceDefinition,
	SourceProviderDefinition as SourceProviderDefinitionTemplate,
	SourcePublicEnv,
} from '$/sources/$sources.ts'
import type { Source } from '$/sources/Source.ts'
import type { SourceBinding } from '$/sources/SourceBinding.ts'
import type { SourceProvider } from '$/sources/SourceProvider.ts'

export type SourceOrigin = {
	origin: string
	corsEnabled: boolean
}

export type SourceProviderDefinition = SourceProviderDefinitionTemplate<SourceProvider, Source> & {
	env?: Type<SourcePublicEnv>
	sources: readonly SourceDefinition<Source>[]
	bindings: readonly SourceBinding[]
}

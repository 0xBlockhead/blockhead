import type {
	SourceDefinition,
	SourceProviderDefinition as SourceProviderDefinitionTemplate,
} from '$/sources/$sources.ts'
import type { Source } from '$/sources/Source.ts'
import type { SourceBindingIndex } from '$/sources/SourceBinding.ts'
import type { SourceProvider } from '$/sources/SourceProvider.ts'

export type SourceOrigin = {
	origin: string
	corsEnabled: boolean
}

type SourceFromIndex<
	_Bindings extends SourceBindingIndex,
> = Extract<keyof _Bindings, Source>

export type SourceProviderDefinition<
	_Bindings extends SourceBindingIndex = SourceBindingIndex,
> = (
	Omit<
		SourceProviderDefinitionTemplate<SourceProvider, Source>,
		| 'sources'
		| 'bindings'
	> & {
		sources: readonly SourceDefinition<SourceFromIndex<_Bindings>>[]
		bindings: _Bindings
	}
)

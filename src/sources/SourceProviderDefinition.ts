import type {
	SourceDefinitionIndex,
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

type SourceDefinitionsFromIndex<
	_Bindings extends SourceBindingIndex | undefined,
> = _Bindings extends SourceBindingIndex ?
	SourceDefinitionIndex<SourceFromIndex<_Bindings>>
:
	Partial<SourceDefinitionIndex<Source>>

export type SourceProviderDefinition<
	_Bindings extends SourceBindingIndex | undefined = undefined,
> = (
	Omit<
		SourceProviderDefinitionTemplate<SourceProvider, Source>,
		| 'sources'
		| 'bindings'
	> & {
		sources: SourceDefinitionsFromIndex<_Bindings>
		bindings: _Bindings extends SourceBindingIndex ? _Bindings : SourceBindingIndex
	}
)

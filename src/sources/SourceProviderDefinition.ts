import type {
	SourceDefinition,
	SourceProviderDefinition as SourceProviderDefinitionTemplate,
} from '$/sources/$sources.ts'
import type { Source } from '$/sources/Source.ts'
import type {
	SourceBinding,
	SourceBindingIndex,
} from '$/sources/SourceBinding.ts'
import type { SourceProvider } from '$/sources/SourceProvider.ts'

export type SourceOrigin = {
	origin: string
	corsEnabled: boolean
}

type SourceBindingFromIndex<
	_Bindings extends SourceBindingIndex | undefined,
> = _Bindings extends SourceBindingIndex ?
	(
		| Extract<_Bindings[keyof _Bindings], SourceBinding>
		| Extract<_Bindings[keyof _Bindings], readonly SourceBinding[]>[number]
	)
	:
	SourceBinding

type SourceFromIndex<
	_Bindings extends SourceBindingIndex | undefined,
> = _Bindings extends SourceBindingIndex ?
	SourceBindingFromIndex<_Bindings>['source']
	:
	Source

export type SourceProviderDefinition<
	_Bindings extends SourceBindingIndex | undefined = undefined,
> = (
	Omit<
		SourceProviderDefinitionTemplate<SourceProvider, Source>,
		| 'sources'
		| 'bindings'
	> & {
		sources: readonly SourceDefinition<SourceFromIndex<_Bindings>>[]
		bindings: readonly SourceBindingFromIndex<_Bindings>[]
	}
)

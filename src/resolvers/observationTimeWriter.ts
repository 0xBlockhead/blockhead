import {
	EntityMetaKey,
	type EntityDefinitionForEntityType,
	type EntitySelectorForSelectorName,
	type EntitySelectorName,
	type EntityType,
} from '$/schema/$schema.ts'
import type { RegisteredSchema } from '$/schema/index.ts'
import type { Source } from '$/sources/Source.ts'

export const observationTimeProvenances = [
	'ProviderEvent',
	'ProviderSnapshot',
	'HttpResponse',
	'Ingestion',
	'LocalRefresh',
] as const

export type ObservationTimeProvenance = typeof observationTimeProvenances[number]

type ObservationTimeSelectorName<
	_EntityType extends EntityType<RegisteredSchema>,
> = {
	[_SelectorName in EntitySelectorName<RegisteredSchema, _EntityType>]: (
		'timestampMs' | 'source' extends Extract<
			EntityDefinitionForEntityType<RegisteredSchema, _EntityType>['selectors'][number],
			{ readonly name: _SelectorName }
		>['fields'][number] ?
			_SelectorName
		:
			never
	)
}[EntitySelectorName<RegisteredSchema, _EntityType>]

type ObservationTimeSelector<
	_EntityType extends EntityType<RegisteredSchema>,
	_SelectorName extends EntitySelectorName<RegisteredSchema, _EntityType>,
	_Source extends Source,
> = EntitySelectorForSelectorName<
	RegisteredSchema,
	_EntityType,
	_SelectorName
> & {
	readonly timestampMs: number
	readonly source: _Source
}

export const defineObservationTimeWriter = <
	const _EntityType extends EntityType<RegisteredSchema>,
	const _SelectorName extends EntitySelectorName<RegisteredSchema, _EntityType>,
	const _Source extends Source,
>(registration: {
	readonly entityType: _EntityType
	readonly selectorName: _SelectorName & ObservationTimeSelectorName<_EntityType>
	readonly source: _Source
	readonly provenance: ObservationTimeProvenance
}) => ({
	write: <const _Fields extends object>(
		selector: ObservationTimeSelector<_EntityType, _SelectorName, _Source>,
		fields: _Fields
	) => ({
		[EntityMetaKey.Selector]: selector,
		[EntityMetaKey.Fields]: fields,
	}),
})

import {
	EntityMetaKey,
	type EntitySelectorForSelectorName,
	type EntitySelectorName,
	type EntityType,
} from '$/schema/$schema.ts'
import { schema } from '$/schema/index.ts'
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
	_EntityType extends EntityType<typeof schema>,
> = {
	[_SelectorName in EntitySelectorName<typeof schema, _EntityType>]: (
		EntitySelectorForSelectorName<
			typeof schema,
			_EntityType,
			_SelectorName
		> extends {
			readonly timestampMs: number
			readonly source: Source
		} ?
			_SelectorName
		:
			never
	)
}[EntitySelectorName<typeof schema, _EntityType>]

type ObservationTimeSelector<
	_EntityType extends EntityType<typeof schema>,
	_SelectorName extends ObservationTimeSelectorName<_EntityType>,
	_Source extends Source,
> = EntitySelectorForSelectorName<
	typeof schema,
	_EntityType,
	_SelectorName
> & {
	readonly source: _Source
}

export const defineObservationTimeWriter = <
	const _EntityType extends EntityType<typeof schema>,
	const _SelectorName extends ObservationTimeSelectorName<_EntityType>,
	const _Source extends Source,
>(registration: {
	readonly entityType: _EntityType
	readonly selectorName: _SelectorName
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

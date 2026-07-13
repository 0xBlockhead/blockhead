import type { EntityDefinitionForEntityType, EntityFacetDefinition, EntityFieldName, EntitySelectorForSelectorName, EntitySelectorName, EntityType, Schema } from '$/schema/$schema.ts'
import type { schema } from '$/schema/index.ts'
import type { Source } from '$/sources/Source.ts'
import type { SourcePublicEnv } from '$/sources/$sources.ts'
import type {
	FieldSelector,
	ProjectionFieldSelector,
	ResolveLivePublishers,
	ResolverComparable,
	ResolverContext,
	ResolverValue,
} from '$/resolvers/$resolvers.ts'

export type SourceResolverContext<
	_Source extends Source,
> = Omit<ResolverContext, 'publicEnv'> & {
	readonly publicEnv: SourcePublicEnv
}

type ResolverSnapshotCandidate = ResolverComparable | object

type ResolverSnapshotValue<_Resolve> = Awaited<ReturnType<Extract<_Resolve[keyof _Resolve], (...parameters: never[]) => Promise<ResolverSnapshotCandidate>>>>

type ResolverSnapshot<_Resolve> = (
	[Extract<_Resolve[keyof _Resolve], (...parameters: never[]) => Promise<ResolverSnapshotCandidate>>] extends [never] ?
		ResolverValue
	:
		ResolverSnapshotValue<_Resolve>
)

type ResolveShape<
	_Source extends Source,
	_EntityType extends EntityType<typeof schema>,
> = Partial<{
	readonly [_SelectorName in Extract<EntitySelectorName<typeof schema, _EntityType>, string>]: (
		entitySelector: EntitySelectorForSelectorName<
			typeof schema,
			_EntityType,
			Extract<_SelectorName, EntitySelectorName<typeof schema, _EntityType>>
		>,
		context: SourceResolverContext<_Source>
		) => Promise<ResolverSnapshotCandidate>
}>

type ResolverFields<
	_Source extends Source,
	_EntityType extends EntityType<typeof schema>,
	_Resolve extends ResolveShape<_Source, _EntityType>,
> = Partial<{
	readonly [_FieldName in EntityFieldName<typeof schema, _EntityType>]: FieldSelector<
		typeof schema,
		_EntityType,
		_FieldName,
		ResolverSnapshot<_Resolve>,
		SourceResolverContext<_Source>
	>
}> & ResolverFacetFields<
	_Source,
	_EntityType,
	_Resolve,
	NonNullable<EntityDefinitionForEntityType<typeof schema, _EntityType>['facets']>[number]
>

type ResolverFacetFields<
	_Source extends Source,
	_EntityType extends EntityType<typeof schema>,
	_Resolve extends ResolveShape<_Source, _EntityType>,
	_Facet extends EntityFacetDefinition,
> = string extends _Facet['name'] ? {} : Partial<{
	readonly [_FacetName in _Facet['name']]: ResolverFacetFieldsForDefinition<
		_Source,
		_EntityType,
		_Resolve,
		Extract<_Facet, { readonly name: _FacetName }>
	>
}>

type ResolverFacetFieldsForDefinition<
	_Source extends Source,
	_EntityType extends EntityType<typeof schema>,
	_Resolve extends ResolveShape<_Source, _EntityType>,
	_Facet extends EntityFacetDefinition,
> = Partial<{
	readonly [_FieldName in _Facet['fields'][number]['name']]: ProjectionFieldSelector<
		typeof schema,
		_EntityType,
		Extract<_Facet['fields'][number], { readonly name: _FieldName }>,
		ResolverSnapshot<_Resolve>,
		SourceResolverContext<_Source>
	>
}> & (
	_Facet['facets'] extends readonly EntityFacetDefinition[] ? ResolverFacetFields<_Source, _EntityType, _Resolve, _Facet['facets'][number]> : {}
)

export const defineResolver = <
	const _Source extends Source,
	const _EntityType extends EntityType<typeof schema>,
	const _Resolve extends ResolveShape<_Source, _EntityType>,
>(
	_source: _Source,
	resolver: {
	entityType: _EntityType
	resolve: _Resolve
	resolveLive?: ResolveLivePublishers<typeof schema, _EntityType>
}
) => <const _Fields extends ResolverFields<_Source, _EntityType, _Resolve>>(projections: _Fields) => ({
	...resolver,
	projections,
})

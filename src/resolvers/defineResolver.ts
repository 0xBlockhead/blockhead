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
	ResolverSelectorPattern,
	ResolverValue,
} from '$/resolvers/$resolvers.ts'

export type SourceResolverContext<
	_Source extends Source,
> = Omit<ResolverContext, 'publicEnv'> & {
	readonly publicEnv: SourcePublicEnv
}

type ResolverSnapshotCandidate = ResolverComparable | object

type ResolverResolveFunction<_Resolve> = Extract<
	NonNullable<_Resolve[keyof _Resolve]>,
	{
		readonly resolve: (...parameters: never[]) => Promise<ResolverSnapshotCandidate>
	}
>['resolve']

type ResolverSnapshotValue<_Resolve> = Awaited<ReturnType<ResolverResolveFunction<_Resolve>>>

type ResolverSnapshot<_Resolve> = (
	[ResolverResolveFunction<_Resolve>] extends [never] ?
		ResolverValue
	:
		ResolverSnapshotValue<_Resolve>
)

type ResolveShape<
	_Source extends Source,
	_EntityType extends EntityType<typeof schema>,
> = Partial<{
	readonly [_SelectorName in Extract<EntitySelectorName<typeof schema, _EntityType>, string>]: {
		readonly appliesTo?: readonly [ResolverSelectorPattern<EntitySelectorForSelectorName<
			typeof schema,
			_EntityType,
			Extract<_SelectorName, EntitySelectorName<typeof schema, _EntityType>>
		>>, ...ResolverSelectorPattern<EntitySelectorForSelectorName<
			typeof schema,
			_EntityType,
			Extract<_SelectorName, EntitySelectorName<typeof schema, _EntityType>>
		>>[]]
		readonly resolve: (
			entitySelector: EntitySelectorForSelectorName<
				typeof schema,
				_EntityType,
				Extract<_SelectorName, EntitySelectorName<typeof schema, _EntityType>>
			>,
			context: SourceResolverContext<_Source>
		) => Promise<ResolverSnapshotCandidate>
	}
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

type DefineResolverResult<
	_Source extends Source,
	_EntityType extends EntityType<typeof schema>,
	_Resolve extends ResolveShape<_Source, _EntityType>,
	_Resolver extends {
		entityType: _EntityType
		resolve: _Resolve
	},
> = <const _Fields extends ResolverFields<_Source, _EntityType, _Resolve>>(projections: _Fields) => _Resolver & {
	projections: _Fields
}

export function defineResolver<
	const _Source extends Source,
	const _EntityType extends EntityType<typeof schema>,
	const _Resolve extends ResolveShape<_Source, _EntityType>,
>(
	_source: _Source,
	resolver: {
		entityType: _EntityType
		resolve: _Resolve
	}
): DefineResolverResult<_Source, _EntityType, _Resolve, typeof resolver>

export function defineResolver<
	const _Source extends Source,
	const _EntityType extends EntityType<typeof schema>,
	const _Resolve extends ResolveShape<_Source, _EntityType>,
	const _ResolveLive extends ResolveLivePublishers<typeof schema, _EntityType>,
>(
	_source: _Source,
	resolver: {
		entityType: _EntityType
		resolve: _Resolve
		resolveLive: _ResolveLive
	}
): DefineResolverResult<_Source, _EntityType, _Resolve, typeof resolver>

export function defineResolver(
	_source: Source,
	resolver: {
		entityType: EntityType<typeof schema>
		resolve: object
		resolveLive?: object
	}
) {
	return <const _Fields extends object>(projections: _Fields) => ({
		...resolver,
		projections,
	})
}

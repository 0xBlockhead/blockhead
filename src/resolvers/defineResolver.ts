import type { EntityDefinitionForEntityType, EntityFacetDefinition, EntityFieldName, EntitySelectorForSelectorName, EntitySelectorName, EntityType, Schema } from '$/schema/$schema.ts'
import type { RegisteredSchema } from '$/schema/index.ts'
import type { Source } from '$/sources/Source.ts'
import type {
	FieldSelector,
	ProjectionFieldSelector,
	ResolveLivePublishers,
	ResolverComparable,
	ResolverContext,
	ResolverSelectorPattern,
	ResolverValue,
	SourceResolverModule,
} from '$/resolvers/$resolvers.ts'

export type RegisteredSourceResolverModule<
	_Source extends Source = Source,
> = SourceResolverModule<RegisteredSchema, _Source>

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
	_EntityType extends EntityType<RegisteredSchema>,
> = Partial<{
	readonly [_SelectorName in Extract<EntitySelectorName<RegisteredSchema, _EntityType>, string>]: {
		readonly appliesTo?: readonly [ResolverSelectorPattern<EntitySelectorForSelectorName<
			RegisteredSchema,
			_EntityType,
			Extract<_SelectorName, EntitySelectorName<RegisteredSchema, _EntityType>>
		>>, ...ResolverSelectorPattern<EntitySelectorForSelectorName<
			RegisteredSchema,
			_EntityType,
			Extract<_SelectorName, EntitySelectorName<RegisteredSchema, _EntityType>>
		>>[]]
		readonly resolve: (
			entitySelector: EntitySelectorForSelectorName<
				RegisteredSchema,
				_EntityType,
				Extract<_SelectorName, EntitySelectorName<RegisteredSchema, _EntityType>>
			>,
			context: ResolverContext
		) => Promise<ResolverSnapshotCandidate>
	}
}>

type ExactResolveConstraint<
	_EntityType extends EntityType<RegisteredSchema>,
	_Resolve,
> = Exclude<keyof _Resolve, EntitySelectorName<RegisteredSchema, _EntityType>> extends never ?
	unknown
	:
	{ readonly resolve: never }

type ResolverFields<
	_EntityType extends EntityType<RegisteredSchema>,
	_Resolve extends ResolveShape<_EntityType>,
> = Partial<{
	readonly [_FieldName in EntityFieldName<RegisteredSchema, _EntityType>]: FieldSelector<
		RegisteredSchema,
		_EntityType,
		_FieldName,
		ResolverSnapshot<_Resolve>,
		ResolverContext
	>
}> & ResolverFacetFields<
	_EntityType,
	_Resolve,
	NonNullable<EntityDefinitionForEntityType<RegisteredSchema, _EntityType>['facets']>[number]
>

type ResolverFacetFields<
	_EntityType extends EntityType<RegisteredSchema>,
	_Resolve extends ResolveShape<_EntityType>,
	_Facet extends EntityFacetDefinition,
> = string extends _Facet['name'] ? {} : Partial<{
	readonly [_FacetName in _Facet['name']]: ResolverFacetFieldsForDefinition<
		_EntityType,
		_Resolve,
		Extract<_Facet, { readonly name: _FacetName }>
	>
}>

type ResolverFacetFieldsForDefinition<
	_EntityType extends EntityType<RegisteredSchema>,
	_Resolve extends ResolveShape<_EntityType>,
	_Facet extends EntityFacetDefinition,
> = Partial<{
	readonly [_FieldName in _Facet['fields'][number]['name']]: ProjectionFieldSelector<
		RegisteredSchema,
		_EntityType,
		Extract<_Facet['fields'][number], { readonly name: _FieldName }>,
		ResolverSnapshot<_Resolve>,
		ResolverContext
	>
}> & ResolverFacetFields<
	_EntityType,
	_Resolve,
	NonNullable<_Facet['facets']>[number]
>

type DefineResolverResult<
	_EntityType extends EntityType<RegisteredSchema>,
	_Resolve extends ResolveShape<_EntityType>,
	_Resolver extends {
		entityType: _EntityType
		resolve: _Resolve
	},
> = <const _Fields extends ResolverFields<_EntityType, _Resolve>>(projections: _Fields) => _Resolver & {
	projections: _Fields
}

export function defineResolver<
	const _EntityType extends EntityType<RegisteredSchema>,
	const _Resolve extends ResolveShape<_EntityType>,
>(
	resolver: {
		entityType: _EntityType
		resolve: _Resolve
	} & ExactResolveConstraint<_EntityType, _Resolve>
): DefineResolverResult<_EntityType, _Resolve, typeof resolver>

export function defineResolver<
	const _EntityType extends EntityType<RegisteredSchema>,
	const _Resolve extends ResolveShape<_EntityType>,
	const _ResolveLive extends ResolveLivePublishers<RegisteredSchema, _EntityType>,
>(
	resolver: {
		entityType: _EntityType
		resolve: _Resolve
		resolveLive: _ResolveLive
	} & ExactResolveConstraint<_EntityType, _Resolve>
): DefineResolverResult<_EntityType, _Resolve, typeof resolver>

export function defineResolver(
	resolver: {
		entityType: EntityType<RegisteredSchema>
		resolve: object
		resolveLive?: object
	}
) {
	return <const _Fields extends object>(projections: _Fields) => ({
		...resolver,
		projections,
	})
}

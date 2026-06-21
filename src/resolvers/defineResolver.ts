import type { EntityFieldName, EntitySelectorForSelectorName, EntitySelectorName, EntityType, Schema } from '$/schema/$schema.ts'
import type { schema } from '$/schema/index.ts'
import type { Source } from '$/sources/Source.ts'
import type { SourcePublicEnvFor } from '$/sources/index.ts'
import type {
	FieldSelector,
	ResolveLivePublishers,
	ResolverContext,
	ResolverValue,
} from '$/resolvers/$resolvers.ts'

export type SourceResolverContext<
	_Source extends Source,
> = Omit<ResolverContext, 'publicEnv'> & {
	readonly publicEnv: SourcePublicEnvFor<_Source>
}

type ResolverSnapshotValue<_Resolve> = Awaited<ReturnType<Extract<_Resolve[keyof _Resolve], (...parameters: never[]) => Promise<ResolverValue>>>>

type ResolverSnapshot<_Resolve> = (
	[Extract<_Resolve[keyof _Resolve], (...parameters: never[]) => Promise<ResolverValue>>] extends [never] ?
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
	) => Promise<ResolverValue>
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
}>

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
) => <const _Fields extends ResolverFields<_Source, _EntityType, _Resolve>>(facets: {
	fields: _Fields
}) => ({
	...resolver,
	...facets,
})

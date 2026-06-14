import type { EntityFieldName, EntitySelectorForSelectorName, EntitySelectorName, EntityType, Schema } from '$/schema/$schema.ts'
import type { schema } from '$/schema/index.ts'
import type { Source } from '$/sources/Source.ts'
import type { SourcePublicEnvFor } from '$/sources/index.ts'
import type { SourcePublicEnv } from '$/sources/$sources.ts'
import type {
	FieldSelector,
	ResolveLivePublishers,
	ResolverContext,
	ResolverValue,
} from '$/resolvers/$resolvers.ts'

export type SourceResolverContext<
	_Source extends Source,
> = Omit<ResolverContext, 'publicEnv'> & {
	readonly publicEnv: SourcePublicEnv & SourcePublicEnvFor<_Source>
}

type UnionToIntersection<_Union> = (
	(_Union extends _Union ? (_value: _Union) => void : never) extends (_value: infer _Intersection) => void ?
		_Intersection
	:
		never
)

type ResolverSnapshotValue<_Resolve> = Awaited<ReturnType<Extract<_Resolve[keyof _Resolve], (...parameters: never[]) => Promise<ResolverValue>>>>

type ResolverSnapshot<_Resolve> = (
	[Extract<_Resolve[keyof _Resolve], (...parameters: never[]) => Promise<ResolverValue>>] extends [never] ?
		ResolverValue
	: unknown extends ResolverSnapshotValue<_Resolve> ?
		ResolverValue
	:
		UnionToIntersection<ResolverSnapshotValue<_Resolve>>
)

export const defineResolver = <
	const _Source extends Source,
	const _EntityType extends EntityType<typeof schema>,
	const _Resolve extends Partial<{
		readonly [_SelectorName in Extract<EntitySelectorName<typeof schema, _EntityType>, string>]: (
			entitySelector: EntitySelectorForSelectorName<
				typeof schema,
				_EntityType,
				Extract<_SelectorName, EntitySelectorName<typeof schema, _EntityType>>
			>,
			context: SourceResolverContext<_Source>,
		) => Promise<ResolverValue>
	}>,
>(
	_source: _Source,
	resolver: {
	entityType: _EntityType
	resolve: _Resolve
	resolveLive?: ResolveLivePublishers<typeof schema, _EntityType>
},
) => (facets: {
	fields: Partial<{
		readonly [
			_FieldName in Extract<EntityFieldName<typeof schema, _EntityType>, string>
		]: FieldSelector<typeof schema, _EntityType, _FieldName, ResolverSnapshot<_Resolve>, SourceResolverContext<_Source>>
	}>
}) => ({
	...resolver,
	...facets,
})

import {
	EntityFieldCardinality,
	EntityFieldType,
} from '$/schema/$schema.ts'
import type {
	EntityFieldDefinition,
	EntityFieldDefinitionByName,
	EntityFieldName,
	EntitySelector,
	EntityType,
	Schema,
} from '$/schema/$schema.ts'

/**
 * Parent + list-valued entity field whose listed `entityType` is `_ListedEntity`
 * (same as the list view’s `entityType` on `EntitiesList`).
 */
export type EntityFieldReference<
	_Schema extends Schema,
	_ListedEntity extends EntityType<_Schema>,
> = {
	[_Parent in EntityType<_Schema>]: {
		[_Field in EntityFieldName<_Schema, _Parent>]:
			EntityFieldDefinitionByName<_Schema, _Parent, _Field> extends {
				type: typeof EntityFieldType.EntitiesReference
				cardinality: typeof EntityFieldCardinality.Many | typeof EntityFieldCardinality.ZeroOrMany
				entityType: _ListedEntity
			} ? {
				entityType: _Parent
				selector: EntitySelector<_Schema, _Parent>
				fieldName: _Field
			}
			:
				never
	}[EntityFieldName<_Schema, _Parent>]
}[EntityType<_Schema>]

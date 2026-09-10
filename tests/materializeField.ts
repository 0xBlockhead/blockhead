import {
	materializeResolverOutput,
	ResolverOutputMaterialization,
} from '$/collections/assertLoadedCollectionRows.ts'
import { entityFieldAddressKey, entitySelectorKey } from '$/schema/$schema.ts'
import { entityDefinitionByType, schema, schemaMeta } from '$/schema/index.ts'
import type { EntityType } from '$/schema/EntityType.ts'
import type { Source } from '$/sources/Source.ts'

export const materializeField = <_Value>(
	entityType: EntityType,
	parentSelector: object,
	fieldName: string,
	value: _Value,
	source: Source
) => {
	const entityDefinition = entityDefinitionByType[entityType]
	const fieldDefinition = schemaMeta.entityFieldDefinitionByEntityTypePathAndName[entityType]?.[
		entityFieldAddressKey(entityType, [], fieldName)
	]
	if (fieldDefinition == null)
		throw new Error(`${entityType}.${fieldName} is not registered`)

	return materializeResolverOutput({
		kind: ResolverOutputMaterialization.Field,
		schema,
		schemaIndex: schemaMeta,
		entityDefinition,
		parentSelector,
		parentSelectorKey: entitySelectorKey(schema, entityDefinition, parentSelector),
		fieldDefinition,
		value,
		source,
	})
}

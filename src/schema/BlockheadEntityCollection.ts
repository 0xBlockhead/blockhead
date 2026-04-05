import { type } from 'arktype'
import { CollectionScope } from '$/data/collections/entityCollections.ts'
import type { EntityDefinition, EntityFieldDefinition } from '$/schema/$EntityDefinition.ts'
import { EntityType } from '$/schema/$EntityType.ts'

export default {
	entityType: EntityType.BlockheadEntityCollection,

	label: 'Entity Collection',

	id: type({
		collectionId: 'string',
		scope: type.valueOf(CollectionScope),
	}),

	fields: [] as const satisfies readonly EntityFieldDefinition[],
} as const satisfies EntityDefinition


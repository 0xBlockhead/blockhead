import { type } from 'arktype'
import {
	EntityFieldCardinality,
	EntityFieldType,
	type EntityDefinition,
} from '$/schema/$schema.ts'
import { EntityType } from '$/schema/EntityType.ts'
export enum BlockheadPanelTreeSelector {
	Id = 'id',
}
export default {
	entityType: EntityType.BlockheadPanelTree,
	label: 'blockhead panel tree',
	labelPlural: 'blockhead panel trees',
	selectors: [
		{
			name: BlockheadPanelTreeSelector.Id,
			fields: [
				'id',
			],
		},
	],
	fields: [
		{
			name: 'id',
			label: 'ID',
			description: 'The identifier assigned by the source domain.',
			type: EntityFieldType.Primitive,
			primitiveType: type("string"),
			cardinality: EntityFieldCardinality.One,
		},
	],
} as const satisfies EntityDefinition

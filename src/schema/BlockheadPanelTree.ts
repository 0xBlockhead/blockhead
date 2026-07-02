// Generated from APP.ts. Do not edit by hand.

import { EntityFieldCardinality, EntityFieldType, type EntityDefinition } from '$/schema/$schema.ts'
import { EntityType } from '$/schema/EntityType.ts'
import { type } from 'arktype'

export enum BlockheadPanelTreeSelector {
	Id = 'Id',
}
export default {
	entityType: EntityType.BlockheadPanelTree,
	label: 'dashboard',
	labelPlural: 'dashboards',
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
				type: EntityFieldType.Primitive,
				primitiveType: type('string'),
				cardinality: EntityFieldCardinality.One,
		},
	],
} as const satisfies EntityDefinition

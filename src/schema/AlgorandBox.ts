import { type } from 'arktype'
import {
	EntityFieldCardinality,
	EntityFieldType,
	type EntityDefinition,
} from '$/schema/$schema.ts'
import { EntityType } from '$/schema/EntityType.ts'
export enum AlgorandBoxSelector {
	ApplicationBoxName = '$application+boxName',
}
export default {
	entityType: EntityType.AlgorandBox,
	label: 'algorand box',
	labelPlural: 'algorand boxes',
	selectors: [
		{
			name: AlgorandBoxSelector.ApplicationBoxName,
			fields: [
				'$application',
				'boxName',
			],
		},
	],
	fields: [
		{
			name: '$application',
			label: 'application',
			type: EntityFieldType.EntityReference,
			entityType: EntityType.AlgorandApplication,
			cardinality: EntityFieldCardinality.One,
		},
		{
			name: 'boxName',
			label: 'box name',
			type: EntityFieldType.Primitive,
			primitiveType: type("string"),
			cardinality: EntityFieldCardinality.One,
		},
		{
			name: '$$rounds',
			label: 'rounds',
			type: EntityFieldType.EntitiesReference,
			entityType: EntityType.AlgorandBox_Round,
			cardinality: EntityFieldCardinality.Many,
		},
	],
} as const satisfies EntityDefinition

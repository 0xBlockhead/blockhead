import { type } from 'arktype'
import {
	EntityFieldCardinality,
	EntityFieldType,
	type EntityDefinition,
} from '$/schema/$schema.ts'
import { EntityType } from '$/schema/EntityType.ts'
export enum TezosBigMapKeySelector {
	BigMapKeyHash = '$bigMap+keyHash',
}
export default {
	entityType: EntityType.TezosBigMapKey,
	label: 'tezos big map key',
	labelPlural: 'tezos big map keys',
	selectors: [
		{
			name: TezosBigMapKeySelector.BigMapKeyHash,
			fields: [
				'$bigMap',
				'keyHash',
			],
		},
	],
	fields: [
		{
			name: '$bigMap',
			label: 'big map',
			type: EntityFieldType.EntityReference,
			entityType: EntityType.TezosBigMap,
			cardinality: EntityFieldCardinality.One,
		},
		{
			name: 'keyHash',
			label: 'key hash',
			type: EntityFieldType.Primitive,
			primitiveType: type("string"),
			cardinality: EntityFieldCardinality.One,
		},
		{
			name: '$$updates',
			label: 'updates',
			type: EntityFieldType.EntitiesReference,
			entityType: EntityType.TezosBigMapDiff,
			cardinality: EntityFieldCardinality.Many,
		},
		{
			name: '$$timestamps',
			label: 'timestamps',
			type: EntityFieldType.EntitiesReference,
			entityType: EntityType.TezosBigMapKey_Timestamp,
			cardinality: EntityFieldCardinality.Many,
		},
	],
} as const satisfies EntityDefinition

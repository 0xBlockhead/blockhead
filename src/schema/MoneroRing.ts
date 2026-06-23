import { type } from 'arktype'
import {
	EntityFieldCardinality,
	EntityFieldType,
	type EntityDefinition,
} from '$/schema/$schema.ts'
import { EntityType } from '$/schema/EntityType.ts'
export enum MoneroRingSelector {
	MoneroKeyImage = 'moneroKeyImage',
	KeyImage = '$keyImage',
}
export default {
	entityType: EntityType.MoneroRing,
	label: 'monero ring',
	labelPlural: 'monero rings',
	selectors: [
		{
			name: MoneroRingSelector.MoneroKeyImage,
			fields: [
				'$keyImage',
			],
		},
	],
	fields: [
		{
			name: '$keyImage',
			label: 'key image',
			type: EntityFieldType.EntityReference,
			entityType: EntityType.MoneroKeyImage,
			cardinality: EntityFieldCardinality.One,
		},
		{
			name: '$$members',
			label: 'members',
			type: EntityFieldType.EntitiesReference,
			entityType: EntityType.MoneroRingMember,
			cardinality: EntityFieldCardinality.Many,
		},
	],
} as const satisfies EntityDefinition

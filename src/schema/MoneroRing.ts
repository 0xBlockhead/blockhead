import { type } from 'arktype'

import {
	EntityFieldType,
	EntityFieldCardinality,
	type EntityDefinition,
	type EntityFieldDefinition,
} from '$/schema/$schema.ts'
import { EntityType } from '$/schema/EntityType.ts'

export enum MoneroRingSelector {
	MoneroKeyImage = 'moneroKeyImage',
}

export default {
	entityType: EntityType.MoneroRing,

	label: 'Monero Ring',
	labelPlural: 'Monero Rings',

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
			type: EntityFieldType.EntityReference,
			entityType: EntityType.MoneroKeyImage,
			cardinality: EntityFieldCardinality.One,
		},
		{
			name: '$$members',
			type: EntityFieldType.EntitiesReference,
			entityType: EntityType.MoneroRingMember,
			cardinality: EntityFieldCardinality.ZeroOrMany,
		},
	] as const satisfies readonly EntityFieldDefinition[],
} as const satisfies EntityDefinition

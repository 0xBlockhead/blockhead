import { type } from 'arktype'

import {
	EntityFieldType,
	EntityFieldCardinality,
	type EntityDefinition,
	type EntityFieldDefinition,
} from '$/schema/$schema.ts'
import { EntityType } from '$/schema/EntityType.ts'
import Ring from '$/schema/MoneroRing.ts'

export enum MoneroRingMemberSelector {
	MoneroRingMemberIndex = 'moneroRingMemberIndex',
}

export default {
	entityType: EntityType.MoneroRingMember,

	label: 'Monero Ring Member',
	labelPlural: 'Monero Ring Members',

	selectors: [
		{
			name: MoneroRingMemberSelector.MoneroRingMemberIndex,
			fields: [
				'$ring',
				'memberIndex',
			],
		},
	],

	fields: [
		{
			name: '$ring',
			type: EntityFieldType.EntityReference,
			entityType: EntityType.MoneroRing,
			cardinality: EntityFieldCardinality.One,
		},
		{
			name: 'memberIndex',
			type: EntityFieldType.Primitive,
			primitiveType: type('number'),
			cardinality: EntityFieldCardinality.One,
		},
		{
			name: 'globalOutputIndex',
			type: EntityFieldType.Primitive,
			primitiveType: type('bigint'),
			cardinality: EntityFieldCardinality.ZeroOrOne,
		},
	] as const satisfies readonly EntityFieldDefinition[],
} as const satisfies EntityDefinition

import { type } from 'arktype'
import {
	EntityFieldCardinality,
	EntityFieldType,
	type EntityDefinition,
} from '$/schema/$schema.ts'
import { EntityType } from '$/schema/EntityType.ts'
export enum MoneroRingMemberSelector {
	MoneroRingMemberIndex = 'moneroRingMemberIndex',
	RingMemberIndex = '$ring+memberIndex',
}
export default {
	entityType: EntityType.MoneroRingMember,
	label: 'monero ring member',
	labelPlural: 'monero ring members',
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
			label: 'ring',
			type: EntityFieldType.EntityReference,
			entityType: EntityType.MoneroRing,
			cardinality: EntityFieldCardinality.One,
		},
		{
			name: 'memberIndex',
			label: 'member index',
			type: EntityFieldType.Primitive,
			primitiveType: type("number"),
			cardinality: EntityFieldCardinality.One,
		},
		{
			name: 'globalOutputIndex',
			label: 'global output index',
			type: EntityFieldType.Primitive,
			primitiveType: type("bigint"),
			cardinality: EntityFieldCardinality.ZeroOrOne,
		},
	],
} as const satisfies EntityDefinition

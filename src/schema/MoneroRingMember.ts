// Generated from APP.ts. Do not edit by hand.

import { EntityFieldCardinality, EntityFieldType, type EntityDefinition } from '$/schema/$schema.ts'
import { EntityType } from '$/schema/EntityType.ts'
import { Source } from '$/sources/Source.ts'
import { type } from 'arktype'

export enum MoneroRingMemberSelector {
	MoneroRingMemberIndex = 'MoneroRingMemberIndex',
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
				label: 'Ring',
				type: EntityFieldType.EntityReference,
				entityType: EntityType.MoneroRing,
				cardinality: EntityFieldCardinality.One,
		},
		{
				name: 'memberIndex',
				label: 'Member index',
				type: EntityFieldType.Primitive,
				primitiveType: type('number'),
				cardinality: EntityFieldCardinality.One,
		},
		{
				name: 'globalOutputIndex',
				label: 'Global output index',
				type: EntityFieldType.Primitive,
				primitiveType: type('bigint'),
				cardinality: EntityFieldCardinality.ZeroOrOne,
				defaultSources: [
					Source.MoneroDaemonRpc_JsonRpc,
				],
		},
	],
} as const satisfies EntityDefinition

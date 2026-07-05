// Generated from APP.ts. Do not edit by hand.

import { EntityFieldCardinality, EntityFieldType, type EntityDefinition } from '$/schema/$schema.ts'
import { EntityType } from '$/schema/EntityType.ts'
import { ZeroExHex } from '$/schema/ZeroExHex.ts'
import { type } from 'arktype'

export enum AlgorandTransactionGroupSelector {
	NetworkGroup = 'NetworkGroup',
}
export default {
	entityType: EntityType.AlgorandTransactionGroup,
	label: 'algorand transaction group',
	labelPlural: 'algorand transaction groups',
	selectors: [
		{
			name: AlgorandTransactionGroupSelector.NetworkGroup,
			fields: [
				'$network',
				'group',
			],
		},
	],
	fields: [
		{
				name: '$network',
				label: 'network',
				type: EntityFieldType.EntityReference,
				entityType: EntityType.AlgorandNetwork,
				cardinality: EntityFieldCardinality.One,
		},
		{
				name: 'group',
				label: 'group',
				type: EntityFieldType.Primitive,
				primitiveType: (ZeroExHex),
				cardinality: EntityFieldCardinality.One,
		},
		{
				name: '$$transactions',
				label: 'transactions',
				type: EntityFieldType.EntitiesReference,
				entityType: EntityType.AlgorandTransaction,
				cardinality: EntityFieldCardinality.Many,
		},
	],
} as const satisfies EntityDefinition

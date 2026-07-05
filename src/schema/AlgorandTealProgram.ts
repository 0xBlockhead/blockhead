// Generated from APP.ts. Do not edit by hand.

import { EntityFieldCardinality, EntityFieldType, type EntityDefinition } from '$/schema/$schema.ts'
import { EntityType } from '$/schema/EntityType.ts'
import { ZeroExHex } from '$/schema/ZeroExHex.ts'
import { type } from 'arktype'

export enum AlgorandTealProgramSelector {
	NetworkProgramHash = 'NetworkProgramHash',
}
export default {
	entityType: EntityType.AlgorandTealProgram,
	label: 'algorand teal program',
	labelPlural: 'algorand teal programs',
	selectors: [
		{
			name: AlgorandTealProgramSelector.NetworkProgramHash,
			fields: [
				'$network',
				'programHash',
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
				name: 'programHash',
				label: 'program hash',
				type: EntityFieldType.Primitive,
				primitiveType: (ZeroExHex),
				cardinality: EntityFieldCardinality.One,
		},
		{
				name: 'programKind',
				label: 'program kind',
				type: EntityFieldType.Primitive,
				primitiveType: type('string'),
				cardinality: EntityFieldCardinality.ZeroOrOne,
		},
		{
				name: 'tealVersion',
				label: 'teal version',
				type: EntityFieldType.Primitive,
				primitiveType: type('number'),
				cardinality: EntityFieldCardinality.ZeroOrOne,
		},
		{
				name: '$$timestamps',
				label: 'timestamps',
				type: EntityFieldType.EntitiesReference,
				entityType: EntityType.AlgorandTealProgram_Timestamp,
				cardinality: EntityFieldCardinality.Many,
		},
		{
				name: '$$applications',
				label: 'applications',
				type: EntityFieldType.EntitiesReference,
				entityType: EntityType.AlgorandApplication,
				cardinality: EntityFieldCardinality.Many,
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

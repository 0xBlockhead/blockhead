// Generated from APP.ts. Do not edit by hand.

import { EntityFieldCardinality, EntityFieldType, type EntityDefinition } from '$/schema/$schema.ts'
import { EntityType } from '$/schema/EntityType.ts'
import { type } from 'arktype'

export enum TezosCycleSelector {
	NetworkCycle = 'NetworkCycle',
}
export default {
	entityType: EntityType.TezosCycle,
	label: 'tezos cycle',
	labelPlural: 'tezos cycles',
	selectors: [
		{
			name: TezosCycleSelector.NetworkCycle,
			fields: [
				'$network',
				'cycle',
			],
		},
	],
	fields: [
		{
			name: '$network',
			label: 'network',
			type: EntityFieldType.EntityReference,
			entityType: EntityType.TezosNetwork,
			cardinality: EntityFieldCardinality.One,
		},
		{
			name: 'cycle',
			label: 'cycle',
			type: EntityFieldType.Primitive,
			primitiveType: type('bigint'),
			cardinality: EntityFieldCardinality.One,
		},
		{
			name: 'firstLevel',
			label: 'first level',
			type: EntityFieldType.Primitive,
			primitiveType: type('bigint'),
			cardinality: EntityFieldCardinality.ZeroOrOne,
		},
		{
			name: 'lastLevel',
			label: 'last level',
			type: EntityFieldType.Primitive,
			primitiveType: type('bigint'),
			cardinality: EntityFieldCardinality.ZeroOrOne,
		},
		{
			name: 'snapshotLevel',
			label: 'snapshot level',
			type: EntityFieldType.Primitive,
			primitiveType: type('bigint'),
			cardinality: EntityFieldCardinality.ZeroOrOne,
		},
		{
			name: 'randomSeed',
			label: 'random seed',
			type: EntityFieldType.Primitive,
			primitiveType: type('string'),
			cardinality: EntityFieldCardinality.ZeroOrOne,
		},
		{
			name: '$$bakerTimestamps',
			label: 'baker timestamps',
			type: EntityFieldType.EntitiesReference,
			entityType: EntityType.TezosBaker_Cycle_Timestamp,
			cardinality: EntityFieldCardinality.Many,
		},
	],
} as const satisfies EntityDefinition

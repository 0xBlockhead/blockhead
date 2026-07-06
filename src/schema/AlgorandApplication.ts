// Generated from APP.ts. Do not edit by hand.

import { EntityFieldCardinality, EntityFieldType, type EntityDefinition } from '$/schema/$schema.ts'
import { EntityType } from '$/schema/EntityType.ts'
import { type } from 'arktype'

export enum AlgorandApplicationSelector {
	NetworkApplicationId = 'NetworkApplicationId',
}
export default {
	entityType: EntityType.AlgorandApplication,
	label: 'algorand application',
	labelPlural: 'algorand applications',
	selectors: [
		{
			name: AlgorandApplicationSelector.NetworkApplicationId,
			fields: [
				'$network',
				'applicationId',
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
			name: 'applicationId',
			label: 'application ID',
			type: EntityFieldType.Primitive,
			primitiveType: type('bigint'),
			cardinality: EntityFieldCardinality.One,
		},
		{
			name: 'creator',
			label: 'creator',
			type: EntityFieldType.Primitive,
			primitiveType: type('string'),
			cardinality: EntityFieldCardinality.ZeroOrOne,
		},
		{
			name: '$$boxes',
			label: 'boxes',
			type: EntityFieldType.EntitiesReference,
			entityType: EntityType.AlgorandBox,
			cardinality: EntityFieldCardinality.Many,
		},
		{
			name: '$$localStateRounds',
			label: 'local state rounds',
			type: EntityFieldType.EntitiesReference,
			entityType: EntityType.AlgorandApplicationLocalState_Round,
			cardinality: EntityFieldCardinality.Many,
		},
		{
			name: '$$timestamps',
			label: 'timestamps',
			type: EntityFieldType.EntitiesReference,
			entityType: EntityType.AlgorandApplication_Timestamp,
			cardinality: EntityFieldCardinality.Many,
		},
	],
} as const satisfies EntityDefinition

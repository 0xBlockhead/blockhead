// Generated from APP.ts. Do not edit by hand.

import { EntityFieldCardinality, EntityFieldType, type EntityDefinition } from '$/schema/$schema.ts'
import { EntityType } from '$/schema/EntityType.ts'
import { type } from 'arktype'

export enum AlgorandAccountSelector {
	NetworkAddress = 'NetworkAddress',
}
export default {
	entityType: EntityType.AlgorandAccount,
	label: 'algorand account',
	labelPlural: 'algorand accounts',
	selectors: [
		{
			name: AlgorandAccountSelector.NetworkAddress,
			fields: [
				'$network',
				'address',
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
			name: 'address',
			label: 'Address',
			description: 'The address or account identifier used by the source protocol.',
			type: EntityFieldType.Primitive,
			primitiveType: type('string'),
			cardinality: EntityFieldCardinality.One,
		},
		{
			name: '$$applicationLocalStateRounds',
			label: 'application local state rounds',
			type: EntityFieldType.EntitiesReference,
			entityType: EntityType.AlgorandApplicationLocalState_Round,
			cardinality: EntityFieldCardinality.Many,
		},
		{
			name: '$$assetHoldingRounds',
			label: 'asset holding rounds',
			type: EntityFieldType.EntitiesReference,
			entityType: EntityType.AlgorandAssetHolding_Round,
			cardinality: EntityFieldCardinality.Many,
		},
		{
			name: '$$timestamps',
			label: 'timestamps',
			type: EntityFieldType.EntitiesReference,
			entityType: EntityType.AlgorandAccount_Timestamp,
			cardinality: EntityFieldCardinality.Many,
		},
	],
} as const satisfies EntityDefinition

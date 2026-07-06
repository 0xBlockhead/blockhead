// Generated from APP.ts. Do not edit by hand.

import { EntityFieldCardinality, EntityFieldType, type EntityDefinition } from '$/schema/$schema.ts'
import { EntityType } from '$/schema/EntityType.ts'
import { type } from 'arktype'

export enum BnbValidatorSelector {
	NetworkOperatorAddress = 'NetworkOperatorAddress',
}
export default {
	entityType: EntityType.BnbValidator,
	label: 'bnb validator',
	labelPlural: 'bnb validators',
	selectors: [
		{
			name: BnbValidatorSelector.NetworkOperatorAddress,
			fields: [
				'$network',
				'operatorAddress',
			],
		},
	],
	fields: [
		{
			name: '$network',
			label: 'network',
			type: EntityFieldType.EntityReference,
			entityType: EntityType.BnbBeaconNetwork,
			cardinality: EntityFieldCardinality.One,
		},
		{
			name: 'operatorAddress',
			label: 'operator address',
			type: EntityFieldType.Primitive,
			primitiveType: type('string'),
			cardinality: EntityFieldCardinality.One,
		},
		{
			name: 'consensusAddress',
			label: 'consensus address',
			type: EntityFieldType.Primitive,
			primitiveType: type('string'),
			cardinality: EntityFieldCardinality.ZeroOrOne,
		},
		{
			name: 'moniker',
			label: 'moniker',
			type: EntityFieldType.Primitive,
			primitiveType: type('string'),
			cardinality: EntityFieldCardinality.ZeroOrOne,
		},
		{
			name: '$$timestamps',
			label: 'timestamps',
			type: EntityFieldType.EntitiesReference,
			entityType: EntityType.BnbValidator_Timestamp,
			cardinality: EntityFieldCardinality.Many,
		},
	],
} as const satisfies EntityDefinition

// Generated from APP.ts. Do not edit by hand.

import { EntityFieldCardinality, EntityFieldType, type EntityDefinition } from '$/schema/$schema.ts'
import { EntityType } from '$/schema/EntityType.ts'
import { type } from 'arktype'

export enum HyperliquidValidatorSelector {
	NetworkValidator = 'NetworkValidator',
}
export default {
	entityType: EntityType.HyperliquidValidator,
	label: 'hyperliquid validator',
	labelPlural: 'hyperliquid validators',
	selectors: [
		{
			name: HyperliquidValidatorSelector.NetworkValidator,
			fields: [
				'$network',
				'validator',
			],
		},
	],
	fields: [
		{
			name: '$network',
			label: 'network',
			type: EntityFieldType.EntityReference,
			entityType: EntityType.Network,
			cardinality: EntityFieldCardinality.One,
		},
		{
			name: 'validator',
			label: 'validator',
			type: EntityFieldType.Primitive,
			primitiveType: type('string'),
			cardinality: EntityFieldCardinality.One,
		},
		{
			name: '$$timestamps',
			label: 'timestamps',
			type: EntityFieldType.EntitiesReference,
			entityType: EntityType.HyperliquidValidator_Timestamp,
			cardinality: EntityFieldCardinality.Many,
		},
	],
} as const satisfies EntityDefinition

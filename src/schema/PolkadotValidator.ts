// Generated from APP.ts. Do not edit by hand.

import { EntityFieldCardinality, EntityFieldType, type EntityDefinition } from '$/schema/$schema.ts'
import { EntityType } from '$/schema/EntityType.ts'
import { type } from 'arktype'

export enum PolkadotValidatorSelector {
	NetworkStashAccountId = 'NetworkStashAccountId',
}
export default {
	entityType: EntityType.PolkadotValidator,
	label: 'Polkadot validator',
	labelPlural: 'Polkadot validators',
	selectors: [
		{
			name: PolkadotValidatorSelector.NetworkStashAccountId,
			fields: [
				'$network',
				'stashAccountId',
			],
		},
	],
	fields: [
		{
			name: '$network',
			label: 'Network',
			type: EntityFieldType.EntityReference,
			entityType: EntityType.Network,
			cardinality: EntityFieldCardinality.One,
		},
		{
			name: 'stashAccountId',
			label: 'Stash account ID',
			type: EntityFieldType.Primitive,
			primitiveType: type('string'),
			cardinality: EntityFieldCardinality.One,
		},
	],
} as const satisfies EntityDefinition

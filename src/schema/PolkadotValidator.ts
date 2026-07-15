// Generated from APP.ts. Do not edit by hand.

import { entity, facet } from '$/schema/$schema.ts'
import { EntityFieldCardinality, EntityFieldType } from '$/schema/EntityField.ts'
import { EntityType } from '$/schema/EntityType.ts'
import { type } from 'arktype'

export enum PolkadotValidatorSelector {
	NetworkStashAccountId = 'NetworkStashAccountId',
}
export const PolkadotValidator = entity({
	entityType: EntityType.PolkadotValidator,
	labels: {
		singular: 'Polkadot validator',
		plural: 'Polkadot validators',
	},
})({
	$network: {
		label: 'Network',
		type: EntityFieldType.EntityReference,
		entityType: EntityType.Network,
		cardinality: EntityFieldCardinality.One,
	},
	stashAccountId: {
		label: 'Stash account ID',
		type: EntityFieldType.Primitive,
		primitiveType: type('string'),
		cardinality: EntityFieldCardinality.One,
	},
})({
	selectors: {
		NetworkStashAccountId: [
			'$network',
			'stashAccountId',
		],
	},
})

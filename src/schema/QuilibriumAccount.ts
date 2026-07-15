// Generated from APP.ts. Do not edit by hand.

import { entity, facet } from '$/schema/$schema.ts'
import { EntityFieldCardinality, EntityFieldType } from '$/schema/EntityField.ts'
import { EntityType } from '$/schema/EntityType.ts'
import { type } from 'arktype'

export enum QuilibriumAccountSelector {
	NetworkAccountAddress = 'NetworkAccountAddress',
}
export const QuilibriumAccount = entity({
	entityType: EntityType.QuilibriumAccount,
	labels: {
		singular: 'quilibrium account',
		plural: 'quilibrium accounts',
	},
})({
	$network: {
		label: 'network',
		type: EntityFieldType.EntityReference,
		entityType: EntityType.Network,
		cardinality: EntityFieldCardinality.One,
	},
	accountAddress: {
		label: 'account address',
		type: EntityFieldType.Primitive,
		primitiveType: type('string'),
		cardinality: EntityFieldCardinality.One,
	},
	accountKind: {
		label: 'account kind',
		type: EntityFieldType.Primitive,
		primitiveType: type('string'),
		cardinality: EntityFieldCardinality.ZeroOrOne,
	},
	$$blockheadAccountStates: {
		label: 'blockhead account states',
		type: EntityFieldType.EntitiesReference,
		entityType: EntityType.BlockheadQuilibriumAccountState,
		cardinality: EntityFieldCardinality.Many,
	},
})({
	selectors: {
		NetworkAccountAddress: [
			'$network',
			'accountAddress',
		],
	},
})

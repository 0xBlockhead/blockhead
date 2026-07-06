// Generated from APP.ts. Do not edit by hand.

import { EntityFieldCardinality, EntityFieldType, type EntityDefinition } from '$/schema/$schema.ts'
import { EntityType } from '$/schema/EntityType.ts'
import { type } from 'arktype'

export enum QuilibriumAccountSelector {
	NetworkAccountAddress = 'NetworkAccountAddress',
}
export default {
	entityType: EntityType.QuilibriumAccount,
	label: 'quilibrium account',
	labelPlural: 'quilibrium accounts',
	selectors: [
		{
			name: QuilibriumAccountSelector.NetworkAccountAddress,
			fields: [
				'$network',
				'accountAddress',
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
			name: 'accountAddress',
			label: 'account address',
			type: EntityFieldType.Primitive,
			primitiveType: type('string'),
			cardinality: EntityFieldCardinality.One,
		},
		{
			name: 'accountKind',
			label: 'account kind',
			type: EntityFieldType.Primitive,
			primitiveType: type('string'),
			cardinality: EntityFieldCardinality.ZeroOrOne,
		},
		{
			name: '$$blockheadAccountStates',
			label: 'blockhead account states',
			type: EntityFieldType.EntitiesReference,
			entityType: EntityType.BlockheadQuilibriumAccountState,
			cardinality: EntityFieldCardinality.Many,
		},
	],
} as const satisfies EntityDefinition

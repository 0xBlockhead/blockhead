// Generated from APP.ts. Do not edit by hand.

import { entity, EntityFieldCardinality, EntityFieldType, facet } from '$/schema/$schema.ts'
import { EntityType } from '$/schema/EntityType.ts'
import { type } from 'arktype'

export enum SuiTransactionSelector {
	NetworkDigest = 'NetworkDigest',
}
export const SuiTransaction = entity({
	entityType: EntityType.SuiTransaction,
	label: 'sui transaction',
	labelPlural: 'sui transactions',
})({
	$network: {
		label: 'network',
		type: EntityFieldType.EntityReference,
		entityType: EntityType.SuiNetwork,
		cardinality: EntityFieldCardinality.One,
	},
	digest: {
		label: 'digest',
		type: EntityFieldType.Primitive,
		primitiveType: type('string'),
		cardinality: EntityFieldCardinality.One,
	},
	transactionKind: {
		label: 'transaction kind',
		type: EntityFieldType.Primitive,
		primitiveType: type('string'),
		cardinality: EntityFieldCardinality.ZeroOrOne,
	},
	sender: {
		label: 'sender',
		type: EntityFieldType.Primitive,
		primitiveType: type('string'),
		cardinality: EntityFieldCardinality.ZeroOrOne,
	},
	$$timestamps: {
		label: 'timestamps',
		type: EntityFieldType.EntitiesReference,
		entityType: EntityType.SuiTransaction_Timestamp,
		cardinality: EntityFieldCardinality.Many,
	},
	$$commands: {
		label: 'commands',
		type: EntityFieldType.EntitiesReference,
		entityType: EntityType.SuiProgrammableTransactionCommand,
		cardinality: EntityFieldCardinality.Many,
	},
	$$objectChanges: {
		label: 'object changes',
		type: EntityFieldType.EntitiesReference,
		entityType: EntityType.SuiObjectChange,
		cardinality: EntityFieldCardinality.Many,
	},
	$$balanceChanges: {
		label: 'balance changes',
		type: EntityFieldType.EntitiesReference,
		entityType: EntityType.SuiBalanceChange,
		cardinality: EntityFieldCardinality.Many,
	},
	$$events: {
		label: 'events',
		type: EntityFieldType.EntitiesReference,
		entityType: EntityType.SuiEvent,
		cardinality: EntityFieldCardinality.Many,
	},
})({
	selectors: {
		NetworkDigest: [
			'$network',
			'digest',
		],
	},
})

// Generated from APP.ts. Do not edit by hand.

import { entity } from '$/schema/$schema.ts'
import { EntityFieldCardinality } from '$/schema/EntityFieldCardinality.ts'
import { EntityFieldType } from '$/schema/EntityFieldType.ts'
import { EntityType } from '$/schema/EntityType.ts'
import { type } from 'arktype'

export default entity({
	entityType: EntityType.SuiTransaction,
	labels: {
		singular: 'sui transaction',
		plural: 'sui transactions',
	},
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

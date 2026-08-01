// Generated from APP.ts.

import { entity } from '$/schema/$schema.ts'
import { EntityFieldCardinality } from '$/schema/EntityFieldCardinality.ts'
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
		entityType: EntityType.SuiNetwork,
		cardinality: EntityFieldCardinality.One,
	},
	digest: {
		label: 'digest',
		primitiveType: type('string'),
		cardinality: EntityFieldCardinality.One,
	},
	transactionKind: {
		label: 'transaction kind',
		primitiveType: type('string'),
		cardinality: EntityFieldCardinality.ZeroOrOne,
	},
	sender: {
		label: 'sender',
		primitiveType: type('string'),
		cardinality: EntityFieldCardinality.ZeroOrOne,
	},
	$$timestamps: {
		label: 'timestamps',
		entityType: EntityType.SuiTransaction_Timestamp,
		cardinality: EntityFieldCardinality.Many,
	},
	$$commands: {
		label: 'commands',
		entityType: EntityType.SuiProgrammableTransactionCommand,
		cardinality: EntityFieldCardinality.Many,
	},
	$$objectChanges: {
		label: 'object changes',
		entityType: EntityType.SuiObjectChange,
		cardinality: EntityFieldCardinality.Many,
	},
	$$balanceChanges: {
		label: 'balance changes',
		entityType: EntityType.SuiBalanceChange,
		cardinality: EntityFieldCardinality.Many,
	},
	$$events: {
		label: 'events',
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

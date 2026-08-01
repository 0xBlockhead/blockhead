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
		entityType: EntityType.SuiNetwork,
		cardinality: EntityFieldCardinality.One,
	},
	digest: {
		primitiveType: type('string'),
		cardinality: EntityFieldCardinality.One,
	},
	transactionKind: {
		primitiveType: type('string'),
		cardinality: EntityFieldCardinality.ZeroOrOne,
	},
	sender: {
		primitiveType: type('string'),
		cardinality: EntityFieldCardinality.ZeroOrOne,
	},
	$$timestamps: {
		entityType: EntityType.SuiTransaction_Timestamp,
		cardinality: EntityFieldCardinality.Many,
	},
	$$commands: {
		entityType: EntityType.SuiProgrammableTransactionCommand,
		cardinality: EntityFieldCardinality.Many,
	},
	$$objectChanges: {
		entityType: EntityType.SuiObjectChange,
		cardinality: EntityFieldCardinality.Many,
	},
	$$balanceChanges: {
		entityType: EntityType.SuiBalanceChange,
		cardinality: EntityFieldCardinality.Many,
	},
	$$events: {
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

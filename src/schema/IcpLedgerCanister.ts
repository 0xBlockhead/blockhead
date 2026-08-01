// Generated from APP.ts.

import { entity } from '$/schema/$schema.ts'
import { EntityFieldCardinality } from '$/schema/EntityFieldCardinality.ts'
import { EntityType } from '$/schema/EntityType.ts'
import { type } from 'arktype'

export default entity({
	entityType: EntityType.IcpLedgerCanister,
	labels: {
		singular: 'icp ledger canister',
		plural: 'icp ledger canisters',
	},
})({
	$canister: {
		entityType: EntityType.IcpCanister,
		cardinality: EntityFieldCardinality.One,
	},
	ledgerStandard: {
		primitiveType: type('string'),
		cardinality: EntityFieldCardinality.One,
	},
	$$timestamps: {
		entityType: EntityType.IcpLedgerCanister_Timestamp,
		cardinality: EntityFieldCardinality.Many,
	},
	$$accountTimestamps: {
		entityType: EntityType.IcpLedgerAccount_Timestamp,
		cardinality: EntityFieldCardinality.Many,
	},
	$$blocks: {
		entityType: EntityType.IcpLedgerBlock,
		cardinality: EntityFieldCardinality.Many,
	},
	$$transactions: {
		entityType: EntityType.IcpLedgerTransaction,
		cardinality: EntityFieldCardinality.Many,
	},
})({
	selectors: {
		Canister: [
			'$canister',
		],
	},
})

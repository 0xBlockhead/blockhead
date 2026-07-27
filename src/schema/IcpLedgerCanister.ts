// Generated from APP.ts. Do not edit by hand.

import { entity } from '$/schema/$schema.ts'
import { EntityFieldCardinality, EntityFieldType } from '$/schema/EntityField.ts'
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
		label: 'canister',
		type: EntityFieldType.EntityReference,
		entityType: EntityType.IcpCanister,
		cardinality: EntityFieldCardinality.One,
	},
	ledgerStandard: {
		label: 'ledger standard',
		type: EntityFieldType.Primitive,
		primitiveType: type('string'),
		cardinality: EntityFieldCardinality.One,
	},
	$$timestamps: {
		label: 'timestamps',
		type: EntityFieldType.EntitiesReference,
		entityType: EntityType.IcpLedgerCanister_Timestamp,
		cardinality: EntityFieldCardinality.Many,
	},
	$$accountTimestamps: {
		label: 'account timestamps',
		type: EntityFieldType.EntitiesReference,
		entityType: EntityType.IcpLedgerAccount_Timestamp,
		cardinality: EntityFieldCardinality.Many,
	},
	$$blocks: {
		label: 'blocks',
		type: EntityFieldType.EntitiesReference,
		entityType: EntityType.IcpLedgerBlock,
		cardinality: EntityFieldCardinality.Many,
	},
	$$transactions: {
		label: 'transactions',
		type: EntityFieldType.EntitiesReference,
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

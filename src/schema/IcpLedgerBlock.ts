// Generated from APP.ts.

import { entity } from '$/schema/$schema.ts'
import { EntityFieldCardinality } from '$/schema/EntityFieldCardinality.ts'
import { EntityType } from '$/schema/EntityType.ts'
import { type } from 'arktype'

export default entity({
	entityType: EntityType.IcpLedgerBlock,
	labels: {
		singular: 'icp ledger block',
		plural: 'icp ledger blocks',
	},
})({
	$ledger: {
		label: 'ledger',
		entityType: EntityType.IcpLedgerCanister,
		cardinality: EntityFieldCardinality.One,
	},
	blockIndex: {
		label: 'block index',
		primitiveType: type('bigint'),
		cardinality: EntityFieldCardinality.One,
	},
	blockHash: {
		label: 'Block hash',
		description: 'The hash that identifies the block in its network.',
		primitiveType: type('string'),
		cardinality: EntityFieldCardinality.ZeroOrOne,
	},
	parentHash: {
		label: 'parent hash',
		primitiveType: type('string'),
		cardinality: EntityFieldCardinality.ZeroOrOne,
	},
	timestampNs: {
		label: 'timestamp ns',
		primitiveType: type('bigint'),
		cardinality: EntityFieldCardinality.ZeroOrOne,
	},
	transactionCount: {
		label: 'transaction count',
		primitiveType: type('number'),
		cardinality: EntityFieldCardinality.ZeroOrOne,
	},
	archiveCanisterId: {
		label: 'archive canister ID',
		primitiveType: type('string'),
		cardinality: EntityFieldCardinality.ZeroOrOne,
	},
	$$transactions: {
		label: 'transactions',
		entityType: EntityType.IcpLedgerTransaction,
		cardinality: EntityFieldCardinality.Many,
	},
})({
	selectors: {
		LedgerBlockIndex: [
			'$ledger',
			'blockIndex',
		],
	},
})

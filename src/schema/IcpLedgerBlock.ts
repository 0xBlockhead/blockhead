// Generated from APP.ts. Do not edit by hand.

import { entity, EntityFieldCardinality, EntityFieldType, facet } from '$/schema/$schema.ts'
import { EntityType } from '$/schema/EntityType.ts'
import { type } from 'arktype'

export enum IcpLedgerBlockSelector {
	LedgerBlockIndex = 'LedgerBlockIndex',
}
export const IcpLedgerBlock = entity({
	entityType: EntityType.IcpLedgerBlock,
	labels: {
		singular: 'icp ledger block',
		plural: 'icp ledger blocks',
	},
})({
	$ledger: {
		label: 'ledger',
		type: EntityFieldType.EntityReference,
		entityType: EntityType.IcpLedgerCanister,
		cardinality: EntityFieldCardinality.One,
	},
	blockIndex: {
		label: 'block index',
		type: EntityFieldType.Primitive,
		primitiveType: type('bigint'),
		cardinality: EntityFieldCardinality.One,
	},
	blockHash: {
		label: 'Block hash',
		description: 'The hash that identifies the block in its network.',
		type: EntityFieldType.Primitive,
		primitiveType: type('string'),
		cardinality: EntityFieldCardinality.ZeroOrOne,
	},
	parentHash: {
		label: 'parent hash',
		type: EntityFieldType.Primitive,
		primitiveType: type('string'),
		cardinality: EntityFieldCardinality.ZeroOrOne,
	},
	timestampNs: {
		label: 'timestamp ns',
		type: EntityFieldType.Primitive,
		primitiveType: type('bigint'),
		cardinality: EntityFieldCardinality.ZeroOrOne,
	},
	transactionCount: {
		label: 'transaction count',
		type: EntityFieldType.Primitive,
		primitiveType: type('number'),
		cardinality: EntityFieldCardinality.ZeroOrOne,
	},
	archiveCanisterId: {
		label: 'archive canister ID',
		type: EntityFieldType.Primitive,
		primitiveType: type('string'),
		cardinality: EntityFieldCardinality.ZeroOrOne,
	},
	$$transactions: {
		label: 'transactions',
		type: EntityFieldType.EntitiesReference,
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

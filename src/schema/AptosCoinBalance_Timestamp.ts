// Generated from APP.ts.

import { entity } from '$/schema/$schema.ts'
import { EntityFieldCardinality } from '$/schema/EntityFieldCardinality.ts'
import { EntityType } from '$/schema/EntityType.ts'
import { type } from 'arktype'

export default entity({
	entityType: EntityType.AptosCoinBalance_Timestamp,
	labels: {
		singular: 'current Aptos coin balance observation',
		plural: 'current Aptos coin balance observations',
	},
	description: 'A current balance reported by the Aptos Indexer, anchored to the row\'s last transaction version. This surface does not imply retained balance history.',
})({
	$account: {
		entityType: EntityType.AptosAccount,
		cardinality: EntityFieldCardinality.One,
	},
	assetType: {
		primitiveType: type('string'),
		cardinality: EntityFieldCardinality.One,
	},
	storageId: {
		primitiveType: type('string'),
		cardinality: EntityFieldCardinality.One,
	},
	isPrimary: {
		primitiveType: type('boolean'),
		cardinality: EntityFieldCardinality.One,
	},
	ledgerVersion: {
		primitiveType: type('bigint').narrow((value) => value >= 0n),
		cardinality: EntityFieldCardinality.One,
	},
	source: {
		primitiveType: type('string'),
		cardinality: EntityFieldCardinality.One,
	},
	timestampMs: {
		primitiveType: type('number'),
		cardinality: EntityFieldCardinality.ZeroOrOne,
	},
	amount: {
		primitiveType: type('bigint'),
		cardinality: EntityFieldCardinality.One,
	},
	ownerAddress: {
		primitiveType: type('string'),
		cardinality: EntityFieldCardinality.One,
	},
	coinType: {
		primitiveType: type('string'),
		cardinality: EntityFieldCardinality.ZeroOrOne,
	},
})({
	selectors: {
		AccountStorageIdLedgerVersionSource: [
			'$account',
			'storageId',
			'ledgerVersion',
			'source',
		],
	},
})

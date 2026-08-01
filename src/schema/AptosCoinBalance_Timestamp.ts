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
		label: 'account',
		entityType: EntityType.AptosAccount,
		cardinality: EntityFieldCardinality.One,
	},
	assetType: {
		label: 'asset type',
		primitiveType: type('string'),
		cardinality: EntityFieldCardinality.One,
	},
	storageId: {
		label: 'storage ID',
		description: 'The primary key of the current_fungible_asset_balances row supplied by the Aptos Indexer.',
		primitiveType: type('string'),
		cardinality: EntityFieldCardinality.One,
	},
	isPrimary: {
		label: 'primary store',
		description: 'Whether the balance belongs to the account\'s primary fungible asset store.',
		primitiveType: type('boolean'),
		cardinality: EntityFieldCardinality.One,
	},
	ledgerVersion: {
		label: 'last transaction version',
		description: 'The last transaction version supplied by the current materialized balance row.',
		primitiveType: type('bigint'),
		cardinality: EntityFieldCardinality.One,
	},
	source: {
		label: 'Source',
		description: 'The source that produced this observation.',
		primitiveType: type('string'),
		cardinality: EntityFieldCardinality.One,
	},
	timestampMs: {
		label: 'Timestamp',
		description: 'The observation time in Unix milliseconds.',
		primitiveType: type('number'),
		cardinality: EntityFieldCardinality.ZeroOrOne,
	},
	amount: {
		label: 'amount',
		primitiveType: type('bigint'),
		cardinality: EntityFieldCardinality.One,
	},
	ownerAddress: {
		label: 'owner address',
		primitiveType: type('string'),
		cardinality: EntityFieldCardinality.One,
	},
	coinType: {
		label: 'coin type',
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

// Generated from APP.ts.

import { entity } from '$/schema/$schema.ts'
import { EntityFieldCardinality } from '$/schema/EntityFieldCardinality.ts'
import { EntityType } from '$/schema/EntityType.ts'
import { Hash32 } from '$/schema/ZeroExHex.ts'
import { type } from 'arktype'

export default entity({
	entityType: EntityType.BlockheadWalletRequest_Timestamp,
	labels: {
		singular: 'blockhead wallet request timestamp',
		plural: 'blockhead wallet request observations',
	},
})({
	$walletRequest: {
		entityType: EntityType.BlockheadWalletRequest,
		cardinality: EntityFieldCardinality.One,
	},
	timestampMs: {
		primitiveType: type('number'),
		cardinality: EntityFieldCardinality.One,
	},
	source: {
		primitiveType: type('string'),
		cardinality: EntityFieldCardinality.One,
	},
	status: {
		primitiveType: type('string'),
		cardinality: EntityFieldCardinality.One,
	},
	walletStatusCode: {
		primitiveType: type('number'),
		cardinality: EntityFieldCardinality.ZeroOrOne,
	},
	atomic: {
		primitiveType: type('boolean'),
		cardinality: EntityFieldCardinality.ZeroOrOne,
	},
	transactionId: {
		primitiveType: type('string'),
		cardinality: EntityFieldCardinality.ZeroOrOne,
	},
	signatureHash: {
		primitiveType: Hash32,
		cardinality: EntityFieldCardinality.ZeroOrOne,
	},
	statusPayloadHash: {
		primitiveType: Hash32,
		cardinality: EntityFieldCardinality.ZeroOrOne,
	},
	error: {
		primitiveType: type('string'),
		cardinality: EntityFieldCardinality.ZeroOrOne,
	},
	$$evmTransactions: {
		entityType: EntityType.EvmTransaction,
		cardinality: EntityFieldCardinality.Many,
	},
})({
	selectors: {
		WalletRequestTimestampMsSource: [
			'$walletRequest',
			'timestampMs',
			'source',
		],
	},
})

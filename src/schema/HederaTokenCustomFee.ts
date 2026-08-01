// Generated from APP.ts.

import { entity } from '$/schema/$schema.ts'
import { EntityFieldCardinality } from '$/schema/EntityFieldCardinality.ts'
import { EntityType } from '$/schema/EntityType.ts'
import { type } from 'arktype'

export default entity({
	entityType: EntityType.HederaTokenCustomFee,
	labels: {
		singular: 'hedera token custom fee',
		plural: 'hedera token custom fees',
	},
})({
	$tokenTimestamp: {
		label: 'token timestamp',
		entityType: EntityType.HederaToken_Timestamp,
		cardinality: EntityFieldCardinality.One,
	},
	feeIndex: {
		label: 'fee index',
		primitiveType: type('number'),
		cardinality: EntityFieldCardinality.One,
	},
	feeKind: {
		label: 'fee kind',
		primitiveType: type('string'),
		cardinality: EntityFieldCardinality.One,
	},
	collectorAccountId: {
		label: 'collector account ID',
		primitiveType: type('string'),
		cardinality: EntityFieldCardinality.ZeroOrOne,
	},
	denominatingTokenId: {
		label: 'denominating token ID',
		primitiveType: type('string'),
		cardinality: EntityFieldCardinality.ZeroOrOne,
	},
	amount: {
		label: 'amount',
		primitiveType: type('bigint'),
		cardinality: EntityFieldCardinality.ZeroOrOne,
	},
	numerator: {
		label: 'numerator',
		primitiveType: type('bigint'),
		cardinality: EntityFieldCardinality.ZeroOrOne,
	},
	denominator: {
		label: 'denominator',
		primitiveType: type('bigint'),
		cardinality: EntityFieldCardinality.ZeroOrOne,
	},
	minimumAmount: {
		label: 'minimum amount',
		primitiveType: type('bigint'),
		cardinality: EntityFieldCardinality.ZeroOrOne,
	},
	maximumAmount: {
		label: 'maximum amount',
		primitiveType: type('bigint'),
		cardinality: EntityFieldCardinality.ZeroOrOne,
	},
	netOfTransfers: {
		label: 'net of transfers',
		primitiveType: type('boolean'),
		cardinality: EntityFieldCardinality.ZeroOrOne,
	},
	allCollectorsAreExempt: {
		label: 'all collectors are exempt',
		primitiveType: type('boolean'),
		cardinality: EntityFieldCardinality.ZeroOrOne,
	},
	$collector: {
		label: 'collector',
		entityType: EntityType.HederaAccount,
		cardinality: EntityFieldCardinality.ZeroOrOne,
	},
	$denominatingToken: {
		label: 'denominating token',
		entityType: EntityType.HederaToken,
		cardinality: EntityFieldCardinality.ZeroOrOne,
	},
})({
	selectors: {
		TokenTimestampFeeIndex: [
			'$tokenTimestamp',
			'feeIndex',
		],
	},
})

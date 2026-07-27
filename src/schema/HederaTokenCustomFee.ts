// Generated from APP.ts. Do not edit by hand.

import { entity } from '$/schema/$schema.ts'
import { EntityFieldCardinality, EntityFieldType } from '$/schema/EntityField.ts'
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
		type: EntityFieldType.EntityReference,
		entityType: EntityType.HederaToken_Timestamp,
		cardinality: EntityFieldCardinality.One,
	},
	feeIndex: {
		label: 'fee index',
		type: EntityFieldType.Primitive,
		primitiveType: type('number'),
		cardinality: EntityFieldCardinality.One,
	},
	feeKind: {
		label: 'fee kind',
		type: EntityFieldType.Primitive,
		primitiveType: type('string'),
		cardinality: EntityFieldCardinality.One,
	},
	collectorAccountId: {
		label: 'collector account ID',
		type: EntityFieldType.Primitive,
		primitiveType: type('string'),
		cardinality: EntityFieldCardinality.ZeroOrOne,
	},
	denominatingTokenId: {
		label: 'denominating token ID',
		type: EntityFieldType.Primitive,
		primitiveType: type('string'),
		cardinality: EntityFieldCardinality.ZeroOrOne,
	},
	amount: {
		label: 'amount',
		type: EntityFieldType.Primitive,
		primitiveType: type('bigint'),
		cardinality: EntityFieldCardinality.ZeroOrOne,
	},
	numerator: {
		label: 'numerator',
		type: EntityFieldType.Primitive,
		primitiveType: type('bigint'),
		cardinality: EntityFieldCardinality.ZeroOrOne,
	},
	denominator: {
		label: 'denominator',
		type: EntityFieldType.Primitive,
		primitiveType: type('bigint'),
		cardinality: EntityFieldCardinality.ZeroOrOne,
	},
	minimumAmount: {
		label: 'minimum amount',
		type: EntityFieldType.Primitive,
		primitiveType: type('bigint'),
		cardinality: EntityFieldCardinality.ZeroOrOne,
	},
	maximumAmount: {
		label: 'maximum amount',
		type: EntityFieldType.Primitive,
		primitiveType: type('bigint'),
		cardinality: EntityFieldCardinality.ZeroOrOne,
	},
	netOfTransfers: {
		label: 'net of transfers',
		type: EntityFieldType.Primitive,
		primitiveType: type('boolean'),
		cardinality: EntityFieldCardinality.ZeroOrOne,
	},
	allCollectorsAreExempt: {
		label: 'all collectors are exempt',
		type: EntityFieldType.Primitive,
		primitiveType: type('boolean'),
		cardinality: EntityFieldCardinality.ZeroOrOne,
	},
	$collector: {
		label: 'collector',
		type: EntityFieldType.EntityReference,
		entityType: EntityType.HederaAccount,
		cardinality: EntityFieldCardinality.ZeroOrOne,
	},
	$denominatingToken: {
		label: 'denominating token',
		type: EntityFieldType.EntityReference,
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

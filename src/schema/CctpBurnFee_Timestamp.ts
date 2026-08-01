// Generated from APP.ts.

import { entity } from '$/schema/$schema.ts'
import { EntityFieldCardinality } from '$/schema/EntityFieldCardinality.ts'
import { EntityType } from '$/schema/EntityType.ts'
import { type } from 'arktype'

export default entity({
	entityType: EntityType.CctpBurnFee_Timestamp,
	labels: {
		singular: 'CCTP burn fee timestamp',
		plural: 'CCTP burn fee observations',
	},
})({
	$sourceDomain: {
		entityType: EntityType.CctpDomainSupport,
		cardinality: EntityFieldCardinality.One,
	},
	$destinationDomain: {
		entityType: EntityType.CctpDomainSupport,
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
	forward: {
		primitiveType: type('boolean'),
		cardinality: EntityFieldCardinality.One,
	},
	hyperCoreDeposit: {
		primitiveType: type('boolean'),
		cardinality: EntityFieldCardinality.ZeroOrOne,
	},
	feeRows: {
		primitiveType: type({
			finalityThreshold: type('number'),
			minimumFeeBps: type('number'),
			'forwardFeeLow?': type('bigint'),
			'forwardFeeMedium?': type('bigint'),
			'forwardFeeHigh?': type('bigint'),
		}),
		cardinality: EntityFieldCardinality.Many,
	},
})({
	selectors: {
		SourceDomainDestinationDomainTimestampMsSource: [
			'$sourceDomain',
			'$destinationDomain',
			'timestampMs',
			'source',
		],
	},
})

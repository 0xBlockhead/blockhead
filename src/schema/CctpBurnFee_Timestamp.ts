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
		label: 'Source domain',
		entityType: EntityType.CctpDomainSupport,
		cardinality: EntityFieldCardinality.One,
	},
	$destinationDomain: {
		label: 'Destination domain',
		entityType: EntityType.CctpDomainSupport,
		cardinality: EntityFieldCardinality.One,
	},
	timestampMs: {
		label: 'Timestamp',
		description: 'The observation time in Unix milliseconds.',
		primitiveType: type('number'),
		cardinality: EntityFieldCardinality.One,
	},
	source: {
		label: 'Source',
		description: 'The source that produced this observation.',
		primitiveType: type('string'),
		cardinality: EntityFieldCardinality.One,
	},
	forward: {
		label: 'Forward',
		primitiveType: type('boolean'),
		cardinality: EntityFieldCardinality.One,
	},
	hyperCoreDeposit: {
		label: 'HyperCore deposit',
		primitiveType: type('boolean'),
		cardinality: EntityFieldCardinality.ZeroOrOne,
	},
	feeRows: {
		label: 'Fee rows',
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

// Generated from APP.ts. Do not edit by hand.

import { entity, facet } from '$/schema/$schema.ts'
import { EntityFieldCardinality, EntityFieldType } from '$/schema/EntityField.ts'
import { EntityType } from '$/schema/EntityType.ts'
import { type } from 'arktype'

export enum CctpBurnFee_TimestampSelector {
	SourceDomainDestinationDomainTimestampMsSource = 'SourceDomainDestinationDomainTimestampMsSource',
}
export const CctpBurnFee_Timestamp = entity({
	entityType: EntityType.CctpBurnFee_Timestamp,
	labels: {
		singular: 'CCTP burn fee timestamp',
		plural: 'CCTP burn fee observations',
	},
})({
	$sourceDomain: {
		label: 'Source domain',
		type: EntityFieldType.EntityReference,
		entityType: EntityType.CctpDomainSupport,
		cardinality: EntityFieldCardinality.One,
	},
	$destinationDomain: {
		label: 'Destination domain',
		type: EntityFieldType.EntityReference,
		entityType: EntityType.CctpDomainSupport,
		cardinality: EntityFieldCardinality.One,
	},
	timestampMs: {
		label: 'Timestamp',
		description: 'The observation time in Unix milliseconds.',
		type: EntityFieldType.Primitive,
		primitiveType: type('number'),
		cardinality: EntityFieldCardinality.One,
	},
	source: {
		label: 'Source',
		description: 'The source that produced this observation.',
		type: EntityFieldType.Primitive,
		primitiveType: type('string'),
		cardinality: EntityFieldCardinality.One,
	},
	forward: {
		label: 'Forward',
		type: EntityFieldType.Primitive,
		primitiveType: type('boolean'),
		cardinality: EntityFieldCardinality.One,
	},
	hyperCoreDeposit: {
		label: 'HyperCore deposit',
		type: EntityFieldType.Primitive,
		primitiveType: type('boolean'),
		cardinality: EntityFieldCardinality.ZeroOrOne,
	},
	feeRows: {
		label: 'Fee rows',
		type: EntityFieldType.Primitive,
		primitiveType: type({ 'finalityThreshold': type('number'), 'minimumFeeBps': type('number'), 'forwardFeeLow?': type('bigint'), 'forwardFeeMedium?': type('bigint'), 'forwardFeeHigh?': type('bigint') }),
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

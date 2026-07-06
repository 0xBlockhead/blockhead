// Generated from APP.ts. Do not edit by hand.

import { EntityFieldCardinality, EntityFieldType, type EntityDefinition } from '$/schema/$schema.ts'
import { EntityType } from '$/schema/EntityType.ts'
import { type } from 'arktype'

export enum CctpBurnFee_TimestampSelector {
	SourceDomainDestinationDomainTimestampMsSource = 'SourceDomainDestinationDomainTimestampMsSource',
}
export default {
	entityType: EntityType.CctpBurnFee_Timestamp,
	label: 'CCTP burn fee timestamp',
	labelPlural: 'CCTP burn fee observations',
	selectors: [
		{
			name: CctpBurnFee_TimestampSelector.SourceDomainDestinationDomainTimestampMsSource,
			fields: [
				'$sourceDomain',
				'$destinationDomain',
				'timestampMs',
				'source',
			],
		},
	],
	fields: [
		{
			name: '$sourceDomain',
			label: 'Source domain',
			type: EntityFieldType.EntityReference,
			entityType: EntityType.CctpDomainSupport,
			cardinality: EntityFieldCardinality.One,
		},
		{
			name: '$destinationDomain',
			label: 'Destination domain',
			type: EntityFieldType.EntityReference,
			entityType: EntityType.CctpDomainSupport,
			cardinality: EntityFieldCardinality.One,
		},
		{
			name: 'timestampMs',
			label: 'Timestamp',
			description: 'The observation time in Unix milliseconds.',
			type: EntityFieldType.Primitive,
			primitiveType: type('number'),
			cardinality: EntityFieldCardinality.One,
		},
		{
			name: 'source',
			label: 'Source',
			description: 'The source that produced this observation.',
			type: EntityFieldType.Primitive,
			primitiveType: type('string'),
			cardinality: EntityFieldCardinality.One,
		},
		{
			name: 'forward',
			label: 'Forward',
			type: EntityFieldType.Primitive,
			primitiveType: type('boolean'),
			cardinality: EntityFieldCardinality.One,
		},
		{
			name: 'hyperCoreDeposit',
			label: 'HyperCore deposit',
			type: EntityFieldType.Primitive,
			primitiveType: type('boolean'),
			cardinality: EntityFieldCardinality.ZeroOrOne,
		},
		{
			name: 'feeRows',
			label: 'Fee rows',
			type: EntityFieldType.Primitive,
			primitiveType: type({ 'finalityThreshold': type('number'), 'minimumFeeBps': type('number'), 'forwardFeeLow?': type('bigint'), 'forwardFeeMedium?': type('bigint'), 'forwardFeeHigh?': type('bigint') }),
			cardinality: EntityFieldCardinality.Many,
		},
	],
} as const satisfies EntityDefinition

import { type } from 'arktype'
import {
	EntityFieldCardinality,
	EntityFieldType,
	type EntityDefinition,
} from '$/schema/$schema.ts'
import { EntityType } from '$/schema/EntityType.ts'
export enum CctpBurnFee_TimestampSelector {
	SourceDomainDestinationDomainTimestampMsSource = '$sourceDomain+$destinationDomain+timestampMs+source',
}
export default {
	entityType: EntityType.CctpBurnFee_Timestamp,
	label: 'cctp burn fee timestamp',
	labelPlural: 'cctp burn fee observations',
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
			label: 'source domain',
			type: EntityFieldType.EntityReference,
			entityType: EntityType.CctpDomainSupport,
			cardinality: EntityFieldCardinality.One,
		},
		{
			name: '$destinationDomain',
			label: 'destination domain',
			type: EntityFieldType.EntityReference,
			entityType: EntityType.CctpDomainSupport,
			cardinality: EntityFieldCardinality.One,
		},
		{
			name: 'timestampMs',
			label: 'Timestamp',
			description: 'The observation time in Unix milliseconds.',
			type: EntityFieldType.Primitive,
			primitiveType: type("number"),
			cardinality: EntityFieldCardinality.One,
		},
		{
			name: 'source',
			label: 'Source',
			description: 'The source that produced this observation.',
			type: EntityFieldType.Primitive,
			primitiveType: type("string"),
			cardinality: EntityFieldCardinality.One,
		},
		{
			name: 'forward',
			label: 'forward',
			type: EntityFieldType.Primitive,
			primitiveType: type("boolean"),
			cardinality: EntityFieldCardinality.One,
		},
		{
			name: 'hyperCoreDeposit',
			label: 'hyper core deposit',
			type: EntityFieldType.Primitive,
			primitiveType: type("boolean"),
			cardinality: EntityFieldCardinality.ZeroOrOne,
		},
		{
			name: 'feeRows',
			label: 'fee rows',
			type: EntityFieldType.Primitive,
			primitiveType: type({"finalityThreshold": "number", "minimumFeeBps": "number", "forwardFeeLow?": "bigint", "forwardFeeMedium?": "bigint", "forwardFeeHigh?": "bigint"}),
			cardinality: EntityFieldCardinality.Many,
		},
	],
} as const satisfies EntityDefinition

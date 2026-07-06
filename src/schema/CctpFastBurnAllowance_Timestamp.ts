// Generated from APP.ts. Do not edit by hand.

import { EntityFieldCardinality, EntityFieldType, type EntityDefinition } from '$/schema/$schema.ts'
import { EntityType } from '$/schema/EntityType.ts'
import { type } from 'arktype'

export enum CctpFastBurnAllowance_TimestampSelector {
	TimestampMsSource = 'TimestampMsSource',
}
export default {
	entityType: EntityType.CctpFastBurnAllowance_Timestamp,
	label: 'CCTP fast burn allowance timestamp',
	labelPlural: 'CCTP fast burn allowance observations',
	selectors: [
		{
			name: CctpFastBurnAllowance_TimestampSelector.TimestampMsSource,
			fields: [
				'timestampMs',
				'source',
			],
		},
	],
	fields: [
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
			name: 'allowanceUsdc',
			label: 'Allowance USDC',
			type: EntityFieldType.Primitive,
			primitiveType: type('number'),
			cardinality: EntityFieldCardinality.ZeroOrOne,
		},
		{
			name: 'lastUpdatedMs',
			label: 'Last updated ms',
			type: EntityFieldType.Primitive,
			primitiveType: type('number'),
			cardinality: EntityFieldCardinality.ZeroOrOne,
		},
		{
			name: 'requestId',
			label: 'Request ID',
			type: EntityFieldType.Primitive,
			primitiveType: type('string'),
			cardinality: EntityFieldCardinality.ZeroOrOne,
		},
	],
} as const satisfies EntityDefinition

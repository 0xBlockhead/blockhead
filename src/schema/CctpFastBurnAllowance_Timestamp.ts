import { type } from 'arktype'
import {
	EntityFieldCardinality,
	EntityFieldType,
	type EntityDefinition,
} from '$/schema/$schema.ts'
import { EntityType } from '$/schema/EntityType.ts'
export enum CctpFastBurnAllowance_TimestampSelector {
	TimestampMsSource = 'timestampMs+source',
}
export default {
	entityType: EntityType.CctpFastBurnAllowance_Timestamp,
	label: 'cctp fast burn allowance timestamp',
	labelPlural: 'cctp fast burn allowance observations',
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
			name: 'allowanceUsdc',
			label: 'allowance usdc',
			type: EntityFieldType.Primitive,
			primitiveType: type("number"),
			cardinality: EntityFieldCardinality.ZeroOrOne,
		},
		{
			name: 'lastUpdatedMs',
			label: 'last updated ms',
			type: EntityFieldType.Primitive,
			primitiveType: type("number"),
			cardinality: EntityFieldCardinality.ZeroOrOne,
		},
		{
			name: 'requestId',
			label: 'request ID',
			type: EntityFieldType.Primitive,
			primitiveType: type("string"),
			cardinality: EntityFieldCardinality.ZeroOrOne,
		},
	],
} as const satisfies EntityDefinition

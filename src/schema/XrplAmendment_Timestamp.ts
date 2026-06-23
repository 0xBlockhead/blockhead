import { type } from 'arktype'
import {
	EntityFieldCardinality,
	EntityFieldType,
	type EntityDefinition,
} from '$/schema/$schema.ts'
import { EntityType } from '$/schema/EntityType.ts'
export enum XrplAmendment_TimestampSelector {
	AmendmentLedgerIndexSource = '$amendment+ledgerIndex+source',
}
export default {
	entityType: EntityType.XrplAmendment_Timestamp,
	label: 'xrpl amendment timestamp',
	labelPlural: 'xrpl amendment observations',
	selectors: [
		{
			name: XrplAmendment_TimestampSelector.AmendmentLedgerIndexSource,
			fields: [
				'$amendment',
				'ledgerIndex',
				'source',
			],
		},
	],
	fields: [
		{
			name: '$amendment',
			label: 'amendment',
			type: EntityFieldType.EntityReference,
			entityType: EntityType.XrplAmendment,
			cardinality: EntityFieldCardinality.One,
		},
		{
			name: 'ledgerIndex',
			label: 'ledger index',
			type: EntityFieldType.Primitive,
			primitiveType: type("bigint"),
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
			name: 'timestampMs',
			label: 'Timestamp',
			description: 'The observation time in Unix milliseconds.',
			type: EntityFieldType.Primitive,
			primitiveType: type("number"),
			cardinality: EntityFieldCardinality.ZeroOrOne,
		},
		{
			name: 'enabled',
			label: 'enabled',
			type: EntityFieldType.Primitive,
			primitiveType: type("boolean"),
			cardinality: EntityFieldCardinality.ZeroOrOne,
		},
		{
			name: 'supported',
			label: 'supported',
			type: EntityFieldType.Primitive,
			primitiveType: type("boolean"),
			cardinality: EntityFieldCardinality.ZeroOrOne,
		},
		{
			name: 'status',
			label: 'status',
			type: EntityFieldType.Primitive,
			primitiveType: type("string"),
			cardinality: EntityFieldCardinality.ZeroOrOne,
		},
		{
			name: 'enabledAtLedger',
			label: 'enabled AT ledger',
			type: EntityFieldType.Primitive,
			primitiveType: type("bigint"),
			cardinality: EntityFieldCardinality.ZeroOrOne,
		},
	],
} as const satisfies EntityDefinition

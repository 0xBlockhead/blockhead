import { type } from 'arktype'
import {
	EntityFieldCardinality,
	EntityFieldType,
	type EntityDefinition,
} from '$/schema/$schema.ts'
import { EntityType } from '$/schema/EntityType.ts'
export enum HederaTokenCustomFeeSelector {
	TokenTimestampFeeIndex = '$tokenTimestamp+feeIndex',
}
export default {
	entityType: EntityType.HederaTokenCustomFee,
	label: 'hedera token custom fee',
	labelPlural: 'hedera token custom fees',
	selectors: [
		{
			name: HederaTokenCustomFeeSelector.TokenTimestampFeeIndex,
			fields: [
				'$tokenTimestamp',
				'feeIndex',
			],
		},
	],
	fields: [
		{
			name: '$tokenTimestamp',
			label: 'token timestamp',
			type: EntityFieldType.EntityReference,
			entityType: EntityType.HederaToken_Timestamp,
			cardinality: EntityFieldCardinality.One,
		},
		{
			name: 'feeIndex',
			label: 'fee index',
			type: EntityFieldType.Primitive,
			primitiveType: type("number"),
			cardinality: EntityFieldCardinality.One,
		},
		{
			name: 'feeKind',
			label: 'fee kind',
			type: EntityFieldType.Primitive,
			primitiveType: type("string"),
			cardinality: EntityFieldCardinality.One,
		},
		{
			name: 'collectorAccountId',
			label: 'collector account ID',
			type: EntityFieldType.Primitive,
			primitiveType: type("string"),
			cardinality: EntityFieldCardinality.ZeroOrOne,
		},
		{
			name: 'denominatingTokenId',
			label: 'denominating token ID',
			type: EntityFieldType.Primitive,
			primitiveType: type("string"),
			cardinality: EntityFieldCardinality.ZeroOrOne,
		},
		{
			name: 'amount',
			label: 'amount',
			type: EntityFieldType.Primitive,
			primitiveType: type("bigint"),
			cardinality: EntityFieldCardinality.ZeroOrOne,
		},
		{
			name: 'numerator',
			label: 'numerator',
			type: EntityFieldType.Primitive,
			primitiveType: type("bigint"),
			cardinality: EntityFieldCardinality.ZeroOrOne,
		},
		{
			name: 'denominator',
			label: 'denominator',
			type: EntityFieldType.Primitive,
			primitiveType: type("bigint"),
			cardinality: EntityFieldCardinality.ZeroOrOne,
		},
		{
			name: 'minimumAmount',
			label: 'minimum amount',
			type: EntityFieldType.Primitive,
			primitiveType: type("bigint"),
			cardinality: EntityFieldCardinality.ZeroOrOne,
		},
		{
			name: 'maximumAmount',
			label: 'maximum amount',
			type: EntityFieldType.Primitive,
			primitiveType: type("bigint"),
			cardinality: EntityFieldCardinality.ZeroOrOne,
		},
		{
			name: 'netOfTransfers',
			label: 'net of transfers',
			type: EntityFieldType.Primitive,
			primitiveType: type("boolean"),
			cardinality: EntityFieldCardinality.ZeroOrOne,
		},
		{
			name: 'allCollectorsAreExempt',
			label: 'all collectors are exempt',
			type: EntityFieldType.Primitive,
			primitiveType: type("boolean"),
			cardinality: EntityFieldCardinality.ZeroOrOne,
		},
		{
			name: '$collector',
			label: 'collector',
			type: EntityFieldType.EntityReference,
			entityType: EntityType.HederaAccount,
			cardinality: EntityFieldCardinality.ZeroOrOne,
		},
		{
			name: '$denominatingToken',
			label: 'denominating token',
			type: EntityFieldType.EntityReference,
			entityType: EntityType.HederaToken,
			cardinality: EntityFieldCardinality.ZeroOrOne,
		},
	],
} as const satisfies EntityDefinition

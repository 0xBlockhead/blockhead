import { type } from 'arktype'
import {
	EntityFieldCardinality,
	EntityFieldType,
	type EntityDefinition,
} from '$/schema/$schema.ts'
import { EntityType } from '$/schema/EntityType.ts'
export enum CashuKeyset_TimestampSelector {
	KeysetTimestampMsSource = '$keyset+timestampMs+source',
}
export default {
	entityType: EntityType.CashuKeyset_Timestamp,
	label: 'Cashu keyset timestamp',
	labelPlural: 'Cashu keyset observations',
	selectors: [
		{
			name: CashuKeyset_TimestampSelector.KeysetTimestampMsSource,
			fields: [
				'$keyset',
				'timestampMs',
				'source',
			],
		},
	],
	fields: [
		{
			name: '$keyset',
			label: 'keyset',
			type: EntityFieldType.EntityReference,
			entityType: EntityType.CashuKeyset,
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
			name: 'active',
			label: 'active',
			type: EntityFieldType.Primitive,
			primitiveType: type("boolean"),
			cardinality: EntityFieldCardinality.ZeroOrOne,
		},
		{
			name: 'inputFeePpk',
			label: 'input fee ppk',
			type: EntityFieldType.Primitive,
			primitiveType: type("number"),
			cardinality: EntityFieldCardinality.ZeroOrOne,
		},
		{
			name: 'finalExpiryMs',
			label: 'final expiry ms',
			type: EntityFieldType.Primitive,
			primitiveType: type("number"),
			cardinality: EntityFieldCardinality.ZeroOrOne,
		},
		{
			name: 'listedByKeysEndpoint',
			label: 'listed by keys endpoint',
			type: EntityFieldType.Primitive,
			primitiveType: type("boolean"),
			cardinality: EntityFieldCardinality.ZeroOrOne,
		},
		{
			name: 'listedByKeysetsEndpoint',
			label: 'listed by keysets endpoint',
			type: EntityFieldType.Primitive,
			primitiveType: type("boolean"),
			cardinality: EntityFieldCardinality.ZeroOrOne,
		},
	],
} as const satisfies EntityDefinition

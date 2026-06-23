import { type } from 'arktype'
import {
	EntityFieldCardinality,
	EntityFieldType,
	type EntityDefinition,
} from '$/schema/$schema.ts'
import { EntityType } from '$/schema/EntityType.ts'
export enum HederaNft_TimestampSelector {
	NftTimestampMsSource = '$nft+timestampMs+source',
}
export default {
	entityType: EntityType.HederaNft_Timestamp,
	label: 'hedera NFT timestamp',
	labelPlural: 'hedera NFT observations',
	selectors: [
		{
			name: HederaNft_TimestampSelector.NftTimestampMsSource,
			fields: [
				'$nft',
				'timestampMs',
				'source',
			],
		},
	],
	fields: [
		{
			name: '$nft',
			label: 'NFT',
			type: EntityFieldType.EntityReference,
			entityType: EntityType.HederaNft,
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
			name: '$owner',
			label: 'owner',
			type: EntityFieldType.EntityReference,
			entityType: EntityType.HederaAccount,
			cardinality: EntityFieldCardinality.ZeroOrOne,
		},
		{
			name: 'ownerAccountId',
			label: 'owner account ID',
			type: EntityFieldType.Primitive,
			primitiveType: type("string"),
			cardinality: EntityFieldCardinality.ZeroOrOne,
		},
		{
			name: 'deleted',
			label: 'deleted',
			type: EntityFieldType.Primitive,
			primitiveType: type("boolean"),
			cardinality: EntityFieldCardinality.ZeroOrOne,
		},
		{
			name: 'spenderAccountId',
			label: 'spender account ID',
			type: EntityFieldType.Primitive,
			primitiveType: type("string"),
			cardinality: EntityFieldCardinality.ZeroOrOne,
		},
		{
			name: 'modifiedTimestamp',
			label: 'modified timestamp',
			type: EntityFieldType.Primitive,
			primitiveType: type("string"),
			cardinality: EntityFieldCardinality.ZeroOrOne,
		},
	],
} as const satisfies EntityDefinition

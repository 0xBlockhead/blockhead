import { type } from 'arktype'
import {
	EntityFieldCardinality,
	EntityFieldType,
	type EntityDefinition,
} from '$/schema/$schema.ts'
import { EntityType } from '$/schema/EntityType.ts'
export enum CardanoAddress_TimestampSelector {
	AddressBlockSlotSource = '$address+blockSlot+source',
}
export default {
	entityType: EntityType.CardanoAddress_Timestamp,
	label: 'cardano address timestamp',
	labelPlural: 'cardano address observations',
	selectors: [
		{
			name: CardanoAddress_TimestampSelector.AddressBlockSlotSource,
			fields: [
				'$address',
				'blockSlot',
				'source',
			],
		},
	],
	fields: [
		{
			name: '$address',
			label: 'Address',
			description: 'The address or account identifier used by the source protocol.',
			type: EntityFieldType.EntityReference,
			entityType: EntityType.CardanoAddress,
			cardinality: EntityFieldCardinality.One,
		},
		{
			name: 'blockSlot',
			label: 'block slot',
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
			name: 'blockHash',
			label: 'Block hash',
			description: 'The hash that identifies the block in its network.',
			type: EntityFieldType.Primitive,
			primitiveType: type("string"),
			cardinality: EntityFieldCardinality.ZeroOrOne,
		},
		{
			name: 'lovelaceBalance',
			label: 'lovelace balance',
			type: EntityFieldType.Primitive,
			primitiveType: type("bigint"),
			cardinality: EntityFieldCardinality.ZeroOrOne,
		},
		{
			name: 'nativeAssetCount',
			label: 'native asset count',
			type: EntityFieldType.Primitive,
			primitiveType: type("number"),
			cardinality: EntityFieldCardinality.ZeroOrOne,
		},
		{
			name: 'utxoCount',
			label: 'UTXO count',
			type: EntityFieldType.Primitive,
			primitiveType: type("number"),
			cardinality: EntityFieldCardinality.ZeroOrOne,
		},
		{
			name: 'transactionCount',
			label: 'transaction count',
			type: EntityFieldType.Primitive,
			primitiveType: type("number"),
			cardinality: EntityFieldCardinality.ZeroOrOne,
		},
	],
} as const satisfies EntityDefinition

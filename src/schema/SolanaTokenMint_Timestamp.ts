// Generated from APP.ts. Do not edit by hand.

import { EntityFieldCardinality, EntityFieldType, type EntityDefinition } from '$/schema/$schema.ts'
import { EntityType } from '$/schema/EntityType.ts'
import { Source } from '$/sources/Source.ts'
import { type } from 'arktype'

export enum SolanaTokenMint_TimestampSelector {
	MintSlotSource = 'MintSlotSource',
}
export default {
	entityType: EntityType.SolanaTokenMint_Timestamp,
	label: 'solana token mint timestamp',
	labelPlural: 'Solana token mint observations',
	selectors: [
		{
			name: SolanaTokenMint_TimestampSelector.MintSlotSource,
			fields: [
				'$mint',
				'slot',
				'source',
			],
		},
	],
	fields: [
		{
			name: '$mint',
			label: 'Mint',
			type: EntityFieldType.EntityReference,
			entityType: EntityType.SolanaTokenMint,
			cardinality: EntityFieldCardinality.One,
		},
		{
			name: 'slot',
			label: 'Slot',
			type: EntityFieldType.Primitive,
			primitiveType: type('bigint'),
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
			name: 'timestampMs',
			label: 'Timestamp',
			description: 'The observation time in Unix milliseconds.',
			type: EntityFieldType.Primitive,
			primitiveType: type('number'),
			cardinality: EntityFieldCardinality.ZeroOrOne,
		},
		{
			name: 'supply',
			label: 'Supply',
			type: EntityFieldType.Primitive,
			primitiveType: type('bigint'),
			cardinality: EntityFieldCardinality.ZeroOrOne,
			defaultSources: [
				Source.Solana_JsonRpc,
			],
		},
		{
			name: 'decimals',
			label: 'Decimals',
			type: EntityFieldType.Primitive,
			primitiveType: type('number'),
			cardinality: EntityFieldCardinality.ZeroOrOne,
			defaultSources: [
				Source.Solana_JsonRpc,
			],
		},
		{
			name: 'mintAuthorityPubkey',
			label: 'Mint authority public key',
			type: EntityFieldType.Primitive,
			primitiveType: type('string'),
			cardinality: EntityFieldCardinality.ZeroOrOne,
			defaultSources: [
				Source.Solana_JsonRpc,
			],
		},
		{
			name: 'freezeAuthorityPubkey',
			label: 'Freeze authority public key',
			type: EntityFieldType.Primitive,
			primitiveType: type('string'),
			cardinality: EntityFieldCardinality.ZeroOrOne,
			defaultSources: [
				Source.Solana_JsonRpc,
			],
		},
		{
			name: 'isInitialized',
			label: 'Initialized',
			type: EntityFieldType.Primitive,
			primitiveType: type('boolean'),
			cardinality: EntityFieldCardinality.ZeroOrOne,
			defaultSources: [
				Source.Solana_JsonRpc,
			],
		},
	],
} as const satisfies EntityDefinition

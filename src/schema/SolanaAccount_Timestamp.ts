// Generated from APP.ts. Do not edit by hand.

import { EntityFieldCardinality, EntityFieldType, type EntityDefinition } from '$/schema/$schema.ts'
import { EntityType } from '$/schema/EntityType.ts'
import { Source } from '$/sources/Source.ts'
import { type } from 'arktype'

export enum SolanaAccount_TimestampSelector {
	AccountSlotSource = 'AccountSlotSource',
}
export default {
	entityType: EntityType.SolanaAccount_Timestamp,
	label: 'solana account timestamp',
	labelPlural: 'Solana account observations',
	selectors: [
		{
			name: SolanaAccount_TimestampSelector.AccountSlotSource,
			fields: [
				'$account',
				'slot',
				'source',
			],
		},
	],
	fields: [
		{
				name: '$account',
				label: 'Account',
				type: EntityFieldType.EntityReference,
				entityType: EntityType.SolanaAccount,
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
				name: 'lamports',
				label: 'Lamports',
				type: EntityFieldType.Primitive,
				primitiveType: type('bigint'),
				cardinality: EntityFieldCardinality.ZeroOrOne,
				defaultSources: [
					Source.Solana_JsonRpc,
				],
		},
		{
				name: 'ownerProgramId',
				label: 'Owner program ID',
				type: EntityFieldType.Primitive,
				primitiveType: type('string'),
				cardinality: EntityFieldCardinality.ZeroOrOne,
				defaultSources: [
					Source.Solana_JsonRpc,
				],
		},
		{
				name: 'executable',
				label: 'Executable',
				type: EntityFieldType.Primitive,
				primitiveType: type('boolean'),
				cardinality: EntityFieldCardinality.ZeroOrOne,
				defaultSources: [
					Source.Solana_JsonRpc,
				],
		},
		{
				name: 'rentEpoch',
				label: 'Rent epoch',
				type: EntityFieldType.Primitive,
				primitiveType: type('bigint'),
				cardinality: EntityFieldCardinality.ZeroOrOne,
				defaultSources: [
					Source.Solana_JsonRpc,
				],
		},
		{
				name: 'spaceBytes',
				label: 'Space bytes',
				type: EntityFieldType.Primitive,
				primitiveType: type('number'),
				cardinality: EntityFieldCardinality.ZeroOrOne,
		},
		{
				name: 'dataEncoding',
				label: 'Data encoding',
				type: EntityFieldType.Primitive,
				primitiveType: type('string'),
				cardinality: EntityFieldCardinality.ZeroOrOne,
				defaultSources: [
					Source.Solana_JsonRpc,
				],
		},
		{
				name: 'parsedData',
				label: 'Parsed data',
				type: EntityFieldType.Primitive,
				primitiveType: type('unknown'),
				cardinality: EntityFieldCardinality.ZeroOrOne,
		},
	],
} as const satisfies EntityDefinition

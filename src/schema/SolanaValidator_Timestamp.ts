// Generated from APP.ts. Do not edit by hand.

import { EntityFieldCardinality, EntityFieldType, type EntityDefinition } from '$/schema/$schema.ts'
import { EntityType } from '$/schema/EntityType.ts'
import { Source } from '$/sources/Source.ts'
import { type } from 'arktype'

export enum SolanaValidator_TimestampSelector {
	ValidatorSlotSource = 'ValidatorSlotSource',
}
export default {
	entityType: EntityType.SolanaValidator_Timestamp,
	label: 'solana validator timestamp',
	labelPlural: 'Solana validator observations',
	selectors: [
		{
			name: SolanaValidator_TimestampSelector.ValidatorSlotSource,
			fields: [
				'$validator',
				'slot',
				'source',
			],
		},
	],
	fields: [
		{
				name: '$validator',
				label: 'Validator',
				type: EntityFieldType.EntityReference,
				entityType: EntityType.SolanaValidator,
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
				name: 'activatedStakeLamports',
				label: 'Activated stake',
				type: EntityFieldType.Primitive,
				primitiveType: type('bigint'),
				cardinality: EntityFieldCardinality.ZeroOrOne,
				defaultSources: [
					Source.Solana_JsonRpc,
				],
		},
		{
				name: 'commission',
				label: 'Commission',
				type: EntityFieldType.Primitive,
				primitiveType: type('number'),
				cardinality: EntityFieldCardinality.ZeroOrOne,
				defaultSources: [
					Source.Solana_JsonRpc,
				],
		},
		{
				name: 'delinquent',
				label: 'Delinquent',
				type: EntityFieldType.Primitive,
				primitiveType: type('boolean'),
				cardinality: EntityFieldCardinality.ZeroOrOne,
				defaultSources: [
					Source.Solana_JsonRpc,
				],
		},
		{
				name: 'lastVoteSlot',
				label: 'Last vote slot',
				type: EntityFieldType.Primitive,
				primitiveType: type('bigint'),
				cardinality: EntityFieldCardinality.ZeroOrOne,
				defaultSources: [
					Source.Solana_JsonRpc,
				],
		},
		{
				name: 'rootSlot',
				label: 'Root slot',
				type: EntityFieldType.Primitive,
				primitiveType: type('bigint'),
				cardinality: EntityFieldCardinality.ZeroOrOne,
				defaultSources: [
					Source.Solana_JsonRpc,
				],
		},
		{
				name: 'epochCredits',
				label: 'Epoch credits',
				type: EntityFieldType.Primitive,
				primitiveType: type('unknown'),
				cardinality: EntityFieldCardinality.ZeroOrOne,
				defaultSources: [
					Source.Solana_JsonRpc,
				],
		},
	],
} as const satisfies EntityDefinition

// Generated from APP.ts. Do not edit by hand.

import { EntityFieldCardinality, EntityFieldType, type EntityDefinition } from '$/schema/$schema.ts'
import { EntityType } from '$/schema/EntityType.ts'
import { EvmAddress } from '$/schema/ZeroExHex.ts'
import { type } from 'arktype'

export enum Erc4626Vault_TimestampSelector {
	VaultTimestampMsSource = 'VaultTimestampMsSource',
}
export default {
	entityType: EntityType.Erc4626Vault_Timestamp,
	label: 'erc4626 vault timestamp',
	labelPlural: 'erc4626 vault observations',
	selectors: [
		{
			name: Erc4626Vault_TimestampSelector.VaultTimestampMsSource,
			fields: [
				'$vault',
				'timestampMs',
				'source',
			],
		},
	],
	fields: [
		{
			name: '$vault',
			label: 'Vault',
			type: EntityFieldType.EntityReference,
			entityType: EntityType.Erc4626Vault,
			cardinality: EntityFieldCardinality.One,
		},
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
			name: 'apyBase',
			label: 'APY base',
			type: EntityFieldType.Primitive,
			primitiveType: type('number'),
			cardinality: EntityFieldCardinality.ZeroOrOne,
		},
		{
			name: 'apyReward',
			label: 'APY reward',
			type: EntityFieldType.Primitive,
			primitiveType: type('number'),
			cardinality: EntityFieldCardinality.ZeroOrOne,
		},
		{
			name: 'apyTotal',
			label: 'APY total',
			type: EntityFieldType.Primitive,
			primitiveType: type('number'),
			cardinality: EntityFieldCardinality.ZeroOrOne,
		},
		{
			name: 'tvlUsd',
			label: 'TVL USD',
			type: EntityFieldType.Primitive,
			primitiveType: type('number'),
			cardinality: EntityFieldCardinality.ZeroOrOne,
		},
		{
			name: 'rewardTokens',
			label: 'Reward tokens',
			type: EntityFieldType.Primitive,
			primitiveType: (EvmAddress),
			cardinality: EntityFieldCardinality.Many,
		},
		{
			name: 'poolId',
			label: 'Pool ID',
			type: EntityFieldType.Primitive,
			primitiveType: type('string'),
			cardinality: EntityFieldCardinality.ZeroOrOne,
		},
		{
			name: 'projectSlug',
			label: 'Project slug',
			type: EntityFieldType.Primitive,
			primitiveType: type('string'),
			cardinality: EntityFieldCardinality.ZeroOrOne,
		},
		{
			name: 'chainLabel',
			label: 'Chain label',
			type: EntityFieldType.Primitive,
			primitiveType: type('string'),
			cardinality: EntityFieldCardinality.ZeroOrOne,
		},
	],
} as const satisfies EntityDefinition

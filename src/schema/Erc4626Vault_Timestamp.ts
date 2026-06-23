import { type } from 'arktype'
import {
	EntityFieldCardinality,
	EntityFieldType,
	type EntityDefinition,
} from '$/schema/$schema.ts'
import { EntityType } from '$/schema/EntityType.ts'
import { EvmAddress } from '$/schema/ZeroExHex.ts'
export enum Erc4626Vault_TimestampSelector {
	VaultTimestampMsSource = '$vault+timestampMs+source',
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
			label: 'vault',
			type: EntityFieldType.EntityReference,
			entityType: EntityType.Erc4626Vault,
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
			name: 'apyBase',
			label: 'apy base',
			type: EntityFieldType.Primitive,
			primitiveType: type("number"),
			cardinality: EntityFieldCardinality.ZeroOrOne,
		},
		{
			name: 'apyReward',
			label: 'apy reward',
			type: EntityFieldType.Primitive,
			primitiveType: type("number"),
			cardinality: EntityFieldCardinality.ZeroOrOne,
		},
		{
			name: 'apyTotal',
			label: 'apy total',
			type: EntityFieldType.Primitive,
			primitiveType: type("number"),
			cardinality: EntityFieldCardinality.ZeroOrOne,
		},
		{
			name: 'tvlUsd',
			label: 'tvl usd',
			type: EntityFieldType.Primitive,
			primitiveType: type("number"),
			cardinality: EntityFieldCardinality.ZeroOrOne,
		},
		{
			name: 'rewardTokens',
			label: 'reward tokens',
			type: EntityFieldType.Primitive,
			primitiveType: EvmAddress,
			cardinality: EntityFieldCardinality.Many,
		},
		{
			name: 'poolId',
			label: 'pool ID',
			type: EntityFieldType.Primitive,
			primitiveType: type("string"),
			cardinality: EntityFieldCardinality.ZeroOrOne,
		},
		{
			name: 'projectSlug',
			label: 'project slug',
			type: EntityFieldType.Primitive,
			primitiveType: type("string"),
			cardinality: EntityFieldCardinality.ZeroOrOne,
		},
		{
			name: 'chainLabel',
			label: 'chain label',
			type: EntityFieldType.Primitive,
			primitiveType: type("string"),
			cardinality: EntityFieldCardinality.ZeroOrOne,
		},
	],
} as const satisfies EntityDefinition

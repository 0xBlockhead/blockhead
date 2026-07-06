// Generated from APP.ts. Do not edit by hand.

import { EntityFieldCardinality, EntityFieldType, type EntityDefinition } from '$/schema/$schema.ts'
import { EntityType } from '$/schema/EntityType.ts'
import { type } from 'arktype'

export enum Erc4626Vault_BlockSelector {
	VaultBlockNumberSource = 'VaultBlockNumberSource',
}
export default {
	entityType: EntityType.Erc4626Vault_Block,
	label: 'erc4626 vault block',
	labelPlural: 'erc4626 vault blocks',
	selectors: [
		{
			name: Erc4626Vault_BlockSelector.VaultBlockNumberSource,
			fields: [
				'$vault',
				'blockNumber',
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
			name: 'blockNumber',
			label: 'Block number',
			description: 'The block height or number in its network.',
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
			name: 'totalAssets',
			label: 'Total assets',
			type: EntityFieldType.Primitive,
			primitiveType: type('bigint'),
			cardinality: EntityFieldCardinality.ZeroOrOne,
		},
		{
			name: 'totalSupply',
			label: 'Total supply',
			type: EntityFieldType.Primitive,
			primitiveType: type('bigint'),
			cardinality: EntityFieldCardinality.ZeroOrOne,
		},
		{
			name: 'assetsPerShare',
			label: 'Assets per share',
			type: EntityFieldType.Primitive,
			primitiveType: type('number'),
			cardinality: EntityFieldCardinality.ZeroOrOne,
		},
		{
			name: 'sharesPerAsset',
			label: 'Shares per asset',
			type: EntityFieldType.Primitive,
			primitiveType: type('number'),
			cardinality: EntityFieldCardinality.ZeroOrOne,
		},
		{
			name: 'maxDepositAssets',
			label: 'Max deposit assets',
			type: EntityFieldType.Primitive,
			primitiveType: type('bigint'),
			cardinality: EntityFieldCardinality.ZeroOrOne,
		},
		{
			name: 'maxMintShares',
			label: 'Max mint shares',
			type: EntityFieldType.Primitive,
			primitiveType: type('bigint'),
			cardinality: EntityFieldCardinality.ZeroOrOne,
		},
		{
			name: 'maxWithdrawAssets',
			label: 'Max withdraw assets',
			type: EntityFieldType.Primitive,
			primitiveType: type('bigint'),
			cardinality: EntityFieldCardinality.ZeroOrOne,
		},
		{
			name: 'maxRedeemShares',
			label: 'Max redeem shares',
			type: EntityFieldType.Primitive,
			primitiveType: type('bigint'),
			cardinality: EntityFieldCardinality.ZeroOrOne,
		},
		{
			name: 'previewDepositShares',
			label: 'Preview deposit shares',
			type: EntityFieldType.Primitive,
			primitiveType: type('bigint'),
			cardinality: EntityFieldCardinality.ZeroOrOne,
		},
		{
			name: 'previewMintAssets',
			label: 'Preview mint assets',
			type: EntityFieldType.Primitive,
			primitiveType: type('bigint'),
			cardinality: EntityFieldCardinality.ZeroOrOne,
		},
		{
			name: 'previewWithdrawShares',
			label: 'Preview withdraw shares',
			type: EntityFieldType.Primitive,
			primitiveType: type('bigint'),
			cardinality: EntityFieldCardinality.ZeroOrOne,
		},
		{
			name: 'previewRedeemAssets',
			label: 'Preview redeem assets',
			type: EntityFieldType.Primitive,
			primitiveType: type('bigint'),
			cardinality: EntityFieldCardinality.ZeroOrOne,
		},
	],
} as const satisfies EntityDefinition

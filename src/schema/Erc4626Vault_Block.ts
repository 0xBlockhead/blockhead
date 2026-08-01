// Generated from APP.ts.

import { entity } from '$/schema/$schema.ts'
import { EntityFieldCardinality } from '$/schema/EntityFieldCardinality.ts'
import { EntityType } from '$/schema/EntityType.ts'
import { type } from 'arktype'

export default entity({
	entityType: EntityType.Erc4626Vault_Block,
	labels: {
		singular: 'erc4626 vault block',
		plural: 'erc4626 vault blocks',
	},
})({
	$vault: {
		label: 'Vault',
		entityType: EntityType.Erc4626Vault,
		cardinality: EntityFieldCardinality.One,
	},
	blockNumber: {
		label: 'Block number',
		description: 'The block height or number in its network.',
		primitiveType: type('number'),
		cardinality: EntityFieldCardinality.One,
	},
	source: {
		label: 'Source',
		description: 'The source that produced this observation.',
		primitiveType: type('string'),
		cardinality: EntityFieldCardinality.One,
	},
	totalAssets: {
		label: 'Total assets',
		primitiveType: type('bigint'),
		cardinality: EntityFieldCardinality.ZeroOrOne,
	},
	totalSupply: {
		label: 'Total supply',
		primitiveType: type('bigint'),
		cardinality: EntityFieldCardinality.ZeroOrOne,
	},
	assetsPerShare: {
		label: 'Assets per share',
		primitiveType: type('number'),
		cardinality: EntityFieldCardinality.ZeroOrOne,
	},
	sharesPerAsset: {
		label: 'Shares per asset',
		primitiveType: type('number'),
		cardinality: EntityFieldCardinality.ZeroOrOne,
	},
	maxDepositAssets: {
		label: 'Max deposit assets',
		primitiveType: type('bigint'),
		cardinality: EntityFieldCardinality.ZeroOrOne,
	},
	maxMintShares: {
		label: 'Max mint shares',
		primitiveType: type('bigint'),
		cardinality: EntityFieldCardinality.ZeroOrOne,
	},
	maxWithdrawAssets: {
		label: 'Max withdraw assets',
		primitiveType: type('bigint'),
		cardinality: EntityFieldCardinality.ZeroOrOne,
	},
	maxRedeemShares: {
		label: 'Max redeem shares',
		primitiveType: type('bigint'),
		cardinality: EntityFieldCardinality.ZeroOrOne,
	},
	previewDepositShares: {
		label: 'Preview deposit shares',
		primitiveType: type('bigint'),
		cardinality: EntityFieldCardinality.ZeroOrOne,
	},
	previewMintAssets: {
		label: 'Preview mint assets',
		primitiveType: type('bigint'),
		cardinality: EntityFieldCardinality.ZeroOrOne,
	},
	previewWithdrawShares: {
		label: 'Preview withdraw shares',
		primitiveType: type('bigint'),
		cardinality: EntityFieldCardinality.ZeroOrOne,
	},
	previewRedeemAssets: {
		label: 'Preview redeem assets',
		primitiveType: type('bigint'),
		cardinality: EntityFieldCardinality.ZeroOrOne,
	},
})({
	selectors: {
		VaultBlockNumberSource: [
			'$vault',
			'blockNumber',
			'source',
		],
	},
})

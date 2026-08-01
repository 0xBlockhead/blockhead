// Generated from APP.ts.

import { entity } from '$/schema/$schema.ts'
import { EntityFieldCardinality } from '$/schema/EntityFieldCardinality.ts'
import { EntityType } from '$/schema/EntityType.ts'
import { EvmAddress } from '$/schema/ZeroExHex.ts'
import { type } from 'arktype'

export default entity({
	entityType: EntityType.Erc4626Vault_Timestamp,
	labels: {
		singular: 'erc4626 vault timestamp',
		plural: 'erc4626 vault observations',
	},
})({
	$vault: {
		label: 'Vault',
		entityType: EntityType.Erc4626Vault,
		cardinality: EntityFieldCardinality.One,
	},
	timestampMs: {
		label: 'Timestamp',
		description: 'The observation time in Unix milliseconds.',
		primitiveType: type('number'),
		cardinality: EntityFieldCardinality.One,
	},
	source: {
		label: 'Source',
		description: 'The source that produced this observation.',
		primitiveType: type('string'),
		cardinality: EntityFieldCardinality.One,
	},
	apyBase: {
		label: 'APY base',
		primitiveType: type('number'),
		cardinality: EntityFieldCardinality.ZeroOrOne,
	},
	apyReward: {
		label: 'APY reward',
		primitiveType: type('number'),
		cardinality: EntityFieldCardinality.ZeroOrOne,
	},
	apyTotal: {
		label: 'APY total',
		primitiveType: type('number'),
		cardinality: EntityFieldCardinality.ZeroOrOne,
	},
	tvlUsd: {
		label: 'TVL USD',
		primitiveType: type('number'),
		cardinality: EntityFieldCardinality.ZeroOrOne,
	},
	rewardTokens: {
		label: 'Reward tokens',
		primitiveType: EvmAddress,
		cardinality: EntityFieldCardinality.Many,
	},
	poolId: {
		label: 'Pool ID',
		primitiveType: type('string'),
		cardinality: EntityFieldCardinality.ZeroOrOne,
	},
	projectSlug: {
		label: 'Project slug',
		primitiveType: type('string'),
		cardinality: EntityFieldCardinality.ZeroOrOne,
	},
	chainLabel: {
		label: 'Chain label',
		primitiveType: type('string'),
		cardinality: EntityFieldCardinality.ZeroOrOne,
	},
})({
	selectors: {
		VaultTimestampMsSource: [
			'$vault',
			'timestampMs',
			'source',
		],
	},
})

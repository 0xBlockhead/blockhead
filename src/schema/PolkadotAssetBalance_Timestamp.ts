// Generated from APP.ts.

import { entity } from '$/schema/$schema.ts'
import { EntityFieldCardinality } from '$/schema/EntityFieldCardinality.ts'
import { EntityType } from '$/schema/EntityType.ts'
import { Source } from '$/sources/Source.ts'
import { type } from 'arktype'

export default entity({
	entityType: EntityType.PolkadotAssetBalance_Timestamp,
	labels: {
		singular: 'Polkadot asset balance timestamp',
		plural: 'Polkadot asset balance observations',
	},
})({
	$account: {
		entityType: EntityType.PolkadotAccount,
		cardinality: EntityFieldCardinality.One,
	},
	$asset: {
		entityType: EntityType.PolkadotAsset,
		cardinality: EntityFieldCardinality.One,
	},
	timestampMs: {
		primitiveType: type('number'),
		cardinality: EntityFieldCardinality.One,
	},
	source: {
		primitiveType: type('string'),
		cardinality: EntityFieldCardinality.One,
	},
	blockNumber: {
		primitiveType: type('bigint'),
		cardinality: EntityFieldCardinality.ZeroOrOne,
		defaultSources: [
			Source.SubstrateSidecar_Rest,
		],
	},
	blockHash: {
		primitiveType: type('string'),
		cardinality: EntityFieldCardinality.ZeroOrOne,
		defaultSources: [
			Source.SubstrateSidecar_Rest,
		],
	},
	freeBalancePlancks: {
		primitiveType: type('bigint'),
		cardinality: EntityFieldCardinality.ZeroOrOne,
		defaultSources: [
			Source.SubstrateSidecar_Rest,
		],
	},
	reservedBalancePlancks: {
		primitiveType: type('bigint'),
		cardinality: EntityFieldCardinality.ZeroOrOne,
	},
	frozenBalancePlancks: {
		primitiveType: type('bigint'),
		cardinality: EntityFieldCardinality.ZeroOrOne,
	},
	transferableBalancePlancks: {
		primitiveType: type('bigint'),
		cardinality: EntityFieldCardinality.ZeroOrOne,
	},
	lockedBalancePlancks: {
		primitiveType: type('bigint'),
		cardinality: EntityFieldCardinality.ZeroOrOne,
	},
	status: {
		primitiveType: type('string'),
		cardinality: EntityFieldCardinality.ZeroOrOne,
		defaultSources: [
			Source.SubstrateSidecar_Rest,
		],
	},
	reason: {
		primitiveType: type('string'),
		cardinality: EntityFieldCardinality.ZeroOrOne,
	},
})({
	selectors: {
		AccountAssetTimestampMsSource: [
			'$account',
			'$asset',
			'timestampMs',
			'source',
		],
	},
})

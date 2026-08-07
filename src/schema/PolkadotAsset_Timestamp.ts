// Generated from APP.ts.

import { entity } from '$/schema/$schema.ts'
import { EntityFieldCardinality } from '$/schema/EntityFieldCardinality.ts'
import { EntityType } from '$/schema/EntityType.ts'
import { Source } from '$/sources/Source.ts'
import { type } from 'arktype'

export default entity({
	entityType: EntityType.PolkadotAsset_Timestamp,
	labels: {
		singular: 'Polkadot asset timestamp',
		plural: 'Polkadot asset observations',
	},
})({
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
	supply: {
		primitiveType: type('bigint'),
		cardinality: EntityFieldCardinality.ZeroOrOne,
		defaultSources: [
			Source.SubstrateSidecar_Rest,
		],
	},
	holderCount: {
		primitiveType: type('number'),
		cardinality: EntityFieldCardinality.ZeroOrOne,
		defaultSources: [
			Source.SubstrateSidecar_Rest,
		],
	},
	status: {
		primitiveType: type('string'),
		cardinality: EntityFieldCardinality.ZeroOrOne,
		defaultSources: [
			Source.SubstrateSidecar_Rest,
		],
	},
	symbol: {
		primitiveType: type('string'),
		cardinality: EntityFieldCardinality.ZeroOrOne,
		defaultSources: [
			Source.SubstrateSidecar_Rest,
		],
	},
	name: {
		primitiveType: type('string'),
		cardinality: EntityFieldCardinality.ZeroOrOne,
		defaultSources: [
			Source.SubstrateSidecar_Rest,
		],
	},
	decimals: {
		primitiveType: type('number'),
		cardinality: EntityFieldCardinality.ZeroOrOne,
		defaultSources: [
			Source.SubstrateSidecar_Rest,
		],
	},
	existentialDepositPlancks: {
		primitiveType: type('bigint'),
		cardinality: EntityFieldCardinality.ZeroOrOne,
		defaultSources: [
			Source.SubstrateSidecar_Rest,
		],
	},
	owner: {
		primitiveType: type('string'),
		cardinality: EntityFieldCardinality.ZeroOrOne,
		defaultSources: [
			Source.SubstrateSidecar_Rest,
		],
	},
	issuer: {
		primitiveType: type('string'),
		cardinality: EntityFieldCardinality.ZeroOrOne,
		defaultSources: [
			Source.SubstrateSidecar_Rest,
		],
	},
	admin: {
		primitiveType: type('string'),
		cardinality: EntityFieldCardinality.ZeroOrOne,
		defaultSources: [
			Source.SubstrateSidecar_Rest,
		],
	},
	freezer: {
		primitiveType: type('string'),
		cardinality: EntityFieldCardinality.ZeroOrOne,
		defaultSources: [
			Source.SubstrateSidecar_Rest,
		],
	},
})({
	selectors: {
		AssetTimestampMsSource: [
			'$asset',
			'timestampMs',
			'source',
		],
	},
})

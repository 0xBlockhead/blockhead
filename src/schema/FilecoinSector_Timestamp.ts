// Generated from APP.ts.

import { entity } from '$/schema/$schema.ts'
import { EntityFieldCardinality } from '$/schema/EntityFieldCardinality.ts'
import { EntityType } from '$/schema/EntityType.ts'
import { Source } from '$/sources/Source.ts'
import { type } from 'arktype'

const lotusJsonRpcSources = [
	Source.Lotus_JsonRpc,
] as const

export default entity({
	entityType: EntityType.FilecoinSector_Timestamp,
	labels: {
		singular: 'filecoin sector timestamp',
		plural: 'filecoin sector observations',
	},
})({
	$sector: {
		entityType: EntityType.FilecoinSector,
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
	height: {
		primitiveType: type('bigint'),
		cardinality: EntityFieldCardinality.ZeroOrOne,
	},
	tipsetKey: {
		primitiveType: type('string'),
		cardinality: EntityFieldCardinality.ZeroOrOne,
	},
	$tipset: {
		entityType: EntityType.FilecoinTipset,
		cardinality: EntityFieldCardinality.ZeroOrOne,
	},
	sealedCid: {
		primitiveType: type('string'),
		cardinality: EntityFieldCardinality.ZeroOrOne,
		defaultSources: lotusJsonRpcSources,
	},
	activationEpoch: {
		primitiveType: type('bigint'),
		cardinality: EntityFieldCardinality.ZeroOrOne,
		defaultSources: lotusJsonRpcSources,
	},
	expirationEpoch: {
		primitiveType: type('bigint'),
		cardinality: EntityFieldCardinality.ZeroOrOne,
		defaultSources: lotusJsonRpcSources,
	},
	dealIds: {
		primitiveType: type('bigint'),
		cardinality: EntityFieldCardinality.Many,
	},
})({
	selectors: {
		SectorTimestampMsSource: [
			'$sector',
			'timestampMs',
			'source',
		],
	},
})

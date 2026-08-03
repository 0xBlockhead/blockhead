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
	entityType: EntityType.FilecoinSector,
	labels: {
		singular: 'filecoin sector',
		plural: 'filecoin sectors',
	},
})({
	$miner: {
		entityType: EntityType.FilecoinMiner,
		cardinality: EntityFieldCardinality.One,
	},
	sectorNumber: {
		primitiveType: type('bigint'),
		cardinality: EntityFieldCardinality.One,
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
})({
	selectors: {
		FilecoinMinerSectorNumber: [
			'$miner',
			'sectorNumber',
		],
	},
})

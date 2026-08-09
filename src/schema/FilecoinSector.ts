// Generated from APP.ts.

import { entity } from '$/schema/$schema.ts'
import { EntityFieldCardinality } from '$/schema/EntityFieldCardinality.ts'
import { EntityType } from '$/schema/EntityType.ts'
import { Source } from '$/sources/Source.ts'
import { type } from 'arktype'

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
		primitiveType: type('bigint').narrow((value) => value >= 0n),
		cardinality: EntityFieldCardinality.One,
	},
	sealedCid: {
		primitiveType: type('string'),
		cardinality: EntityFieldCardinality.ZeroOrOne,
		defaultSources: [
			Source.Lotus_JsonRpc,
		],
	},
	activationEpoch: {
		primitiveType: type('bigint'),
		cardinality: EntityFieldCardinality.ZeroOrOne,
		defaultSources: [
			Source.Lotus_JsonRpc,
		],
	},
	expirationEpoch: {
		primitiveType: type('bigint'),
		cardinality: EntityFieldCardinality.ZeroOrOne,
		defaultSources: [
			Source.Lotus_JsonRpc,
		],
	},
})({
	selectors: {
		FilecoinMinerSectorNumber: [
			'$miner',
			'sectorNumber',
		],
	},
})

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
		label: 'Miner',
		entityType: EntityType.FilecoinMiner,
		cardinality: EntityFieldCardinality.One,
	},
	sectorNumber: {
		label: 'Sector number',
		primitiveType: type('bigint'),
		cardinality: EntityFieldCardinality.One,
	},
	sealedCid: {
		label: 'Sealed CID',
		primitiveType: type('string'),
		cardinality: EntityFieldCardinality.ZeroOrOne,
		defaultSources: [
			Source.Lotus_JsonRpc,
		],
	},
	activationEpoch: {
		label: 'Activation epoch',
		primitiveType: type('bigint'),
		cardinality: EntityFieldCardinality.ZeroOrOne,
		defaultSources: [
			Source.Lotus_JsonRpc,
		],
	},
	expirationEpoch: {
		label: 'Expiration epoch',
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

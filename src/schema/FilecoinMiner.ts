// Generated from APP.ts.

import { entity } from '$/schema/$schema.ts'
import { EntityFieldCardinality } from '$/schema/EntityFieldCardinality.ts'
import { EntityType } from '$/schema/EntityType.ts'
import { Source } from '$/sources/Source.ts'
import { type } from 'arktype'

export default entity({
	entityType: EntityType.FilecoinMiner,
	labels: {
		singular: 'filecoin miner',
		plural: 'filecoin miners',
	},
})({
	$network: {
		label: 'Network',
		entityType: EntityType.Network,
		cardinality: EntityFieldCardinality.One,
	},
	minerAddress: {
		label: 'Miner address',
		primitiveType: type('string'),
		cardinality: EntityFieldCardinality.One,
	},
	$$sectors: {
		label: 'Sectors',
		entityType: EntityType.FilecoinSector,
		cardinality: EntityFieldCardinality.Many,
		defaultSources: [
			Source.Lotus_JsonRpc,
		],
	},
	$$timestamps: {
		label: 'Observations',
		entityType: EntityType.FilecoinMiner_Timestamp,
		cardinality: EntityFieldCardinality.Many,
		defaultSources: [
			Source.Lotus_JsonRpc,
		],
	},
})({
	selectors: {
		NetworkMinerAddress: [
			'$network',
			'minerAddress',
		],
	},
})

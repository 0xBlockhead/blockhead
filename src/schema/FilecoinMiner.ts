// Generated from APP.ts. Do not edit by hand.

import { entity, facet } from '$/schema/$schema.ts'
import { EntityFieldCardinality, EntityFieldType } from '$/schema/EntityField.ts'
import { EntityType } from '$/schema/EntityType.ts'
import { Source } from '$/sources/Source.ts'
import { type } from 'arktype'

export enum FilecoinMinerSelector {
	NetworkMinerAddress = 'NetworkMinerAddress',
}
export const FilecoinMiner = entity({
	entityType: EntityType.FilecoinMiner,
	labels: {
		singular: 'filecoin miner',
		plural: 'filecoin miners',
	},
})({
	$network: {
		label: 'Network',
		type: EntityFieldType.EntityReference,
		entityType: EntityType.Network,
		cardinality: EntityFieldCardinality.One,
	},
	minerAddress: {
		label: 'Miner address',
		type: EntityFieldType.Primitive,
		primitiveType: type('string'),
		cardinality: EntityFieldCardinality.One,
	},
	$$sectors: {
		label: 'Sectors',
		type: EntityFieldType.EntitiesReference,
		entityType: EntityType.FilecoinSector,
		cardinality: EntityFieldCardinality.Many,
		defaultSources: [
			Source.Lotus_JsonRpc,
		],
	},
	$$timestamps: {
		label: 'Observations',
		type: EntityFieldType.EntitiesReference,
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

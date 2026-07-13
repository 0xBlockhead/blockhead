// Generated from APP.ts. Do not edit by hand.

import { entity, EntityFieldCardinality, EntityFieldType, facet } from '$/schema/$schema.ts'
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
	$owner: {
		label: 'Owner',
		type: EntityFieldType.EntityReference,
		entityType: EntityType.FilecoinActor,
		cardinality: EntityFieldCardinality.ZeroOrOne,
		defaultSources: [
			Source.Lotus_JsonRpc,
			Source.Filfox_Rest,
		],
	},
	$worker: {
		label: 'Worker',
		type: EntityFieldType.EntityReference,
		entityType: EntityType.FilecoinActor,
		cardinality: EntityFieldCardinality.ZeroOrOne,
		defaultSources: [
			Source.Lotus_JsonRpc,
			Source.Filfox_Rest,
		],
	},
	peerId: {
		label: 'Peer ID',
		type: EntityFieldType.Primitive,
		primitiveType: type('string'),
		cardinality: EntityFieldCardinality.ZeroOrOne,
		defaultSources: [
			Source.Lotus_JsonRpc,
			Source.Filfox_Rest,
		],
	},
	qualityAdjustedPower: {
		label: 'Quality adjusted power',
		type: EntityFieldType.Primitive,
		primitiveType: type('bigint'),
		cardinality: EntityFieldCardinality.ZeroOrOne,
		defaultSources: [
			Source.Lotus_JsonRpc,
			Source.Filfox_Rest,
		],
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
})({
	selectors: {
		NetworkMinerAddress: [
			'$network',
			'minerAddress',
		],
	},
})

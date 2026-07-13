// Generated from APP.ts. Do not edit by hand.

import { entity, EntityFieldCardinality, EntityFieldType, facet } from '$/schema/$schema.ts'
import { EntityType } from '$/schema/EntityType.ts'
import { Source } from '$/sources/Source.ts'
import { type } from 'arktype'

export enum FilecoinNetworkSelector {
	Network = 'Network',
}
export const FilecoinNetwork = entity({
	entityType: EntityType.FilecoinNetwork,
	labels: {
		singular: 'filecoin network',
		plural: 'filecoin networks',
	},
	description: 'Filecoin-specific view over a canonical Network row, including Lotus endpoints, chain head observations, and tipsets.',
})({
	$network: {
		label: 'Network',
		type: EntityFieldType.EntityReference,
		entityType: EntityType.Network,
		cardinality: EntityFieldCardinality.One,
	},
	rpcEndpoints: {
		label: 'RPC endpoints',
		type: EntityFieldType.Primitive,
		primitiveType: type({ 'url': type('string'), 'transportType': type('string'), 'providerName': type('string') }),
		cardinality: EntityFieldCardinality.Many,
		defaultSources: [
			Source.Lotus_JsonRpc,
		],
	},
	$$timestamps: {
		label: 'Observations',
		type: EntityFieldType.EntitiesReference,
		entityType: EntityType.FilecoinNetwork_Timestamp,
		cardinality: EntityFieldCardinality.Many,
		defaultSources: [
			Source.Lotus_JsonRpc,
		],
	},
	$$tipsets: {
		label: 'Tipsets',
		type: EntityFieldType.EntitiesReference,
		entityType: EntityType.FilecoinTipset,
		cardinality: EntityFieldCardinality.Many,
		defaultSources: [
			Source.Lotus_JsonRpc,
		],
	},
})({
	selectors: {
		Network: [
			'$network',
		],
	},
})

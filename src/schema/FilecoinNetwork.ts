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
	entityType: EntityType.FilecoinNetwork,
	labels: {
		singular: 'filecoin network',
		plural: 'filecoin networks',
	},
	description: 'Filecoin-specific view over a canonical Network row, including Lotus endpoints, chain head observations, and tipsets.',
})({
	$network: {
		entityType: EntityType.Network,
		cardinality: EntityFieldCardinality.One,
	},
	rpcEndpoints: {
		primitiveType: type({
			url: type('string'),
			transportType: type('string'),
			providerName: type('string'),
		}),
		cardinality: EntityFieldCardinality.Many,
		defaultSources: lotusJsonRpcSources,
	},
	$$timestamps: {
		entityType: EntityType.FilecoinNetwork_Timestamp,
		cardinality: EntityFieldCardinality.Many,
		defaultSources: lotusJsonRpcSources,
	},
	$$tipsets: {
		entityType: EntityType.FilecoinTipset,
		cardinality: EntityFieldCardinality.Many,
		defaultSources: lotusJsonRpcSources,
	},
})({
	selectors: {
		Network: [
			'$network',
		],
	},
})

// Generated from APP.ts.

import { entity } from '$/schema/$schema.ts'
import { EntityFieldCardinality } from '$/schema/EntityFieldCardinality.ts'
import { EntityType } from '$/schema/EntityType.ts'
import { UrlString } from '$/schema/UrlString.ts'
import { type } from 'arktype'

export default entity({
	entityType: EntityType.BlockheadKaspaNodeState,
	labels: {
		singular: 'blockhead kaspa node state',
		plural: 'blockhead kaspa node states',
	},
})({
	connectionId: {
		label: 'connection ID',
		primitiveType: type('string'),
		cardinality: EntityFieldCardinality.One,
	},
	$network: {
		label: 'network',
		entityType: EntityType.KaspaNetwork,
		cardinality: EntityFieldCardinality.One,
	},
	rpcUrl: {
		label: 'RPC URL',
		primitiveType: UrlString,
		cardinality: EntityFieldCardinality.ZeroOrOne,
	},
	encoding: {
		label: 'encoding',
		primitiveType: type('string'),
		cardinality: EntityFieldCardinality.ZeroOrOne,
	},
	networkId: {
		label: 'network ID',
		primitiveType: type('string'),
		cardinality: EntityFieldCardinality.ZeroOrOne,
	},
	$$timestamps: {
		label: 'timestamps',
		entityType: EntityType.BlockheadKaspaNodeState_Timestamp,
		cardinality: EntityFieldCardinality.Many,
	},
})({
	selectors: {
		ConnectionIdNetwork: [
			'connectionId',
			'$network',
		],
	},
})

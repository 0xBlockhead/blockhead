// Generated from APP.ts.

import { entity } from '$/schema/$schema.ts'
import { EntityFieldCardinality } from '$/schema/EntityFieldCardinality.ts'
import { EntityType } from '$/schema/EntityType.ts'
import { UrlString } from '$/schema/UrlString.ts'
import { Source } from '$/sources/Source.ts'
import { type } from 'arktype'

export default entity({
	entityType: EntityType.MevRelay,
	labels: {
		singular: 'MEV relay',
		plural: 'MEV relays',
	},
})({
	$network: {
		label: 'Network',
		entityType: EntityType.Network,
		cardinality: EntityFieldCardinality.One,
	},
	host: {
		label: 'Host',
		primitiveType: type('string'),
		cardinality: EntityFieldCardinality.One,
	},
	url: {
		label: 'URL',
		description: 'The URL for the source-domain resource.',
		primitiveType: UrlString,
		cardinality: EntityFieldCardinality.One,
	},
	$$timestamps: {
		label: 'Timestamps',
		entityType: EntityType.MevRelay_Timestamp,
		cardinality: EntityFieldCardinality.Many,
		defaultSources: [
			Source.MevRelay_Rest,
		],
	},
})({
	selectors: {
		EvmNetworkHost: [
			'$network',
			'host',
		],
	},
})

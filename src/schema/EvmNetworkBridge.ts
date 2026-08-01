// Generated from APP.ts.

import { entity } from '$/schema/$schema.ts'
import { EntityFieldCardinality } from '$/schema/EntityFieldCardinality.ts'
import { EntityType } from '$/schema/EntityType.ts'
import { UrlString } from '$/schema/UrlString.ts'
import { type } from 'arktype'

export default entity({
	entityType: EntityType.EvmNetworkBridge,
	labels: {
		singular: 'EVM network bridge',
		plural: 'EVM network bridges',
	},
})({
	$fromNetwork: {
		label: 'From network',
		entityType: EntityType.Network,
		cardinality: EntityFieldCardinality.One,
	},
	$toNetwork: {
		label: 'To network',
		entityType: EntityType.Network,
		cardinality: EntityFieldCardinality.One,
	},
	url: {
		label: 'URL',
		description: 'The URL for the source-domain resource.',
		primitiveType: UrlString,
		cardinality: EntityFieldCardinality.One,
	},
	relationshipType: {
		label: 'Relationship type',
		primitiveType: type('string'),
		cardinality: EntityFieldCardinality.ZeroOrOne,
	},
})({
	selectors: {
		FromToUrl: [
			'$fromNetwork',
			'$toNetwork',
			'url',
		],
	},
})

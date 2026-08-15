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
		entityType: EntityType.Network,
		cardinality: EntityFieldCardinality.One,
	},
	host: {
		primitiveType: type('string'),
		cardinality: EntityFieldCardinality.One,
	},
	url: {
		primitiveType: UrlString,
		cardinality: EntityFieldCardinality.One,
	},
	$$timestamps: {
		entityType: EntityType.MevRelay_Timestamp,
		cardinality: EntityFieldCardinality.Many,
		defaultSources: [
			Source.MevRelay_Rest,
		],
	},
	$$deliveredPayloads: {
		entityType: EntityType.MevRelay_ProposerPayloadDelivered,
		cardinality: EntityFieldCardinality.Many,
		defaultSources: [
			Source.MevRelay_Rest,
		],
	},
	$$receivedBids: {
		entityType: EntityType.MevRelay_BuilderBlockReceived,
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

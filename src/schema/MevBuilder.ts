// Generated from APP.ts.

import { entity } from '$/schema/$schema.ts'
import { EntityFieldCardinality } from '$/schema/EntityFieldCardinality.ts'
import { EntityType } from '$/schema/EntityType.ts'
import { Source } from '$/sources/Source.ts'
import { type } from 'arktype'

const mevRelayRestSources = [
	Source.MevRelay_Rest,
] as const

export default entity({
	entityType: EntityType.MevBuilder,
	labels: {
		singular: 'MEV builder',
		plural: 'MEV builders',
	},
})({
	$network: {
		entityType: EntityType.Network,
		cardinality: EntityFieldCardinality.One,
	},
	builderPubkey: {
		primitiveType: type('string'),
		cardinality: EntityFieldCardinality.One,
	},
	$$timestamps: {
		entityType: EntityType.MevBuilder_Timestamp,
		cardinality: EntityFieldCardinality.Many,
		defaultSources: mevRelayRestSources,
	},
	$$deliveredPayloads: {
		entityType: EntityType.MevRelay_ProposerPayloadDelivered,
		cardinality: EntityFieldCardinality.Many,
		defaultSources: mevRelayRestSources,
	},
})({
	selectors: {
		EvmNetworkBuilderPubkey: [
			'$network',
			'builderPubkey',
		],
	},
})

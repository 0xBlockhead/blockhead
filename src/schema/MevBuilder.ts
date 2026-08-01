// Generated from APP.ts.

import { entity } from '$/schema/$schema.ts'
import { EntityFieldCardinality } from '$/schema/EntityFieldCardinality.ts'
import { EntityType } from '$/schema/EntityType.ts'
import { Source } from '$/sources/Source.ts'
import { type } from 'arktype'

export default entity({
	entityType: EntityType.MevBuilder,
	labels: {
		singular: 'MEV builder',
		plural: 'MEV builders',
	},
})({
	$network: {
		label: 'Network',
		entityType: EntityType.Network,
		cardinality: EntityFieldCardinality.One,
	},
	builderPubkey: {
		label: 'Builder public key',
		primitiveType: type('string'),
		cardinality: EntityFieldCardinality.One,
	},
	$$timestamps: {
		label: 'Timestamps',
		entityType: EntityType.MevBuilder_Timestamp,
		cardinality: EntityFieldCardinality.Many,
		defaultSources: [
			Source.MevRelay_Rest,
		],
	},
	$$deliveredPayloads: {
		label: 'Delivered payloads',
		entityType: EntityType.MevRelay_ProposerPayloadDelivered,
		cardinality: EntityFieldCardinality.Many,
		defaultSources: [
			Source.MevRelay_Rest,
		],
	},
})({
	selectors: {
		EvmNetworkBuilderPubkey: [
			'$network',
			'builderPubkey',
		],
	},
})

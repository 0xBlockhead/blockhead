// Generated from APP.ts. Do not edit by hand.

import { entity, EntityFieldCardinality, EntityFieldType, facet } from '$/schema/$schema.ts'
import { EntityType } from '$/schema/EntityType.ts'
import { Source } from '$/sources/Source.ts'
import { type } from 'arktype'

export enum MevBuilderSelector {
	EvmNetworkBuilderPubkey = 'EvmNetworkBuilderPubkey',
}
export const MevBuilder = entity({
	entityType: EntityType.MevBuilder,
	labels: {
		singular: 'MEV builder',
		plural: 'MEV builders',
	},
})({
	$network: {
		label: 'Network',
		type: EntityFieldType.EntityReference,
		entityType: EntityType.Network,
		cardinality: EntityFieldCardinality.One,
	},
	builderPubkey: {
		label: 'Builder public key',
		type: EntityFieldType.Primitive,
		primitiveType: type('string'),
		cardinality: EntityFieldCardinality.One,
	},
	$$timestamps: {
		label: 'Timestamps',
		type: EntityFieldType.EntitiesReference,
		entityType: EntityType.MevBuilder_Timestamp,
		cardinality: EntityFieldCardinality.Many,
		defaultSources: [
			Source.MevRelay_Rest,
		],
	},
	$$deliveredPayloads: {
		label: 'Delivered payloads',
		type: EntityFieldType.EntitiesReference,
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

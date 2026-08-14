// Generated from APP.ts.

import { entity } from '$/schema/$schema.ts'
import { EntityFieldCardinality } from '$/schema/EntityFieldCardinality.ts'
import { EntityType } from '$/schema/EntityType.ts'
import { EvmAddress, ZeroExHex } from '$/schema/ZeroExHex.ts'
import { type } from 'arktype'

export default entity({
	entityType: EntityType.BeaconExecutionConsolidationRequest,
	labels: {
		singular: 'Beacon execution consolidation request',
		plural: 'Beacon execution consolidation requests',
	},
	description: 'A consolidation request carried by one delivered Gloas execution payload envelope.',
})({
	$envelope: {
		entityType: EntityType.BeaconExecutionPayloadEnvelope,
		cardinality: EntityFieldCardinality.One,
	},
	indexInEnvelope: {
		primitiveType: type('number.integer >= 0'),
		cardinality: EntityFieldCardinality.One,
	},
	sourceAddress: {
		primitiveType: EvmAddress,
		cardinality: EntityFieldCardinality.One,
	},
	sourcePubkey: {
		primitiveType: ZeroExHex,
		cardinality: EntityFieldCardinality.One,
	},
	targetPubkey: {
		primitiveType: ZeroExHex,
		cardinality: EntityFieldCardinality.One,
	},
})({
	selectors: {
		EnvelopeIndexInEnvelope: [
			'$envelope',
			'indexInEnvelope',
		],
	},
})

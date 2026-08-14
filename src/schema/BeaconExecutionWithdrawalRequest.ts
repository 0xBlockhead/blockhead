// Generated from APP.ts.

import { entity } from '$/schema/$schema.ts'
import { EntityFieldCardinality } from '$/schema/EntityFieldCardinality.ts'
import { EntityType } from '$/schema/EntityType.ts'
import { EvmAddress, ZeroExHex } from '$/schema/ZeroExHex.ts'
import { type } from 'arktype'

export default entity({
	entityType: EntityType.BeaconExecutionWithdrawalRequest,
	labels: {
		singular: 'Beacon execution withdrawal request',
		plural: 'Beacon execution withdrawal requests',
	},
	description: 'A withdrawal request carried by one delivered Gloas execution payload envelope.',
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
	validatorPubkey: {
		primitiveType: ZeroExHex,
		cardinality: EntityFieldCardinality.One,
	},
	amountGwei: {
		primitiveType: type('bigint'),
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

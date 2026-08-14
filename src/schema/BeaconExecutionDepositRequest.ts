// Generated from APP.ts.

import { entity } from '$/schema/$schema.ts'
import { EntityFieldCardinality } from '$/schema/EntityFieldCardinality.ts'
import { EntityType } from '$/schema/EntityType.ts'
import { ZeroExHex } from '$/schema/ZeroExHex.ts'
import { type } from 'arktype'

export default entity({
	entityType: EntityType.BeaconExecutionDepositRequest,
	labels: {
		singular: 'Beacon execution deposit request',
		plural: 'Beacon execution deposit requests',
	},
	description: 'A deposit request carried by one delivered Gloas execution payload envelope.',
})({
	$envelope: {
		entityType: EntityType.BeaconExecutionPayloadEnvelope,
		cardinality: EntityFieldCardinality.One,
	},
	requestIndex: {
		primitiveType: type('bigint'),
		cardinality: EntityFieldCardinality.One,
	},
	pubkey: {
		primitiveType: ZeroExHex,
		cardinality: EntityFieldCardinality.One,
	},
	withdrawalCredentials: {
		primitiveType: ZeroExHex,
		cardinality: EntityFieldCardinality.One,
	},
	amountGwei: {
		primitiveType: type('bigint'),
		cardinality: EntityFieldCardinality.One,
	},
	signature: {
		primitiveType: ZeroExHex,
		cardinality: EntityFieldCardinality.One,
	},
})({
	selectors: {
		EnvelopeRequestIndex: [
			'$envelope',
			'requestIndex',
		],
	},
})

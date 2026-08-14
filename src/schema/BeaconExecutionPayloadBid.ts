// Generated from APP.ts.

import { entity } from '$/schema/$schema.ts'
import { EntityFieldCardinality } from '$/schema/EntityFieldCardinality.ts'
import { EntityType } from '$/schema/EntityType.ts'
import { EvmAddress, ZeroExHex } from '$/schema/ZeroExHex.ts'
import { type } from 'arktype'

export default entity({
	entityType: EntityType.BeaconExecutionPayloadBid,
	labels: {
		singular: 'Beacon execution payload bid',
		plural: 'Beacon execution payload bids',
	},
	description: 'The signed execution-payload commitment selected by one Gloas beacon block.',
})({
	$beaconBlock: {
		entityType: EntityType.BeaconBlock,
		cardinality: EntityFieldCardinality.One,
	},
	builderIndex: {
		primitiveType: type('number.integer >= 0'),
		cardinality: EntityFieldCardinality.One,
	},
	parentExecutionBlockHash: {
		primitiveType: ZeroExHex,
		cardinality: EntityFieldCardinality.One,
	},
	executionBlockHash: {
		primitiveType: ZeroExHex,
		cardinality: EntityFieldCardinality.One,
	},
	prevRandao: {
		primitiveType: ZeroExHex,
		cardinality: EntityFieldCardinality.One,
	},
	feeRecipient: {
		primitiveType: EvmAddress,
		cardinality: EntityFieldCardinality.One,
	},
	gasLimit: {
		primitiveType: type('bigint'),
		cardinality: EntityFieldCardinality.One,
	},
	valueGwei: {
		primitiveType: type('bigint'),
		cardinality: EntityFieldCardinality.One,
	},
	executionPaymentGwei: {
		primitiveType: type('bigint'),
		cardinality: EntityFieldCardinality.One,
	},
	blobKzgCommitments: {
		primitiveType: ZeroExHex,
		cardinality: EntityFieldCardinality.Many,
	},
	executionRequestsRoot: {
		primitiveType: ZeroExHex,
		cardinality: EntityFieldCardinality.One,
	},
	signature: {
		primitiveType: ZeroExHex,
		cardinality: EntityFieldCardinality.One,
	},
})({
	selectors: {
		BeaconBlock: [
			'$beaconBlock',
		],
	},
})

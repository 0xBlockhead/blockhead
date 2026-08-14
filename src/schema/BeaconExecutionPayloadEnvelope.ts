// Generated from APP.ts.

import { entity } from '$/schema/$schema.ts'
import { EntityFieldCardinality } from '$/schema/EntityFieldCardinality.ts'
import { EntityType } from '$/schema/EntityType.ts'
import { EvmAddress, ZeroExHex } from '$/schema/ZeroExHex.ts'
import { Source } from '$/sources/Source.ts'
import { type } from 'arktype'

export default entity({
	entityType: EntityType.BeaconExecutionPayloadEnvelope,
	labels: {
		singular: 'Beacon execution payload envelope',
		plural: 'Beacon execution payload envelopes',
	},
	description: 'The separately signed execution payload delivered for one Gloas beacon block.',
})({
	$beaconBlock: {
		entityType: EntityType.BeaconBlock,
		cardinality: EntityFieldCardinality.One,
	},
	$bid: {
		entityType: EntityType.BeaconExecutionPayloadBid,
		cardinality: EntityFieldCardinality.One,
	},
	$executionBlock: {
		entityType: EntityType.EvmBlock,
		cardinality: EntityFieldCardinality.One,
	},
	$parentExecutionBlock: {
		entityType: EntityType.EvmBlock,
		cardinality: EntityFieldCardinality.One,
	},
	builderIndex: {
		primitiveType: type('number.integer >= 0'),
		cardinality: EntityFieldCardinality.One,
	},
	signature: {
		primitiveType: ZeroExHex,
		cardinality: EntityFieldCardinality.One,
	},
	blockNumber: {
		primitiveType: type('bigint'),
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
	gasUsed: {
		primitiveType: type('bigint'),
		cardinality: EntityFieldCardinality.One,
	},
	executionTimestampMs: {
		primitiveType: type('number.integer >= 0'),
		cardinality: EntityFieldCardinality.One,
	},
	slotNumber: {
		primitiveType: type('number.integer >= 0'),
		cardinality: EntityFieldCardinality.One,
	},
	baseFeePerGas: {
		primitiveType: type('bigint'),
		cardinality: EntityFieldCardinality.One,
	},
	blobGasUsed: {
		primitiveType: type('bigint'),
		cardinality: EntityFieldCardinality.One,
	},
	excessBlobGas: {
		primitiveType: type('bigint'),
		cardinality: EntityFieldCardinality.One,
	},
	blockAccessList: {
		primitiveType: ZeroExHex,
		cardinality: EntityFieldCardinality.One,
	},
	transactionCount: {
		primitiveType: type('number.integer >= 0'),
		cardinality: EntityFieldCardinality.One,
	},
	$$timestamps: {
		entityType: EntityType.BeaconExecutionPayloadEnvelope_Timestamp,
		cardinality: EntityFieldCardinality.Many,
		defaultSources: [
			Source.Beacon_Rest,
		],
	},
})({
	selectors: {
		BeaconBlock: [
			'$beaconBlock',
		],
	},
})

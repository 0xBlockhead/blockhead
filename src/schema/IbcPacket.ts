// Generated from APP.ts.

import { entity } from '$/schema/$schema.ts'
import { EntityFieldCardinality } from '$/schema/EntityFieldCardinality.ts'
import { EntityType } from '$/schema/EntityType.ts'
import { type } from 'arktype'

export default entity({
	entityType: EntityType.IbcPacket,
	labels: {
		singular: 'IBC packet',
		plural: 'IBC packets',
	},
})({
	$channel: {
		label: 'Channel',
		entityType: EntityType.IbcChannel,
		cardinality: EntityFieldCardinality.One,
	},
	sequence: {
		label: 'Sequence',
		primitiveType: type('bigint'),
		cardinality: EntityFieldCardinality.One,
	},
	direction: {
		label: 'Direction',
		primitiveType: type('string'),
		cardinality: EntityFieldCardinality.One,
	},
	sourcePort: {
		label: 'Source port',
		primitiveType: type('string'),
		cardinality: EntityFieldCardinality.ZeroOrOne,
	},
	sourceChannel: {
		label: 'Source channel',
		primitiveType: type('string'),
		cardinality: EntityFieldCardinality.ZeroOrOne,
	},
	destinationPort: {
		label: 'Destination port',
		primitiveType: type('string'),
		cardinality: EntityFieldCardinality.ZeroOrOne,
	},
	destinationChannel: {
		label: 'Destination channel',
		primitiveType: type('string'),
		cardinality: EntityFieldCardinality.ZeroOrOne,
	},
	timeoutHeight: {
		label: 'Timeout height',
		primitiveType: type('unknown'),
		cardinality: EntityFieldCardinality.ZeroOrOne,
	},
	timeoutTimestampNs: {
		label: 'Timeout timestamp ns',
		primitiveType: type('bigint'),
		cardinality: EntityFieldCardinality.ZeroOrOne,
	},
	dataHash: {
		label: 'Data hash',
		primitiveType: type('string'),
		cardinality: EntityFieldCardinality.ZeroOrOne,
	},
	commitmentHash: {
		label: 'Commitment hash',
		primitiveType: type('string'),
		cardinality: EntityFieldCardinality.ZeroOrOne,
	},
	acknowledgementHash: {
		label: 'Acknowledgement hash',
		primitiveType: type('string'),
		cardinality: EntityFieldCardinality.ZeroOrOne,
	},
	receiptExists: {
		label: 'Receipt exists',
		primitiveType: type('boolean'),
		cardinality: EntityFieldCardinality.ZeroOrOne,
	},
	status: {
		label: 'Status',
		primitiveType: type('string'),
		cardinality: EntityFieldCardinality.ZeroOrOne,
	},
	sendTxHash: {
		label: 'Send transaction hash',
		primitiveType: type('string'),
		cardinality: EntityFieldCardinality.ZeroOrOne,
	},
	receiveTxHash: {
		label: 'Receive transaction hash',
		primitiveType: type('string'),
		cardinality: EntityFieldCardinality.ZeroOrOne,
	},
	acknowledgeTxHash: {
		label: 'Acknowledge transaction hash',
		primitiveType: type('string'),
		cardinality: EntityFieldCardinality.ZeroOrOne,
	},
	timeoutTxHash: {
		label: 'Timeout transaction hash',
		primitiveType: type('string'),
		cardinality: EntityFieldCardinality.ZeroOrOne,
	},
	$denomTrace: {
		label: 'Denom trace',
		entityType: EntityType.IbcDenomTrace,
		cardinality: EntityFieldCardinality.ZeroOrOne,
	},
})({
	selectors: {
		ChannelSequenceDirection: [
			'$channel',
			'sequence',
			'direction',
		],
	},
})

// Generated from APP.ts. Do not edit by hand.

import { EntityFieldCardinality, EntityFieldType, type EntityDefinition } from '$/schema/$schema.ts'
import { EntityType } from '$/schema/EntityType.ts'
import { type } from 'arktype'

export enum IbcPacketSelector {
	ChannelSequenceDirection = 'ChannelSequenceDirection',
}
export default {
	entityType: EntityType.IbcPacket,
	label: 'IBC packet',
	labelPlural: 'IBC packets',
	selectors: [
		{
			name: IbcPacketSelector.ChannelSequenceDirection,
			fields: [
				'$channel',
				'sequence',
				'direction',
			],
		},
	],
	fields: [
		{
			name: '$channel',
			label: 'Channel',
			type: EntityFieldType.EntityReference,
			entityType: EntityType.IbcChannel,
			cardinality: EntityFieldCardinality.One,
		},
		{
			name: 'sequence',
			label: 'Sequence',
			type: EntityFieldType.Primitive,
			primitiveType: type('bigint'),
			cardinality: EntityFieldCardinality.One,
		},
		{
			name: 'direction',
			label: 'Direction',
			type: EntityFieldType.Primitive,
			primitiveType: type('string'),
			cardinality: EntityFieldCardinality.One,
		},
		{
			name: 'sourcePort',
			label: 'Source port',
			type: EntityFieldType.Primitive,
			primitiveType: type('string'),
			cardinality: EntityFieldCardinality.ZeroOrOne,
		},
		{
			name: 'sourceChannel',
			label: 'Source channel',
			type: EntityFieldType.Primitive,
			primitiveType: type('string'),
			cardinality: EntityFieldCardinality.ZeroOrOne,
		},
		{
			name: 'destinationPort',
			label: 'Destination port',
			type: EntityFieldType.Primitive,
			primitiveType: type('string'),
			cardinality: EntityFieldCardinality.ZeroOrOne,
		},
		{
			name: 'destinationChannel',
			label: 'Destination channel',
			type: EntityFieldType.Primitive,
			primitiveType: type('string'),
			cardinality: EntityFieldCardinality.ZeroOrOne,
		},
		{
			name: 'timeoutHeight',
			label: 'Timeout height',
			type: EntityFieldType.Primitive,
			primitiveType: type('unknown'),
			cardinality: EntityFieldCardinality.ZeroOrOne,
		},
		{
			name: 'timeoutTimestampNs',
			label: 'Timeout timestamp ns',
			type: EntityFieldType.Primitive,
			primitiveType: type('bigint'),
			cardinality: EntityFieldCardinality.ZeroOrOne,
		},
		{
			name: 'dataHash',
			label: 'Data hash',
			type: EntityFieldType.Primitive,
			primitiveType: type('string'),
			cardinality: EntityFieldCardinality.ZeroOrOne,
		},
		{
			name: 'commitmentHash',
			label: 'Commitment hash',
			type: EntityFieldType.Primitive,
			primitiveType: type('string'),
			cardinality: EntityFieldCardinality.ZeroOrOne,
		},
		{
			name: 'acknowledgementHash',
			label: 'Acknowledgement hash',
			type: EntityFieldType.Primitive,
			primitiveType: type('string'),
			cardinality: EntityFieldCardinality.ZeroOrOne,
		},
		{
			name: 'receiptExists',
			label: 'Receipt exists',
			type: EntityFieldType.Primitive,
			primitiveType: type('boolean'),
			cardinality: EntityFieldCardinality.ZeroOrOne,
		},
		{
			name: 'status',
			label: 'Status',
			type: EntityFieldType.Primitive,
			primitiveType: type('string'),
			cardinality: EntityFieldCardinality.ZeroOrOne,
		},
		{
			name: 'sendTxHash',
			label: 'Send transaction hash',
			type: EntityFieldType.Primitive,
			primitiveType: type('string'),
			cardinality: EntityFieldCardinality.ZeroOrOne,
		},
		{
			name: 'receiveTxHash',
			label: 'Receive transaction hash',
			type: EntityFieldType.Primitive,
			primitiveType: type('string'),
			cardinality: EntityFieldCardinality.ZeroOrOne,
		},
		{
			name: 'acknowledgeTxHash',
			label: 'Acknowledge transaction hash',
			type: EntityFieldType.Primitive,
			primitiveType: type('string'),
			cardinality: EntityFieldCardinality.ZeroOrOne,
		},
		{
			name: 'timeoutTxHash',
			label: 'Timeout transaction hash',
			type: EntityFieldType.Primitive,
			primitiveType: type('string'),
			cardinality: EntityFieldCardinality.ZeroOrOne,
		},
		{
			name: '$denomTrace',
			label: 'Denom trace',
			type: EntityFieldType.EntityReference,
			entityType: EntityType.IbcDenomTrace,
			cardinality: EntityFieldCardinality.ZeroOrOne,
		},
	],
} as const satisfies EntityDefinition

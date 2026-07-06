// Generated from APP.ts. Do not edit by hand.

import { EntityFieldCardinality, EntityFieldType, type EntityDefinition } from '$/schema/$schema.ts'
import { EntityType } from '$/schema/EntityType.ts'
import { ZeroExHex } from '$/schema/ZeroExHex.ts'
import { type } from 'arktype'

export enum CctpMessageSelector {
	SourceDomainNonce = 'SourceDomainNonce',
}
export default {
	entityType: EntityType.CctpMessage,
	label: 'CCTP message',
	labelPlural: 'CCTP messages',
	selectors: [
		{
			name: CctpMessageSelector.SourceDomainNonce,
			fields: [
				'sourceDomain',
				'nonce',
			],
		},
	],
	fields: [
		{
			name: 'sourceDomain',
			label: 'Source domain',
			type: EntityFieldType.Primitive,
			primitiveType: type('number'),
			cardinality: EntityFieldCardinality.One,
		},
		{
			name: 'nonce',
			label: 'Nonce',
			type: EntityFieldType.Primitive,
			primitiveType: type('string'),
			cardinality: EntityFieldCardinality.One,
		},
		{
			name: 'cctpVersion',
			label: 'CCTP version',
			type: EntityFieldType.Primitive,
			primitiveType: type('number'),
			cardinality: EntityFieldCardinality.ZeroOrOne,
		},
		{
			name: 'messageHash',
			label: 'Message hash',
			type: EntityFieldType.Primitive,
			primitiveType: (ZeroExHex),
			cardinality: EntityFieldCardinality.ZeroOrOne,
		},
		{
			name: 'messageBytes',
			label: 'Message bytes',
			type: EntityFieldType.Primitive,
			primitiveType: (ZeroExHex),
			cardinality: EntityFieldCardinality.ZeroOrOne,
		},
		{
			name: 'sourceTransactionHash',
			label: 'Source transaction hash',
			type: EntityFieldType.Primitive,
			primitiveType: (ZeroExHex),
			cardinality: EntityFieldCardinality.ZeroOrOne,
		},
		{
			name: 'sourceLogIndex',
			label: 'Source log index',
			type: EntityFieldType.Primitive,
			primitiveType: type('number'),
			cardinality: EntityFieldCardinality.ZeroOrOne,
		},
		{
			name: '$sourceDomain',
			label: 'Source domain',
			type: EntityFieldType.EntityReference,
			entityType: EntityType.CctpDomainSupport,
			cardinality: EntityFieldCardinality.ZeroOrOne,
		},
		{
			name: '$destinationDomain',
			label: 'Destination domain',
			type: EntityFieldType.EntityReference,
			entityType: EntityType.CctpDomainSupport,
			cardinality: EntityFieldCardinality.ZeroOrOne,
		},
		{
			name: 'destinationDomain',
			label: 'Destination domain',
			type: EntityFieldType.Primitive,
			primitiveType: type('number'),
			cardinality: EntityFieldCardinality.ZeroOrOne,
		},
		{
			name: 'sender',
			label: 'Sender',
			type: EntityFieldType.Primitive,
			primitiveType: type('string'),
			cardinality: EntityFieldCardinality.ZeroOrOne,
		},
		{
			name: 'recipient',
			label: 'Recipient',
			type: EntityFieldType.Primitive,
			primitiveType: type('string'),
			cardinality: EntityFieldCardinality.ZeroOrOne,
		},
		{
			name: 'destinationCaller',
			label: 'Destination caller',
			type: EntityFieldType.Primitive,
			primitiveType: type('string'),
			cardinality: EntityFieldCardinality.ZeroOrOne,
		},
		{
			name: 'burnToken',
			label: 'Burn token',
			type: EntityFieldType.Primitive,
			primitiveType: type('string'),
			cardinality: EntityFieldCardinality.ZeroOrOne,
		},
		{
			name: 'mintRecipient',
			label: 'Mint recipient',
			type: EntityFieldType.Primitive,
			primitiveType: type('string'),
			cardinality: EntityFieldCardinality.ZeroOrOne,
		},
		{
			name: 'amount',
			label: 'Amount',
			type: EntityFieldType.Primitive,
			primitiveType: type('bigint'),
			cardinality: EntityFieldCardinality.ZeroOrOne,
		},
		{
			name: 'messageSender',
			label: 'Message sender',
			type: EntityFieldType.Primitive,
			primitiveType: type('string'),
			cardinality: EntityFieldCardinality.ZeroOrOne,
		},
		{
			name: 'maxFee',
			label: 'Max fee',
			type: EntityFieldType.Primitive,
			primitiveType: type('bigint'),
			cardinality: EntityFieldCardinality.ZeroOrOne,
		},
		{
			name: 'feeExecuted',
			label: 'Fee executed',
			type: EntityFieldType.Primitive,
			primitiveType: type('bigint'),
			cardinality: EntityFieldCardinality.ZeroOrOne,
		},
		{
			name: 'expirationBlock',
			label: 'Expiration block',
			type: EntityFieldType.Primitive,
			primitiveType: type('bigint'),
			cardinality: EntityFieldCardinality.ZeroOrOne,
		},
		{
			name: 'hookData',
			label: 'Hook data',
			type: EntityFieldType.Primitive,
			primitiveType: (ZeroExHex),
			cardinality: EntityFieldCardinality.ZeroOrOne,
		},
		{
			name: 'minFinalityThreshold',
			label: 'Minimum finality threshold',
			type: EntityFieldType.Primitive,
			primitiveType: type('number'),
			cardinality: EntityFieldCardinality.ZeroOrOne,
		},
		{
			name: 'finalityThresholdExecuted',
			label: 'Finality threshold executed',
			type: EntityFieldType.Primitive,
			primitiveType: type('number'),
			cardinality: EntityFieldCardinality.ZeroOrOne,
		},
		{
			name: '$$attestationTimestamps',
			label: 'Attestation timestamps',
			type: EntityFieldType.EntitiesReference,
			entityType: EntityType.CctpAttestation_Timestamp,
			cardinality: EntityFieldCardinality.Many,
		},
	],
} as const satisfies EntityDefinition

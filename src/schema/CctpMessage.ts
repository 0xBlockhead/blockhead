// Generated from APP.ts. Do not edit by hand.

import { entity } from '$/schema/$schema.ts'
import { EntityFieldCardinality, EntityFieldType } from '$/schema/EntityField.ts'
import { EntityType } from '$/schema/EntityType.ts'
import { ZeroExHex } from '$/schema/ZeroExHex.ts'
import { type } from 'arktype'

export default entity({
	entityType: EntityType.CctpMessage,
	labels: {
		singular: 'CCTP message',
		plural: 'CCTP messages',
	},
})({
	sourceDomain: {
		label: 'Source domain',
		type: EntityFieldType.Primitive,
		primitiveType: type('number'),
		cardinality: EntityFieldCardinality.One,
	},
	nonce: {
		label: 'Nonce',
		type: EntityFieldType.Primitive,
		primitiveType: type('string'),
		cardinality: EntityFieldCardinality.One,
	},
	cctpVersion: {
		label: 'CCTP version',
		type: EntityFieldType.Primitive,
		primitiveType: type('number'),
		cardinality: EntityFieldCardinality.ZeroOrOne,
	},
	messageHash: {
		label: 'Message hash',
		type: EntityFieldType.Primitive,
		primitiveType: ZeroExHex,
		cardinality: EntityFieldCardinality.ZeroOrOne,
	},
	messageBytes: {
		label: 'Message bytes',
		type: EntityFieldType.Primitive,
		primitiveType: ZeroExHex,
		cardinality: EntityFieldCardinality.ZeroOrOne,
	},
	sourceTransactionHash: {
		label: 'Source transaction hash',
		type: EntityFieldType.Primitive,
		primitiveType: ZeroExHex,
		cardinality: EntityFieldCardinality.ZeroOrOne,
	},
	sourceLogIndex: {
		label: 'Source log index',
		type: EntityFieldType.Primitive,
		primitiveType: type('number'),
		cardinality: EntityFieldCardinality.ZeroOrOne,
	},
	$sourceDomain: {
		label: 'Source domain',
		type: EntityFieldType.EntityReference,
		entityType: EntityType.CctpDomainSupport,
		cardinality: EntityFieldCardinality.ZeroOrOne,
	},
	$destinationDomain: {
		label: 'Destination domain',
		type: EntityFieldType.EntityReference,
		entityType: EntityType.CctpDomainSupport,
		cardinality: EntityFieldCardinality.ZeroOrOne,
	},
	destinationDomain: {
		label: 'Destination domain',
		type: EntityFieldType.Primitive,
		primitiveType: type('number'),
		cardinality: EntityFieldCardinality.ZeroOrOne,
	},
	sender: {
		label: 'Sender',
		type: EntityFieldType.Primitive,
		primitiveType: type('string'),
		cardinality: EntityFieldCardinality.ZeroOrOne,
	},
	recipient: {
		label: 'Recipient',
		type: EntityFieldType.Primitive,
		primitiveType: type('string'),
		cardinality: EntityFieldCardinality.ZeroOrOne,
	},
	destinationCaller: {
		label: 'Destination caller',
		type: EntityFieldType.Primitive,
		primitiveType: type('string'),
		cardinality: EntityFieldCardinality.ZeroOrOne,
	},
	burnToken: {
		label: 'Burn token',
		type: EntityFieldType.Primitive,
		primitiveType: type('string'),
		cardinality: EntityFieldCardinality.ZeroOrOne,
	},
	mintRecipient: {
		label: 'Mint recipient',
		type: EntityFieldType.Primitive,
		primitiveType: type('string'),
		cardinality: EntityFieldCardinality.ZeroOrOne,
	},
	amount: {
		label: 'Amount',
		type: EntityFieldType.Primitive,
		primitiveType: type('bigint'),
		cardinality: EntityFieldCardinality.ZeroOrOne,
	},
	messageSender: {
		label: 'Message sender',
		type: EntityFieldType.Primitive,
		primitiveType: type('string'),
		cardinality: EntityFieldCardinality.ZeroOrOne,
	},
	maxFee: {
		label: 'Max fee',
		type: EntityFieldType.Primitive,
		primitiveType: type('bigint'),
		cardinality: EntityFieldCardinality.ZeroOrOne,
	},
	feeExecuted: {
		label: 'Fee executed',
		type: EntityFieldType.Primitive,
		primitiveType: type('bigint'),
		cardinality: EntityFieldCardinality.ZeroOrOne,
	},
	expirationBlock: {
		label: 'Expiration block',
		type: EntityFieldType.Primitive,
		primitiveType: type('bigint'),
		cardinality: EntityFieldCardinality.ZeroOrOne,
	},
	hookData: {
		label: 'Hook data',
		type: EntityFieldType.Primitive,
		primitiveType: ZeroExHex,
		cardinality: EntityFieldCardinality.ZeroOrOne,
	},
	minFinalityThreshold: {
		label: 'Minimum finality threshold',
		type: EntityFieldType.Primitive,
		primitiveType: type('number'),
		cardinality: EntityFieldCardinality.ZeroOrOne,
	},
	finalityThresholdExecuted: {
		label: 'Finality threshold executed',
		type: EntityFieldType.Primitive,
		primitiveType: type('number'),
		cardinality: EntityFieldCardinality.ZeroOrOne,
	},
	$$attestationTimestamps: {
		label: 'Attestation timestamps',
		type: EntityFieldType.EntitiesReference,
		entityType: EntityType.CctpAttestation_Timestamp,
		cardinality: EntityFieldCardinality.Many,
	},
})({
	selectors: {
		SourceDomainNonce: [
			'sourceDomain',
			'nonce',
		],
	},
})

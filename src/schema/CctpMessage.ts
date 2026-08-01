// Generated from APP.ts.

import { entity } from '$/schema/$schema.ts'
import { EntityFieldCardinality } from '$/schema/EntityFieldCardinality.ts'
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
		primitiveType: type('number'),
		cardinality: EntityFieldCardinality.One,
	},
	nonce: {
		label: 'Nonce',
		primitiveType: type('string'),
		cardinality: EntityFieldCardinality.One,
	},
	cctpVersion: {
		label: 'CCTP version',
		primitiveType: type('number'),
		cardinality: EntityFieldCardinality.ZeroOrOne,
	},
	messageHash: {
		label: 'Message hash',
		primitiveType: ZeroExHex,
		cardinality: EntityFieldCardinality.ZeroOrOne,
	},
	messageBytes: {
		label: 'Message bytes',
		primitiveType: ZeroExHex,
		cardinality: EntityFieldCardinality.ZeroOrOne,
	},
	sourceTransactionHash: {
		label: 'Source transaction hash',
		primitiveType: ZeroExHex,
		cardinality: EntityFieldCardinality.ZeroOrOne,
	},
	sourceLogIndex: {
		label: 'Source log index',
		primitiveType: type('number'),
		cardinality: EntityFieldCardinality.ZeroOrOne,
	},
	$sourceDomain: {
		label: 'Source domain',
		entityType: EntityType.CctpDomainSupport,
		cardinality: EntityFieldCardinality.ZeroOrOne,
	},
	$destinationDomain: {
		label: 'Destination domain',
		entityType: EntityType.CctpDomainSupport,
		cardinality: EntityFieldCardinality.ZeroOrOne,
	},
	destinationDomain: {
		label: 'Destination domain',
		primitiveType: type('number'),
		cardinality: EntityFieldCardinality.ZeroOrOne,
	},
	sender: {
		label: 'Sender',
		primitiveType: type('string'),
		cardinality: EntityFieldCardinality.ZeroOrOne,
	},
	recipient: {
		label: 'Recipient',
		primitiveType: type('string'),
		cardinality: EntityFieldCardinality.ZeroOrOne,
	},
	destinationCaller: {
		label: 'Destination caller',
		primitiveType: type('string'),
		cardinality: EntityFieldCardinality.ZeroOrOne,
	},
	burnToken: {
		label: 'Burn token',
		primitiveType: type('string'),
		cardinality: EntityFieldCardinality.ZeroOrOne,
	},
	mintRecipient: {
		label: 'Mint recipient',
		primitiveType: type('string'),
		cardinality: EntityFieldCardinality.ZeroOrOne,
	},
	amount: {
		label: 'Amount',
		primitiveType: type('bigint'),
		cardinality: EntityFieldCardinality.ZeroOrOne,
	},
	messageSender: {
		label: 'Message sender',
		primitiveType: type('string'),
		cardinality: EntityFieldCardinality.ZeroOrOne,
	},
	maxFee: {
		label: 'Max fee',
		primitiveType: type('bigint'),
		cardinality: EntityFieldCardinality.ZeroOrOne,
	},
	feeExecuted: {
		label: 'Fee executed',
		primitiveType: type('bigint'),
		cardinality: EntityFieldCardinality.ZeroOrOne,
	},
	expirationBlock: {
		label: 'Expiration block',
		primitiveType: type('bigint'),
		cardinality: EntityFieldCardinality.ZeroOrOne,
	},
	hookData: {
		label: 'Hook data',
		primitiveType: ZeroExHex,
		cardinality: EntityFieldCardinality.ZeroOrOne,
	},
	minFinalityThreshold: {
		label: 'Minimum finality threshold',
		primitiveType: type('number'),
		cardinality: EntityFieldCardinality.ZeroOrOne,
	},
	finalityThresholdExecuted: {
		label: 'Finality threshold executed',
		primitiveType: type('number'),
		cardinality: EntityFieldCardinality.ZeroOrOne,
	},
	$$attestationTimestamps: {
		label: 'Attestation timestamps',
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

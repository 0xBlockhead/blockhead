// Generated from APP.ts. Do not edit by hand.

import { entity } from '$/schema/$schema.ts'
import { EntityFieldCardinality } from '$/schema/EntityFieldCardinality.ts'
import { EntityFieldType } from '$/schema/EntityFieldType.ts'
import { EntityType } from '$/schema/EntityType.ts'
import { type } from 'arktype'

export default entity({
	entityType: EntityType.BlockheadPayjoinSession,
	labels: {
		singular: 'blockhead payjoin session',
		plural: 'blockhead payjoin sessions',
	},
})({
	sessionId: {
		label: 'session ID',
		type: EntityFieldType.Primitive,
		primitiveType: type('string'),
		cardinality: EntityFieldCardinality.One,
	},
	role: {
		label: 'role',
		type: EntityFieldType.Primitive,
		primitiveType: type('string'),
		cardinality: EntityFieldCardinality.One,
	},
	status: {
		label: 'status',
		type: EntityFieldType.Primitive,
		primitiveType: type('string'),
		cardinality: EntityFieldCardinality.One,
	},
	$network: {
		label: 'network',
		type: EntityFieldType.EntityReference,
		entityType: EntityType.Network,
		cardinality: EntityFieldCardinality.One,
	},
	$directory: {
		label: 'directory',
		type: EntityFieldType.EntityReference,
		entityType: EntityType.PayjoinDirectory,
		cardinality: EntityFieldCardinality.ZeroOrOne,
	},
	$endpoint: {
		label: 'endpoint',
		type: EntityFieldType.EntityReference,
		entityType: EntityType.PayjoinEndpoint,
		cardinality: EntityFieldCardinality.ZeroOrOne,
	},
	bip21Uri: {
		label: 'bip21 URI',
		type: EntityFieldType.Primitive,
		primitiveType: type('string'),
		cardinality: EntityFieldCardinality.ZeroOrOne,
	},
	endpointUrl: {
		label: 'endpoint URL',
		type: EntityFieldType.Primitive,
		primitiveType: type('string'),
		cardinality: EntityFieldCardinality.ZeroOrOne,
	},
	receiverAddress: {
		label: 'receiver address',
		type: EntityFieldType.Primitive,
		primitiveType: type('string'),
		cardinality: EntityFieldCardinality.ZeroOrOne,
	},
	amountSats: {
		label: 'amount sats',
		type: EntityFieldType.Primitive,
		primitiveType: type('bigint'),
		cardinality: EntityFieldCardinality.ZeroOrOne,
	},
	disableOutputSubstitution: {
		label: 'disable output substitution',
		type: EntityFieldType.Primitive,
		primitiveType: type('boolean'),
		cardinality: EntityFieldCardinality.ZeroOrOne,
	},
	minFeeRateSatPerVbyte: {
		label: 'min fee rate sat per vbyte',
		type: EntityFieldType.Primitive,
		primitiveType: type('number'),
		cardinality: EntityFieldCardinality.ZeroOrOne,
	},
	additionalFeeOutputIndex: {
		label: 'additional fee output index',
		type: EntityFieldType.Primitive,
		primitiveType: type('number'),
		cardinality: EntityFieldCardinality.ZeroOrOne,
	},
	maxAdditionalFeeContributionSats: {
		label: 'max additional fee contribution sats',
		type: EntityFieldType.Primitive,
		primitiveType: type('bigint'),
		cardinality: EntityFieldCardinality.ZeroOrOne,
	},
	originalPsbtHash: {
		label: 'original psbt hash',
		type: EntityFieldType.Primitive,
		primitiveType: type('string'),
		cardinality: EntityFieldCardinality.ZeroOrOne,
	},
	proposalPsbtHash: {
		label: 'proposal psbt hash',
		type: EntityFieldType.Primitive,
		primitiveType: type('string'),
		cardinality: EntityFieldCardinality.ZeroOrOne,
	},
	finalTransactionId: {
		label: 'final transaction ID',
		type: EntityFieldType.Primitive,
		primitiveType: type('string'),
		cardinality: EntityFieldCardinality.ZeroOrOne,
	},
	$finalTransaction: {
		label: 'final transaction',
		type: EntityFieldType.EntityReference,
		entityType: EntityType.UtxoTransaction,
		cardinality: EntityFieldCardinality.ZeroOrOne,
	},
	errorCode: {
		label: 'error code',
		type: EntityFieldType.Primitive,
		primitiveType: type('string'),
		cardinality: EntityFieldCardinality.ZeroOrOne,
	},
	createdAt: {
		label: 'Created',
		description: 'The time when the subject was created according to the source.',
		type: EntityFieldType.Primitive,
		primitiveType: type('number'),
		cardinality: EntityFieldCardinality.One,
	},
	updatedAt: {
		label: 'Updated',
		description: 'The time when the subject was last updated according to the source.',
		type: EntityFieldType.Primitive,
		primitiveType: type('number'),
		cardinality: EntityFieldCardinality.ZeroOrOne,
	},
	completedAt: {
		label: 'completed AT',
		type: EntityFieldType.Primitive,
		primitiveType: type('number'),
		cardinality: EntityFieldCardinality.ZeroOrOne,
	},
})({
	selectors: {
		SessionId: [
			'sessionId',
		],
	},
})

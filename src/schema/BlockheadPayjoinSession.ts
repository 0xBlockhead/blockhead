// Generated from APP.ts.

import { entity } from '$/schema/$schema.ts'
import { EntityFieldCardinality } from '$/schema/EntityFieldCardinality.ts'
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
		primitiveType: type('string'),
		cardinality: EntityFieldCardinality.One,
	},
	role: {
		label: 'role',
		primitiveType: type('string'),
		cardinality: EntityFieldCardinality.One,
	},
	status: {
		label: 'status',
		primitiveType: type('string'),
		cardinality: EntityFieldCardinality.One,
	},
	$network: {
		label: 'network',
		entityType: EntityType.Network,
		cardinality: EntityFieldCardinality.One,
	},
	$directory: {
		label: 'directory',
		entityType: EntityType.PayjoinDirectory,
		cardinality: EntityFieldCardinality.ZeroOrOne,
	},
	$endpoint: {
		label: 'endpoint',
		entityType: EntityType.PayjoinEndpoint,
		cardinality: EntityFieldCardinality.ZeroOrOne,
	},
	bip21Uri: {
		label: 'bip21 URI',
		primitiveType: type('string'),
		cardinality: EntityFieldCardinality.ZeroOrOne,
	},
	endpointUrl: {
		label: 'endpoint URL',
		primitiveType: type('string'),
		cardinality: EntityFieldCardinality.ZeroOrOne,
	},
	receiverAddress: {
		label: 'receiver address',
		primitiveType: type('string'),
		cardinality: EntityFieldCardinality.ZeroOrOne,
	},
	amountSats: {
		label: 'amount sats',
		primitiveType: type('bigint'),
		cardinality: EntityFieldCardinality.ZeroOrOne,
	},
	disableOutputSubstitution: {
		label: 'disable output substitution',
		primitiveType: type('boolean'),
		cardinality: EntityFieldCardinality.ZeroOrOne,
	},
	minFeeRateSatPerVbyte: {
		label: 'min fee rate sat per vbyte',
		primitiveType: type('number'),
		cardinality: EntityFieldCardinality.ZeroOrOne,
	},
	additionalFeeOutputIndex: {
		label: 'additional fee output index',
		primitiveType: type('number'),
		cardinality: EntityFieldCardinality.ZeroOrOne,
	},
	maxAdditionalFeeContributionSats: {
		label: 'max additional fee contribution sats',
		primitiveType: type('bigint'),
		cardinality: EntityFieldCardinality.ZeroOrOne,
	},
	originalPsbtHash: {
		label: 'original psbt hash',
		primitiveType: type('string'),
		cardinality: EntityFieldCardinality.ZeroOrOne,
	},
	proposalPsbtHash: {
		label: 'proposal psbt hash',
		primitiveType: type('string'),
		cardinality: EntityFieldCardinality.ZeroOrOne,
	},
	finalTransactionId: {
		label: 'final transaction ID',
		primitiveType: type('string'),
		cardinality: EntityFieldCardinality.ZeroOrOne,
	},
	$finalTransaction: {
		label: 'final transaction',
		entityType: EntityType.UtxoTransaction,
		cardinality: EntityFieldCardinality.ZeroOrOne,
	},
	errorCode: {
		label: 'error code',
		primitiveType: type('string'),
		cardinality: EntityFieldCardinality.ZeroOrOne,
	},
	createdAt: {
		label: 'Created',
		description: 'The time when the subject was created according to the source.',
		primitiveType: type('number'),
		cardinality: EntityFieldCardinality.One,
	},
	updatedAt: {
		label: 'Updated',
		description: 'The time when the subject was last updated according to the source.',
		primitiveType: type('number'),
		cardinality: EntityFieldCardinality.ZeroOrOne,
	},
	completedAt: {
		label: 'completed AT',
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

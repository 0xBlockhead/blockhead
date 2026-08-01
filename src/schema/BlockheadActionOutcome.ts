// Generated from APP.ts.

import { entity } from '$/schema/$schema.ts'
import { EntityFieldCardinality } from '$/schema/EntityFieldCardinality.ts'
import { EntityType } from '$/schema/EntityType.ts'
import { ZeroExHex } from '$/schema/ZeroExHex.ts'
import { type } from 'arktype'

export default entity({
	entityType: EntityType.BlockheadActionOutcome,
	labels: {
		singular: 'blockhead action outcome',
		plural: 'blockhead action outcomes',
	},
})({
	sessionId: {
		label: 'session ID',
		primitiveType: type('string'),
		cardinality: EntityFieldCardinality.One,
	},
	actionId: {
		label: 'action ID',
		primitiveType: type('string'),
		cardinality: EntityFieldCardinality.One,
	},
	outcomeId: {
		label: 'outcome ID',
		primitiveType: type('string'),
		cardinality: EntityFieldCardinality.One,
	},
	$sessionAction: {
		label: 'session action',
		entityType: EntityType.BlockheadSessionAction,
		cardinality: EntityFieldCardinality.One,
	},
	outcomeKind: {
		label: 'outcome kind',
		primitiveType: type('string'),
		cardinality: EntityFieldCardinality.One,
	},
	$walletRequest: {
		label: 'wallet request',
		entityType: EntityType.BlockheadWalletRequest,
		cardinality: EntityFieldCardinality.ZeroOrOne,
	},
	$intentOrder: {
		label: 'intent order',
		entityType: EntityType.BlockheadIntentOrder,
		cardinality: EntityFieldCardinality.ZeroOrOne,
	},
	$simulation: {
		label: 'simulation',
		entityType: EntityType.BlockheadSessionSimulation,
		cardinality: EntityFieldCardinality.ZeroOrOne,
	},
	transactionHash: {
		label: 'transaction hash',
		primitiveType: ZeroExHex,
		cardinality: EntityFieldCardinality.ZeroOrOne,
	},
	transactionId: {
		label: 'transaction ID',
		primitiveType: type('string'),
		cardinality: EntityFieldCardinality.ZeroOrOne,
	},
	bridgeTransferId: {
		label: 'bridge transfer ID',
		primitiveType: type('string'),
		cardinality: EntityFieldCardinality.ZeroOrOne,
	},
	createdAt: {
		label: 'Created',
		description: 'The time when the subject was created according to the source.',
		primitiveType: type('number'),
		cardinality: EntityFieldCardinality.One,
	},
	outcomeSummary: {
		label: 'outcome summary',
		primitiveType: type('unknown'),
		cardinality: EntityFieldCardinality.ZeroOrOne,
	},
	outcomePayloadHash: {
		label: 'outcome payload hash',
		primitiveType: ZeroExHex,
		cardinality: EntityFieldCardinality.ZeroOrOne,
	},
	$$timestamps: {
		label: 'timestamps',
		entityType: EntityType.BlockheadActionOutcome_Timestamp,
		cardinality: EntityFieldCardinality.Many,
	},
})({
	selectors: {
		SessionIdActionIdOutcomeId: [
			'sessionId',
			'actionId',
			'outcomeId',
		],
	},
})

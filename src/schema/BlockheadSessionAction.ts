// Generated from APP.ts.

import { entity } from '$/schema/$schema.ts'
import { EntityFieldCardinality } from '$/schema/EntityFieldCardinality.ts'
import { EntityType } from '$/schema/EntityType.ts'
import { type } from 'arktype'

export default entity({
	entityType: EntityType.BlockheadSessionAction,
	labels: {
		singular: 'blockhead session action',
		plural: 'blockhead session actions',
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
	$session: {
		label: 'session',
		entityType: EntityType.BlockheadSession,
		cardinality: EntityFieldCardinality.One,
	},
	indexInSequence: {
		label: 'index in sequence',
		primitiveType: type('number'),
		cardinality: EntityFieldCardinality.One,
	},
	actionType: {
		label: 'action type',
		primitiveType: type('string'),
		cardinality: EntityFieldCardinality.One,
	},
	selectedProtocol: {
		label: 'selected protocol',
		primitiveType: type('string'),
		cardinality: EntityFieldCardinality.ZeroOrOne,
	},
	actionParams: {
		label: 'action params',
		primitiveType: type('unknown'),
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
		cardinality: EntityFieldCardinality.One,
	},
	$originInvocation: {
		label: 'origin invocation',
		entityType: EntityType.BlockheadIntentInvocation,
		cardinality: EntityFieldCardinality.ZeroOrOne,
	},
	$$readinessChecks: {
		label: 'readiness checks',
		entityType: EntityType.BlockheadActionReadinessCheck,
		cardinality: EntityFieldCardinality.Many,
	},
	$$quotes: {
		label: 'quotes',
		entityType: EntityType.BlockheadIntentQuote,
		cardinality: EntityFieldCardinality.Many,
	},
	$$orders: {
		label: 'orders',
		entityType: EntityType.BlockheadIntentOrder,
		cardinality: EntityFieldCardinality.Many,
	},
	$$walletRequests: {
		label: 'wallet requests',
		entityType: EntityType.BlockheadWalletRequest,
		cardinality: EntityFieldCardinality.Many,
	},
	$$outcomes: {
		label: 'outcomes',
		entityType: EntityType.BlockheadActionOutcome,
		cardinality: EntityFieldCardinality.Many,
	},
})({
	selectors: {
		SessionIdActionId: [
			'sessionId',
			'actionId',
		],
	},
})

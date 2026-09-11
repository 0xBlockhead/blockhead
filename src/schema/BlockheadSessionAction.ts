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
		primitiveType: type('string'),
		cardinality: EntityFieldCardinality.One,
	},
	actionId: {
		primitiveType: type('string'),
		cardinality: EntityFieldCardinality.One,
	},
	$session: {
		entityType: EntityType.BlockheadSession,
		cardinality: EntityFieldCardinality.One,
	},
	indexInSequence: {
		primitiveType: type('number'),
		cardinality: EntityFieldCardinality.One,
	},
	$action: {
		entityType: EntityType.BlockheadAction,
		cardinality: EntityFieldCardinality.One,
	},
	selectedProtocol: {
		primitiveType: type('string'),
		cardinality: EntityFieldCardinality.ZeroOrOne,
	},
	createdAt: {
		primitiveType: type('number'),
		cardinality: EntityFieldCardinality.One,
	},
	updatedAt: {
		primitiveType: type('number'),
		cardinality: EntityFieldCardinality.One,
	},
	$originInvocation: {
		entityType: EntityType.BlockheadIntentInvocation,
		cardinality: EntityFieldCardinality.ZeroOrOne,
	},
	$$readinessChecks: {
		entityType: EntityType.BlockheadActionReadinessCheck,
		cardinality: EntityFieldCardinality.Many,
	},
	$$quotes: {
		entityType: EntityType.BlockheadIntentQuote,
		cardinality: EntityFieldCardinality.Many,
	},
	$$orders: {
		entityType: EntityType.BlockheadIntentOrder,
		cardinality: EntityFieldCardinality.Many,
	},
	$$walletRequests: {
		entityType: EntityType.BlockheadWalletRequest,
		cardinality: EntityFieldCardinality.Many,
	},
	$$authorityRequests: {
		entityType: EntityType.BlockheadActionAuthorityRequest,
		cardinality: EntityFieldCardinality.Many,
	},
	$$outcomes: {
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

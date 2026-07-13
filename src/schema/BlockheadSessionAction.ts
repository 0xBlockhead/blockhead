// Generated from APP.ts. Do not edit by hand.

import { entity, EntityFieldCardinality, EntityFieldType, facet } from '$/schema/$schema.ts'
import { EntityType } from '$/schema/EntityType.ts'
import { type } from 'arktype'

export enum BlockheadSessionActionSelector {
	SessionIdActionId = 'SessionIdActionId',
}
export const BlockheadSessionAction = entity({
	entityType: EntityType.BlockheadSessionAction,
	labels: {
		singular: 'blockhead session action',
		plural: 'blockhead session actions',
	},
})({
	sessionId: {
		label: 'session ID',
		type: EntityFieldType.Primitive,
		primitiveType: type('string'),
		cardinality: EntityFieldCardinality.One,
	},
	actionId: {
		label: 'action ID',
		type: EntityFieldType.Primitive,
		primitiveType: type('string'),
		cardinality: EntityFieldCardinality.One,
	},
	$session: {
		label: 'session',
		type: EntityFieldType.EntityReference,
		entityType: EntityType.BlockheadSession,
		cardinality: EntityFieldCardinality.One,
	},
	indexInSequence: {
		label: 'index in sequence',
		type: EntityFieldType.Primitive,
		primitiveType: type('number'),
		cardinality: EntityFieldCardinality.One,
	},
	actionType: {
		label: 'action type',
		type: EntityFieldType.Primitive,
		primitiveType: type('string'),
		cardinality: EntityFieldCardinality.One,
	},
	selectedProtocol: {
		label: 'selected protocol',
		type: EntityFieldType.Primitive,
		primitiveType: type('string'),
		cardinality: EntityFieldCardinality.ZeroOrOne,
	},
	actionParams: {
		label: 'action params',
		type: EntityFieldType.Primitive,
		primitiveType: type('unknown'),
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
		cardinality: EntityFieldCardinality.One,
	},
	$originInvocation: {
		label: 'origin invocation',
		type: EntityFieldType.EntityReference,
		entityType: EntityType.BlockheadIntentInvocation,
		cardinality: EntityFieldCardinality.ZeroOrOne,
	},
	$$readinessChecks: {
		label: 'readiness checks',
		type: EntityFieldType.EntitiesReference,
		entityType: EntityType.BlockheadActionReadinessCheck,
		cardinality: EntityFieldCardinality.Many,
	},
	$$quotes: {
		label: 'quotes',
		type: EntityFieldType.EntitiesReference,
		entityType: EntityType.BlockheadIntentQuote,
		cardinality: EntityFieldCardinality.Many,
	},
	$$orders: {
		label: 'orders',
		type: EntityFieldType.EntitiesReference,
		entityType: EntityType.BlockheadIntentOrder,
		cardinality: EntityFieldCardinality.Many,
	},
	$$walletRequests: {
		label: 'wallet requests',
		type: EntityFieldType.EntitiesReference,
		entityType: EntityType.BlockheadWalletRequest,
		cardinality: EntityFieldCardinality.Many,
	},
	$$outcomes: {
		label: 'outcomes',
		type: EntityFieldType.EntitiesReference,
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

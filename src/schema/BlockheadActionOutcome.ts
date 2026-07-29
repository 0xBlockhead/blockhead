// Generated from APP.ts. Do not edit by hand.

import { entity } from '$/schema/$schema.ts'
import { EntityFieldCardinality } from '$/schema/EntityFieldCardinality.ts'
import { EntityFieldType } from '$/schema/EntityFieldType.ts'
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
	outcomeId: {
		label: 'outcome ID',
		type: EntityFieldType.Primitive,
		primitiveType: type('string'),
		cardinality: EntityFieldCardinality.One,
	},
	$sessionAction: {
		label: 'session action',
		type: EntityFieldType.EntityReference,
		entityType: EntityType.BlockheadSessionAction,
		cardinality: EntityFieldCardinality.One,
	},
	outcomeKind: {
		label: 'outcome kind',
		type: EntityFieldType.Primitive,
		primitiveType: type('string'),
		cardinality: EntityFieldCardinality.One,
	},
	$walletRequest: {
		label: 'wallet request',
		type: EntityFieldType.EntityReference,
		entityType: EntityType.BlockheadWalletRequest,
		cardinality: EntityFieldCardinality.ZeroOrOne,
	},
	$intentOrder: {
		label: 'intent order',
		type: EntityFieldType.EntityReference,
		entityType: EntityType.BlockheadIntentOrder,
		cardinality: EntityFieldCardinality.ZeroOrOne,
	},
	$simulation: {
		label: 'simulation',
		type: EntityFieldType.EntityReference,
		entityType: EntityType.BlockheadSessionSimulation,
		cardinality: EntityFieldCardinality.ZeroOrOne,
	},
	transactionHash: {
		label: 'transaction hash',
		type: EntityFieldType.Primitive,
		primitiveType: ZeroExHex,
		cardinality: EntityFieldCardinality.ZeroOrOne,
	},
	transactionId: {
		label: 'transaction ID',
		type: EntityFieldType.Primitive,
		primitiveType: type('string'),
		cardinality: EntityFieldCardinality.ZeroOrOne,
	},
	bridgeTransferId: {
		label: 'bridge transfer ID',
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
	outcomeSummary: {
		label: 'outcome summary',
		type: EntityFieldType.Primitive,
		primitiveType: type('unknown'),
		cardinality: EntityFieldCardinality.ZeroOrOne,
	},
	outcomePayloadHash: {
		label: 'outcome payload hash',
		type: EntityFieldType.Primitive,
		primitiveType: ZeroExHex,
		cardinality: EntityFieldCardinality.ZeroOrOne,
	},
	$$timestamps: {
		label: 'timestamps',
		type: EntityFieldType.EntitiesReference,
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

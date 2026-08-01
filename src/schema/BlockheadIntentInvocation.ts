// Generated from APP.ts.

import { entity } from '$/schema/$schema.ts'
import { EntityFieldCardinality } from '$/schema/EntityFieldCardinality.ts'
import { EntityType } from '$/schema/EntityType.ts'
import { ZeroExHex } from '$/schema/ZeroExHex.ts'
import { type } from 'arktype'

export default entity({
	entityType: EntityType.BlockheadIntentInvocation,
	labels: {
		singular: 'blockhead intent invocation',
		plural: 'blockhead intent invocations',
	},
})({
	sessionId: {
		label: 'session ID',
		primitiveType: type('string'),
		cardinality: EntityFieldCardinality.One,
	},
	invocationId: {
		label: 'invocation ID',
		primitiveType: type('string'),
		cardinality: EntityFieldCardinality.One,
	},
	$session: {
		label: 'session',
		entityType: EntityType.BlockheadSession,
		cardinality: EntityFieldCardinality.One,
	},
	modality: {
		label: 'modality',
		primitiveType: type('string'),
		cardinality: EntityFieldCardinality.One,
	},
	sourceEntityType: {
		label: 'source entity type',
		primitiveType: type('string'),
		cardinality: EntityFieldCardinality.ZeroOrOne,
	},
	sourceSelector: {
		label: 'source selector',
		primitiveType: type('unknown'),
		cardinality: EntityFieldCardinality.ZeroOrOne,
	},
	targetEntityType: {
		label: 'target entity type',
		primitiveType: type('string'),
		cardinality: EntityFieldCardinality.ZeroOrOne,
	},
	targetSelector: {
		label: 'target selector',
		primitiveType: type('unknown'),
		cardinality: EntityFieldCardinality.ZeroOrOne,
	},
	sourcePlacement: {
		label: 'source placement',
		primitiveType: type('string'),
		cardinality: EntityFieldCardinality.ZeroOrOne,
	},
	targetPlacement: {
		label: 'target placement',
		primitiveType: type('string'),
		cardinality: EntityFieldCardinality.ZeroOrOne,
	},
	invocationPayloadHash: {
		label: 'invocation payload hash',
		primitiveType: ZeroExHex,
		cardinality: EntityFieldCardinality.ZeroOrOne,
	},
	resolvedIntentType: {
		label: 'resolved intent type',
		primitiveType: type('string'),
		cardinality: EntityFieldCardinality.ZeroOrOne,
	},
	intentDefinitionKey: {
		label: 'intent definition key',
		primitiveType: type('string'),
		cardinality: EntityFieldCardinality.ZeroOrOne,
	},
	intentDefinitionHash: {
		label: 'intent definition hash',
		primitiveType: ZeroExHex,
		cardinality: EntityFieldCardinality.ZeroOrOne,
	},
	selectedOptionIndex: {
		label: 'selected option index',
		primitiveType: type('number'),
		cardinality: EntityFieldCardinality.ZeroOrOne,
	},
	selectedOptionHash: {
		label: 'selected option hash',
		primitiveType: ZeroExHex,
		cardinality: EntityFieldCardinality.ZeroOrOne,
	},
	createdAt: {
		label: 'Created',
		description: 'The time when the subject was created according to the source.',
		primitiveType: type('number'),
		cardinality: EntityFieldCardinality.One,
	},
	$createdAction: {
		label: 'created action',
		entityType: EntityType.BlockheadSessionAction,
		cardinality: EntityFieldCardinality.ZeroOrOne,
	},
})({
	selectors: {
		SessionIdInvocationId: [
			'sessionId',
			'invocationId',
		],
	},
})

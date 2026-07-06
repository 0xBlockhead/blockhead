// Generated from APP.ts. Do not edit by hand.

import { EntityFieldCardinality, EntityFieldType, type EntityDefinition } from '$/schema/$schema.ts'
import { EntityType } from '$/schema/EntityType.ts'
import { type } from 'arktype'

export enum BlockheadSessionActionSelector {
	SessionIdActionId = 'SessionIdActionId',
}
export default {
	entityType: EntityType.BlockheadSessionAction,
	label: 'blockhead session action',
	labelPlural: 'blockhead session actions',
	selectors: [
		{
			name: BlockheadSessionActionSelector.SessionIdActionId,
			fields: [
				'sessionId',
				'actionId',
			],
		},
	],
	fields: [
		{
			name: 'sessionId',
			label: 'session ID',
			type: EntityFieldType.Primitive,
			primitiveType: type('string'),
			cardinality: EntityFieldCardinality.One,
		},
		{
			name: 'actionId',
			label: 'action ID',
			type: EntityFieldType.Primitive,
			primitiveType: type('string'),
			cardinality: EntityFieldCardinality.One,
		},
		{
			name: '$session',
			label: 'session',
			type: EntityFieldType.EntityReference,
			entityType: EntityType.BlockheadSession,
			cardinality: EntityFieldCardinality.One,
		},
		{
			name: 'indexInSequence',
			label: 'index in sequence',
			type: EntityFieldType.Primitive,
			primitiveType: type('number'),
			cardinality: EntityFieldCardinality.One,
		},
		{
			name: 'actionType',
			label: 'action type',
			type: EntityFieldType.Primitive,
			primitiveType: type('string'),
			cardinality: EntityFieldCardinality.One,
		},
		{
			name: 'selectedProtocol',
			label: 'selected protocol',
			type: EntityFieldType.Primitive,
			primitiveType: type('string'),
			cardinality: EntityFieldCardinality.ZeroOrOne,
		},
		{
			name: 'actionParams',
			label: 'action params',
			type: EntityFieldType.Primitive,
			primitiveType: type('unknown'),
			cardinality: EntityFieldCardinality.ZeroOrOne,
		},
		{
			name: 'createdAt',
			label: 'Created',
			description: 'The time when the subject was created according to the source.',
			type: EntityFieldType.Primitive,
			primitiveType: type('number'),
			cardinality: EntityFieldCardinality.One,
		},
		{
			name: 'updatedAt',
			label: 'Updated',
			description: 'The time when the subject was last updated according to the source.',
			type: EntityFieldType.Primitive,
			primitiveType: type('number'),
			cardinality: EntityFieldCardinality.One,
		},
		{
			name: '$originInvocation',
			label: 'origin invocation',
			type: EntityFieldType.EntityReference,
			entityType: EntityType.BlockheadIntentInvocation,
			cardinality: EntityFieldCardinality.ZeroOrOne,
		},
		{
			name: '$$readinessChecks',
			label: 'readiness checks',
			type: EntityFieldType.EntitiesReference,
			entityType: EntityType.BlockheadActionReadinessCheck,
			cardinality: EntityFieldCardinality.Many,
		},
		{
			name: '$$quotes',
			label: 'quotes',
			type: EntityFieldType.EntitiesReference,
			entityType: EntityType.BlockheadIntentQuote,
			cardinality: EntityFieldCardinality.Many,
		},
		{
			name: '$$orders',
			label: 'orders',
			type: EntityFieldType.EntitiesReference,
			entityType: EntityType.BlockheadIntentOrder,
			cardinality: EntityFieldCardinality.Many,
		},
		{
			name: '$$walletRequests',
			label: 'wallet requests',
			type: EntityFieldType.EntitiesReference,
			entityType: EntityType.BlockheadWalletRequest,
			cardinality: EntityFieldCardinality.Many,
		},
		{
			name: '$$outcomes',
			label: 'outcomes',
			type: EntityFieldType.EntitiesReference,
			entityType: EntityType.BlockheadActionOutcome,
			cardinality: EntityFieldCardinality.Many,
		},
	],
} as const satisfies EntityDefinition

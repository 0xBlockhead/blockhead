// Generated from APP.ts. Do not edit by hand.

import { EntityFieldCardinality, EntityFieldType, type EntityDefinition } from '$/schema/$schema.ts'
import { EntityType } from '$/schema/EntityType.ts'
import { ZeroExHex } from '$/schema/ZeroExHex.ts'
import { type } from 'arktype'

export enum BlockheadActionOutcomeSelector {
	SessionIdActionIdOutcomeId = 'SessionIdActionIdOutcomeId',
}
export default {
	entityType: EntityType.BlockheadActionOutcome,
	label: 'blockhead action outcome',
	labelPlural: 'blockhead action outcomes',
	selectors: [
		{
			name: BlockheadActionOutcomeSelector.SessionIdActionIdOutcomeId,
			fields: [
				'sessionId',
				'actionId',
				'outcomeId',
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
			name: 'outcomeId',
			label: 'outcome ID',
			type: EntityFieldType.Primitive,
			primitiveType: type('string'),
			cardinality: EntityFieldCardinality.One,
		},
		{
			name: '$sessionAction',
			label: 'session action',
			type: EntityFieldType.EntityReference,
			entityType: EntityType.BlockheadSessionAction,
			cardinality: EntityFieldCardinality.One,
		},
		{
			name: 'outcomeKind',
			label: 'outcome kind',
			type: EntityFieldType.Primitive,
			primitiveType: type('string'),
			cardinality: EntityFieldCardinality.One,
		},
		{
			name: '$walletRequest',
			label: 'wallet request',
			type: EntityFieldType.EntityReference,
			entityType: EntityType.BlockheadWalletRequest,
			cardinality: EntityFieldCardinality.ZeroOrOne,
		},
		{
			name: '$intentOrder',
			label: 'intent order',
			type: EntityFieldType.EntityReference,
			entityType: EntityType.BlockheadIntentOrder,
			cardinality: EntityFieldCardinality.ZeroOrOne,
		},
		{
			name: '$simulation',
			label: 'simulation',
			type: EntityFieldType.EntityReference,
			entityType: EntityType.BlockheadSessionSimulation,
			cardinality: EntityFieldCardinality.ZeroOrOne,
		},
		{
			name: 'transactionHash',
			label: 'transaction hash',
			type: EntityFieldType.Primitive,
			primitiveType: (ZeroExHex),
			cardinality: EntityFieldCardinality.ZeroOrOne,
		},
		{
			name: 'transactionId',
			label: 'transaction ID',
			type: EntityFieldType.Primitive,
			primitiveType: type('string'),
			cardinality: EntityFieldCardinality.ZeroOrOne,
		},
		{
			name: 'bridgeTransferId',
			label: 'bridge transfer ID',
			type: EntityFieldType.Primitive,
			primitiveType: type('string'),
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
			name: 'outcomeSummary',
			label: 'outcome summary',
			type: EntityFieldType.Primitive,
			primitiveType: type('unknown'),
			cardinality: EntityFieldCardinality.ZeroOrOne,
		},
		{
			name: 'outcomePayloadHash',
			label: 'outcome payload hash',
			type: EntityFieldType.Primitive,
			primitiveType: (ZeroExHex),
			cardinality: EntityFieldCardinality.ZeroOrOne,
		},
		{
			name: '$$timestamps',
			label: 'timestamps',
			type: EntityFieldType.EntitiesReference,
			entityType: EntityType.BlockheadActionOutcome_Timestamp,
			cardinality: EntityFieldCardinality.Many,
		},
	],
} as const satisfies EntityDefinition

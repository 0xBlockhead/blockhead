// Generated from APP.ts. Do not edit by hand.

import { entity } from '$/schema/$schema.ts'
import { EntityFieldCardinality } from '$/schema/EntityFieldCardinality.ts'
import { EntityFieldType } from '$/schema/EntityFieldType.ts'
import { EntityType } from '$/schema/EntityType.ts'
import { EvmAddress } from '$/schema/ZeroExHex.ts'
import { type } from 'arktype'

export default entity({
	entityType: EntityType.BlockheadActionReadinessCheck,
	labels: {
		singular: 'blockhead action readiness check',
		plural: 'blockhead action readiness checks',
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
	checkId: {
		label: 'check ID',
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
	checkKind: {
		label: 'check kind',
		type: EntityFieldType.Primitive,
		primitiveType: type('string'),
		cardinality: EntityFieldCardinality.One,
	},
	networkCaip2: {
		label: 'network CAIP-2',
		type: EntityFieldType.Primitive,
		primitiveType: type({
			namespace: type('string'),
			reference: type('string'),
		}),
		cardinality: EntityFieldCardinality.ZeroOrOne,
	},
	accountCaip10: {
		label: 'account CAIP-10',
		type: EntityFieldType.Primitive,
		primitiveType: type({
			namespace: type('string'),
			reference: type('string'),
			accountAddress: type('string'),
		}),
		cardinality: EntityFieldCardinality.ZeroOrOne,
	},
	assetCaip19: {
		label: 'asset CAIP-19',
		type: EntityFieldType.Primitive,
		primitiveType: type('string'),
		cardinality: EntityFieldCardinality.ZeroOrOne,
	},
	chainId: {
		label: 'Chain ID',
		type: EntityFieldType.Primitive,
		primitiveType: type('number'),
		cardinality: EntityFieldCardinality.ZeroOrOne,
	},
	accountAddress: {
		label: 'account address',
		type: EntityFieldType.Primitive,
		primitiveType: EvmAddress,
		cardinality: EntityFieldCardinality.ZeroOrOne,
	},
	tokenAddress: {
		label: 'token address',
		type: EntityFieldType.Primitive,
		primitiveType: EvmAddress,
		cardinality: EntityFieldCardinality.ZeroOrOne,
	},
	spenderAddress: {
		label: 'spender address',
		type: EntityFieldType.Primitive,
		primitiveType: EvmAddress,
		cardinality: EntityFieldCardinality.ZeroOrOne,
	},
	capabilityKey: {
		label: 'capability key',
		type: EntityFieldType.Primitive,
		primitiveType: type('string'),
		cardinality: EntityFieldCardinality.ZeroOrOne,
	},
	requiredAmount: {
		label: 'required amount',
		type: EntityFieldType.Primitive,
		primitiveType: type('bigint'),
		cardinality: EntityFieldCardinality.ZeroOrOne,
	},
	createdAt: {
		label: 'Created',
		description: 'The time when the subject was created according to the source.',
		type: EntityFieldType.Primitive,
		primitiveType: type('number'),
		cardinality: EntityFieldCardinality.One,
	},
	$$timestamps: {
		label: 'timestamps',
		type: EntityFieldType.EntitiesReference,
		entityType: EntityType.BlockheadActionReadinessCheck_Timestamp,
		cardinality: EntityFieldCardinality.Many,
	},
})({
	selectors: {
		SessionIdActionIdCheckId: [
			'sessionId',
			'actionId',
			'checkId',
		],
	},
})

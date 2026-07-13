// Generated from APP.ts. Do not edit by hand.

import { entity, EntityFieldCardinality, EntityFieldType, facet } from '$/schema/$schema.ts'
import { EntityType } from '$/schema/EntityType.ts'
import { EvmAddress, ZeroExHex } from '$/schema/ZeroExHex.ts'
import { type } from 'arktype'

export enum BlockheadWalletRequestSelector {
	Id = 'Id',
}
export const BlockheadWalletRequest = entity({
	entityType: EntityType.BlockheadWalletRequest,
	labels: {
		singular: 'blockhead wallet request',
		plural: 'blockhead wallet requests',
	},
})({
	id: {
		label: 'ID',
		description: 'The identifier assigned by the source domain.',
		type: EntityFieldType.Primitive,
		primitiveType: type('string'),
		cardinality: EntityFieldCardinality.One,
	},
	$sessionAction: {
		label: 'session action',
		type: EntityFieldType.EntityReference,
		entityType: EntityType.BlockheadSessionAction,
		cardinality: EntityFieldCardinality.ZeroOrOne,
	},
	$intentOrder: {
		label: 'intent order',
		type: EntityFieldType.EntityReference,
		entityType: EntityType.BlockheadIntentOrder,
		cardinality: EntityFieldCardinality.ZeroOrOne,
	},
	$walletConnection: {
		label: 'wallet connection',
		type: EntityFieldType.EntityReference,
		entityType: EntityType.BlockheadWalletConnection,
		cardinality: EntityFieldCardinality.ZeroOrOne,
	},
	walletProtocol: {
		label: 'wallet protocol',
		type: EntityFieldType.Primitive,
		primitiveType: type('string'),
		cardinality: EntityFieldCardinality.ZeroOrOne,
	},
	caip10: {
		label: 'CAIP-10',
		description: 'The account identifier in CAIP-10 namespace, reference, and address form.',
		type: EntityFieldType.Primitive,
		primitiveType: type({ 'namespace': type('string'), 'reference': type('string'), 'accountAddress': type('string') }),
		cardinality: EntityFieldCardinality.ZeroOrOne,
	},
	requestKind: {
		label: 'request kind',
		type: EntityFieldType.Primitive,
		primitiveType: type('string'),
		cardinality: EntityFieldCardinality.One,
	},
	requestMethod: {
		label: 'request method',
		type: EntityFieldType.Primitive,
		primitiveType: type('string'),
		cardinality: EntityFieldCardinality.One,
	},
	chainId: {
		label: 'Chain ID',
		type: EntityFieldType.Primitive,
		primitiveType: type('number'),
		cardinality: EntityFieldCardinality.ZeroOrOne,
	},
	fromAddress: {
		label: 'from address',
		type: EntityFieldType.Primitive,
		primitiveType: (EvmAddress),
		cardinality: EntityFieldCardinality.ZeroOrOne,
	},
	toAddress: {
		label: 'to address',
		type: EntityFieldType.Primitive,
		primitiveType: (EvmAddress),
		cardinality: EntityFieldCardinality.ZeroOrOne,
	},
	value: {
		label: 'Value',
		description: 'The source-domain value.',
		type: EntityFieldType.Primitive,
		primitiveType: type('bigint'),
		cardinality: EntityFieldCardinality.ZeroOrOne,
	},
	callCount: {
		label: 'call count',
		type: EntityFieldType.Primitive,
		primitiveType: type('number'),
		cardinality: EntityFieldCardinality.ZeroOrOne,
	},
	atomicRequired: {
		label: 'atomic required',
		type: EntityFieldType.Primitive,
		primitiveType: type('boolean'),
		cardinality: EntityFieldCardinality.ZeroOrOne,
	},
	requestPayloadHash: {
		label: 'request payload hash',
		type: EntityFieldType.Primitive,
		primitiveType: (ZeroExHex),
		cardinality: EntityFieldCardinality.ZeroOrOne,
	},
	walletCallBundleId: {
		label: 'wallet call bundle ID',
		type: EntityFieldType.Primitive,
		primitiveType: type('string'),
		cardinality: EntityFieldCardinality.ZeroOrOne,
	},
	requestedAt: {
		label: 'requested AT',
		type: EntityFieldType.Primitive,
		primitiveType: type('number'),
		cardinality: EntityFieldCardinality.One,
	},
	submittedAt: {
		label: 'submitted AT',
		type: EntityFieldType.Primitive,
		primitiveType: type('number'),
		cardinality: EntityFieldCardinality.ZeroOrOne,
	},
	$$calls: {
		label: 'calls',
		type: EntityFieldType.EntitiesReference,
		entityType: EntityType.BlockheadWalletRequestCall,
		cardinality: EntityFieldCardinality.Many,
	},
	$$timestamps: {
		label: 'timestamps',
		type: EntityFieldType.EntitiesReference,
		entityType: EntityType.BlockheadWalletRequest_Timestamp,
		cardinality: EntityFieldCardinality.Many,
	},
})({
	selectors: {
		Id: [
			'id',
		],
	},
})

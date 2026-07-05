// Generated from APP.ts. Do not edit by hand.

import { EntityFieldCardinality, EntityFieldType, type EntityDefinition } from '$/schema/$schema.ts'
import { EntityType } from '$/schema/EntityType.ts'
import { EvmAddress, ZeroExHex } from '$/schema/ZeroExHex.ts'
import { type } from 'arktype'

export enum BlockheadWalletRequestSelector {
	Id = 'Id',
}
export default {
	entityType: EntityType.BlockheadWalletRequest,
	label: 'blockhead wallet request',
	labelPlural: 'blockhead wallet requests',
	selectors: [
		{
			name: BlockheadWalletRequestSelector.Id,
			fields: [
				'id',
			],
		},
	],
	fields: [
		{
				name: 'id',
				label: 'ID',
				description: 'The identifier assigned by the source domain.',
				type: EntityFieldType.Primitive,
				primitiveType: type('string'),
				cardinality: EntityFieldCardinality.One,
		},
		{
				name: '$sessionAction',
				label: 'session action',
				type: EntityFieldType.EntityReference,
				entityType: EntityType.BlockheadSessionAction,
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
				name: '$walletConnection',
				label: 'wallet connection',
				type: EntityFieldType.EntityReference,
				entityType: EntityType.BlockheadWalletConnection,
				cardinality: EntityFieldCardinality.ZeroOrOne,
		},
		{
				name: 'walletProtocol',
				label: 'wallet protocol',
				type: EntityFieldType.Primitive,
				primitiveType: type('string'),
				cardinality: EntityFieldCardinality.ZeroOrOne,
		},
		{
				name: 'caip10',
				label: 'CAIP-10',
				description: 'The account identifier in CAIP-10 namespace, reference, and address form.',
				type: EntityFieldType.Primitive,
				primitiveType: type({ 'namespace': type('string'), 'reference': type('string'), 'accountAddress': type('string') }),
				cardinality: EntityFieldCardinality.ZeroOrOne,
		},
		{
				name: 'requestKind',
				label: 'request kind',
				type: EntityFieldType.Primitive,
				primitiveType: type('string'),
				cardinality: EntityFieldCardinality.One,
		},
		{
				name: 'requestMethod',
				label: 'request method',
				type: EntityFieldType.Primitive,
				primitiveType: type('string'),
				cardinality: EntityFieldCardinality.One,
		},
		{
				name: 'chainId',
				label: 'Chain ID',
				type: EntityFieldType.Primitive,
				primitiveType: type('number'),
				cardinality: EntityFieldCardinality.ZeroOrOne,
		},
		{
				name: 'fromAddress',
				label: 'from address',
				type: EntityFieldType.Primitive,
				primitiveType: (EvmAddress),
				cardinality: EntityFieldCardinality.ZeroOrOne,
		},
		{
				name: 'toAddress',
				label: 'to address',
				type: EntityFieldType.Primitive,
				primitiveType: (EvmAddress),
				cardinality: EntityFieldCardinality.ZeroOrOne,
		},
		{
				name: 'value',
				label: 'Value',
				description: 'The source-domain value.',
				type: EntityFieldType.Primitive,
				primitiveType: type('bigint'),
				cardinality: EntityFieldCardinality.ZeroOrOne,
		},
		{
				name: 'callCount',
				label: 'call count',
				type: EntityFieldType.Primitive,
				primitiveType: type('number'),
				cardinality: EntityFieldCardinality.ZeroOrOne,
		},
		{
				name: 'atomicRequired',
				label: 'atomic required',
				type: EntityFieldType.Primitive,
				primitiveType: type('boolean'),
				cardinality: EntityFieldCardinality.ZeroOrOne,
		},
		{
				name: 'requestPayloadHash',
				label: 'request payload hash',
				type: EntityFieldType.Primitive,
				primitiveType: (ZeroExHex),
				cardinality: EntityFieldCardinality.ZeroOrOne,
		},
		{
				name: 'walletCallBundleId',
				label: 'wallet call bundle ID',
				type: EntityFieldType.Primitive,
				primitiveType: type('string'),
				cardinality: EntityFieldCardinality.ZeroOrOne,
		},
		{
				name: 'requestedAt',
				label: 'requested AT',
				type: EntityFieldType.Primitive,
				primitiveType: type('number'),
				cardinality: EntityFieldCardinality.One,
		},
		{
				name: 'submittedAt',
				label: 'submitted AT',
				type: EntityFieldType.Primitive,
				primitiveType: type('number'),
				cardinality: EntityFieldCardinality.ZeroOrOne,
		},
		{
				name: '$$timestamps',
				label: 'timestamps',
				type: EntityFieldType.EntitiesReference,
				entityType: EntityType.BlockheadWalletRequest_Timestamp,
				cardinality: EntityFieldCardinality.Many,
		},
	],
} as const satisfies EntityDefinition

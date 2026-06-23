import { type } from 'arktype'
import {
	EntityFieldCardinality,
	EntityFieldType,
	type EntityDefinition,
} from '$/schema/$schema.ts'
import { EntityType } from '$/schema/EntityType.ts'
import { EvmAddress } from '$/schema/ZeroExHex.ts'
export enum BlockheadTransferIntentSelector {
	SessionIdActionId = 'sessionId+actionId',
}
export default {
	entityType: EntityType.BlockheadTransferIntent,
	label: 'blockhead transfer intent',
	labelPlural: 'blockhead transfer intents',
	selectors: [
		{
			name: BlockheadTransferIntentSelector.SessionIdActionId,
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
			primitiveType: type("string"),
			cardinality: EntityFieldCardinality.One,
		},
		{
			name: 'actionId',
			label: 'action ID',
			type: EntityFieldType.Primitive,
			primitiveType: type("string"),
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
			name: 'fromCaip1',
			label: 'from caip1',
			type: EntityFieldType.Primitive,
			primitiveType: type({"namespace": "string", "reference": "string", "accountAddress": "string"}),
			cardinality: EntityFieldCardinality.Zero,
		},
		{
			name: 'toCaip1',
			label: 'to caip1',
			type: EntityFieldType.Primitive,
			primitiveType: type({"namespace": "string", "reference": "string", "accountAddress": "string"}),
			cardinality: EntityFieldCardinality.Zero,
		},
		{
			name: 'networkCaip2',
			label: 'network caip2',
			type: EntityFieldType.Primitive,
			primitiveType: type({"namespace": "string", "reference": "string"}),
			cardinality: EntityFieldCardinality.ZeroOrOne,
		},
		{
			name: 'assetCaip19',
			label: 'asset caip19',
			type: EntityFieldType.Primitive,
			primitiveType: type("string"),
			cardinality: EntityFieldCardinality.ZeroOrOne,
		},
		{
			name: 'fromAddress',
			label: 'from address',
			type: EntityFieldType.Primitive,
			primitiveType: EvmAddress,
			cardinality: EntityFieldCardinality.ZeroOrOne,
		},
		{
			name: 'toAddress',
			label: 'to address',
			type: EntityFieldType.Primitive,
			primitiveType: EvmAddress,
			cardinality: EntityFieldCardinality.ZeroOrOne,
		},
		{
			name: 'chainId',
			label: 'Chain ID',
			description: 'The chain identifier used by the network family.',
			type: EntityFieldType.Primitive,
			primitiveType: type("number"),
			cardinality: EntityFieldCardinality.ZeroOrOne,
		},
		{
			name: 'tokenAddress',
			label: 'token address',
			type: EntityFieldType.Primitive,
			primitiveType: EvmAddress,
			cardinality: EntityFieldCardinality.ZeroOrOne,
		},
		{
			name: '$fromAccount',
			label: 'from account',
			type: EntityFieldType.EntityReference,
			entityType: EntityType.Account,
			cardinality: EntityFieldCardinality.ZeroOrOne,
		},
		{
			name: '$toAccount',
			label: 'to account',
			type: EntityFieldType.EntityReference,
			entityType: EntityType.Account,
			cardinality: EntityFieldCardinality.ZeroOrOne,
		},
		{
			name: '$from',
			label: 'from',
			type: EntityFieldType.EntityReference,
			entityType: EntityType.EvmAccount,
			cardinality: EntityFieldCardinality.ZeroOrOne,
		},
		{
			name: '$to',
			label: 'to',
			type: EntityFieldType.EntityReference,
			entityType: EntityType.EvmAccount,
			cardinality: EntityFieldCardinality.ZeroOrOne,
		},
		{
			name: '$network',
			label: 'network',
			type: EntityFieldType.EntityReference,
			entityType: EntityType.Network,
			cardinality: EntityFieldCardinality.ZeroOrOne,
		},
		{
			name: '$evmNetwork',
			label: 'EVM network',
			type: EntityFieldType.EntityReference,
			entityType: EntityType.EvmNetwork,
			cardinality: EntityFieldCardinality.ZeroOrOne,
		},
		{
			name: '$token',
			label: 'token',
			type: EntityFieldType.EntityReference,
			entityType: EntityType.EvmCoinInstance,
			cardinality: EntityFieldCardinality.ZeroOrOne,
		},
		{
			name: 'amount',
			label: 'amount',
			type: EntityFieldType.Primitive,
			primitiveType: type("bigint"),
			cardinality: EntityFieldCardinality.ZeroOrOne,
		},
	],
} as const satisfies EntityDefinition

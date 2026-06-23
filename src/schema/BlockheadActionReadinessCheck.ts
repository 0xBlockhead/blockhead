import { type } from 'arktype'
import {
	EntityFieldCardinality,
	EntityFieldType,
	type EntityDefinition,
} from '$/schema/$schema.ts'
import { EntityType } from '$/schema/EntityType.ts'
import { EvmAddress } from '$/schema/ZeroExHex.ts'
export enum BlockheadActionReadinessCheckSelector {
	SessionIdActionIdCheckId = 'sessionId+actionId+checkId',
}
export default {
	entityType: EntityType.BlockheadActionReadinessCheck,
	label: 'blockhead action readiness check',
	labelPlural: 'blockhead action readiness checks',
	selectors: [
		{
			name: BlockheadActionReadinessCheckSelector.SessionIdActionIdCheckId,
			fields: [
				'sessionId',
				'actionId',
				'checkId',
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
			name: 'checkId',
			label: 'check ID',
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
			name: 'checkKind',
			label: 'check kind',
			type: EntityFieldType.Primitive,
			primitiveType: type("string"),
			cardinality: EntityFieldCardinality.One,
		},
		{
			name: 'networkCaip2',
			label: 'network caip2',
			type: EntityFieldType.Primitive,
			primitiveType: type({"namespace": "string", "reference": "string"}),
			cardinality: EntityFieldCardinality.ZeroOrOne,
		},
		{
			name: 'accountCaip1',
			label: 'account caip1',
			type: EntityFieldType.Primitive,
			primitiveType: type({"namespace": "string", "reference": "string", "accountAddress": "string"}),
			cardinality: EntityFieldCardinality.Zero,
		},
		{
			name: 'assetCaip19',
			label: 'asset caip19',
			type: EntityFieldType.Primitive,
			primitiveType: type("string"),
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
			name: 'accountAddress',
			label: 'account address',
			type: EntityFieldType.Primitive,
			primitiveType: EvmAddress,
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
			name: 'spenderAddress',
			label: 'spender address',
			type: EntityFieldType.Primitive,
			primitiveType: EvmAddress,
			cardinality: EntityFieldCardinality.ZeroOrOne,
		},
		{
			name: 'capabilityKey',
			label: 'capability key',
			type: EntityFieldType.Primitive,
			primitiveType: type("string"),
			cardinality: EntityFieldCardinality.ZeroOrOne,
		},
		{
			name: 'requiredAmount',
			label: 'required amount',
			type: EntityFieldType.Primitive,
			primitiveType: type("bigint"),
			cardinality: EntityFieldCardinality.ZeroOrOne,
		},
		{
			name: 'createdAt',
			label: 'Created',
			description: 'The time when the subject was created according to the source.',
			type: EntityFieldType.Primitive,
			primitiveType: type("number"),
			cardinality: EntityFieldCardinality.One,
		},
		{
			name: '$$timestamps',
			label: 'timestamps',
			type: EntityFieldType.EntitiesReference,
			entityType: EntityType.BlockheadActionReadinessCheck_Timestamp,
			cardinality: EntityFieldCardinality.Many,
		},
	],
} as const satisfies EntityDefinition

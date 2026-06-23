import { type } from 'arktype'
import {
	EntityFieldCardinality,
	EntityFieldType,
	type EntityDefinition,
} from '$/schema/$schema.ts'
import { EntityType } from '$/schema/EntityType.ts'
export enum MevRelay_ProposerPayloadDeliveredSelector {
	EvmNetworkRelayHostSlotBlockHash = 'evmNetworkRelayHostSlotBlockHash',
	NetworkRelayHostSlotBlockHash = '$network+relayHost+slot+blockHash',
}
export default {
	entityType: EntityType.MevRelay_ProposerPayloadDelivered,
	label: 'mev relay proposer payload delivered',
	labelPlural: 'mev relay proposer payload delivereds',
	selectors: [
		{
			name: MevRelay_ProposerPayloadDeliveredSelector.EvmNetworkRelayHostSlotBlockHash,
			fields: [
				'$network',
				'relayHost',
				'slot',
				'blockHash',
			],
		},
	],
	fields: [
		{
			name: '$network',
			label: 'network',
			type: EntityFieldType.EntityReference,
			entityType: EntityType.EvmNetwork,
			cardinality: EntityFieldCardinality.One,
		},
		{
			name: 'relayHost',
			label: 'relay host',
			type: EntityFieldType.Primitive,
			primitiveType: type("string"),
			cardinality: EntityFieldCardinality.One,
		},
		{
			name: 'slot',
			label: 'slot',
			type: EntityFieldType.Primitive,
			primitiveType: type("number"),
			cardinality: EntityFieldCardinality.One,
		},
		{
			name: 'blockHash',
			label: 'Block hash',
			description: 'The hash that identifies the block in its network.',
			type: EntityFieldType.Primitive,
			primitiveType: type("string"),
			cardinality: EntityFieldCardinality.One,
		},
		{
			name: 'builderPubkey',
			label: 'builder public key',
			type: EntityFieldType.Primitive,
			primitiveType: type("string"),
			cardinality: EntityFieldCardinality.ZeroOrOne,
		},
		{
			name: '$builder',
			label: 'builder',
			type: EntityFieldType.EntityReference,
			entityType: EntityType.MevBuilder,
			cardinality: EntityFieldCardinality.ZeroOrOne,
		},
		{
			name: 'value',
			label: 'Value',
			description: 'The source-domain value.',
			type: EntityFieldType.Primitive,
			primitiveType: type("bigint"),
			cardinality: EntityFieldCardinality.ZeroOrOne,
		},
		{
			name: 'blockNumber',
			label: 'Block number',
			description: 'The block height or number in its network.',
			type: EntityFieldType.Primitive,
			primitiveType: type("bigint"),
			cardinality: EntityFieldCardinality.ZeroOrOne,
		},
		{
			name: '$executionBlock',
			label: 'execution block',
			type: EntityFieldType.EntityReference,
			entityType: EntityType.EvmBlock,
			cardinality: EntityFieldCardinality.ZeroOrOne,
		},
	],
} as const satisfies EntityDefinition

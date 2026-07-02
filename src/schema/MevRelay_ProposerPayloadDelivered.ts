// Generated from APP.ts. Do not edit by hand.

import { EntityFieldCardinality, EntityFieldType, type EntityDefinition } from '$/schema/$schema.ts'
import { EntityType } from '$/schema/EntityType.ts'
import { ZeroExHex } from '$/schema/ZeroExHex.ts'
import { type } from 'arktype'

export enum MevRelay_ProposerPayloadDeliveredSelector {
	EvmNetworkRelayHostSlotBlockHash = 'EvmNetworkRelayHostSlotBlockHash',
}
export default {
	entityType: EntityType.MevRelay_ProposerPayloadDelivered,
	label: 'MEV relay proposer payload delivered',
	labelPlural: 'MEV relay proposer payloads delivered',
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
				label: 'Network',
				type: EntityFieldType.EntityReference,
				entityType: EntityType.EvmNetwork,
				cardinality: EntityFieldCardinality.One,
		},
		{
				name: 'relayHost',
				label: 'Relay host',
				type: EntityFieldType.Primitive,
				primitiveType: type('string'),
				cardinality: EntityFieldCardinality.One,
		},
		{
				name: 'slot',
				label: 'Slot',
				type: EntityFieldType.Primitive,
				primitiveType: type('number'),
				cardinality: EntityFieldCardinality.One,
		},
		{
				name: 'blockHash',
				label: 'Block hash',
				description: 'The hash that identifies the block in its network.',
				type: EntityFieldType.Primitive,
				primitiveType: (ZeroExHex),
				cardinality: EntityFieldCardinality.One,
		},
		{
				name: 'builderPubkey',
				label: 'Builder public key',
				type: EntityFieldType.Primitive,
				primitiveType: type('string'),
				cardinality: EntityFieldCardinality.ZeroOrOne,
		},
		{
				name: '$builder',
				label: 'Builder',
				type: EntityFieldType.EntityReference,
				entityType: EntityType.MevBuilder,
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
				name: 'blockNumber',
				label: 'Block number',
				description: 'The block height or number in its network.',
				type: EntityFieldType.Primitive,
				primitiveType: type('bigint'),
				cardinality: EntityFieldCardinality.ZeroOrOne,
		},
		{
				name: '$executionBlock',
				label: 'Execution block',
				type: EntityFieldType.EntityReference,
				entityType: EntityType.EvmBlock,
				cardinality: EntityFieldCardinality.ZeroOrOne,
		},
	],
} as const satisfies EntityDefinition

import { type } from 'arktype'
import { ZeroExHex } from '$/schema/ZeroExHex.ts'
import {
	EntityFieldType,
	EntityFieldCardinality,
	type EntityDefinition,
	type EntityFieldDefinition,
} from '$/schema/$schema.ts'
import { EntityType } from '$/schema/EntityType.ts'
import { Source } from '$/sources/Source.ts'

export enum MevRelay_ProposerPayloadDeliveredSelector {
	EvmNetworkRelayHostSlotBlockHash = 'evmNetworkRelayHostSlotBlockHash',
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
			type: EntityFieldType.EntityReference,
			entityType: EntityType.EvmNetwork,
			cardinality: EntityFieldCardinality.One,
		},
		{
			name: 'relayHost',
			type: EntityFieldType.Primitive,
			primitiveType: type('string'),
			cardinality: EntityFieldCardinality.One,
		},
		{
			name: 'slot',
			type: EntityFieldType.Primitive,
			primitiveType: type('number'),
			cardinality: EntityFieldCardinality.One,
		},
		{
			name: 'blockHash',
			type: EntityFieldType.Primitive,
			primitiveType: ZeroExHex,
			cardinality: EntityFieldCardinality.One,
		},
		{
			name: 'builderPubkey',
			type: EntityFieldType.Primitive,
			primitiveType: type('string'),
			cardinality: EntityFieldCardinality.ZeroOrOne,
			defaultSources: [
				Source.MevRelay_Rest,
			],
		},
		{
			name: 'value',
			type: EntityFieldType.Primitive,
			primitiveType: type('bigint'),
			cardinality: EntityFieldCardinality.ZeroOrOne,
			defaultSources: [
				Source.MevRelay_Rest,
			],
		},
		{
			name: 'blockNumber',
			type: EntityFieldType.Primitive,
			primitiveType: type('bigint'),
			cardinality: EntityFieldCardinality.ZeroOrOne,
			defaultSources: [
				Source.MevRelay_Rest,
			],
		},
		{
			name: '$executionBlock',
			type: EntityFieldType.EntityReference,
			entityType: EntityType.EvmBlock,
			cardinality: EntityFieldCardinality.ZeroOrOne,
			defaultSources: [
				Source.MevRelay_Rest,
			],
		},
	] as const satisfies readonly EntityFieldDefinition[],
} as const satisfies EntityDefinition

import { type } from 'arktype'
import { ZeroExHex } from '$/schema/$ZeroExHex.ts'
import {
	EntityFieldType,
	EntityFieldCardinality,
	type EntityDefinition,
	type EntityFieldDefinition,
} from '$/schema/$EntityDefinition.ts'
import { EntityType } from '$/schema/$EntityType.ts'
import Network from '$/schema/EvmNetwork.ts'
import { Source } from '$/sources/$Source.ts'

export default {
	entityType: EntityType.MevRelay_ProposerPayloadDelivered,

	label: 'MEV relay proposer payload delivered',
	labelPlural: 'MEV relay proposer payloads delivered',

	id: type({
		$network: Network.id,
		relayHost: 'string',
		slot: 'number',
		blockHash: ZeroExHex,
	}),

	fields: [
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

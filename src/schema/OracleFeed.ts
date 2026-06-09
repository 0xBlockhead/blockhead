import { type } from 'arktype'
import { EvmAddress } from '$/schema/ZeroExHex.ts'
import {
	EntityFieldType,
	EntityFieldCardinality,
	type EntityDefinition,
	type EntityFieldDefinition,
} from '$/schema/$schema.ts'
import { EntityType } from '$/schema/EntityType.ts'
import Market from '$/schema/Market.ts'
import Network from '$/schema/EvmNetwork.ts'
import { Source } from '$/sources/Source.ts'

export default {
	entityType: EntityType.OracleFeed,

	label: 'Oracle feed',
	labelPlural: 'Oracle feeds',

	id: type({
		$network: Network.id,
		address: EvmAddress,
	}),

	fields: [
		{
			name: '$market',
			type: EntityFieldType.EntityReference,
			entityType: EntityType.Market,
			cardinality: EntityFieldCardinality.ZeroOrOne,
			defaultSources: [
				Source.Constants_Internal,
			],
		},
		{
			name: 'label',
			type: EntityFieldType.Primitive,
			primitiveType: type('string'),
			cardinality: EntityFieldCardinality.ZeroOrOne,
		},
		{
			name: 'decimals',
			type: EntityFieldType.Primitive,
			primitiveType: type('number'),
			cardinality: EntityFieldCardinality.ZeroOrOne,
			defaultSources: [
				Source.Voltaire_JsonRpc,
			],
		},
		{
			name: 'description',
			type: EntityFieldType.Primitive,
			primitiveType: type('string'),
			cardinality: EntityFieldCardinality.ZeroOrOne,
			defaultSources: [
				Source.Voltaire_JsonRpc,
			],
		},
		{
			name: '$$rounds',
			type: EntityFieldType.EntitiesReference,
			entityType: EntityType.OracleFeed_Round,
			cardinality: EntityFieldCardinality.Many,
			defaultSources: [
				Source.Voltaire_JsonRpc,
			],
		},
	] as const satisfies readonly EntityFieldDefinition[],
} as const satisfies EntityDefinition

import { type } from 'arktype'

import {
	EntityFieldType,
	EntityFieldCardinality,
	type EntityDefinition,
	type EntityFieldDefinition,
} from '$/schema/$EntityDefinition.ts'
import { EntityType } from '$/schema/$EntityType.ts'
import Network from '$/schema/Network.ts'
import { Source } from '$/sources/$Source.ts'

export default {
	entityType: EntityType.LightningNode,

	label: 'Lightning node',
	labelPlural: 'Lightning nodes',

	id: type({
		$network: Network.id,
		publicKey: 'string',
	}),

	fields: [
		{
			name: 'alias',
			type: EntityFieldType.Primitive,
			primitiveType: type('string'),
			cardinality: EntityFieldCardinality.ZeroOrOne,
			defaultSources: [
				Source.LightningMempoolSpace_Rest,
				Source.Amboss_Graphql,
				Source.LightningLnd_Rest,
			],
		},
		{
			name: 'color',
			type: EntityFieldType.Primitive,
			primitiveType: type('string'),
			cardinality: EntityFieldCardinality.ZeroOrOne,
			defaultSources: [
				Source.Amboss_Graphql,
				Source.LightningLnd_Rest,
			],
		},
		{
			name: 'capacitySats',
			type: EntityFieldType.Primitive,
			primitiveType: type('bigint'),
			cardinality: EntityFieldCardinality.ZeroOrOne,
			defaultSources: [
				Source.LightningMempoolSpace_Rest,
				Source.Amboss_Graphql,
			],
		},
		{
			name: 'channelCount',
			type: EntityFieldType.Primitive,
			primitiveType: type('number'),
			cardinality: EntityFieldCardinality.ZeroOrOne,
			defaultSources: [
				Source.LightningMempoolSpace_Rest,
				Source.Amboss_Graphql,
				Source.LightningLnd_Rest,
			],
		},
		{
			name: 'firstSeenMs',
			type: EntityFieldType.Primitive,
			primitiveType: type('number'),
			cardinality: EntityFieldCardinality.ZeroOrOne,
			defaultSources: [
				Source.LightningMempoolSpace_Rest,
				Source.Amboss_Graphql,
			],
		},
		{
			name: 'updatedAtMs',
			type: EntityFieldType.Primitive,
			primitiveType: type('number'),
			cardinality: EntityFieldCardinality.ZeroOrOne,
			defaultSources: [
				Source.LightningMempoolSpace_Rest,
				Source.Amboss_Graphql,
			],
		},
		{
			name: 'countryCode',
			type: EntityFieldType.Primitive,
			primitiveType: type('string'),
			cardinality: EntityFieldCardinality.ZeroOrOne,
			defaultSources: [
				Source.LightningMempoolSpace_Rest,
				Source.Amboss_Graphql,
			],
		},
		{
			name: 'city',
			type: EntityFieldType.Primitive,
			primitiveType: type('string'),
			cardinality: EntityFieldCardinality.ZeroOrOne,
			defaultSources: [
				Source.LightningMempoolSpace_Rest,
				Source.Amboss_Graphql,
			],
		},
		{
			name: 'networkAddresses',
			type: EntityFieldType.Primitive,
			primitiveType: type('string'),
			cardinality: EntityFieldCardinality.Many,
			defaultSources: [
				Source.LightningMempoolSpace_Rest,
				Source.Amboss_Graphql,
				Source.LightningLnd_Rest,
			],
		},
		{
			name: '$$channels',
			type: EntityFieldType.EntitiesReference,
			entityType: EntityType.LightningChannel,
			cardinality: EntityFieldCardinality.Many,
			defaultSources: [
				Source.LightningMempoolSpace_Rest,
				Source.LightningLnd_Rest,
			],
		},
	] as const satisfies readonly EntityFieldDefinition[],
} as const satisfies EntityDefinition

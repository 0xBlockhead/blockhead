import { type } from 'arktype'

import {
	EntityFieldType,
	EntityFieldCardinality,
	type EntityDefinition,
	type EntityFieldDefinition,
} from '$/schema/$schema.ts'
import { EntityType } from '$/schema/EntityType.ts'
import Network from '$/schema/Network.ts'
import { Source } from '$/sources/Source.ts'

export enum ElementsNetworkSelector {
	Network = 'network',
}

export default {
	entityType: EntityType.ElementsNetwork,

	label: 'Elements network',
	labelPlural: 'Elements networks',

	selectors: [
		{
			name: ElementsNetworkSelector.Network,
			fields: [
				'$network',
			],
		},
	],

	fields: [
		{
			name: '$network',
			type: EntityFieldType.EntityReference,
			entityType: EntityType.Network,
			cardinality: EntityFieldCardinality.One,
			defaultSources: [
				Source.Constants_Internal,
			],
		},
		{
			name: '$settlementNetwork',
			type: EntityFieldType.EntityReference,
			entityType: EntityType.UtxoNetwork,
			cardinality: EntityFieldCardinality.ZeroOrOne,
			defaultSources: [
				Source.Constants_Internal,
			],
		},
		{
			name: 'federationName',
			type: EntityFieldType.Primitive,
			primitiveType: type('string'),
			cardinality: EntityFieldCardinality.ZeroOrOne,
			defaultSources: [
				Source.Constants_Internal,
			],
		},
		{
			name: 'blockTimeSeconds',
			type: EntityFieldType.Primitive,
			primitiveType: type('number'),
			cardinality: EntityFieldCardinality.ZeroOrOne,
			defaultSources: [
				Source.Constants_Internal,
			],
		},
		{
			name: '$nativeAsset',
			type: EntityFieldType.EntityReference,
			entityType: EntityType.ElementsAsset,
			cardinality: EntityFieldCardinality.ZeroOrOne,
			defaultSources: [
				Source.Constants_Internal,
				Source.Esplora_Rest,
			],
		},
		{
			name: 'confidentialTransactionsDefault',
			type: EntityFieldType.Primitive,
			primitiveType: type('boolean'),
			cardinality: EntityFieldCardinality.ZeroOrOne,
			defaultSources: [
				Source.Constants_Internal,
			],
		},
		{
			name: '$$assets',
			type: EntityFieldType.EntitiesReference,
			entityType: EntityType.ElementsAsset,
			cardinality: EntityFieldCardinality.ZeroOrMany,
			defaultSources: [
				Source.Esplora_Rest,
			],
		},
	] as const satisfies readonly EntityFieldDefinition[],
} as const satisfies EntityDefinition

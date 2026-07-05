// Generated from APP.ts. Do not edit by hand.

import { EntityFieldCardinality, EntityFieldType, type EntityDefinition } from '$/schema/$schema.ts'
import { EntityType } from '$/schema/EntityType.ts'
import { Source } from '$/sources/Source.ts'
import { type } from 'arktype'

export enum ElementsNetworkSelector {
	Network = 'Network',
}
export default {
	entityType: EntityType.ElementsNetwork,
	label: 'Elements network',
	labelPlural: 'Elements networks',
	description: 'Elements/Liquid-specific view over a canonical Network row, including federation metadata, settlement network, native asset, and registry assets.',
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
				label: 'Network',
				type: EntityFieldType.EntityReference,
				entityType: EntityType.Network,
				cardinality: EntityFieldCardinality.One,
		},
		{
				name: '$settlementNetwork',
				label: 'Settlement network',
				type: EntityFieldType.EntityReference,
				entityType: EntityType.UtxoNetwork,
				cardinality: EntityFieldCardinality.ZeroOrOne,
				defaultSources: [
					Source.Constants_Internal,
				],
		},
		{
				name: 'federationName',
				label: 'Federation',
				type: EntityFieldType.Primitive,
				primitiveType: type('string'),
				cardinality: EntityFieldCardinality.ZeroOrOne,
				defaultSources: [
					Source.Constants_Internal,
				],
		},
		{
				name: 'blockTimeSeconds',
				label: 'Block time seconds',
				type: EntityFieldType.Primitive,
				primitiveType: type('number'),
				cardinality: EntityFieldCardinality.ZeroOrOne,
				defaultSources: [
					Source.Constants_Internal,
				],
		},
		{
				name: '$nativeAsset',
				label: 'Native asset',
				type: EntityFieldType.EntityReference,
				entityType: EntityType.ElementsAsset,
				cardinality: EntityFieldCardinality.ZeroOrOne,
				defaultSources: [
					Source.Esplora_Rest,
				],
		},
		{
				name: 'confidentialTransactionsDefault',
				label: 'Confidential transactions by default',
				type: EntityFieldType.Primitive,
				primitiveType: type('boolean'),
				cardinality: EntityFieldCardinality.ZeroOrOne,
				defaultSources: [
					Source.Constants_Internal,
				],
		},
		{
				name: '$$assets',
				label: 'Assets',
				type: EntityFieldType.EntitiesReference,
				entityType: EntityType.ElementsAsset,
				cardinality: EntityFieldCardinality.Many,
				defaultSources: [
					Source.Esplora_Rest,
				],
		},
	],
} as const satisfies EntityDefinition

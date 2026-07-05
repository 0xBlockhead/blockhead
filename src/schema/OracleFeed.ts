// Generated from APP.ts. Do not edit by hand.

import { EntityFieldCardinality, EntityFieldType, type EntityDefinition } from '$/schema/$schema.ts'
import { EntityType } from '$/schema/EntityType.ts'
import { EvmAddress } from '$/schema/ZeroExHex.ts'
import { type } from 'arktype'

export enum OracleFeedSelector {
	EvmNetworkAddress = 'EvmNetworkAddress',
}
export default {
	entityType: EntityType.OracleFeed,
	label: 'oracle feed',
	labelPlural: 'oracle feeds',
	selectors: [
		{
			name: OracleFeedSelector.EvmNetworkAddress,
			fields: [
				'$network',
				'address',
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
				name: 'address',
				label: 'Address',
				description: 'The address or account identifier used by the source protocol.',
				type: EntityFieldType.Primitive,
				primitiveType: (EvmAddress),
				cardinality: EntityFieldCardinality.One,
		},
		{
				name: '$market',
				label: 'market',
				type: EntityFieldType.EntityReference,
				entityType: EntityType.Market,
				cardinality: EntityFieldCardinality.ZeroOrOne,
		},
		{
				name: 'label',
				label: 'Label',
				description: 'A human-readable name for the subject.',
				type: EntityFieldType.Primitive,
				primitiveType: type('string'),
				cardinality: EntityFieldCardinality.ZeroOrOne,
		},
		{
				name: 'feedKind',
				label: 'feed kind',
				type: EntityFieldType.Primitive,
				primitiveType: type('string'),
				cardinality: EntityFieldCardinality.ZeroOrOne,
		},
		{
				name: '$$rounds',
				label: 'rounds',
				type: EntityFieldType.EntitiesReference,
				entityType: EntityType.OracleFeed_Round,
				cardinality: EntityFieldCardinality.ZeroOrMany,
		},
		{
				name: '$$timestamps',
				label: 'timestamps',
				type: EntityFieldType.EntitiesReference,
				entityType: EntityType.OracleFeed_Timestamp,
				cardinality: EntityFieldCardinality.Many,
		},
	],
} as const satisfies EntityDefinition

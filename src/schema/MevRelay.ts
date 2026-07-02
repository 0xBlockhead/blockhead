// Generated from APP.ts. Do not edit by hand.

import { EntityFieldCardinality, EntityFieldType, type EntityDefinition } from '$/schema/$schema.ts'
import { EntityType } from '$/schema/EntityType.ts'
import { UrlString } from '$/schema/UrlString.ts'
import { type } from 'arktype'

export enum MevRelaySelector {
	EvmNetworkHost = 'EvmNetworkHost',
}
export default {
	entityType: EntityType.MevRelay,
	label: 'MEV relay',
	labelPlural: 'MEV relays',
	selectors: [
		{
			name: MevRelaySelector.EvmNetworkHost,
			fields: [
				'$network',
				'host',
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
				name: 'host',
				label: 'Host',
				type: EntityFieldType.Primitive,
				primitiveType: type('string'),
				cardinality: EntityFieldCardinality.One,
		},
		{
				name: 'url',
				label: 'URL',
				description: 'The URL for the source-domain resource.',
				type: EntityFieldType.Primitive,
				primitiveType: (UrlString),
				cardinality: EntityFieldCardinality.One,
		},
		{
				name: '$$timestamps',
				label: 'Timestamps',
				type: EntityFieldType.EntitiesReference,
				entityType: EntityType.MevRelay_Timestamp,
				cardinality: EntityFieldCardinality.Many,
		},
	],
} as const satisfies EntityDefinition

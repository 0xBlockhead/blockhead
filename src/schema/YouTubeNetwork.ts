// Generated from APP.ts. Do not edit by hand.

import { EntityFieldCardinality, EntityFieldType, type EntityDefinition } from '$/schema/$schema.ts'
import { EntityType } from '$/schema/EntityType.ts'
import { UrlString } from '$/schema/UrlString.ts'
import { type } from 'arktype'

export enum YoutubeNetworkSelector {
	Scope = 'Scope',
}
export default {
	entityType: EntityType.YoutubeNetwork,
	label: 'YouTube Data API',
	labelPlural: 'YouTube Data API',
	selectors: [
		{
			name: YoutubeNetworkSelector.Scope,
			fields: [
				'scope',
			],
		},
	],
	fields: [
		{
				name: 'scope',
				label: 'Scope',
				description: 'The fixed scope value that identifies this compatibility protocol row.',
				type: EntityFieldType.Primitive,
				primitiveType: type.unit('YoutubeNetwork'),
				cardinality: EntityFieldCardinality.One,
		},
		{
				name: 'protocolName',
				label: 'Protocol',
				type: EntityFieldType.Primitive,
				primitiveType: type('string'),
				cardinality: EntityFieldCardinality.One,
		},
		{
				name: 'homeUrl',
				label: 'Home',
				type: EntityFieldType.Primitive,
				primitiveType: (UrlString),
				cardinality: EntityFieldCardinality.One,
		},
		{
				name: 'docsUrl',
				label: 'Documentation',
				type: EntityFieldType.Primitive,
				primitiveType: (UrlString),
				cardinality: EntityFieldCardinality.ZeroOrOne,
		},
	],
} as const satisfies EntityDefinition

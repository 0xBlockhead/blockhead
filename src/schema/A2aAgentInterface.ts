// Generated from APP.ts. Do not edit by hand.

import { EntityFieldCardinality, EntityFieldType, type EntityDefinition } from '$/schema/$schema.ts'
import { EntityType } from '$/schema/EntityType.ts'
import { UrlString } from '$/schema/UrlString.ts'
import { type } from 'arktype'

export enum A2aAgentInterfaceSelector {
	CardSnapshotProtocolBindingUrl = 'CardSnapshotProtocolBindingUrl',
}
export default {
	entityType: EntityType.A2aAgentInterface,
	label: 'a2a agent interface',
	labelPlural: 'a2a agent interfaces',
	selectors: [
		{
			name: A2aAgentInterfaceSelector.CardSnapshotProtocolBindingUrl,
			fields: [
				'$cardSnapshot',
				'protocolBinding',
				'url',
			],
		},
	],
	fields: [
		{
			name: '$cardSnapshot',
			label: 'card snapshot',
			type: EntityFieldType.EntityReference,
			entityType: EntityType.A2aAgentCard_Snapshot,
			cardinality: EntityFieldCardinality.One,
		},
		{
			name: 'protocolBinding',
			label: 'protocol binding',
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
			name: 'protocolVersion',
			label: 'protocol version',
			type: EntityFieldType.Primitive,
			primitiveType: type('string'),
			cardinality: EntityFieldCardinality.ZeroOrOne,
		},
		{
			name: 'transportKind',
			label: 'transport kind',
			type: EntityFieldType.Primitive,
			primitiveType: type('string'),
			cardinality: EntityFieldCardinality.ZeroOrOne,
		},
		{
			name: 'mediaType',
			label: 'media type',
			type: EntityFieldType.Primitive,
			primitiveType: type('string'),
			cardinality: EntityFieldCardinality.ZeroOrOne,
		},
		{
			name: 'serviceParameters',
			label: 'service parameters',
			type: EntityFieldType.Primitive,
			primitiveType: type('unknown'),
			cardinality: EntityFieldCardinality.ZeroOrOne,
		},
	],
} as const satisfies EntityDefinition

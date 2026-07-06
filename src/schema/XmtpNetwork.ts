// Generated from APP.ts. Do not edit by hand.

import { EntityFieldCardinality, EntityFieldType, type EntityDefinition } from '$/schema/$schema.ts'
import { EntityType } from '$/schema/EntityType.ts'
import { Source } from '$/sources/Source.ts'
import { type } from 'arktype'

export enum XmtpNetworkSelector {
	Scope = 'Scope',
}
export default {
	entityType: EntityType.XmtpNetwork,
	label: 'XMTP',
	labelPlural: 'XMTP',
	description: 'XMTP transports encrypted payloads between inbox identities. This hub shows local conversation state from the seeded.',
	selectors: [
		{
			name: XmtpNetworkSelector.Scope,
			fields: [
				'scope',
			],
		},
	],
	fields: [
		{
			name: 'scope',
			label: 'Scope',
			description: 'The fixed scope value that identifies this hub row.',
			type: EntityFieldType.Primitive,
			primitiveType: type('string'),
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
			label: 'Home URL',
			type: EntityFieldType.Primitive,
			primitiveType: type('string'),
			cardinality: EntityFieldCardinality.One,
		},
		{
			name: 'docsUrl',
			label: 'Docs URL',
			type: EntityFieldType.Primitive,
			primitiveType: type('string'),
			cardinality: EntityFieldCardinality.ZeroOrOne,
		},
		{
			name: 'registryName',
			label: 'Registry name',
			type: EntityFieldType.Primitive,
			primitiveType: type('string'),
			cardinality: EntityFieldCardinality.ZeroOrOne,
		},
		{
			name: 'relationshipModel',
			label: 'Relationship model',
			type: EntityFieldType.Primitive,
			primitiveType: type('string'),
			cardinality: EntityFieldCardinality.ZeroOrOne,
		},
		{
			name: '$$xmtpConversations',
			label: 'Conversations',
			type: EntityFieldType.EntitiesReference,
			entityType: EntityType.XmtpConversation,
			cardinality: EntityFieldCardinality.Many,
			defaultSources: [
				Source.Local_Internal,
			],
		},
	],
} as const satisfies EntityDefinition

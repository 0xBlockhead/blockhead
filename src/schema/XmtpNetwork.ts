import { type } from 'arktype'
import {
	EntityFieldType,
	EntityFieldCardinality,
	type EntityDefinition,
	type EntityFieldDefinition,
} from '$/schema/$schema.ts'
import { EntityType } from '$/schema/EntityType.ts'
import { UrlString } from '$/schema/UrlString.ts'
import { Source } from '$/sources/Source.ts'

export enum XmtpNetworkSelector {
	Scope = 'scope',
}

export default {
	entityType: EntityType.XmtpNetwork,

	label: 'XMTP network',
	labelPlural: 'XMTP networks',

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
			type: EntityFieldType.Primitive,
			primitiveType: type.unit('XmtpNetwork'),
			cardinality: EntityFieldCardinality.One,
		},
		{
			name: 'protocolName',
			type: EntityFieldType.Primitive,
			primitiveType: type('string'),
			cardinality: EntityFieldCardinality.One,
			defaultSources: [
				Source.Constants_Internal,
			],
		},
		{
			name: 'homeUrl',
			type: EntityFieldType.Primitive,
			primitiveType: UrlString,
			cardinality: EntityFieldCardinality.One,
			defaultSources: [
				Source.Constants_Internal,
			],
		},
		{
			name: 'docsUrl',
			type: EntityFieldType.Primitive,
			primitiveType: UrlString,
			cardinality: EntityFieldCardinality.ZeroOrOne,
			defaultSources: [
				Source.Constants_Internal,
			],
		},
		{
			name: 'registryLabel',
			type: EntityFieldType.Primitive,
			primitiveType: type('string'),
			cardinality: EntityFieldCardinality.One,
			defaultSources: [
				Source.Constants_Internal,
			],
		},
		{
			name: 'topology',
			type: EntityFieldType.Primitive,
			primitiveType: type('string'),
			cardinality: EntityFieldCardinality.One,
			defaultSources: [
				Source.Constants_Internal,
			],
		},
		{
			name: '$$xmtpConversations',
			type: EntityFieldType.EntitiesReference,
			entityType: EntityType.XmtpConversation,
			cardinality: EntityFieldCardinality.ZeroOrMany,
			defaultSources: [
				Source.Local_Internal,
			],
		},
	] as const satisfies readonly EntityFieldDefinition[],
} as const satisfies EntityDefinition

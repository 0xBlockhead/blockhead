// Generated from APP.ts. Do not edit by hand.

import { EntityFieldCardinality, EntityFieldType, type EntityDefinition } from '$/schema/$schema.ts'
import { EntityType } from '$/schema/EntityType.ts'
import { UrlString } from '$/schema/UrlString.ts'
import { Source } from '$/sources/Source.ts'
import { type } from 'arktype'

export enum _GlobalAtprotoNetworkSelector {
	Scope = 'Scope',
}
export default {
	entityType: EntityType._GlobalAtprotoNetwork,
	label: 'AT Protocol',
	labelPlural: 'AT Protocol',
	description: 'AT Protocol is a DID-based social protocol. This hub shows bounded actor and post windows from configured Bluesky-compatible appview sources, not a claim about every repository on the network.',
	selectors: [
		{
			name: _GlobalAtprotoNetworkSelector.Scope,
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
			primitiveType: type.unit('_GlobalAtprotoNetwork'),
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
			name: 'topology',
			label: 'Topology',
			type: EntityFieldType.Primitive,
			primitiveType: type('string'),
			cardinality: EntityFieldCardinality.ZeroOrOne,
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
		{
			name: '$$sourceWindowActors',
			label: 'Accounts',
			type: EntityFieldType.EntitiesReference,
			entityType: EntityType.AtprotoActor,
			cardinality: EntityFieldCardinality.Many,
			defaultSources: [
				Source.Constants_Internal,
				Source.Atproto_Xrpc,
			],
		},
		{
			name: '$$sourceWindowPosts',
			label: 'Recent posts',
			type: EntityFieldType.EntitiesReference,
			entityType: EntityType.AtprotoPost,
			cardinality: EntityFieldCardinality.Many,
			defaultSources: [
				Source.Constants_Internal,
				Source.Atproto_Xrpc,
			],
		},
		{
			name: '$$timestamps',
			label: 'Observations',
			type: EntityFieldType.EntitiesReference,
			entityType: EntityType._GlobalAtprotoNetwork_Timestamp,
			cardinality: EntityFieldCardinality.Many,
		},
	],
} as const satisfies EntityDefinition

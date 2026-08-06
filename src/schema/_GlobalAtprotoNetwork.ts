// Generated from APP.ts.

import { entity } from '$/schema/$schema.ts'
import { EntityFieldCardinality } from '$/schema/EntityFieldCardinality.ts'
import { EntityType } from '$/schema/EntityType.ts'
import { UrlString } from '$/schema/UrlString.ts'
import { Source } from '$/sources/Source.ts'
import { type } from 'arktype'

export default entity({
	entityType: EntityType._GlobalAtprotoNetwork,
	labels: {
		singular: 'AT Protocol',
		plural: 'AT Protocol',
	},
	description: 'AT Protocol is a DID-based social protocol. This hub shows bounded actor and post windows from declared Bluesky-compatible appview sources, not a claim about every repository on the network.',
})({
	scope: {
		primitiveType: type.unit('_GlobalAtprotoNetwork'),
		cardinality: EntityFieldCardinality.One,
	},
	protocolName: {
		primitiveType: type('string'),
		cardinality: EntityFieldCardinality.One,
	},
	relationshipModel: {
		primitiveType: type('string'),
		cardinality: EntityFieldCardinality.ZeroOrOne,
	},
	homeUrl: {
		primitiveType: UrlString,
		cardinality: EntityFieldCardinality.One,
	},
	docsUrl: {
		primitiveType: UrlString,
		cardinality: EntityFieldCardinality.ZeroOrOne,
	},
	$$observedActors: {
		entityType: EntityType.AtprotoActor,
		cardinality: EntityFieldCardinality.Many,
		defaultSources: [
			Source.Constants_Internal,
			Source.Atproto_Xrpc,
			Source.Atproto_BskySocial_Xrpc,
		],
	},
	$$observedPosts: {
		entityType: EntityType.AtprotoPost,
		cardinality: EntityFieldCardinality.Many,
		defaultSources: [
			Source.Constants_Internal,
			Source.Atproto_Xrpc,
			Source.Atproto_BskySocial_Xrpc,
		],
	},
	$$timestamps: {
		entityType: EntityType._GlobalAtprotoNetwork_Timestamp,
		cardinality: EntityFieldCardinality.Many,
	},
})({
	selectors: {
		Scope: [
			'scope',
		],
	},
})

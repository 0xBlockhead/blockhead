// Generated from APP.ts.

import { entity } from '$/schema/$schema.ts'
import { EntityFieldCardinality } from '$/schema/EntityFieldCardinality.ts'
import { EntityType } from '$/schema/EntityType.ts'
import { Source } from '$/sources/Source.ts'
import { type } from 'arktype'

export default entity({
	entityType: EntityType.XmtpNetwork,
	labels: {
		singular: 'XMTP',
		plural: 'XMTP',
	},
	description: 'XMTP transports encrypted payloads between inbox identities. This hub shows local conversation state from the seeded.',
})({
	scope: {
		label: 'Scope',
		description: 'The fixed scope value that identifies this hub row.',
		primitiveType: type('string'),
		cardinality: EntityFieldCardinality.One,
	},
	protocolName: {
		label: 'Protocol',
		primitiveType: type('string'),
		cardinality: EntityFieldCardinality.One,
	},
	homeUrl: {
		label: 'Home URL',
		primitiveType: type('string'),
		cardinality: EntityFieldCardinality.One,
	},
	docsUrl: {
		label: 'Docs URL',
		primitiveType: type('string'),
		cardinality: EntityFieldCardinality.ZeroOrOne,
	},
	registryName: {
		label: 'Registry name',
		primitiveType: type('string'),
		cardinality: EntityFieldCardinality.ZeroOrOne,
	},
	relationshipModel: {
		label: 'Connection model',
		primitiveType: type('string'),
		cardinality: EntityFieldCardinality.ZeroOrOne,
	},
	$$xmtpConversations: {
		label: 'Conversations',
		entityType: EntityType.XmtpConversation,
		cardinality: EntityFieldCardinality.Many,
		defaultSources: [
			Source.Local_Internal,
		],
	},
})({
	selectors: {
		Scope: [
			'scope',
		],
	},
})

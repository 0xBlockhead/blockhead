// Generated from APP.ts.

import { entity } from '$/schema/$schema.ts'
import { EntityFieldCardinality } from '$/schema/EntityFieldCardinality.ts'
import { EntityType } from '$/schema/EntityType.ts'
import { UrlString } from '$/schema/UrlString.ts'
import { type } from 'arktype'

export default entity({
	entityType: EntityType.A2aAgentInterface,
	labels: {
		singular: 'a2a agent interface',
		plural: 'a2a agent interfaces',
	},
})({
	$cardSnapshot: {
		label: 'card snapshot',
		entityType: EntityType.A2aAgentCard_Snapshot,
		cardinality: EntityFieldCardinality.One,
	},
	protocolBinding: {
		label: 'protocol binding',
		primitiveType: type('string'),
		cardinality: EntityFieldCardinality.One,
	},
	url: {
		label: 'URL',
		description: 'The URL for the source-domain resource.',
		primitiveType: UrlString,
		cardinality: EntityFieldCardinality.One,
	},
	protocolVersion: {
		label: 'protocol version',
		primitiveType: type('string'),
		cardinality: EntityFieldCardinality.ZeroOrOne,
	},
	transportKind: {
		label: 'transport kind',
		primitiveType: type('string'),
		cardinality: EntityFieldCardinality.ZeroOrOne,
	},
	mediaType: {
		label: 'media type',
		primitiveType: type('string'),
		cardinality: EntityFieldCardinality.ZeroOrOne,
	},
	serviceParameters: {
		label: 'service parameters',
		primitiveType: type('unknown'),
		cardinality: EntityFieldCardinality.ZeroOrOne,
	},
})({
	selectors: {
		CardSnapshotProtocolBindingUrl: [
			'$cardSnapshot',
			'protocolBinding',
			'url',
		],
	},
})

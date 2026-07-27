// Generated from APP.ts. Do not edit by hand.

import { entity } from '$/schema/$schema.ts'
import { EntityFieldCardinality, EntityFieldType } from '$/schema/EntityField.ts'
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
		type: EntityFieldType.EntityReference,
		entityType: EntityType.A2aAgentCard_Snapshot,
		cardinality: EntityFieldCardinality.One,
	},
	protocolBinding: {
		label: 'protocol binding',
		type: EntityFieldType.Primitive,
		primitiveType: type('string'),
		cardinality: EntityFieldCardinality.One,
	},
	url: {
		label: 'URL',
		description: 'The URL for the source-domain resource.',
		type: EntityFieldType.Primitive,
		primitiveType: UrlString,
		cardinality: EntityFieldCardinality.One,
	},
	protocolVersion: {
		label: 'protocol version',
		type: EntityFieldType.Primitive,
		primitiveType: type('string'),
		cardinality: EntityFieldCardinality.ZeroOrOne,
	},
	transportKind: {
		label: 'transport kind',
		type: EntityFieldType.Primitive,
		primitiveType: type('string'),
		cardinality: EntityFieldCardinality.ZeroOrOne,
	},
	mediaType: {
		label: 'media type',
		type: EntityFieldType.Primitive,
		primitiveType: type('string'),
		cardinality: EntityFieldCardinality.ZeroOrOne,
	},
	serviceParameters: {
		label: 'service parameters',
		type: EntityFieldType.Primitive,
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

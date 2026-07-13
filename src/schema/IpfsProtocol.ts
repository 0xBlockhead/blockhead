// Generated from APP.ts. Do not edit by hand.

import { entity, EntityFieldCardinality, EntityFieldType, facet } from '$/schema/$schema.ts'
import { EntityType } from '$/schema/EntityType.ts'
import { UrlString } from '$/schema/UrlString.ts'
import { type } from 'arktype'

export enum IpfsProtocolSelector {
	Scope = 'Scope',
}
export const IpfsProtocol = entity({
	entityType: EntityType.IpfsProtocol,
	labels: {
		singular: 'IPFS protocol',
		plural: 'IPFS protocols',
	},
})({
	scope: {
		label: 'Scope',
		description: 'The fixed scope value that identifies this hub row.',
		type: EntityFieldType.Primitive,
		primitiveType: type.unit('IpfsProtocol'),
		cardinality: EntityFieldCardinality.One,
	},
	protocolName: {
		label: 'Protocol name',
		type: EntityFieldType.Primitive,
		primitiveType: type('string'),
		cardinality: EntityFieldCardinality.One,
	},
	homeUrl: {
		label: 'Home URL',
		type: EntityFieldType.Primitive,
		primitiveType: (UrlString),
		cardinality: EntityFieldCardinality.One,
	},
	docsUrl: {
		label: 'Docs URL',
		type: EntityFieldType.Primitive,
		primitiveType: (UrlString),
		cardinality: EntityFieldCardinality.ZeroOrOne,
	},
	registryName: {
		label: 'Registry name name',
		type: EntityFieldType.Primitive,
		primitiveType: type('string'),
		cardinality: EntityFieldCardinality.One,
	},
	relationshipModel: {
		label: 'Connection model',
		type: EntityFieldType.Primitive,
		primitiveType: type('string'),
		cardinality: EntityFieldCardinality.One,
	},
})({
	selectors: {
		Scope: [
			'scope',
		],
	},
})

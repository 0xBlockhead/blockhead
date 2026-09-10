// Generated from APP.ts.

import { entity } from '$/schema/$schema.ts'
import { EntityFieldCardinality } from '$/schema/EntityFieldCardinality.ts'
import { EntityType } from '$/schema/EntityType.ts'
import { UrlString } from '$/schema/UrlString.ts'
import { Source } from '$/sources/Source.ts'
import { type } from 'arktype'

export default entity({
	entityType: EntityType.IpfsResource,
	labels: {
		singular: 'IPFS resource',
		plural: 'IPFS resources',
	},
})({
	namespace: {
		primitiveType: type('"ipfs" | "ipns"'),
		cardinality: EntityFieldCardinality.One,
	},
	target: {
		primitiveType: type('string'),
		cardinality: EntityFieldCardinality.One,
	},
	contentPath: {
		primitiveType: type('string'),
		cardinality: EntityFieldCardinality.One,
	},
	canonicalUri: {
		primitiveType: UrlString,
		cardinality: EntityFieldCardinality.One,
	},
	cidVersion: {
		primitiveType: type('number'),
		cardinality: EntityFieldCardinality.ZeroOrOne,
	},
	cidMultibase: {
		primitiveType: type('string'),
		cardinality: EntityFieldCardinality.ZeroOrOne,
	},
	cidMulticodecCode: {
		primitiveType: type('number'),
		cardinality: EntityFieldCardinality.ZeroOrOne,
	},
	cidMultihashCode: {
		primitiveType: type('number'),
		cardinality: EntityFieldCardinality.ZeroOrOne,
	},
	cidMultihashDigestHex: {
		primitiveType: type('string'),
		cardinality: EntityFieldCardinality.ZeroOrOne,
	},
	isCidSubdomainSafe: {
		primitiveType: type('boolean'),
		cardinality: EntityFieldCardinality.ZeroOrOne,
	},
	$$timestamps: {
		entityType: EntityType.IpfsResource_Timestamp,
		cardinality: EntityFieldCardinality.Many,
		defaultSources: [
			Source.Ipfs_Rest,
		],
	},
})({
	selectors: {
		ResourceAddress: [
			'namespace',
			'target',
			'contentPath',
		],
	},
})

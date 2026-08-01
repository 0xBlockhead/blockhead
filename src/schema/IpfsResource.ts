// Generated from APP.ts.

import { entity } from '$/schema/$schema.ts'
import { EntityFieldCardinality } from '$/schema/EntityFieldCardinality.ts'
import { EntityType } from '$/schema/EntityType.ts'
import { UrlString } from '$/schema/UrlString.ts'
import { type } from 'arktype'

export default entity({
	entityType: EntityType.IpfsResource,
	labels: {
		singular: 'IPFS resource',
		plural: 'IPFS resources',
	},
})({
	namespace: {
		label: 'Namespace',
		description: 'The namespace that qualifies the identifier.',
		primitiveType: type('"ipfs" | "ipns"'),
		cardinality: EntityFieldCardinality.One,
	},
	target: {
		label: 'Target',
		primitiveType: type('string'),
		cardinality: EntityFieldCardinality.One,
	},
	contentPath: {
		label: 'Content path',
		primitiveType: type('string'),
		cardinality: EntityFieldCardinality.One,
	},
	canonicalUri: {
		label: 'Canonical URI',
		primitiveType: UrlString,
		cardinality: EntityFieldCardinality.One,
	},
	gatewayOrigin: {
		label: 'Gateway origin',
		primitiveType: UrlString,
		cardinality: EntityFieldCardinality.One,
	},
	gatewayUrl: {
		label: 'Gateway URL',
		primitiveType: UrlString,
		cardinality: EntityFieldCardinality.One,
	},
	fileName: {
		label: 'File name',
		primitiveType: type('string'),
		cardinality: EntityFieldCardinality.ZeroOrOne,
	},
	extension: {
		label: 'Extension',
		primitiveType: type('string'),
		cardinality: EntityFieldCardinality.ZeroOrOne,
	},
	contentType: {
		label: 'Content type',
		primitiveType: type('string'),
		cardinality: EntityFieldCardinality.ZeroOrOne,
	},
	contentLength: {
		label: 'Content length',
		primitiveType: type('number'),
		cardinality: EntityFieldCardinality.ZeroOrOne,
	},
	displayType: {
		label: 'Display type',
		primitiveType: type('string'),
		cardinality: EntityFieldCardinality.One,
	},
	isContentTypeInferred: {
		label: 'Content type inferred',
		primitiveType: type('boolean'),
		cardinality: EntityFieldCardinality.One,
	},
	text: {
		label: 'Text',
		primitiveType: type('string'),
		cardinality: EntityFieldCardinality.ZeroOrOne,
	},
	$media: {
		label: 'Media',
		entityType: EntityType.Media,
		cardinality: EntityFieldCardinality.ZeroOrOne,
	},
	cidVersion: {
		label: 'CID version',
		primitiveType: type('number'),
		cardinality: EntityFieldCardinality.ZeroOrOne,
	},
	cidMultibase: {
		label: 'CID multibase',
		primitiveType: type('string'),
		cardinality: EntityFieldCardinality.ZeroOrOne,
	},
	cidMulticodecCode: {
		label: 'CID multicodec code',
		primitiveType: type('number'),
		cardinality: EntityFieldCardinality.ZeroOrOne,
	},
	cidMultihashCode: {
		label: 'CID multihash code',
		primitiveType: type('number'),
		cardinality: EntityFieldCardinality.ZeroOrOne,
	},
	cidMultihashDigestHex: {
		label: 'CID multihash digest hex',
		primitiveType: type('string'),
		cardinality: EntityFieldCardinality.ZeroOrOne,
	},
	isCidSubdomainSafe: {
		label: 'CID subdomain safe',
		primitiveType: type('boolean'),
		cardinality: EntityFieldCardinality.ZeroOrOne,
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

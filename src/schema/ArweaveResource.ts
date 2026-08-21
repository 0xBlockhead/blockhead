// Generated from APP.ts.

import { entity } from '$/schema/$schema.ts'
import { EntityFieldCardinality } from '$/schema/EntityFieldCardinality.ts'
import { EntityType } from '$/schema/EntityType.ts'
import { Source } from '$/sources/Source.ts'
import { type } from 'arktype'

export default entity({
	entityType: EntityType.ArweaveResource,
	labels: {
		singular: 'arweave resource',
		plural: 'arweave resources',
	},
})({
	transactionId: {
		primitiveType: type('string'),
		cardinality: EntityFieldCardinality.One,
	},
	contentPath: {
		primitiveType: type('string'),
		cardinality: EntityFieldCardinality.One,
	},
	canonicalUri: {
		primitiveType: type('string'),
		cardinality: EntityFieldCardinality.One,
	},
	manifestVersion: {
		primitiveType: type('string'),
		cardinality: EntityFieldCardinality.ZeroOrOne,
		defaultSources: [
			Source.Arweave_Rest,
		],
	},
	manifestDeclaredIndexPath: {
		primitiveType: type('string'),
		cardinality: EntityFieldCardinality.ZeroOrOne,
		defaultSources: [
			Source.Arweave_Rest,
		],
	},
	$manifestIndexResource: {
		entityType: EntityType.ArweaveResource,
		cardinality: EntityFieldCardinality.ZeroOrOne,
		defaultSources: [
			Source.Arweave_Rest,
		],
	},
	$manifestFallbackResource: {
		entityType: EntityType.ArweaveResource,
		cardinality: EntityFieldCardinality.ZeroOrOne,
		defaultSources: [
			Source.Arweave_Rest,
		],
	},
	$transaction: {
		entityType: EntityType.ArweaveTransaction,
		cardinality: EntityFieldCardinality.ZeroOrOne,
	},
	$$manifestPaths: {
		entityType: EntityType.ArweaveManifestPath,
		cardinality: EntityFieldCardinality.Many,
		defaultSources: [
			Source.Arweave_Rest,
		],
	},
	$$timestamps: {
		entityType: EntityType.ArweaveResource_Timestamp,
		cardinality: EntityFieldCardinality.Many,
	},
})({
	selectors: {
		TransactionId: [
			'transactionId',
		],
		TransactionIdContentPath: [
			'transactionId',
			'contentPath',
		],
	},
})

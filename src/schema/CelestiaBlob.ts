// Generated from APP.ts.

import { entity } from '$/schema/$schema.ts'
import { EntityFieldCardinality } from '$/schema/EntityFieldCardinality.ts'
import { EntityType } from '$/schema/EntityType.ts'
import { Source } from '$/sources/Source.ts'
import { type } from 'arktype'

export default entity({
	entityType: EntityType.CelestiaBlob,
	labels: {
		singular: 'celestia blob',
		plural: 'celestia blobs',
	},
})({
	$namespace: {
		entityType: EntityType.CelestiaNamespace,
		cardinality: EntityFieldCardinality.One,
	},
	height: {
		primitiveType: type('bigint').narrow((value) => value >= 0n),
		cardinality: EntityFieldCardinality.One,
	},
	commitment: {
		primitiveType: type('string'),
		cardinality: EntityFieldCardinality.One,
	},
	dataHash: {
		primitiveType: type('string'),
		cardinality: EntityFieldCardinality.ZeroOrOne,
	},
	shareVersion: {
		primitiveType: type('number'),
		cardinality: EntityFieldCardinality.ZeroOrOne,
		defaultSources: [
			Source.Celenium_Rest,
			Source.CelestiaNode,
		],
	},
	index: {
		primitiveType: type('number'),
		cardinality: EntityFieldCardinality.ZeroOrOne,
		defaultSources: [
			Source.CelestiaNode,
		],
	},
	sizeBytes: {
		primitiveType: type('bigint'),
		cardinality: EntityFieldCardinality.ZeroOrOne,
		defaultSources: [
			Source.Celenium_Rest,
			Source.CelestiaNode,
		],
	},
	signer: {
		primitiveType: type('string'),
		cardinality: EntityFieldCardinality.ZeroOrOne,
		defaultSources: [
			Source.Celenium_Rest,
		],
	},
	txHash: {
		primitiveType: type('string'),
		cardinality: EntityFieldCardinality.ZeroOrOne,
		defaultSources: [
			Source.Celenium_Rest,
		],
	},
	$block: {
		entityType: EntityType.CelestiaBlock,
		cardinality: EntityFieldCardinality.ZeroOrOne,
		defaultSources: [
			Source.Celenium_Rest,
			Source.CelestiaNode,
		],
	},
	proof: {
		primitiveType: type('unknown'),
		cardinality: EntityFieldCardinality.ZeroOrOne,
		defaultSources: [
			Source.CelestiaNode,
		],
	},
	shareProofAvailable: {
		primitiveType: type('boolean'),
		cardinality: EntityFieldCardinality.ZeroOrOne,
		defaultSources: [
			Source.CelestiaNode,
		],
	},
	blobData: {
		primitiveType: type('string'),
		cardinality: EntityFieldCardinality.ZeroOrOne,
		defaultSources: [
			Source.CelestiaNode,
		],
	},
	payloadRequested: {
		primitiveType: type('boolean'),
		cardinality: EntityFieldCardinality.ZeroOrOne,
		defaultSources: [
			Source.CelestiaNode,
		],
	},
})({
	selectors: {
		NamespaceHeightCommitment: [
			'$namespace',
			'height',
			'commitment',
		],
	},
})

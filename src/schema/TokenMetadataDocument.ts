// Generated from APP.ts.

import { entity } from '$/schema/$schema.ts'
import { EntityFieldCardinality } from '$/schema/EntityFieldCardinality.ts'
import { EntityType } from '$/schema/EntityType.ts'
import { type } from 'arktype'

export default entity({
	entityType: EntityType.TokenMetadataDocument,
	labels: {
		singular: 'token metadata document',
		plural: 'token metadata documents',
	},
})({
	metadataSubjectKey: {
		label: 'Metadata subject key',
		primitiveType: type('string'),
		cardinality: EntityFieldCardinality.One,
	},
	$assetInstance: {
		label: 'Asset instance',
		entityType: EntityType.AssetInstance,
		cardinality: EntityFieldCardinality.One,
	},
	$object: {
		label: 'Object',
		entityType: EntityType.AssetObject,
		cardinality: EntityFieldCardinality.ZeroOrOne,
	},
	metadataKey: {
		label: 'Metadata key',
		primitiveType: type('string'),
		cardinality: EntityFieldCardinality.One,
	},
	timestampMs: {
		label: 'Timestamp',
		description: 'The observation time in Unix milliseconds.',
		primitiveType: type('number'),
		cardinality: EntityFieldCardinality.One,
	},
	source: {
		label: 'Source',
		description: 'The source that produced this observation.',
		primitiveType: type('string'),
		cardinality: EntityFieldCardinality.One,
	},
	uri: {
		label: 'URI',
		primitiveType: type('string'),
		cardinality: EntityFieldCardinality.ZeroOrOne,
	},
	contentHash: {
		label: 'Content hash',
		primitiveType: type('string'),
		cardinality: EntityFieldCardinality.ZeroOrOne,
	},
	name: {
		label: 'Name',
		description: 'The human-readable name of the subject.',
		primitiveType: type('string'),
		cardinality: EntityFieldCardinality.ZeroOrOne,
	},
	symbol: {
		label: 'Symbol',
		description: 'The short ticker or symbol used for display.',
		primitiveType: type('string'),
		cardinality: EntityFieldCardinality.ZeroOrOne,
	},
	description: {
		label: 'Description',
		description: 'A human-readable description from the source domain.',
		primitiveType: type('string'),
		cardinality: EntityFieldCardinality.ZeroOrOne,
	},
	attributes: {
		label: 'Attributes',
		primitiveType: type('unknown'),
		cardinality: EntityFieldCardinality.ZeroOrOne,
	},
	mutable: {
		label: 'Mutable',
		primitiveType: type('boolean'),
		cardinality: EntityFieldCardinality.ZeroOrOne,
	},
	metadataStandard: {
		label: 'Metadata standard',
		primitiveType: type('string'),
		cardinality: EntityFieldCardinality.ZeroOrOne,
	},
	mediaUrl: {
		label: 'Media URL',
		primitiveType: type('string'),
		cardinality: EntityFieldCardinality.ZeroOrOne,
	},
	$media: {
		label: 'Media',
		entityType: EntityType.Media,
		cardinality: EntityFieldCardinality.ZeroOrOne,
	},
})({
	selectors: {
		MetadataSubjectKeyMetadataKeyTimestampMsSource: [
			'metadataSubjectKey',
			'metadataKey',
			'timestampMs',
			'source',
		],
	},
})

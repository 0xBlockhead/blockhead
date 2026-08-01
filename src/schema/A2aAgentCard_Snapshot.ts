// Generated from APP.ts.

import { entity } from '$/schema/$schema.ts'
import { EntityFieldCardinality } from '$/schema/EntityFieldCardinality.ts'
import { EntityType } from '$/schema/EntityType.ts'
import { UrlString } from '$/schema/UrlString.ts'
import { ZeroExHex } from '$/schema/ZeroExHex.ts'
import { type } from 'arktype'

export default entity({
	entityType: EntityType.A2aAgentCard_Snapshot,
	labels: {
		singular: 'a2a agent card snapshot',
		plural: 'a2a agent card snapshots',
	},
})({
	$card: {
		label: 'card',
		entityType: EntityType.A2aAgentCard,
		cardinality: EntityFieldCardinality.One,
	},
	contentHashAlgorithm: {
		label: 'content hash algorithm',
		primitiveType: type('string'),
		cardinality: EntityFieldCardinality.One,
	},
	contentHash: {
		label: 'content hash',
		primitiveType: ZeroExHex,
		cardinality: EntityFieldCardinality.One,
	},
	fetchedAt: {
		label: 'fetched AT',
		primitiveType: type('number'),
		cardinality: EntityFieldCardinality.ZeroOrOne,
	},
	snapshotKind: {
		label: 'snapshot kind',
		primitiveType: type('string'),
		cardinality: EntityFieldCardinality.ZeroOrOne,
	},
	name: {
		label: 'Name',
		description: 'The human-readable name of the subject.',
		primitiveType: type('string'),
		cardinality: EntityFieldCardinality.ZeroOrOne,
	},
	description: {
		label: 'Description',
		description: 'A human-readable description from the source domain.',
		primitiveType: type('string'),
		cardinality: EntityFieldCardinality.ZeroOrOne,
	},
	version: {
		label: 'version',
		primitiveType: type('string'),
		cardinality: EntityFieldCardinality.ZeroOrOne,
	},
	protocolVersion: {
		label: 'protocol version',
		primitiveType: type('string'),
		cardinality: EntityFieldCardinality.ZeroOrOne,
	},
	providerName: {
		label: 'provider name',
		primitiveType: type('string'),
		cardinality: EntityFieldCardinality.ZeroOrOne,
	},
	providerUrl: {
		label: 'provider URL',
		primitiveType: UrlString,
		cardinality: EntityFieldCardinality.ZeroOrOne,
	},
	preferredTransport: {
		label: 'preferred transport',
		primitiveType: type('string'),
		cardinality: EntityFieldCardinality.ZeroOrOne,
	},
	defaultInputModes: {
		label: 'default input modes',
		primitiveType: type('unknown'),
		cardinality: EntityFieldCardinality.ZeroOrOne,
	},
	defaultOutputModes: {
		label: 'default output modes',
		primitiveType: type('unknown'),
		cardinality: EntityFieldCardinality.ZeroOrOne,
	},
	capabilities: {
		label: 'capabilities',
		primitiveType: type('unknown'),
		cardinality: EntityFieldCardinality.ZeroOrOne,
	},
	extensions: {
		label: 'extensions',
		primitiveType: type('unknown'),
		cardinality: EntityFieldCardinality.ZeroOrOne,
	},
	securitySchemes: {
		label: 'security schemes',
		primitiveType: type('unknown'),
		cardinality: EntityFieldCardinality.ZeroOrOne,
	},
	security: {
		label: 'security',
		primitiveType: type('unknown'),
		cardinality: EntityFieldCardinality.ZeroOrOne,
	},
	signatures: {
		label: 'signatures',
		primitiveType: type('unknown'),
		cardinality: EntityFieldCardinality.ZeroOrOne,
	},
	$$interfaces: {
		label: 'interfaces',
		entityType: EntityType.A2aAgentInterface,
		cardinality: EntityFieldCardinality.Many,
	},
	$$services: {
		label: 'services',
		entityType: EntityType.A2aAgentService,
		cardinality: EntityFieldCardinality.Many,
	},
	$$skills: {
		label: 'skills',
		entityType: EntityType.A2aAgentSkill,
		cardinality: EntityFieldCardinality.Many,
	},
})({
	selectors: {
		CardContentHash: [
			'$card',
			'contentHashAlgorithm',
			'contentHash',
		],
	},
})

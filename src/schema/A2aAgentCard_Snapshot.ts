// Generated from APP.ts. Do not edit by hand.

import { entity, EntityFieldCardinality, EntityFieldType, facet } from '$/schema/$schema.ts'
import { EntityType } from '$/schema/EntityType.ts'
import { UrlString } from '$/schema/UrlString.ts'
import { ZeroExHex } from '$/schema/ZeroExHex.ts'
import { type } from 'arktype'

export enum A2aAgentCard_SnapshotSelector {
	CardContentHash = 'CardContentHash',
}
export const A2aAgentCard_Snapshot = entity({
	entityType: EntityType.A2aAgentCard_Snapshot,
	label: 'a2a agent card snapshot',
	labelPlural: 'a2a agent card snapshots',
})({
	$card: {
		label: 'card',
		type: EntityFieldType.EntityReference,
		entityType: EntityType.A2aAgentCard,
		cardinality: EntityFieldCardinality.One,
	},
	contentHashAlgorithm: {
		label: 'content hash algorithm',
		type: EntityFieldType.Primitive,
		primitiveType: type('string'),
		cardinality: EntityFieldCardinality.One,
	},
	contentHash: {
		label: 'content hash',
		type: EntityFieldType.Primitive,
		primitiveType: (ZeroExHex),
		cardinality: EntityFieldCardinality.One,
	},
	fetchedAt: {
		label: 'fetched AT',
		type: EntityFieldType.Primitive,
		primitiveType: type('number'),
		cardinality: EntityFieldCardinality.ZeroOrOne,
	},
	snapshotKind: {
		label: 'snapshot kind',
		type: EntityFieldType.Primitive,
		primitiveType: type('string'),
		cardinality: EntityFieldCardinality.ZeroOrOne,
	},
	name: {
		label: 'Name',
		description: 'The human-readable name of the subject.',
		type: EntityFieldType.Primitive,
		primitiveType: type('string'),
		cardinality: EntityFieldCardinality.ZeroOrOne,
	},
	description: {
		label: 'Description',
		description: 'A human-readable description from the source domain.',
		type: EntityFieldType.Primitive,
		primitiveType: type('string'),
		cardinality: EntityFieldCardinality.ZeroOrOne,
	},
	version: {
		label: 'version',
		type: EntityFieldType.Primitive,
		primitiveType: type('string'),
		cardinality: EntityFieldCardinality.ZeroOrOne,
	},
	protocolVersion: {
		label: 'protocol version',
		type: EntityFieldType.Primitive,
		primitiveType: type('string'),
		cardinality: EntityFieldCardinality.ZeroOrOne,
	},
	providerName: {
		label: 'provider name',
		type: EntityFieldType.Primitive,
		primitiveType: type('string'),
		cardinality: EntityFieldCardinality.ZeroOrOne,
	},
	providerUrl: {
		label: 'provider URL',
		type: EntityFieldType.Primitive,
		primitiveType: (UrlString),
		cardinality: EntityFieldCardinality.ZeroOrOne,
	},
	preferredTransport: {
		label: 'preferred transport',
		type: EntityFieldType.Primitive,
		primitiveType: type('string'),
		cardinality: EntityFieldCardinality.ZeroOrOne,
	},
	defaultInputModes: {
		label: 'default input modes',
		type: EntityFieldType.Primitive,
		primitiveType: type('unknown'),
		cardinality: EntityFieldCardinality.ZeroOrOne,
	},
	defaultOutputModes: {
		label: 'default output modes',
		type: EntityFieldType.Primitive,
		primitiveType: type('unknown'),
		cardinality: EntityFieldCardinality.ZeroOrOne,
	},
	capabilities: {
		label: 'capabilities',
		type: EntityFieldType.Primitive,
		primitiveType: type('unknown'),
		cardinality: EntityFieldCardinality.ZeroOrOne,
	},
	extensions: {
		label: 'extensions',
		type: EntityFieldType.Primitive,
		primitiveType: type('unknown'),
		cardinality: EntityFieldCardinality.ZeroOrOne,
	},
	securitySchemes: {
		label: 'security schemes',
		type: EntityFieldType.Primitive,
		primitiveType: type('unknown'),
		cardinality: EntityFieldCardinality.ZeroOrOne,
	},
	security: {
		label: 'security',
		type: EntityFieldType.Primitive,
		primitiveType: type('unknown'),
		cardinality: EntityFieldCardinality.ZeroOrOne,
	},
	signatures: {
		label: 'signatures',
		type: EntityFieldType.Primitive,
		primitiveType: type('unknown'),
		cardinality: EntityFieldCardinality.ZeroOrOne,
	},
	$$interfaces: {
		label: 'interfaces',
		type: EntityFieldType.EntitiesReference,
		entityType: EntityType.A2aAgentInterface,
		cardinality: EntityFieldCardinality.Many,
	},
	$$services: {
		label: 'services',
		type: EntityFieldType.EntitiesReference,
		entityType: EntityType.A2aAgentService,
		cardinality: EntityFieldCardinality.Many,
	},
	$$skills: {
		label: 'skills',
		type: EntityFieldType.EntitiesReference,
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

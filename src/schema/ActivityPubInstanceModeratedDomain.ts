// Generated from APP.ts. Do not edit by hand.

import { EntityFieldCardinality, EntityFieldType, type EntityDefinition } from '$/schema/$schema.ts'
import { EntityType } from '$/schema/EntityType.ts'
import { type } from 'arktype'

export enum ActivityPubInstanceModeratedDomainSelector {
	InstanceOriginModeratedDomainSource = 'InstanceOriginModeratedDomainSource',
}
export default {
	entityType: EntityType.ActivityPubInstanceModeratedDomain,
	label: 'ActivityPub instance moderated domain',
	labelPlural: 'ActivityPub instance moderated domains',
	description: 'A domain that a configured ActivityPub instance reports in its public moderation-domain list.',
	selectors: [
		{
			name: ActivityPubInstanceModeratedDomainSelector.InstanceOriginModeratedDomainSource,
			fields: [
				'instanceOrigin',
				'domain',
				'source',
			],
		},
	],
	fields: [
		{
			name: 'instanceOrigin',
			label: 'Instance origin',
			type: EntityFieldType.Primitive,
			primitiveType: type('string'),
			cardinality: EntityFieldCardinality.One,
		},
		{
			name: 'domain',
			label: 'Domain',
			type: EntityFieldType.Primitive,
			primitiveType: type('string'),
			cardinality: EntityFieldCardinality.One,
		},
		{
			name: 'source',
			label: 'Source',
			description: 'The source that observed this moderation relation.',
			type: EntityFieldType.Primitive,
			primitiveType: type('string'),
			cardinality: EntityFieldCardinality.One,
		},
		{
			name: 'severity',
			label: 'Severity',
			type: EntityFieldType.Primitive,
			primitiveType: type('string'),
			cardinality: EntityFieldCardinality.ZeroOrOne,
		},
		{
			name: 'comment',
			label: 'Comment',
			type: EntityFieldType.Primitive,
			primitiveType: type('string'),
			cardinality: EntityFieldCardinality.ZeroOrOne,
		},
	],
} as const satisfies EntityDefinition

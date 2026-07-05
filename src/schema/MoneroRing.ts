// Generated from APP.ts. Do not edit by hand.

import { EntityFieldCardinality, EntityFieldType, type EntityDefinition } from '$/schema/$schema.ts'
import { EntityType } from '$/schema/EntityType.ts'
import { Source } from '$/sources/Source.ts'
import { type } from 'arktype'

export enum MoneroRingSelector {
	MoneroKeyImage = 'MoneroKeyImage',
}
export default {
	entityType: EntityType.MoneroRing,
	label: 'monero ring',
	labelPlural: 'monero rings',
	selectors: [
		{
			name: MoneroRingSelector.MoneroKeyImage,
			fields: [
				'$keyImage',
			],
		},
	],
	fields: [
		{
				name: '$keyImage',
				label: 'Key image',
				type: EntityFieldType.EntityReference,
				entityType: EntityType.MoneroKeyImage,
				cardinality: EntityFieldCardinality.One,
		},
		{
				name: '$$members',
				label: 'Members',
				type: EntityFieldType.EntitiesReference,
				entityType: EntityType.MoneroRingMember,
				cardinality: EntityFieldCardinality.Many,
				defaultSources: [
					Source.MoneroDaemonRpc_JsonRpc,
				],
		},
	],
} as const satisfies EntityDefinition

// Generated from APP.ts. Do not edit by hand.

import { entity, EntityFieldCardinality, EntityFieldType, facet } from '$/schema/$schema.ts'
import { EntityType } from '$/schema/EntityType.ts'
import { type } from 'arktype'

export enum NetworkStackSelector {
	NetworkStackId = 'NetworkStackId',
}
export const NetworkStack = entity({
	entityType: EntityType.NetworkStack,
	label: 'network stack',
	labelPlural: 'network stacks',
	description: 'A curated protocol-stack classification used by network catalog rows.',
})({
	networkStackId: {
		label: 'Network stack ID',
		type: EntityFieldType.Primitive,
		primitiveType: type('string'),
		cardinality: EntityFieldCardinality.One,
	},
	label: {
		label: 'Label',
		description: 'A human-readable name for the subject.',
		type: EntityFieldType.Primitive,
		primitiveType: type('string'),
		cardinality: EntityFieldCardinality.One,
	},
})({
	selectors: {
		NetworkStackId: [
			'networkStackId',
		],
	},
})

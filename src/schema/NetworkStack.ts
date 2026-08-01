// Generated from APP.ts.

import { entity } from '$/schema/$schema.ts'
import { EntityFieldCardinality } from '$/schema/EntityFieldCardinality.ts'
import { EntityType } from '$/schema/EntityType.ts'
import { type } from 'arktype'

export default entity({
	entityType: EntityType.NetworkStack,
	labels: {
		singular: 'network stack',
		plural: 'network stacks',
	},
	description: 'A curated protocol-stack classification used by network catalog rows.',
})({
	networkStackId: {
		primitiveType: type('string'),
		cardinality: EntityFieldCardinality.One,
	},
	label: {
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

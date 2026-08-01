// Generated from APP.ts.

import { entity } from '$/schema/$schema.ts'
import { EntityFieldCardinality } from '$/schema/EntityFieldCardinality.ts'
import { EntityType } from '$/schema/EntityType.ts'
import { Source } from '$/sources/Source.ts'

export default entity({
	entityType: EntityType.BlockheadAccount,
	labels: {
		singular: 'blockhead account',
		plural: 'blockhead accounts',
	},
	description: 'A locally enrolled public account included in Blockhead account-wide views.',
})({
	$account: {
		entityType: EntityType.Account,
		cardinality: EntityFieldCardinality.One,
		defaultSources: [
			Source.Local_Internal,
		],
	},
})({
	selectors: {
		Account: [
			'$account',
		],
	},
})

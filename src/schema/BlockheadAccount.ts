// Generated from APP.ts. Do not edit by hand.

import { entity } from '$/schema/$schema.ts'
import { EntityFieldCardinality, EntityFieldType } from '$/schema/EntityField.ts'
import { EntityType } from '$/schema/EntityType.ts'
import { Source } from '$/sources/Source.ts'
import { type } from 'arktype'

export default entity({
	entityType: EntityType.BlockheadAccount,
	labels: {
		singular: 'blockhead account',
		plural: 'blockhead accounts',
	},
	description: 'A locally enrolled public account included in Blockhead account-wide views.',
})({
	$account: {
		label: 'Account',
		type: EntityFieldType.EntityReference,
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

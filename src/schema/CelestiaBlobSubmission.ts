// Generated from APP.ts.

import { entity } from '$/schema/$schema.ts'
import { EntityFieldCardinality } from '$/schema/EntityFieldCardinality.ts'
import { EntityType } from '$/schema/EntityType.ts'
import { Source } from '$/sources/Source.ts'
import { type } from 'arktype'

export default entity({
	entityType: EntityType.CelestiaBlobSubmission,
	labels: {
		singular: 'celestia blob submission',
		plural: 'celestia blob submissions',
	},
})({
	$blob: {
		entityType: EntityType.CelestiaBlob,
		cardinality: EntityFieldCardinality.One,
	},
	txHash: {
		primitiveType: type('string'),
		cardinality: EntityFieldCardinality.One,
	},
	$transaction: {
		entityType: EntityType.CosmosTransaction,
		cardinality: EntityFieldCardinality.One,
	},
	$$submitters: {
		entityType: EntityType.CosmosAccount,
		cardinality: EntityFieldCardinality.Many,
		defaultSources: [
			Source.Celenium_Rest,
		],
	},
})({
	selectors: {
		BlobTransaction: [
			'$blob',
			'txHash',
		],
	},
})

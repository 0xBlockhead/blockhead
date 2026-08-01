// Generated from APP.ts.

import { entity } from '$/schema/$schema.ts'
import { EntityFieldCardinality } from '$/schema/EntityFieldCardinality.ts'
import { EntityType } from '$/schema/EntityType.ts'
import { type } from 'arktype'

export default entity({
	entityType: EntityType.BlockheadWallet,
	labels: {
		singular: 'blockhead wallet',
		plural: 'blockhead wallets',
	},
})({
	id: {
		label: 'ID',
		description: 'The identifier assigned by the source domain.',
		primitiveType: type('string'),
		cardinality: EntityFieldCardinality.One,
	},
	name: {
		label: 'Name',
		description: 'The human-readable name of the subject.',
		primitiveType: type('string'),
		cardinality: EntityFieldCardinality.One,
	},
	icon: {
		label: 'icon',
		primitiveType: type('string'),
		cardinality: EntityFieldCardinality.One,
	},
	protocol: {
		label: 'protocol',
		primitiveType: type('string'),
		cardinality: EntityFieldCardinality.One,
	},
	discoveryKind: {
		label: 'discovery kind',
		primitiveType: type('string'),
		cardinality: EntityFieldCardinality.One,
	},
	transportKind: {
		label: 'transport kind',
		primitiveType: type('string'),
		cardinality: EntityFieldCardinality.One,
	},
	rdns: {
		label: 'rdns',
		primitiveType: type('string'),
		cardinality: EntityFieldCardinality.ZeroOrOne,
	},
	websiteUrl: {
		label: 'website URL',
		primitiveType: type('string'),
		cardinality: EntityFieldCardinality.ZeroOrOne,
	},
	capabilities: {
		label: 'capabilities',
		primitiveType: type('string').array(),
		cardinality: EntityFieldCardinality.One,
	},
	$connectionMethod: {
		label: 'connection method',
		entityType: EntityType.WalletConnectionMethod,
		cardinality: EntityFieldCardinality.ZeroOrOne,
	},
	adapterId: {
		label: 'adapter ID',
		primitiveType: type('string'),
		cardinality: EntityFieldCardinality.ZeroOrOne,
	},
	sourceWalletKey: {
		label: 'source wallet key',
		primitiveType: type('string'),
		cardinality: EntityFieldCardinality.ZeroOrOne,
	},
	detectedAt: {
		label: 'detected AT',
		primitiveType: type('number'),
		cardinality: EntityFieldCardinality.ZeroOrOne,
	},
})({
	selectors: {
		Id: [
			'id',
		],
	},
})

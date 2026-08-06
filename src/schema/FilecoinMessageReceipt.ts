// Generated from APP.ts.

import { entity } from '$/schema/$schema.ts'
import { EntityFieldCardinality } from '$/schema/EntityFieldCardinality.ts'
import { EntityType } from '$/schema/EntityType.ts'
import { Source } from '$/sources/Source.ts'
import { type } from 'arktype'

export default entity({
	entityType: EntityType.FilecoinMessageReceipt,
	labels: {
		singular: 'filecoin message receipt',
		plural: 'filecoin message receipts',
	},
	description: 'Execution receipt for a Filecoin message in a tipset context — exit code, gas used, and return data from Filfox getMessage.receipt (Lotus ChainGetMessage alone does not).',
})({
	$message: {
		entityType: EntityType.FilecoinMessage,
		cardinality: EntityFieldCardinality.One,
	},
	tipsetKey: {
		primitiveType: type('string'),
		cardinality: EntityFieldCardinality.One,
	},
	source: {
		primitiveType: type('string'),
		cardinality: EntityFieldCardinality.One,
	},
	$tipset: {
		entityType: EntityType.FilecoinTipset,
		cardinality: EntityFieldCardinality.ZeroOrOne,
		defaultSources: [
			Source.Filfox_Rest,
		],
	},
	height: {
		primitiveType: type('bigint'),
		cardinality: EntityFieldCardinality.ZeroOrOne,
		defaultSources: [
			Source.Filfox_Rest,
		],
	},
	blockCid: {
		primitiveType: type('string'),
		cardinality: EntityFieldCardinality.ZeroOrOne,
		defaultSources: [
			Source.Filfox_Rest,
		],
	},
	exitCode: {
		primitiveType: type('number'),
		cardinality: EntityFieldCardinality.ZeroOrOne,
		defaultSources: [
			Source.Filfox_Rest,
		],
	},
	returnData: {
		primitiveType: type('string'),
		cardinality: EntityFieldCardinality.ZeroOrOne,
		defaultSources: [
			Source.Filfox_Rest,
		],
	},
	gasUsed: {
		primitiveType: type('bigint'),
		cardinality: EntityFieldCardinality.ZeroOrOne,
		defaultSources: [
			Source.Filfox_Rest,
		],
	},
	replacedMessageCid: {
		primitiveType: type('string'),
		cardinality: EntityFieldCardinality.ZeroOrOne,
	},
})({
	selectors: {
		MessageTipsetKeySource: [
			'$message',
			'tipsetKey',
			'source',
		],
	},
})

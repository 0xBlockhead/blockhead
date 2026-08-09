// Generated from APP.ts.

import { entity } from '$/schema/$schema.ts'
import { EntityFieldCardinality } from '$/schema/EntityFieldCardinality.ts'
import { EntityType } from '$/schema/EntityType.ts'
import { NonNegativeDecimalString } from '$/schema/NonNegativeDecimalString.ts'
import { EvmAddress, ZeroExHex } from '$/schema/ZeroExHex.ts'
import { Source } from '$/sources/Source.ts'
import { type } from 'arktype'

export default entity({
	entityType: EntityType.BridgeTransfer_Timestamp,
	labels: {
		singular: 'bridge transfer timestamp',
		plural: 'bridge transfer observations',
	},
})({
	$transfer: {
		entityType: EntityType.BridgeTransfer,
		cardinality: EntityFieldCardinality.One,
	},
	timestampMs: {
		primitiveType: type('number.integer >= 0'),
		cardinality: EntityFieldCardinality.One,
	},
	source: {
		primitiveType: type('string'),
		cardinality: EntityFieldCardinality.One,
	},
	status: {
		primitiveType: type('string'),
		cardinality: EntityFieldCardinality.ZeroOrOne,
		defaultSources: [
			Source.Across_Rest,
			Source.Axelarscan_Rest,
			Source.LayerZeroScan_Rest,
			Source.Lifi_Rest,
			Source.Wormholescan,
		],
	},
	substatus: {
		primitiveType: type('string'),
		cardinality: EntityFieldCardinality.ZeroOrOne,
		defaultSources: [
			Source.Across_Rest,
			Source.Axelarscan_Rest,
			Source.LayerZeroScan_Rest,
			Source.Lifi_Rest,
		],
	},
	sourceConfirmations: {
		primitiveType: type('number'),
		cardinality: EntityFieldCardinality.ZeroOrOne,
	},
	requiredConfirmations: {
		primitiveType: type('number'),
		cardinality: EntityFieldCardinality.ZeroOrOne,
	},
	destinationTxHash: {
		primitiveType: ZeroExHex,
		cardinality: EntityFieldCardinality.ZeroOrOne,
		defaultSources: [
			Source.Across_Rest,
			Source.Axelarscan_Rest,
			Source.LayerZeroScan_Rest,
			Source.Lifi_Rest,
			Source.Wormholescan,
		],
	},
	relayer: {
		primitiveType: EvmAddress,
		cardinality: EntityFieldCardinality.ZeroOrOne,
		defaultSources: [
			Source.Across_Rest,
			Source.Axelarscan_Rest,
			Source.LayerZeroScan_Rest,
		],
	},
	refundTxHash: {
		primitiveType: ZeroExHex,
		cardinality: EntityFieldCardinality.ZeroOrOne,
	},
	estimatedCompletionMs: {
		primitiveType: type('number'),
		cardinality: EntityFieldCardinality.ZeroOrOne,
	},
	completedAt: {
		primitiveType: type('number'),
		cardinality: EntityFieldCardinality.ZeroOrOne,
		defaultSources: [
			Source.Across_Rest,
			Source.Axelarscan_Rest,
			Source.LayerZeroScan_Rest,
			Source.Lifi_Rest,
			Source.Wormholescan,
		],
	},
	fillGasFee: {
		primitiveType: type('bigint'),
		cardinality: EntityFieldCardinality.ZeroOrOne,
		defaultSources: [
			Source.Across_Rest,
			Source.Lifi_Rest,
			Source.Wormholescan,
		],
	},
	fillGasFeeUsd: {
		primitiveType: NonNegativeDecimalString,
		cardinality: EntityFieldCardinality.ZeroOrOne,
		defaultSources: [
			Source.Across_Rest,
			Source.Lifi_Rest,
			Source.Wormholescan,
		],
	},
	error: {
		primitiveType: type('string'),
		cardinality: EntityFieldCardinality.ZeroOrOne,
		defaultSources: [
			Source.Across_Rest,
			Source.Axelarscan_Rest,
			Source.LayerZeroScan_Rest,
			Source.Lifi_Rest,
		],
	},
})({
	selectors: {
		TransferTimestampMsSource: [
			'$transfer',
			'timestampMs',
			'source',
		],
	},
})

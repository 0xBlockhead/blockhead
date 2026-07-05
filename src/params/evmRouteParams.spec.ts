import { describe, expect, it } from 'vitest'

import { match as matchEvmTxHash } from '$/params/evmTxHash.ts'
import { match as matchNonNegativeInteger } from '$/params/nonNegativeInteger.ts'
import { match as matchEip155ChainId } from '$/params/eip155ChainId.ts'
import { match as matchEvmBlockNumber } from '$/params/evmBlockNumber.ts'
import { match as matchBeaconSlotNumber } from '$/params/beaconSlotNumber.ts'
import { match as matchBeaconEpochNumber } from '$/params/beaconEpochNumber.ts'
import { match as matchFarcasterFid } from '$/params/farcasterFid.ts'
import { match as matchBridgeRouteStepIndex } from '$/params/bridgeRouteStepIndex.ts'
import { schemaMeta } from '$/schema/index.ts'
import { EntityType } from '$/schema/EntityType.ts'


describe('EVM route params', () => {
	it('accepts only 32-byte transaction hashes and decimal non-negative indexes', () => {
		expect(matchEvmTxHash('0x5e4763cd6b6f129869fff1d60bfadf1d37e1677cb8f1d8997299680da09d5b01')).toBe(true)
		expect(matchEvmTxHash('not-a-hash')).toBe(false)
		expect(matchEvmTxHash('0x1')).toBe(false)

		expect(matchNonNegativeInteger('0')).toBe(true)
		expect(matchNonNegativeInteger('100')).toBe(true)
		expect(matchNonNegativeInteger('1e2')).toBe(false)
		expect(matchNonNegativeInteger('0x10')).toBe(false)
		expect(matchNonNegativeInteger('-1')).toBe(false)
	})

	it('validates route params through schema field artifacts', () => {
		expect(matchEip155ChainId('1')).toBe(true)
		expect(matchEip155ChainId('1e2')).toBe(false)
		expect(matchEip155ChainId('-1')).toBe(false)

		expect(matchEvmBlockNumber('19000000')).toBe(true)
		expect(matchEvmBlockNumber('1.5')).toBe(false)

		expect(matchBeaconSlotNumber('0')).toBe(true)
		expect(matchBeaconSlotNumber('-1')).toBe(false)

		expect(matchBeaconEpochNumber('1')).toBe(true)
		expect(matchBeaconEpochNumber('1e2')).toBe(false)

		expect(matchFarcasterFid('1')).toBe(true)
		expect(matchFarcasterFid('-1')).toBe(false)

		expect(matchBridgeRouteStepIndex('0')).toBe(true)
		expect(matchBridgeRouteStepIndex('01')).toBe(false)
	})

	it('indexes selector definitions by entity type and selector name', () => {
		expect(schemaMeta.entitySelectorDefinitionByEntityTypeAndName[EntityType.EvmBlock].EvmNetworkBlockNumber.fields).toEqual([
			'$network',
			'blockNumber',
		])
	})
})

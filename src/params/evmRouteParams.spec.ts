import { describe, expect, it } from 'vitest'

import { match as matchBeaconEpochNumber } from '$/params/beaconEpochNumber.ts'
import { match as matchBeaconSlotNumber } from '$/params/beaconSlotNumber.ts'
import { match as matchBridgeRouteStepIndex } from '$/params/bridgeRouteStepIndex.ts'
import { match as matchEip155ChainId } from '$/params/eip155ChainId.ts'
import { match as matchEvmTopicHash } from '$/params/evmTopicHash.ts'
import { match as matchEvmTxHash } from '$/params/evmTxHash.ts'
import { match as matchFarcasterFid } from '$/params/farcasterFid.ts'
import { match as matchNetworkCaip2 } from '$/params/networkCaip2.ts'
import { match as matchNonNegativeBigInt } from '$/params/nonNegativeBigInt.ts'
import { match as matchNonNegativeInteger } from '$/params/nonNegativeInteger.ts'
import { parseEntitySelector } from '$/schema/$schema.ts'
import { EntityType } from '$/schema/EntityType.ts'
import {
	entityDefinitionByType,
	schema,
	schemaMeta,
} from '$/schema/index.ts'


describe('EVM route params', () => {
	it('accepts only 32-byte transaction hashes and decimal non-negative indexes', () => {
		expect(matchEvmTxHash('0x5e4763cd6b6f129869fff1d60bfadf1d37e1677cb8f1d8997299680da09d5b01')).toBe(true)
		expect(matchEvmTxHash('0x5E4763CD6B6F129869FFF1D60BFADF1D37E1677CB8F1D8997299680DA09D5B01')).toBe(true)
		expect(matchEvmTxHash('not-a-hash')).toBe(false)
		expect(matchEvmTxHash('0x1')).toBe(false)
		expect(matchEvmTxHash('0x5e4763cd6b6f129869fff1d60bfadf1d37e1677cb8f1d8997299680da09d5b0')).toBe(false)
		expect(matchEvmTxHash('0x5e4763cd6b6f129869fff1d60bfadf1d37e1677cb8f1d8997299680da09d5b010')).toBe(false)
		expect(matchEvmTopicHash('0xddf252ad1be2c89b69c2b068fc378daa952ba7f163c4a11628f55a4df523b3ef')).toBe(true)
		expect(matchEvmTopicHash('0xa9059cbb')).toBe(false)
		expect(matchEvmTopicHash('0xDDF252AD1BE2C89B69C2B068FC378DAA952BA7F163C4A11628F55A4DF523B3EF')).toBe(false)

		expect(matchNonNegativeInteger('0')).toBe(true)
		expect(matchNonNegativeInteger('100')).toBe(true)
		expect(matchNonNegativeInteger('1e2')).toBe(false)
		expect(matchNonNegativeInteger('0x10')).toBe(false)
		expect(matchNonNegativeInteger('-1')).toBe(false)

		expect(matchNonNegativeBigInt('18446744073709551615')).toBe(true)
		expect(matchNonNegativeBigInt('01')).toBe(false)
		expect(matchNonNegativeBigInt('-1')).toBe(false)
	})

	it('validates route params through schema field artifacts', () => {
		expect(matchNetworkCaip2('eip155:1')).toBe(true)
		expect(matchNetworkCaip2('eip155:999999')).toBe(true)
		expect(matchNetworkCaip2('bip122:000000000019d6689c085ae165831e93')).toBe(true)
		expect(matchNetworkCaip2('eip155')).toBe(false)
		expect(matchNetworkCaip2(':1')).toBe(false)
		expect(matchNetworkCaip2('eip155:')).toBe(false)

		expect(matchEip155ChainId('1')).toBe(true)
		expect(matchEip155ChainId('1e2')).toBe(false)
		expect(matchEip155ChainId('-1')).toBe(false)

		expect(matchBeaconSlotNumber('0')).toBe(true)
		expect(matchBeaconSlotNumber('-1')).toBe(false)

		expect(matchBeaconEpochNumber('1')).toBe(true)
		expect(matchBeaconEpochNumber('1e2')).toBe(false)

		expect(matchFarcasterFid('1')).toBe(true)
		expect(matchFarcasterFid('-1')).toBe(false)

		expect(matchBridgeRouteStepIndex('0')).toBe(true)
		expect(matchBridgeRouteStepIndex('01')).toBe(false)
	})

	it('normalizes accepted transaction hashes at the entity selector boundary', () => {
		expect(parseEntitySelector(
			schema,
			entityDefinitionByType[EntityType.EvmTransaction],
			{
				$network: {
					caip2: {
						namespace: 'eip155',
						reference: '1',
					},
				},
				txHash: '0x5E4763CD6B6F129869FFF1D60BFADF1D37E1677CB8F1D8997299680DA09D5B01',
			}
		)).toEqual({
			$network: {
				caip2: {
					namespace: 'eip155',
					reference: '1',
				},
			},
			txHash: '0x5e4763cd6b6f129869fff1d60bfadf1d37e1677cb8f1d8997299680da09d5b01',
		})
	})

	it('indexes selector definitions by entity type and selector name', () => {
		expect(schemaMeta.entitySelectorDefinitionByEntityTypeAndName[EntityType.EvmBlock].EvmNetworkBlockNumber.fields).toEqual([
			'$network',
			'blockNumber',
		])
	})
})

import { expect, it } from 'vitest'

import { messariGraphqlProfiles } from './direct.ts'
import { parsePool } from './pool.ts'

const feeTypes = [
	'FIXED_TRADING_FEE', 'TIERED_TRADING_FEE', 'DYNAMIC_TRADING_FEE',
	'FIXED_LP_FEE', 'DYNAMIC_LP_FEE', 'FIXED_PROTOCOL_FEE', 'DYNAMIC_PROTOCOL_FEE',
	'FIXED_STAKE_FEE', 'DYNAMIC_STAKE_FEE', 'DEPOSIT_FEE', 'WITHDRAWAL_FEE',
	'DYNAMIC_TAKER_FEE', 'DYNAMIC_TAKER_DELAYED_FEE', 'DYNAMIC_TAKER_DELAYED_OFFCHAIN_FEE',
	'DYNAMIC_MAKER_FEE', 'DYNAMIC_MAKER_DELAYED_FEE', 'DYNAMIC_MAKER_DELAYED_OFFCHAIN_FEE',
] as const

const omissionTypes = new Set([
	'TIERED_TRADING_FEE', 'DYNAMIC_TRADING_FEE', 'DYNAMIC_LP_FEE', 'DYNAMIC_PROTOCOL_FEE',
	'DYNAMIC_STAKE_FEE', 'DYNAMIC_TAKER_FEE', 'DYNAMIC_TAKER_DELAYED_FEE',
	'DYNAMIC_TAKER_DELAYED_OFFCHAIN_FEE', 'DYNAMIC_MAKER_FEE', 'DYNAMIC_MAKER_DELAYED_FEE',
	'DYNAMIC_MAKER_DELAYED_OFFCHAIN_FEE',
])

const payload = (deployment: keyof typeof messariGraphqlProfiles, id: string, fees: unknown[]) => {
	const profile = messariGraphqlProfiles[deployment]
	return {
		_meta: { deployment: profile.deployment, hasIndexingErrors: false, block: { number: 123, hash: `0x${'12'.repeat(32)}`, timestamp: 1_800_000_000 } },
		liquidityPool: {
			id, name: 'Fixture', symbol: 'FIX', isSingleSided: false,
			createdTimestamp: '1', createdBlockNumber: '1',
			protocol: { id: profile.protocolId, network: profile.network, schemaVersion: profile.schemaVersion, subgraphVersion: profile.subgraphVersion, methodologyVersion: profile.methodologyVersion },
			inputTokens: [{ id: `0x${'cd'.repeat(20)}` }], inputTokenBalances: ['1'], inputTokenBalancesUSD: ['1'], inputTokenWeights: ['100'],
			fees,
			totalValueLockedUSD: '1', cumulativeVolumeUSD: '2', cumulativeSupplySideRevenueUSD: '3', cumulativeProtocolSideRevenueUSD: '4', cumulativeTotalRevenueUSD: '7',
		},
	}
}

it('preserves all 17 fee modes and omits dynamic/tiered zero sentinels', () => {
	for (const deployment of ['uniswap-v3-arbitrum', 'sushiswap-v3-arbitrum'] as const) {
		const id = deployment === 'uniswap-v3-arbitrum' ? `0x${'ab'.repeat(20)}` : `0x${'cd'.repeat(20)}`
		const fees = feeTypes.map(feeType => ({
			id: `${feeType}-${id}`,
			feeType,
			feePercentage: omissionTypes.has(feeType) ? '0' : '0.123456789012345678901234567890',
		}))
		const result = parsePool(payload(deployment, id, fees), deployment, id)
		expect(result.pool?.fees).toHaveLength(feeTypes.length)
		expect(result.pool?.fees.map(fee => fee.feeType)).toEqual(feeTypes)
		expect(result.profile.schemaVersion).toBe(messariGraphqlProfiles[deployment].schemaVersion)
	}
})

it('rejects nonzero dynamic values, duplicate types, and noncanonical identities', () => {
	const id = `0x${'ab'.repeat(20)}`
	const base = payload('uniswap-v3-arbitrum', id, [{ id: `DYNAMIC_LP_FEE-${id}`, feeType: 'DYNAMIC_LP_FEE', feePercentage: '0.1' }])
	expect(() => parsePool(base, 'uniswap-v3-arbitrum', id)).toThrow(/zero sentinel/)
	const duplicate = payload('uniswap-v3-arbitrum', id, [
		{ id: `FIXED_LP_FEE-${id}`, feeType: 'FIXED_LP_FEE', feePercentage: '0.1' },
		{ id: `FIXED_LP_FEE-${id}`, feeType: 'FIXED_LP_FEE', feePercentage: '0.1' },
	])
	expect(() => parsePool(duplicate, 'uniswap-v3-arbitrum', id)).toThrow(/duplicated/)
	const uppercaseId = id.toUpperCase()
	expect(() => parsePool(payload('uniswap-v3-arbitrum', uppercaseId, []), 'uniswap-v3-arbitrum', uppercaseId)).toThrow()
})

it('accepts an explicitly empty fee relationship', () => {
	const id = `0x${'ab'.repeat(32)}`
	const result = parsePool(payload('uniswap-v3-arbitrum', id, []), 'uniswap-v3-arbitrum', id)
	expect(result.pool?.fees).toEqual([])
})

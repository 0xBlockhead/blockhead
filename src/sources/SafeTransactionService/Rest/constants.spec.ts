import {
	describe,
	expect,
	it,
} from 'vitest'

import {
	safeTransactionServiceHostByChainId,
	safeTransactionServiceHosts,
} from '$/sources/SafeTransactionService/Rest/constants.ts'

describe('Safe Transaction Service host catalog', () => {
	it('covers every documented tx-service OpenAPI network with unique EIP-155 ids', () => {
		expect(safeTransactionServiceHosts).toHaveLength(52)
		expect(new Set(safeTransactionServiceHosts.map((host) => host.chainId)).size).toBe(52)
		expect(new Set(safeTransactionServiceHosts.map((host) => host.pathSlug)).size).toBe(52)
		expect(safeTransactionServiceHosts.map((host) => host.chainId)).toEqual(
			[...safeTransactionServiceHosts.map((host) => host.chainId)].sort((a, b) => a - b)
		)
	})

	it('keeps api.safe.global tx-service locators for prior and major EIP-155 chains', () => {
		expect(safeTransactionServiceHostByChainId[1]).toMatchObject({
			pathSlug: 'eth',
			baseUrl: 'https://api.safe.global/tx-service/eth',
		})
		expect(safeTransactionServiceHostByChainId[10]).toMatchObject({
			pathSlug: 'oeth',
			baseUrl: 'https://api.safe.global/tx-service/oeth',
		})
		expect(safeTransactionServiceHostByChainId[100]).toMatchObject({
			pathSlug: 'gno',
			baseUrl: 'https://api.safe.global/tx-service/gno',
		})
		expect(safeTransactionServiceHostByChainId[137]).toMatchObject({
			pathSlug: 'pol',
			baseUrl: 'https://api.safe.global/tx-service/pol',
		})
		expect(safeTransactionServiceHostByChainId[8453]).toMatchObject({
			pathSlug: 'base',
			baseUrl: 'https://api.safe.global/tx-service/base',
		})
		expect(safeTransactionServiceHostByChainId[42161]).toMatchObject({
			pathSlug: 'arb1',
			baseUrl: 'https://api.safe.global/tx-service/arb1',
		})
		for (const host of safeTransactionServiceHosts)
			expect(host.baseUrl).toBe(`https://api.safe.global/tx-service/${host.pathSlug}`)
	})
})

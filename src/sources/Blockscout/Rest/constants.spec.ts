import { describe, expect, it } from 'vitest'

import {
	blockscoutErc4337OperationsSupported,
	blockscoutErc4337RegistryListsSupported,
	blockscoutExplorerRestV2OriginForChain,
	blockscoutHostedNetworks,
	blockscoutRestV2AtExplorerOrigin,
} from '$/sources/Blockscout/Rest/constants.ts'

describe('blockscoutErc4337OperationsSupported', () => {
	it('is true for hosted chains with AA proxy indexing', () => {
		expect(blockscoutErc4337OperationsSupported(1)).toBe(true)
		expect(blockscoutErc4337OperationsSupported(8453)).toBe(true)
		expect(blockscoutErc4337OperationsSupported(11155111)).toBe(true)
	})

	it('is false for hosted chains without AA proxy indexing', () => {
		for (const chainId of [5, 17000]) {
			expect(
				blockscoutHostedNetworks.some((network) => network.chainId === chainId),
				`fixture chain ${chainId}`
			).toBe(true)
			expect(blockscoutErc4337OperationsSupported(chainId)).toBe(false)
		}
	})

	it('matches registry list helper on supported chains', () => {
		expect(blockscoutErc4337RegistryListsSupported(42161)).toBe(true)
		expect(blockscoutErc4337RegistryListsSupported(5)).toBe(false)
	})
})

describe('blockscoutRestV2AtExplorerOrigin', () => {
	it('is true for Blockscout hosted explorer hostnames', () => {
		expect(blockscoutRestV2AtExplorerOrigin('https://eth.blockscout.com')).toBe(true)
		expect(blockscoutRestV2AtExplorerOrigin('https://gnosis.blockscout.com')).toBe(true)
	})

	it('is false for other explorer UIs (no Blockscout REST at that origin)', () => {
		for (const origin of [
			'https://basescan.org',
			'https://arbiscan.io',
			'https://example.com',
		]) {
			expect(blockscoutRestV2AtExplorerOrigin(origin), origin).toBe(false)
		}
	})
})

describe('blockscoutExplorerRestV2OriginForChain', () => {
	it('returns the Blockscout REST origin for hosted chains', () => {
		expect(blockscoutExplorerRestV2OriginForChain(1)).toBe('https://eth.blockscout.com')
		expect(blockscoutExplorerRestV2OriginForChain(8453)).toBe('https://base.blockscout.com')
	})

	it('returns undefined when Blockscout does not own REST v2 coverage for the chain', () => {
		expect(blockscoutExplorerRestV2OriginForChain(999999)).toBeUndefined()
	})
})

import { describe, expect, it } from 'vitest'

import {
	blockscoutErc4337OperationsSupportedByChainId,
	blockscoutErc4337RegistryListsSupportedByChainId,
	blockscoutExplorerRestV2OriginByChainId,
	blockscoutHostedNetworks,
} from '$/sources/Blockscout/Rest/constants.ts'

describe('blockscoutErc4337OperationsSupportedByChainId', () => {
	it('is true for hosted chains with AA proxy indexing', () => {
		expect(blockscoutErc4337OperationsSupportedByChainId[1]).toBe(true)
		expect(blockscoutErc4337OperationsSupportedByChainId[8453]).toBe(true)
		expect(blockscoutErc4337OperationsSupportedByChainId[11155111]).toBe(true)
	})

	it('is false for hosted chains without AA proxy indexing', () => {
		for (const chainId of [5, 17000]) {
			expect(
				blockscoutHostedNetworks.some((network) => network.chainId === chainId),
				`fixture chain ${chainId}`
			).toBe(true)
			expect(blockscoutErc4337OperationsSupportedByChainId[chainId]).toBeUndefined()
		}
	})

	it('matches registry list helper on supported chains', () => {
		expect(blockscoutErc4337RegistryListsSupportedByChainId[42161]).toBe(true)
		expect(blockscoutErc4337RegistryListsSupportedByChainId[5]).toBeUndefined()
	})
})

describe('blockscoutExplorerRestV2OriginByChainId', () => {
	it('returns the Blockscout REST origin for hosted chains', () => {
		expect(blockscoutExplorerRestV2OriginByChainId[1]).toBe('https://eth.blockscout.com')
		expect(blockscoutExplorerRestV2OriginByChainId[8453]).toBe('https://base.blockscout.com')
	})

	it('returns undefined when Blockscout does not own REST v2 coverage for the chain', () => {
		expect(blockscoutExplorerRestV2OriginByChainId[999999]).toBeUndefined()
	})
})

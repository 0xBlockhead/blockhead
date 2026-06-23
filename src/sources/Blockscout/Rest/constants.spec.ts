import { describe, expect, it } from 'vitest'

import {
	blockscoutErc4337OperationSupportByChainId,
	blockscoutErc4337RegistryListSupportByChainId,
	blockscoutExplorerRestV2OriginByChainId,
	blockscoutHostedNetworks,
} from '$/sources/Blockscout/Rest/constants.ts'

describe('blockscoutErc4337OperationSupportByChainId', () => {
	it('returns support rows for hosted chains with AA proxy indexing', () => {
		expect(blockscoutErc4337OperationSupportByChainId[1]).toEqual({ chainId: 1 })
		expect(blockscoutErc4337OperationSupportByChainId[8453]).toEqual({ chainId: 8453 })
		expect(blockscoutErc4337OperationSupportByChainId[11155111]).toEqual({ chainId: 11155111 })
	})

	it('returns undefined for hosted chains without AA proxy indexing', () => {
		for (const chainId of [5, 17000]) {
			expect(
				blockscoutHostedNetworks.some((network) => network.chainId === chainId),
				`fixture chain ${chainId}`
			).toBe(true)
			expect(blockscoutErc4337OperationSupportByChainId[chainId]).toBeUndefined()
		}
	})

	it('matches registry list helper on supported chains', () => {
		expect(blockscoutErc4337RegistryListSupportByChainId[42161]).toEqual({ chainId: 42161 })
		expect(blockscoutErc4337RegistryListSupportByChainId[5]).toBeUndefined()
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

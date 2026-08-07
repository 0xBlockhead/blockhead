import {
	afterEach,
	describe,
	expect,
	it,
	vi,
} from 'vitest'

import {
	parseZeroGChainScanLlmIdentity,
} from '$/sources/ZeroG/ChainScan/Rest/types.ts'

const sourceGetText = vi.fn()

vi.mock('$/sources/_runtime/http.ts', () => ({
	firstHttpUrlForBinding: (binding: { endpoints: { locator: string }[] }) => binding.endpoints[0]?.locator,
	sourceGetText,
	sourceGetJson: vi.fn(),
	sourceFetch: vi.fn(),
}))

const {
	getExplorerIdentity,
	getInfo,
} = await import('$/sources/ZeroG/ChainScan/Rest/queries.ts')

const llmText = `# 0G ChainScan

- URL: https://chainscan.0g.ai
- Chain ID: 16661 (mainnet)
`

describe('ZeroG ChainScan REST identity', () => {
	afterEach(() => {
		sourceGetText.mockReset()
	})

	it('asserts binding info and parses llms.txt fail-closed', async () => {
		expect(getInfo()).toEqual({
			url: 'https://chainscan.0g.ai',
			chainId: 16661,
			features: [
				'accounts',
				'blocks',
				'contracts',
				'transactions',
				'validators',
			],
		})

		expect(parseZeroGChainScanLlmIdentity(llmText)).toEqual({
			url: 'https://chainscan.0g.ai',
			chainId: 16661,
		})
		expect(() => parseZeroGChainScanLlmIdentity('# missing identity')).toThrow('llms.txt missing URL or Chain ID')

		sourceGetText.mockResolvedValueOnce(llmText)
		await expect(getExplorerIdentity()).resolves.toMatchObject({
			url: 'https://chainscan.0g.ai',
			chainId: 16661,
		})

		sourceGetText.mockResolvedValueOnce(`URL: https://evil.example\nChain ID: 16661`)
		await expect(getExplorerIdentity()).rejects.toThrow('llms.txt missing URL or Chain ID')
	})
})

import {
	describe,
	expect,
	it,
	vi,
} from 'vitest'

import bindings from '$/sources/EthereumSpecs/bindings.ts'
import { Source } from '$/sources/Source.ts'

const getText = vi.hoisted(() => vi.fn())

vi.mock('$/sources/_shared/wire/HttpRest/client.ts', () => ({
	getText,
}))

const {
	fetchExecutionSpecsMainnetUpgradeMarkdown,
} = await import('$/sources/EthereumSpecs/Github/queries.ts')

const binding = bindings[Source.EthereumSpecs_Github].find(({ target }) => (
	target.key === 'ethereum/execution-specs@8dbde99b65d519ea4c96084d784f85957e9314d0:network-upgrades/mainnet-upgrades'
))

if (binding == null)
	throw new Error('EthereumSpecs_Github execution-specs binding is missing')

describe('Ethereum specs GitHub queries', () => {
	it('reads the pinned upgrade document from its registered source target', async () => {
		getText.mockResolvedValueOnce('# Prague')

		await expect(fetchExecutionSpecsMainnetUpgradeMarkdown({
			filename: 'prague.md',
		})).resolves.toBe('# Prague')
		expect(getText).toHaveBeenCalledWith(binding, 'prague.md')
	})

	it('rejects path traversal and non-Markdown identities before transport', () => {
		vi.clearAllMocks()

		for (const filename of [
			'../prague.md',
			'prague.md?ref=other',
			'prague.txt',
		])
			expect(() => fetchExecutionSpecsMainnetUpgradeMarkdown({ filename })).toThrow(/invalid mainnet upgrade Markdown filename/)
		expect(getText).not.toHaveBeenCalled()
	})
})

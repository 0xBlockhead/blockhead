import { describe, expect, it, vi } from 'vitest'

import bindings from '$/sources/BitcoinBips/bindings.ts'
import { Source } from '$/sources/Source.ts'

const httpRuntime = vi.hoisted(() => ({
	sourceGetJson: vi.fn(),
	sourceGetText: vi.fn(),
}))

vi.mock('$/sources/_runtime/http.ts', () => httpRuntime)

const {
	getProposalText,
} = await import('$/sources/BitcoinBips/Github/queries.ts')

const binding = bindings[Source.BitcoinBips_Github][0]

describe('Bitcoin BIPs GitHub queries', () => {
	it('passes only the caller-provided noncanonical binding to both transports', async () => {
		const modifiedBinding = {
			...binding,
			endpoints: binding.endpoints.map((endpoint) => ({
				...endpoint,
				locator: 'https://noncanonical.example/bitcoin-bips',
			})),
		}
		httpRuntime.sourceGetJson.mockResolvedValueOnce([{
			name: 'bip-0003.md',
			path: 'bip-0003.md',
			type: 'file',
		}])
		httpRuntime.sourceGetText.mockResolvedValueOnce('BIP')

		await getProposalText({ binding: modifiedBinding, number: 3 })

		expect(httpRuntime.sourceGetJson.mock.calls[0][0]).toBe(modifiedBinding)
		expect(httpRuntime.sourceGetText.mock.calls[0][0]).toBe(modifiedBinding)
	})

	it.each([
		['Markdown', 'bip-0003.md'],
		['MediaWiki', 'bip-0002.mediawiki'],
	])('fetches the discovered %s proposal file', async (_format, name) => {
		httpRuntime.sourceGetJson.mockResolvedValueOnce([
			{
				name,
				path: name,
				type: 'file',
			},
		])
		httpRuntime.sourceGetText.mockResolvedValueOnce('BIP')

		await getProposalText({
			binding,
			number: parseInt(name.slice(4, 8), 10),
		})

		expect(httpRuntime.sourceGetText).toHaveBeenCalledWith(
			binding,
			`https://raw.githubusercontent.com/bitcoin/bips/master/${name}`
		)
	})

	it('rejects a proposal-shaped directory', async () => {
		httpRuntime.sourceGetJson.mockResolvedValueOnce([
			{
				name: 'bip-0003.md',
				path: 'bip-0003.md',
				type: 'dir',
			},
		])

		await expect(getProposalText({
			binding,
			number: 3,
		})).rejects.toThrow('BitcoinBips_Github: proposal path is not a file for BIP 3: bip-0003.md')
	})

	it('rejects duplicate proposal formats in stable filename order', async () => {
		httpRuntime.sourceGetJson.mockResolvedValueOnce([
			{
				name: 'bip-0003.mediawiki',
				path: 'bip-0003.mediawiki',
				type: 'file',
			},
			{
				name: 'bip-0003.md',
				path: 'bip-0003.md',
				type: 'file',
			},
		])

		await expect(getProposalText({
			binding,
			number: 3,
		})).rejects.toThrow('BitcoinBips_Github: duplicate proposal files for BIP 3: bip-0003.md, bip-0003.mediawiki')
	})
})

import { beforeEach, describe, expect, it, vi } from 'vitest'

import bindings from '$/sources/EthereumLists/bindings.ts'
import { Source } from '$/sources/Source.ts'

const { sourceFetch, sourceGetJson, throwHttpError } = vi.hoisted(() => ({
	sourceFetch: vi.fn(),
	sourceGetJson: vi.fn(),
	throwHttpError: vi.fn(async () => {
		throw new Error('Ethereum Lists request failed')
	}),
}))

vi.mock('$/sources/_runtime/http.ts', () => ({
	firstHttpUrlForBinding: (binding: { target: { key: string } }) => (
		binding.target.key === 'chains-json' ?
			'https://chainid.network/'
		:
			'https://api.github.com/'
	),
	sourceFetch,
	sourceGetJson,
}))

vi.mock('$/lib/http.ts', () => ({ throwHttpError }))

const {
	fetchChainsJson,
	fetchIconJsonBySlug,
	fetchIconSlugs,
} = await import('$/sources/EthereumLists/Rest/queries.ts')

const bindingByTargetKey = Object.fromEntries(
	bindings[Source.EthereumLists_Rest].map((binding) => [binding.target.key, binding])
)
const chainsBinding = bindingByTargetKey['chains-json']
const githubTreeBinding = bindingByTargetKey['github-tree']

describe('Ethereum Lists chain and icon transport', () => {
	beforeEach(() => {
		vi.clearAllMocks()
	})

	it('loads chains from the chains target and preserves a valid empty list', async () => {
		sourceFetch.mockResolvedValue({
			ok: true,
			json: async () => [],
		})

		await expect(fetchChainsJson()).resolves.toEqual([])
		expect(sourceFetch).toHaveBeenCalledWith(
			chainsBinding,
			'https://chainid.network/chains.json',
			{ cache: 'no-store' }
		)
	})

	it('propagates a non-OK chains response as an HTTP error', async () => {
		const response = { ok: false }
		sourceFetch.mockResolvedValue(response)

		await expect(fetchChainsJson()).rejects.toThrow('Ethereum Lists request failed')
		expect(throwHttpError).toHaveBeenCalledWith('EthereumLists chains.json', response)
	})

	it('filters the recursive GitHub tree to non-empty icon JSON slugs', async () => {
		sourceGetJson.mockResolvedValue({
			tree: [
				{ path: '_data/icons/eth.json' },
				{ path: '_data/icons/nested/icon.json' },
				{ path: '_data/icons/.json' },
				{ path: '_data/icons/readme.md' },
				{ path: 'chains/eip155-1.json' },
				{},
			],
		})

		await expect(fetchIconSlugs()).resolves.toEqual(new Set([
			'eth',
			'nested/icon',
		]))
		expect(sourceGetJson).toHaveBeenCalledWith(
			githubTreeBinding,
			'https://api.github.com/repos/ethereum-lists/chains/git/trees/master?recursive=1'
		)
	})

	it('rejects blank and absent slugs without requesting an icon payload', async () => {
		await expect(fetchIconJsonBySlug('   ')).resolves.toBeUndefined()
		expect(sourceGetJson).not.toHaveBeenCalled()

		sourceGetJson.mockResolvedValueOnce({
			tree: [{ path: '_data/icons/eth.json' }],
		})
		await expect(fetchIconJsonBySlug('missing')).resolves.toBeUndefined()
		expect(sourceGetJson).toHaveBeenCalledOnce()
	})

	it('loads an encoded, trimmed slug only after tree membership succeeds', async () => {
		sourceGetJson
			.mockResolvedValueOnce({
				tree: [{ path: '_data/icons/icon #1.json' }],
			})
			.mockResolvedValueOnce([])

		await expect(fetchIconJsonBySlug('  icon #1  ')).resolves.toEqual([])
		expect(sourceGetJson).toHaveBeenNthCalledWith(
			2,
			chainsBinding,
			'https://chainid.network/icons/icon%20%231.json'
		)
	})
})

import {
	beforeEach,
	describe,
	expect,
	it,
	vi,
} from 'vitest'

import bindings from '$/sources/Superchain/bindings.ts'
import { Source } from '$/sources/Source.ts'

const sourceGetJson = vi.hoisted(() => vi.fn())

vi.mock('$/sources/_runtime/http.ts', async (importOriginal) => ({
	...await importOriginal<typeof import('$/sources/_runtime/http.ts')>(),
	sourceGetJson,
}))

import {
	getChainList,
} from '$/sources/Superchain/Github/queries.ts'

const binding = bindings[Source.Superchain_Github]

describe('Superchain GitHub chain list', () => {
	beforeEach(() => {
		sourceGetJson.mockReset()
	})

	it('preserves endpoint-native identifiers, parent references, and ordering', async () => {
		const chains = [
			{
				name: 'Base Sepolia',
				identifier: 'sepolia/base',
				chainId: 84_532,
				parent: {
					type: 'L1',
					chain: 'sepolia',
				},
			},
			{
				name: 'Base',
				identifier: 'mainnet/base',
				chainId: 8_453,
				parent: {
					type: 'L1',
					chain: 'mainnet',
				},
			},
		]
		sourceGetJson.mockResolvedValue(chains)

		await expect(getChainList()).resolves.toBe(chains)
		expect(sourceGetJson).toHaveBeenCalledWith(
			binding,
			'https://raw.githubusercontent.com/ethereum-optimism/superchain-registry/main/chainList.json'
		)
	})

	it.each([
		[
			{
				name: 'Base',
				identifier: 'mainnet/base',
				chainId: 8_453,
			},
			{
				name: 'Duplicate',
				identifier: 'mainnet/duplicate',
				chainId: 8_453,
			},
		],
		[
			{
				name: 'Base',
				identifier: 'base',
				chainId: 8_453,
			},
		],
		[
			{
				name: '',
				identifier: 'mainnet/base',
				chainId: 8_453,
			},
		],
	])('rejects malformed endpoint catalogs: %#', async (...chains) => {
		sourceGetJson.mockResolvedValue(chains)

		await expect(getChainList()).rejects.toThrow('malformed chain list')
	})
})

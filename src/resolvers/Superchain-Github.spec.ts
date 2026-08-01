import {
	beforeEach,
	describe,
	expect,
	it,
	vi,
} from 'vitest'

import { NetworkEnvironment, NetworkNamespace } from '$/constants/Network.ts'
import { EntityMetaKey } from '$/schema/$schema.ts'

const getChainList = vi.hoisted(() => vi.fn())

vi.mock('$/sources/Superchain/Github/queries.ts', () => ({
	getChainList,
}))

const { default: superchainGithub } = await import('$/resolvers/Superchain-Github.ts')

const resolver = superchainGithub.resolvers[0]

const networkReference = (reference: string) => ({
	[EntityMetaKey.Selector]: {
		caip2: {
			namespace: 'eip155',
			reference,
		},
	},
})

describe('Superchain GitHub resolver', () => {
	beforeEach(() => {
		getChainList.mockReset()
		getChainList.mockResolvedValue([
			{
				name: 'Base',
				identifier: 'mainnet/base',
				chainId: 8_453,
				parent: {
					type: 'L1',
					chain: 'mainnet',
				},
			},
			{
				name: 'Base Sepolia',
				identifier: 'sepolia/base',
				chainId: 84_532,
				parent: {
					type: 'L1',
					chain: 'sepolia',
				},
			},
		])
	})

	it('projects a mainnet, its parent, and all matching testnets in one snapshot', async () => {
		await expect(resolver.resolve.Caip2.resolve({
			caip2: {
				namespace: 'eip155',
				reference: '8453',
			},
		})).resolves.toEqual({
			name: 'Base',
			environment: NetworkEnvironment.Mainnet,
			$parent: networkReference('1'),
			$$testnets: [
				networkReference('84532'),
			],
		})
		expect(getChainList).toHaveBeenCalledOnce()
		expect(resolver.projections.namespace()).toBe(NetworkNamespace.Evm)
	})

	it('projects a testnet back to its mainnet and preserves the testnet parent', async () => {
		await expect(resolver.resolve.Caip2.resolve({
			caip2: {
				namespace: 'eip155',
				reference: '84532',
			},
		})).resolves.toEqual({
			name: 'Base Sepolia',
			environment: NetworkEnvironment.Testnet,
			$parent: networkReference('11155111'),
			$mainnet: networkReference('8453'),
			$$testnets: [],
		})
		expect(getChainList).toHaveBeenCalledOnce()
	})

	it('returns no snapshot for an EVM chain absent from the endpoint catalog', async () => {
		await expect(resolver.resolve.Caip2.resolve({
			caip2: {
				namespace: 'eip155',
				reference: '42161',
			},
		})).resolves.toBeUndefined()
	})
})

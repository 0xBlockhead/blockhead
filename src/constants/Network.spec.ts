import { describe, expect, it } from 'vitest'

import {
	beaconConsensusByExecutionChainId,
} from '$/constants/BeaconConsensus.ts'
import { ChainId } from '$/constants/ChainId.ts'
import {
	NetworkEnvironment,
	NetworkExecutionModel,
	NetworkNamespace,
	NetworkResourceKind,
	networkByCaip2,
	networkBySlug,
	networkResourceUrls,
	networks,
} from '$/constants/Network.ts'


describe('canonical network identities', () => {
	it('indexes Tezos slug and CAIP-2 to one catalog row', () => {
		expect(networkBySlug.tezos).toBe(networkByCaip2['tezos:NetXdQprcVkpaWU'])
		expect(networkBySlug.tezos).toMatchObject({
			slug: 'tezos',
			caip2: {
				namespace: 'tezos',
				reference: 'NetXdQprcVkpaWU',
			},
			namespace: NetworkNamespace.Tezos,
		})
		expect(networkByCaip2['tezos:mainnet']).toBeUndefined()
	})

	it('indexes Ethereum beacon L1s by slug and CAIP-2', () => {
		for (const row of [
			{
				slug: 'ethereum',
				caip2: 'eip155:1',
				environment: NetworkEnvironment.Mainnet,
				chainId: ChainId.Ethereum,
			},
			{
				slug: 'ethereum-sepolia',
				caip2: 'eip155:11155111',
				environment: NetworkEnvironment.Testnet,
				chainId: ChainId.EthereumSepolia,
			},
			{
				slug: 'ethereum-holesky',
				caip2: 'eip155:17000',
				environment: NetworkEnvironment.Testnet,
				chainId: ChainId.Holesky,
			},
			{
				slug: 'ethereum-hoodi',
				caip2: 'eip155:560048',
				environment: NetworkEnvironment.Testnet,
				chainId: ChainId.Hoodi,
			},
		] as const) {
			expect(networkBySlug[row.slug]).toBe(networkByCaip2[row.caip2])
			expect(networkBySlug[row.slug]).toMatchObject({
				slug: row.slug,
				namespace: NetworkNamespace.Evm,
				environment: row.environment,
				executionModels: [NetworkExecutionModel.Evm],
			})
			expect(beaconConsensusByExecutionChainId[row.chainId]?.consensusProtocol).toBe('EthereumBeacon')
			expect(beaconConsensusByExecutionChainId[row.chainId]).not.toHaveProperty('restBaseUrl')
			expect(beaconConsensusByExecutionChainId[row.chainId]?.slotsPerEpoch).toBe(32)
		}
	})
})


describe('network resource catalog', () => {
	it('keeps every resource slug in the network catalog and covers Ethereum L1 explorers/faucets', () => {
		const networkSlugs = new Set(networks.map(({ slug }) => slug))
		for (const resource of networkResourceUrls)
			expect(networkSlugs.has(resource.networkSlug)).toBe(true)

		for (const slug of [
			'ethereum',
			'ethereum-sepolia',
			'ethereum-holesky',
			'ethereum-hoodi',
			'osmosis',
			'kusama',
			'aptos',
			'base',
			'polygon',
		] as const)
			expect(
				networkResourceUrls.some((resource) => (
					resource.networkSlug === slug
					&& resource.kind === NetworkResourceKind.BlockExplorer
				))
			).toBe(true)

		for (const slug of [
			'ethereum-sepolia',
			'ethereum-holesky',
			'ethereum-hoodi',
			'aptos-testnet',
		] as const)
			expect(
				networkResourceUrls.some((resource) => (
					resource.networkSlug === slug
					&& resource.kind === NetworkResourceKind.Faucet
				))
			).toBe(true)
	})
})

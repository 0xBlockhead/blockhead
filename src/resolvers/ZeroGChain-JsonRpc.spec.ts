import { describe, expect, it } from 'vitest'

import { indexResolvers } from '$/resolvers/$resolvers.ts'
import zeroGChain from '$/resolvers/ZeroGChain-JsonRpc.ts'
import { schema } from '$/schema/index.ts'
import { Source } from '$/sources/Source.ts'

const zeroGResolvers = indexResolvers(
	schema,
	[zeroGChain],
	new Set([Source.ZeroGChain_JsonRpc])
).resolverDefinitions

const ethereumNetwork = {
	caip2: {
		namespace: 'eip155',
		reference: '1',
	},
} as const

const zeroGNetwork = {
	caip2: {
		namespace: 'eip155',
		reference: '16661',
	},
} as const

describe('ZeroGChain JSON-RPC source applicability', () => {
	it('excludes Ethereum selectors before invoking 0G-only resolvers', () => {
		const selectors = [
			{ $network: ethereumNetwork, blockNumber: 1n },
			{
				$network: ethereumNetwork,
				$actor: { address: '0xd8da6bf26964af9d7eed9e403e826090792bed6a' },
			},
			{
				$account: {
					$network: ethereumNetwork,
					$actor: { address: '0xd8da6bf26964af9d7eed9e403e826090792bed6a' },
				},
				timestampMs: 0,
				source: Source.ZeroGChain_JsonRpc,
			},
			{ $network: ethereumNetwork, txHash: '0x00' },
			{ $network: ethereumNetwork, blockNumber: 1n },
		] as const
		expect(zeroGResolvers).toHaveLength(selectors.length)

		for (const [index, resolver] of zeroGResolvers.entries())
			expect(resolver.appliesTo(Object.keys(resolver.resolve)[0], selectors[index] ?? {})).toBe(false)
	})

	it('admits selectors for the binding-owned 0G chain', () => {
		const selectors = [
			{ $network: zeroGNetwork, blockNumber: 1n },
			{
				$network: zeroGNetwork,
				$actor: { address: '0xd8da6bf26964af9d7eed9e403e826090792bed6a' },
			},
			{
				$account: {
					$network: zeroGNetwork,
					$actor: { address: '0xd8da6bf26964af9d7eed9e403e826090792bed6a' },
				},
				timestampMs: 0,
				source: Source.ZeroGChain_JsonRpc,
			},
			{ $network: zeroGNetwork, txHash: '0x00' },
			{ $network: zeroGNetwork, blockNumber: 1n },
		] as const
		expect(zeroGResolvers).toHaveLength(selectors.length)

		for (const [index, resolver] of zeroGResolvers.entries())
			expect(resolver.appliesTo(Object.keys(resolver.resolve)[0], selectors[index] ?? {})).toBe(true)
	})
})

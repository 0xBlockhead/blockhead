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

const expectNetworkApplicability = (reference: string, expected: boolean) => {
	const network = {
		caip2: {
			namespace: 'eip155',
			reference,
		},
	} as const
	const selectors = [
		{ $network: network, blockNumber: 1n },
		{
			$network: network,
			$actor: { address: '0xd8da6bf26964af9d7eed9e403e826090792bed6a' },
		},
		{
			$account: {
				$network: network,
				$actor: { address: '0xd8da6bf26964af9d7eed9e403e826090792bed6a' },
			},
			timestampMs: 0,
			source: Source.ZeroGChain_JsonRpc,
		},
		{ $network: network, txHash: '0x00' },
		{ $network: network, blockNumber: 1n },
	] as const
	expect(zeroGResolvers).toHaveLength(selectors.length)

	for (const [index, resolver] of zeroGResolvers.entries())
		expect(resolver.appliesTo(Object.keys(resolver.resolve)[0], selectors[index] ?? {})).toBe(expected)
}

describe('ZeroGChain JSON-RPC source applicability', () => {
	it('excludes Ethereum selectors before invoking 0G-only resolvers', () => {
		expectNetworkApplicability('1', false)
	})

	it('admits selectors for the binding-owned 0G chain', () => {
		expectNetworkApplicability('16661', true)
	})
})

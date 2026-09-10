import { createResolverContext } from '../../tests/resolverContext.ts'
import {
	describe,
	expect,
	it,
	vi,
} from 'vitest'

import { EntityType } from '$/schema/EntityType.ts'

const fetchRpcsJson = vi.hoisted(() => vi.fn())

vi.mock('$/sources/Chainlist/Rest/queries.ts', () => ({
	fetchRpcsJson,
}))

const { default: chainlist } = await import('$/resolvers/Chainlist-Rest.ts')

const networkResolver = chainlist.resolvers.find((resolver) => (
	resolver.entityType === EntityType.Network
))

if (networkResolver == null || !('Caip2' in networkResolver.resolve))
	throw new Error('Chainlist REST network resolver is not registered')

const resolveNetwork = networkResolver.resolve.Caip2.resolve
const projectRpcUrls = networkResolver.projections.Evm.$$rpcUrls
const context = createResolverContext()

describe('Chainlist REST network RPC projection', () => {
	it('keeps a listed network applicable when it has no RPC endpoints', async () => {
		fetchRpcsJson.mockResolvedValue([{
			name: 'Factory 127 Mainnet',
			chainId: 127,
			nativeCurrency: {
				name: 'Factory 127',
				symbol: 'F127',
				decimals: 18,
			},
		}])

		const resolved = await resolveNetwork({
			caip2: {
				namespace: 'eip155',
				reference: '127',
			},
		}, context)

		if (resolved == null)
			throw new Error('Chainlist REST did not resolve the listed network')

		expect(projectRpcUrls(resolved)).toEqual([])
	})
})

import { describe, expect, it } from 'vitest'

import { QuilibriumAccountSelector } from '$/schema/QuilibriumAccount.ts'
import { implicitAccountReference } from '$/sources/QuilibriumNodeRpc/Grpc/queries.ts'

const { default: quilibriumNodeRpcResolvers } = await import('$/resolvers/QuilibriumNodeRpc-Grpc.ts')

const resolver = quilibriumNodeRpcResolvers.resolvers[0]

describe('Quilibrium node RPC account resolution', () => {
	it('maps a provider-native implicit account reference to its account kind', async () => {
		const accountAddress = `0x${'12'.repeat(32)}`

		expect(implicitAccountReference(accountAddress)).toEqual({
			implicitAccount: {
				implicitType: 0,
				address: new Uint8Array(32).fill(0x12),
			},
		})
		await expect(
			resolver.resolve[QuilibriumAccountSelector.NetworkAccountAddress].resolve({
				$network: {
					slug: 'quilibrium',
				},
				accountAddress,
			})
		).resolves.toMatchObject({
			accountKind: 'implicit',
		})
	})

	it.each([
		'0x1234',
		`0x${'gg'.repeat(32)}`,
		'12'.repeat(32),
	])('rejects malformed provider account address %s', async (accountAddress) => {
		await expect(
			resolver.resolve[QuilibriumAccountSelector.NetworkAccountAddress].resolve({
				$network: {
					slug: 'quilibrium',
				},
				accountAddress,
			})
		).rejects.toThrow('implicit account address must be 0x-prefixed 32-byte hex')
	})

	it('rejects an otherwise valid account on an unrelated network', async () => {
		await expect(
			resolver.resolve[QuilibriumAccountSelector.NetworkAccountAddress].resolve({
				$network: {
					slug: 'bitcoin',
				},
				accountAddress: `0x${'12'.repeat(32)}`,
			})
		).rejects.toThrow('QuilibriumNodeRpc_Grpc: unsupported network')
	})
})

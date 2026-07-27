import { beforeEach, describe, expect, it, vi } from 'vitest'

import { EntityType } from '$/schema/EntityType.ts'

const getEnhancedTransactions = vi.hoisted(() => vi.fn())

vi.mock('$/sources/Helius/Rest/queries.ts', () => ({
	getEnhancedTransactions,
}))

const { default: helius } = await import('$/resolvers/Helius-Rest.ts')

const transactionResolver = helius.resolvers.find((
	resolver
): resolver is Extract<
	typeof helius.resolvers[number],
	{ entityType: EntityType.SolanaTransaction }
> => resolver.entityType === EntityType.SolanaTransaction)

if (transactionResolver == null)
	throw new Error('Helius transaction resolver is missing')

const context = {
	filters: [],
	sorts: [],
	pagination: {
		limit: 16,
	},
	selectorKeys: [],
	parentSelectorKeys: [],
	sources: [],
	publicEnv: {
		PUBLIC_HELIUS_API_KEY: 'helius-key',
	},
}

const network = {
	caip2: {
		namespace: 'solana',
		reference: '5eykt4UsFv8P8NJdTREpY1vzqKqZKvdp',
	},
}

describe('Helius resolver source binding', () => {
	beforeEach(() => {
		getEnhancedTransactions.mockReset()
		getEnhancedTransactions.mockResolvedValue([{
			signature: 'transaction-signature',
			slot: 123,
		}])
	})

	it('passes the exact canonical Solana HTTP binding to transport', async () => {
		await transactionResolver.resolve[
			'NetworkSignature'
		].resolve({
			$network: network,
			signature: 'transaction-signature',
		}, context)

		expect(getEnhancedTransactions).toHaveBeenCalledWith({
			signatures: ['transaction-signature'],
			publicEnv: context.publicEnv,
		})
	})

	it('rejects non-mainnet selectors before transport', async () => {
		await expect(transactionResolver.resolve[
			'NetworkSignature'
		].resolve({
			$network: {
				caip2: {
					namespace: 'solana',
					reference: 'testnet',
				},
			},
			signature: 'transaction-signature',
		}, context)).rejects.toThrow('unsupported network')

		expect(getEnhancedTransactions).not.toHaveBeenCalled()
	})
})

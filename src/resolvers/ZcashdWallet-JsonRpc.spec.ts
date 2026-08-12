import { beforeEach, expect, it, vi } from 'vitest'

import { EntityMetaKey } from '$/schema/$schema.ts'
import { EntityType } from '$/schema/EntityType.ts'
import { Source } from '$/sources/Source.ts'

const getWalletObservation = vi.hoisted(() => vi.fn())

vi.mock('$/sources/Zcashd/WalletJsonRpc/queries.ts', () => ({
	getWalletObservation,
}))

const resolverModule = (await import('$/resolvers/ZcashdWallet-JsonRpc.ts')).default
const walletResolver = resolverModule.resolvers.find((resolver) => resolver.entityType === EntityType.BlockheadZcashWalletState)
const observationResolver = resolverModule.resolvers.find((resolver) => resolver.entityType === EntityType.BlockheadZcashWalletState_Timestamp)
if (walletResolver == null || observationResolver == null)
	throw new Error('Zcash wallet resolvers are not registered')

beforeEach(() => {
	vi.clearAllMocks()
})

it('anchors the configured wallet to Zcash and owns an observation clock', async () => {
	vi.spyOn(Date, 'now').mockReturnValue(1_700_000_000_000)

	await expect(walletResolver.resolve.WalletId.resolve({ walletId: 'wallet-rpc' })).resolves.toEqual({
		walletId: 'wallet-rpc',
		$network: {
			[EntityMetaKey.Selector]: {
				caip2: 'bip122:00040fe8ec8471911baa1db1266ea15',
			},
		},
		$$timestamps: [{
			[EntityMetaKey.Selector]: {
				$walletState: { walletId: 'wallet-rpc' },
				timestampMs: 1_700_000_000_000,
				source: Source.ZcashdWallet_JsonRpc,
			},
		}],
	})
})

it('projects native wallet balances without assigning the aggregate private balance to a pool', async () => {
	vi.spyOn(Date, 'now').mockReturnValue(1_700_000_000_000)
	getWalletObservation.mockResolvedValue({
		balanceZatoshis: 300n,
		verifiedBalanceZatoshis: 250n,
		unshieldedBalanceZatoshis: 100n,
		privateBalanceZatoshis: 200n,
		chainTipHeight: 3_000_000n,
	})

	await expect(observationResolver.resolve.WalletStateTimestampMsSource.resolve({
		$walletState: { walletId: 'wallet-rpc' },
		timestampMs: 1_699_999_999_000,
		source: Source.ZcashdWallet_JsonRpc,
	})).resolves.toEqual({
		$walletState: {
			[EntityMetaKey.Selector]: { walletId: 'wallet-rpc' },
		},
		timestampMs: 1_699_999_999_000,
		source: Source.ZcashdWallet_JsonRpc,
		balanceZatoshis: 300n,
		verifiedBalanceZatoshis: 250n,
		unshieldedBalanceZatoshis: 100n,
		privateBalanceZatoshis: 200n,
		chainTipHeight: 3_000_000n,
		lastSyncedAt: 1_700_000_000_000,
	})
})

it('rejects selectors outside the one configured wallet owner', async () => {
	await expect(walletResolver.resolve.WalletId.resolve({ walletId: 'other' })).rejects.toThrow('unsupported wallet')
})

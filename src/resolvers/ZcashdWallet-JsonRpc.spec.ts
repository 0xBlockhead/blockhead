import { beforeEach, expect, it, vi } from 'vitest'

import {
	entityFieldAddressKey,
	EntityMetaKey,
} from '$/schema/$schema.ts'
import { EntityType } from '$/schema/EntityType.ts'
import { Source } from '$/sources/Source.ts'

const getWalletObservation = vi.hoisted(() => vi.fn())
const getWalletNotes = vi.hoisted(() => vi.fn())

vi.mock('$/sources/Zcashd/WalletJsonRpc/queries.ts', () => ({
	getWalletNotes,
	getWalletObservation,
}))

const resolverModule = (await import('$/resolvers/ZcashdWallet-JsonRpc.ts')).default
const walletResolver = resolverModule.resolvers.find((resolver) => resolver.entityType === EntityType.BlockheadZcashWalletState)
const walletNotesResolver = resolverModule.resolvers.find((resolver) => (
	resolver.entityType === EntityType.BlockheadZcashWalletState
	&& '$$notes' in resolver.projections
))
const observationResolver = resolverModule.resolvers.find((resolver) => resolver.entityType === EntityType.BlockheadZcashWalletState_Timestamp)
if (walletResolver == null || walletNotesResolver == null || observationResolver == null)
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

it('materializes native shielded notes and source-clocked unspent observations', async () => {
	getWalletNotes.mockResolvedValue([{
		txid: 'a'.repeat(64),
		pool: 'sapling',
		outindex: 2,
		confirmations: 7,
		spendable: true,
		address: 'zs1recipient',
		amount: 1.25,
		memo: '6869',
		memoStr: 'hi',
		change: false,
		noteCommitment: 'b'.repeat(64),
		valueZatoshis: 125_000_000n,
		receivedAtHeight: 94n,
		observedAtMs: 1_700_000_000_000,
	}])

	const notes = await walletNotesResolver.resolve.WalletId.resolve(
		{ walletId: 'wallet-rpc' },
		{
			pagination: {
				limit: 25,
			},
		}
	)
	expect(getWalletNotes).toHaveBeenCalledWith(25)
	expect(walletNotesResolver.projections.$$notes(notes)).toEqual([{
		[EntityMetaKey.Selector]: {
			walletId: 'wallet-rpc',
			pool: 'sapling',
			noteCommitment: 'b'.repeat(64),
		},
		[EntityMetaKey.Fields]: {
			[entityFieldAddressKey(EntityType.BlockheadZcashNoteState, [], '$shieldedAction')]: {
				[EntityMetaKey.Selector]: {
					$transaction: {
						$network: {
							caip2: 'bip122:00040fe8ec8471911baa1db1266ea15',
						},
						txId: 'a'.repeat(64),
					},
					pool: 'sapling',
					actionKind: 'output',
					indexInTransaction: 2,
				},
			},
			[entityFieldAddressKey(EntityType.BlockheadZcashNoteState, [], 'valueZatoshis')]: 125_000_000n,
			[entityFieldAddressKey(EntityType.BlockheadZcashNoteState, [], 'memo')]: 'hi',
			[entityFieldAddressKey(EntityType.BlockheadZcashNoteState, [], 'recipientAddress')]: 'zs1recipient',
			[entityFieldAddressKey(EntityType.BlockheadZcashNoteState, [], 'receivedTransactionId')]: 'a'.repeat(64),
			[entityFieldAddressKey(EntityType.BlockheadZcashNoteState, [], 'receivedAtHeight')]: 94n,
			[entityFieldAddressKey(EntityType.BlockheadZcashNoteState, [], '$$timestamps')]: [{
				[EntityMetaKey.Selector]: {
					$noteState: {
						walletId: 'wallet-rpc',
						pool: 'sapling',
						noteCommitment: 'b'.repeat(64),
					},
					timestampMs: 1_700_000_000_000,
					source: Source.ZcashdWallet_JsonRpc,
				},
				[EntityMetaKey.Fields]: {
					[entityFieldAddressKey(EntityType.BlockheadZcashNoteState_Timestamp, [], 'spent')]: false,
					[entityFieldAddressKey(EntityType.BlockheadZcashNoteState_Timestamp, [], 'confirmations')]: 7,
				},
			}],
		},
	}])
})

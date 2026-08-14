import {
	afterEach,
	beforeEach,
	describe,
	expect,
	it,
	vi,
} from 'vitest'

import { networkBySlug } from '$/constants/Network.ts'
import {
	entityFieldAddressKey,
	EntityMetaKey,
} from '$/schema/$schema.ts'
import { EntityType } from '$/schema/EntityType.ts'
import { Source } from '$/sources/Source.ts'


const {
	getAccounts,
	getAddress,
	getBalance,
	getHeight,
	getKeyStatus,
	getOutputs,
	getTransfers,
} = vi.hoisted(() => ({
	getAccounts: vi.fn(),
	getAddress: vi.fn(),
	getBalance: vi.fn(),
	getHeight: vi.fn(),
	getKeyStatus: vi.fn(),
	getOutputs: vi.fn(),
	getTransfers: vi.fn(),
}))

vi.mock('$/sources/MoneroWalletRpc/JsonRpc/queries.ts', () => ({
	getAccounts,
	getAddress,
	getBalance,
	getHeight,
	getKeyStatus,
	getOutputs,
	getTransfers,
}))

const { default: resolverModule } = await import('$/resolvers/MoneroWalletRpc-JsonRpc.ts')
const walletResolver = resolverModule.resolvers.find(({ entityType }) => entityType === EntityType.BlockheadMoneroWalletState)
const subaddressResolver = resolverModule.resolvers.find(({ entityType }) => entityType === EntityType.BlockheadMoneroSubaddressState)
const outputResolver = resolverModule.resolvers.find(({ entityType }) => entityType === EntityType.BlockheadMoneroOutputState)
const transferResolver = resolverModule.resolvers.find(({ entityType }) => entityType === EntityType.BlockheadMoneroTransferState)
if (
	walletResolver == null
	|| subaddressResolver == null
	|| outputResolver == null
	|| transferResolver == null
)
	throw new Error('Monero wallet resolvers missing')

const context = {
	filters: [],
	sorts: [],
	pagination: { limit: 8 },
	selectorKeys: [],
	parentSelectorKeys: [],
	sources: [],
	publicEnv: {},
}

afterEach(() => {
	vi.useRealTimers()
})

describe('Monero local wallet journey', () => {
	beforeEach(() => {
		vi.restoreAllMocks()
		getAccounts.mockReset()
		getAddress.mockReset()
		getBalance.mockReset()
		getHeight.mockReset()
		getKeyStatus.mockReset()
		getOutputs.mockReset()
		getTransfers.mockReset()
		getAccounts.mockResolvedValue({
			subaddress_accounts: [{
				account_index: 0,
				base_address: '48primary',
			}],
		})
		getAddress.mockResolvedValue({
			address: '48primary',
			addresses: [{
				address: '48primary',
				address_index: 0,
				label: 'Primary account',
				used: true,
			}],
		})
		getBalance.mockResolvedValue({
			balance: 12,
			unlocked_balance: 10,
			multisig_import_needed: false,
			per_subaddress: [{
				account_index: 0,
				address_index: 0,
				address: '48primary',
				balance: 12,
				unlocked_balance: 10,
				num_unspent_outputs: 2,
			}],
		})
		getHeight.mockResolvedValue({ height: 100 })
		getKeyStatus.mockResolvedValue({
			viewKeyFingerprint: 'b'.repeat(64),
			spendKeyAvailable: false,
		})
		getOutputs.mockResolvedValue({ outputs: [] })
		getTransfers.mockResolvedValue({})
	})

	it('materializes private wallet sync and native subaddress observations', async () => {
		const now = vi.spyOn(Date, 'now').mockReturnValue(1_785_000_000_000)
		getAddress.mockImplementationOnce(async () => {
			now.mockReturnValue(1_786_000_000_000)
			return {
				address: '48primary',
				addresses: [{
					address: '48primary',
					address_index: 0,
					label: 'Primary account',
					used: true,
				}],
			}
		})

		const snapshot = await walletResolver.resolve.WalletId.resolve({
			walletId: 'monero-wallet-rpc',
		}, context)

		expect(snapshot).toMatchObject({
			walletId: 'monero-wallet-rpc',
			$network: {
				$network: {
					caip2: networkBySlug.monero.caip2,
				},
			},
			primaryAddress: '48primary',
			viewOnly: true,
			viewKeyFingerprint: 'b'.repeat(64),
			spendKeyAvailable: false,
		})
		expect(snapshot.$$timestamps[0]).toMatchObject({
			[EntityMetaKey.Selector]: {
				$walletState: { walletId: 'monero-wallet-rpc' },
				timestampMs: 1_786_000_000_000,
				source: Source.MoneroWalletRpc_JsonRpc,
			},
			[EntityMetaKey.Fields]: {
				[entityFieldAddressKey(EntityType.BlockheadMoneroWalletState_Timestamp, [], 'height')]: 100n,
				[entityFieldAddressKey(EntityType.BlockheadMoneroWalletState_Timestamp, [], 'balanceAtomicUnits')]: 12n,
			},
		})
		expect(snapshot.$$subaddresses[0]).toMatchObject({
			[EntityMetaKey.Selector]: {
				walletId: 'monero-wallet-rpc',
				accountIndex: 0,
				addressIndex: 0,
			},
		})
	})

	it('resolves a subaddress directly with its current balance', async () => {
		const snapshot = await subaddressResolver.resolve.WalletIdAccountIndexAddressIndex.resolve({
			walletId: 'monero-wallet-rpc',
			accountIndex: 0,
			addressIndex: 0,
		}, context)

		expect(snapshot).toMatchObject({
			address: '48primary',
			label: 'Primary account',
		})
		expect(snapshot.$$timestamps[0][EntityMetaKey.Fields]).toMatchObject({
			[entityFieldAddressKey(EntityType.BlockheadMoneroSubaddressState_Timestamp, [], 'used')]: true,
			[entityFieldAddressKey(EntityType.BlockheadMoneroSubaddressState_Timestamp, [], 'balanceAtomicUnits')]: 12n,
		})
	})

	it('materializes native local output and transfer lifecycles without inventing spend authority', async () => {
		vi.spyOn(Date, 'now').mockReturnValue(1_786_000_000_000)
		const txHash = 'a'.repeat(64)
		getOutputs.mockResolvedValue({
			outputs: [{
				amount: 12,
				amount_index: 0,
				txid: txHash,
				global_index: 456,
				subaddr_index: {
					major: 2,
					minor: 3,
				},
				spent: false,
				unlocked: true,
				confirmations: 10,
				height: 90,
			}],
		})
		getTransfers.mockResolvedValue({
			in: [{
				amount: 12,
				txid: txHash,
				subaddr_index: {
					major: 2,
					minor: 3,
				},
				timestamp: 1_786_000_000,
				confirmations: 10,
				unlock_time: 100,
			}],
		})

		const wallet = await walletResolver.resolve.WalletId.resolve({
			walletId: 'monero-wallet-rpc',
		}, context)
		expect(wallet.$$outputs[0]).toMatchObject({
			[EntityMetaKey.Selector]: {
				walletId: 'monero-wallet-rpc',
				txHash,
				outputIndex: 0,
			},
		})
		expect(wallet.$$transfers[0]).toMatchObject({
			[EntityMetaKey.Selector]: {
				walletId: 'monero-wallet-rpc',
				txHash,
				transferIndex: 0,
			},
		})

		await expect(outputResolver.resolve.WalletIdTxHashOutputIndex.resolve({
			walletId: 'monero-wallet-rpc',
			txHash,
			outputIndex: 0,
		})).resolves.toMatchObject({
			amountAtomicUnits: 12n,
			accountIndex: 2,
			addressIndex: 3,
			globalOutputIndex: 456n,
		})
		await expect(transferResolver.resolve.WalletIdTxHashTransferIndex.resolve({
			walletId: 'monero-wallet-rpc',
			txHash,
			transferIndex: 0,
		})).resolves.toMatchObject({
			direction: 'in',
			amountAtomicUnits: 12n,
			accountIndex: 2,
			addressIndex: 3,
			timestampMs: 1_786_000_000_000,
		})
	})

	it('rejects foreign wallet identities and provider identity mismatches', async () => {
		await expect(walletResolver.resolve.WalletId.resolve({
			walletId: 'another-wallet',
		}, context)).rejects.toThrow('unknown local wallet')

		getBalance.mockResolvedValue({
			balance: 12,
			unlocked_balance: 10,
			per_subaddress: [{
				account_index: 0,
				address_index: 0,
				address: '48different',
			}],
		})
		await expect(subaddressResolver.resolve.WalletIdAccountIndexAddressIndex.resolve({
			walletId: 'monero-wallet-rpc',
			accountIndex: 0,
			addressIndex: 0,
		}, context)).rejects.toThrow('subaddress identity mismatch')
	})
})

describe('Monero live wallet synchronization', () => {
	beforeEach(() => {
		getBalance.mockReset()
		getHeight.mockReset()
		getBalance.mockResolvedValue({
			balance: 12,
			unlocked_balance: 10,
			multisig_import_needed: false,
		})
		getHeight.mockResolvedValue({ height: 100 })
		vi.useFakeTimers()
	})

	it('publishes source-clocked wallet height and balances until abort cleanup', async () => {
		const replaceTimestamps = vi.fn()
		const abortController = new AbortController()
		const cleanup = await walletResolver.resolveLive.walletSynchronization.start({
			parentEntitySelector: { walletId: 'monero-wallet-rpc' },
			queryClient: {},
			signal: abortController.signal,
			trigger: context,
			fields: {
				$$timestamps: {
					replaceRows: replaceTimestamps,
					invalidate: vi.fn(),
					count: {
						replaceRows: vi.fn(),
						invalidate: vi.fn(),
					},
				},
			},
		})
		await vi.waitFor(() => expect(replaceTimestamps).toHaveBeenCalledOnce())

		expect(replaceTimestamps).toHaveBeenLastCalledWith([{
			source: Source.MoneroWalletRpc_JsonRpc,
			value: [expect.objectContaining({
				[EntityMetaKey.Selector]: {
					$walletState: { walletId: 'monero-wallet-rpc' },
					timestampMs: expect.any(Number),
					source: Source.MoneroWalletRpc_JsonRpc,
				},
				[EntityMetaKey.Fields]: expect.objectContaining({
					[entityFieldAddressKey(EntityType.BlockheadMoneroWalletState_Timestamp, [], 'height')]: 100n,
					[entityFieldAddressKey(EntityType.BlockheadMoneroWalletState_Timestamp, [], 'balanceAtomicUnits')]: 12n,
					[entityFieldAddressKey(EntityType.BlockheadMoneroWalletState_Timestamp, [], 'unlockedBalanceAtomicUnits')]: 10n,
				}),
			})],
		}])

		getBalance.mockResolvedValueOnce({
			balance: 15,
			unlocked_balance: 14,
		})
		getHeight.mockResolvedValueOnce({ height: 101 })
		await vi.advanceTimersByTimeAsync(10_000)
		await vi.waitFor(() => expect(replaceTimestamps).toHaveBeenCalledTimes(2))
		expect(replaceTimestamps.mock.calls[1][0][0].value[0][EntityMetaKey.Fields]).toMatchObject({
			[entityFieldAddressKey(EntityType.BlockheadMoneroWalletState_Timestamp, [], 'height')]: 101n,
			[entityFieldAddressKey(EntityType.BlockheadMoneroWalletState_Timestamp, [], 'balanceAtomicUnits')]: 15n,
		})

		abortController.abort()
		cleanup?.()
		await vi.advanceTimersByTimeAsync(10_000)
		expect(getHeight).toHaveBeenCalledTimes(2)
	})

	it('rejects a foreign local wallet before reading private authority', () => {
		expect(() => walletResolver.resolveLive.walletSynchronization.start({
			parentEntitySelector: { walletId: 'another-wallet' },
			queryClient: {},
			signal: new AbortController().signal,
			trigger: context,
			fields: {
				$$timestamps: {
					replaceRows: vi.fn(),
					invalidate: vi.fn(),
					count: {
						replaceRows: vi.fn(),
						invalidate: vi.fn(),
					},
				},
			},
		})).toThrow('unknown local wallet')
		expect(getHeight).not.toHaveBeenCalled()
	})
})

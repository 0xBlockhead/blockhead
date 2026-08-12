import {
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
	getOutputs,
	getTransfers,
} = vi.hoisted(() => ({
	getAccounts: vi.fn(),
	getAddress: vi.fn(),
	getBalance: vi.fn(),
	getHeight: vi.fn(),
	getOutputs: vi.fn(),
	getTransfers: vi.fn(),
}))

vi.mock('$/sources/MoneroWalletRpc/JsonRpc/queries.ts', () => ({
	getAccounts,
	getAddress,
	getBalance,
	getHeight,
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

describe('Monero local wallet journey', () => {
	beforeEach(() => {
		vi.restoreAllMocks()
		getAccounts.mockReset()
		getAddress.mockReset()
		getBalance.mockReset()
		getHeight.mockReset()
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
		getOutputs.mockResolvedValue({ outputs: [] })
		getTransfers.mockResolvedValue({})
	})

	it('materializes private wallet sync and native subaddress observations', async () => {
		vi.spyOn(Date, 'now').mockReturnValue(1_786_000_000_000)

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
				subaddr_index: 0,
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
				subaddr_index: 0,
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
			addressIndex: 0,
			globalOutputIndex: 456n,
		})
		await expect(transferResolver.resolve.WalletIdTxHashTransferIndex.resolve({
			walletId: 'monero-wallet-rpc',
			txHash,
			transferIndex: 0,
		})).resolves.toMatchObject({
			direction: 'in',
			amountAtomicUnits: 12n,
			addressIndex: 0,
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

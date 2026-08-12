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
} = vi.hoisted(() => ({
	getAccounts: vi.fn(),
	getAddress: vi.fn(),
	getBalance: vi.fn(),
	getHeight: vi.fn(),
}))

vi.mock('$/sources/MoneroWalletRpc/JsonRpc/queries.ts', () => ({
	getAccounts,
	getAddress,
	getBalance,
	getHeight,
}))

const { default: resolverModule } = await import('$/resolvers/MoneroWalletRpc-JsonRpc.ts')
const walletResolver = resolverModule.resolvers.find(({ entityType }) => entityType === EntityType.BlockheadMoneroWalletState)
const subaddressResolver = resolverModule.resolvers.find(({ entityType }) => entityType === EntityType.BlockheadMoneroSubaddressState)
if (walletResolver == null || subaddressResolver == null)
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

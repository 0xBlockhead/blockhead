import { networkBySlug } from '$/constants/Network.ts'
import { resolverContextRowLimit } from '$/resolvers/$resolvers.ts'
import {
	defineResolver,
	type RegisteredSourceResolverModule,
} from '$/resolvers/defineResolver.ts'
import {
	entityFieldAddressKey,
	EntityMetaKey,
} from '$/schema/$schema.ts'
import { EntityType } from '$/schema/EntityType.ts'
import { Source } from '$/sources/Source.ts'
import bindings from '$/sources/MoneroWalletRpc/bindings.ts'
import type {
	MoneroWalletSubaddress,
	MoneroWalletSubaddressBalance,
} from '$/sources/MoneroWalletRpc/JsonRpc/types.ts'


const walletId = 'monero-wallet-rpc'
const walletSelector = { walletId }
const moneroNetwork = {
	$network: {
		caip2: networkBySlug.monero.caip2,
	},
}

const atomicUnits = (
	value: number,
	field: string
) => {
	if (!Number.isSafeInteger(value))
		throw new Error(`MoneroWalletRpc_JsonRpc: ${field} exceeds the safe integer range`)

	return BigInt(value)
}

const subaddressFields = (
	accountIndex: number,
	address: MoneroWalletSubaddress,
	balance: MoneroWalletSubaddressBalance | undefined,
	timestampMs: number
) => {
	if (balance != null && (
		balance.account_index !== accountIndex
		|| balance.address_index !== address.address_index
		|| (balance.address != null && balance.address !== address.address)
	))
		throw new Error('MoneroWalletRpc_JsonRpc: subaddress identity mismatch')

	const $subaddressState = {
		walletId,
		accountIndex,
		addressIndex: address.address_index,
	}
	return {
		...$subaddressState,
		$network: moneroNetwork,
		address: address.address,
		...(address.label != null && address.label !== '' && { label: address.label }),
		$$timestamps: [{
			[EntityMetaKey.Selector]: {
				$subaddressState,
				timestampMs,
				source: Source.MoneroWalletRpc_JsonRpc,
			},
			[EntityMetaKey.Fields]: {
				...(address.used != null && {
					[entityFieldAddressKey(EntityType.BlockheadMoneroSubaddressState_Timestamp, [], 'used')]: address.used,
				}),
				...(balance?.balance != null && {
					[entityFieldAddressKey(EntityType.BlockheadMoneroSubaddressState_Timestamp, [], 'balanceAtomicUnits')]: atomicUnits(balance.balance, 'subaddress balance'),
				}),
				...(balance?.unlocked_balance != null && {
					[entityFieldAddressKey(EntityType.BlockheadMoneroSubaddressState_Timestamp, [], 'unlockedBalanceAtomicUnits')]: atomicUnits(balance.unlocked_balance, 'subaddress unlocked balance'),
				}),
				...(balance?.num_unspent_outputs != null && {
					[entityFieldAddressKey(EntityType.BlockheadMoneroSubaddressState_Timestamp, [], 'numUnspentOutputs')]: balance.num_unspent_outputs,
				}),
				...(balance?.blocks_to_unlock != null && {
					[entityFieldAddressKey(EntityType.BlockheadMoneroSubaddressState_Timestamp, [], 'blocksToUnlock')]: balance.blocks_to_unlock,
				}),
				...(balance?.time_to_unlock != null && {
					[entityFieldAddressKey(EntityType.BlockheadMoneroSubaddressState_Timestamp, [], 'timeToUnlockSeconds')]: balance.time_to_unlock,
				}),
				[entityFieldAddressKey(EntityType.BlockheadMoneroSubaddressState_Timestamp, [], 'lastSyncedAt')]: timestampMs,
			},
		}],
	}
}

const subaddressReference = (
	subaddress: ReturnType<typeof subaddressFields>
) => ({
	[EntityMetaKey.Selector]: {
		walletId: subaddress.walletId,
		accountIndex: subaddress.accountIndex,
		addressIndex: subaddress.addressIndex,
	},
	[EntityMetaKey.Fields]: Object.fromEntries(Object.entries(subaddress).flatMap(([fieldName, value]) => (
		fieldName === 'walletId' || fieldName === 'accountIndex' || fieldName === 'addressIndex' ?
			[]
		:
			[[
				entityFieldAddressKey(EntityType.BlockheadMoneroSubaddressState, [], fieldName),
				value,
			]]
	))),
})

export default {
	source: Source.MoneroWalletRpc_JsonRpc,

	resolvers: [
		defineResolver({
			entityType: EntityType.BlockheadMoneroWalletState,
			resolve: {
				WalletId: {
					resolve: async ({ walletId: requestedWalletId }, context) => {
						if (requestedWalletId !== walletId)
							throw new Error(`MoneroWalletRpc_JsonRpc: unknown local wallet ${requestedWalletId}`)

						const { getAccounts, getAddress, getBalance, getHeight } = await (
							typeof window === 'undefined' ?
								import('$/sources/MoneroWalletRpc/JsonRpc/queries.ts')
							:
								import('$/sources/MoneroWalletRpc/JsonRpc/queries.remote.ts')
						)
						const binding = bindings[Source.MoneroWalletRpc_JsonRpc][0]
						const timestampMs = Date.now()
						const [accounts, balance, height] = await Promise.all([
							getAccounts(binding),
							getBalance(binding),
							getHeight(binding),
						])
						const addressesByAccount = await Promise.all(accounts.subaddress_accounts.map((account) => (
							getAddress(binding, account.account_index)
						)))
						const subaddresses = addressesByAccount.flatMap((addresses, accountOffset) => (
							addresses.addresses.map((address) => subaddressFields(
								accounts.subaddress_accounts[accountOffset].account_index,
								address,
								balance.per_subaddress?.find((candidate) => (
									candidate.account_index === accounts.subaddress_accounts[accountOffset].account_index
									&& candidate.address_index === address.address_index
								)),
								timestampMs
							))
						))
						const primaryAccount = accounts.subaddress_accounts.at(0)

						return {
							walletId,
							$network: moneroNetwork,
							...(primaryAccount?.base_address != null && {
								primaryAddress: primaryAccount.base_address,
							}),
							$$subaddresses: subaddresses
								.slice(0, resolverContextRowLimit(context))
								.map(subaddressReference),
							$$timestamps: [{
								[EntityMetaKey.Selector]: {
									$walletState: walletSelector,
									timestampMs,
									source: Source.MoneroWalletRpc_JsonRpc,
								},
								[EntityMetaKey.Fields]: {
									[entityFieldAddressKey(EntityType.BlockheadMoneroWalletState_Timestamp, [], 'height')]: atomicUnits(height.height, 'wallet height'),
									[entityFieldAddressKey(EntityType.BlockheadMoneroWalletState_Timestamp, [], 'balanceAtomicUnits')]: atomicUnits(balance.balance, 'wallet balance'),
									[entityFieldAddressKey(EntityType.BlockheadMoneroWalletState_Timestamp, [], 'unlockedBalanceAtomicUnits')]: atomicUnits(balance.unlocked_balance, 'wallet unlocked balance'),
									...(balance.multisig_import_needed != null && {
										[entityFieldAddressKey(EntityType.BlockheadMoneroWalletState_Timestamp, [], 'multisigImportNeeded')]: balance.multisig_import_needed,
									}),
									[entityFieldAddressKey(EntityType.BlockheadMoneroWalletState_Timestamp, [], 'lastSyncedAt')]: timestampMs,
								},
							}],
						}
					},
				},
			},
		})({
			walletId: (wallet) => wallet.walletId,
			$network: (wallet) => wallet.$network,
			primaryAddress: (wallet) => wallet.primaryAddress,
			$$subaddresses: (wallet) => wallet.$$subaddresses,
			$$timestamps: (wallet) => wallet.$$timestamps,
		}),

		defineResolver({
			entityType: EntityType.BlockheadMoneroSubaddressState,
			resolve: {
				WalletIdAccountIndexAddressIndex: {
					resolve: async ({ walletId: requestedWalletId, accountIndex, addressIndex }) => {
						if (requestedWalletId !== walletId)
							throw new Error(`MoneroWalletRpc_JsonRpc: unknown local wallet ${requestedWalletId}`)

						const { getAddress, getBalance } = await (
							typeof window === 'undefined' ?
								import('$/sources/MoneroWalletRpc/JsonRpc/queries.ts')
							:
								import('$/sources/MoneroWalletRpc/JsonRpc/queries.remote.ts')
						)
						const binding = bindings[Source.MoneroWalletRpc_JsonRpc][0]
						const [addresses, balance] = await Promise.all([
							getAddress(binding, accountIndex),
							getBalance(binding),
						])
						const address = addresses.addresses.find((candidate) => candidate.address_index === addressIndex)
						if (address == null)
							throw new Error('MoneroWalletRpc_JsonRpc: subaddress not found')

						return subaddressFields(
							accountIndex,
							address,
							balance.per_subaddress?.find((candidate) => (
								candidate.account_index === accountIndex
								&& candidate.address_index === addressIndex
							)),
							Date.now()
						)
					},
				},
			},
		})({
			walletId: (subaddress) => subaddress.walletId,
			$network: (subaddress) => subaddress.$network,
			accountIndex: (subaddress) => subaddress.accountIndex,
			addressIndex: (subaddress) => subaddress.addressIndex,
			address: (subaddress) => subaddress.address,
			label: (subaddress) => subaddress.label,
			$$timestamps: (subaddress) => subaddress.$$timestamps,
		}),
	],
} satisfies RegisteredSourceResolverModule

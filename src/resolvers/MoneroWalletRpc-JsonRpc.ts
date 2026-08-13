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
import type {
	MoneroWalletOutput,
	MoneroWalletSubaddress,
	MoneroWalletSubaddressBalance,
	MoneroWalletTransfer,
	MoneroWalletTransfers,
} from '$/sources/MoneroWalletRpc/JsonRpc/types.ts'


const loadMoneroWalletQueries = async () => {
	if (typeof window !== 'undefined')
		return import('$/sources/MoneroWalletRpc/JsonRpc/queries.remote.ts')

	const queries = await import('$/sources/MoneroWalletRpc/JsonRpc/queries.ts')
	return {
		getAccounts: () => queries.getAccounts(),
		getAddress: (accountIndex: number) => queries.getAddress(accountIndex),
		getBalance: () => queries.getBalance(),
		getHeight: () => queries.getHeight(),
		getKeyStatus: () => queries.getKeyStatus(),
		getOutputs: () => queries.getOutputs(),
		getTransfers: () => queries.getTransfers(),
	}
}


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

const timestampMsFromSeconds = (
	value: number,
	field: string
) => {
	if (value > Math.floor(Number.MAX_SAFE_INTEGER / 1_000))
		throw new Error(`MoneroWalletRpc_JsonRpc: ${field} exceeds the safe integer range`)

	return value * 1_000
}

const assertTransactionHash = (txHash: string) => {
	if (!/^[0-9a-f]{64}$/i.test(txHash))
		throw new Error('MoneroWalletRpc_JsonRpc: invalid transaction hash')

	return txHash.toLowerCase()
}

const outputFields = (
	output: MoneroWalletOutput,
	timestampMs: number
) => {
	const txHash = assertTransactionHash(output.txid)
	const $outputState = {
		walletId,
		txHash,
		outputIndex: output.amount_index,
	}
	return {
		...$outputState,
		$network: moneroNetwork,
		$transaction: {
			[EntityMetaKey.Selector]: {
				$network: moneroNetwork.$network,
				txHash,
			},
		},
		amountAtomicUnits: atomicUnits(output.amount, 'output amount'),
		...(output.subaddr_index != null && {
			accountIndex: output.subaddr_index.major,
			addressIndex: output.subaddr_index.minor,
		}),
		...(output.key_image != null && { keyImage: output.key_image }),
		...(output.global_index != null && {
			globalOutputIndex: atomicUnits(output.global_index, 'output global index'),
		}),
		$$timestamps: [{
			[EntityMetaKey.Selector]: {
				$outputState,
				timestampMs,
				source: Source.MoneroWalletRpc_JsonRpc,
			},
			[EntityMetaKey.Fields]: {
				...(output.spent != null && {
					[entityFieldAddressKey(EntityType.BlockheadMoneroOutputState_Timestamp, [], 'spent')]: output.spent,
				}),
				...(output.unlocked != null && {
					[entityFieldAddressKey(EntityType.BlockheadMoneroOutputState_Timestamp, [], 'unlocked')]: output.unlocked,
				}),
				...(output.confirmations != null && {
					[entityFieldAddressKey(EntityType.BlockheadMoneroOutputState_Timestamp, [], 'confirmations')]: output.confirmations,
				}),
				...(output.height != null && {
					[entityFieldAddressKey(EntityType.BlockheadMoneroOutputState_Timestamp, [], 'exportHeight')]: atomicUnits(output.height, 'output height'),
				}),
				[entityFieldAddressKey(EntityType.BlockheadMoneroOutputState_Timestamp, [], 'lastCheckedAt')]: timestampMs,
			},
		}],
	}
}

const transferFields = (
	transfer: MoneroWalletTransfer,
	direction: string,
	transferIndex: number,
	timestampMs: number
) => {
	const txHash = assertTransactionHash(transfer.txid)
	const $transferState = {
		walletId,
		txHash,
		transferIndex,
	}
	return {
		...$transferState,
		$network: moneroNetwork,
		$transaction: {
			[EntityMetaKey.Selector]: {
				$network: moneroNetwork.$network,
				txHash,
			},
		},
		direction,
		amountAtomicUnits: atomicUnits(transfer.amount, 'transfer amount'),
		...(transfer.fee != null && { feeAtomicUnits: atomicUnits(transfer.fee, 'transfer fee') }),
		...(transfer.subaddr_index != null && {
			accountIndex: transfer.subaddr_index.major,
			addressIndex: transfer.subaddr_index.minor,
		}),
		...(transfer.payment_id != null && { paymentId: transfer.payment_id }),
		...(transfer.note != null && transfer.note !== '' && { note: transfer.note }),
		...(transfer.key_image != null && { keyImage: transfer.key_image }),
		...(transfer.timestamp != null && {
			timestampMs: timestampMsFromSeconds(transfer.timestamp, 'transfer timestamp'),
		}),
		$$timestamps: [{
			[EntityMetaKey.Selector]: {
				$transferState,
				timestampMs,
				source: Source.MoneroWalletRpc_JsonRpc,
			},
			[EntityMetaKey.Fields]: {
				...(transfer.confirmations != null && {
					[entityFieldAddressKey(EntityType.BlockheadMoneroTransferState_Timestamp, [], 'confirmations')]: transfer.confirmations,
				}),
				...(transfer.unlock_time != null && {
					[entityFieldAddressKey(EntityType.BlockheadMoneroTransferState_Timestamp, [], 'unlockTime')]: atomicUnits(transfer.unlock_time, 'transfer unlock time'),
				}),
				[entityFieldAddressKey(EntityType.BlockheadMoneroTransferState_Timestamp, [], 'lastCheckedAt')]: timestampMs,
			},
		}],
	}
}

const transferRows = (
	transfers: MoneroWalletTransfers,
	timestampMs: number
) => {
	const transferIndexByTxHash = new Map<string, number>()
	return (
		[
			['in', transfers.in],
			['out', transfers.out],
			['pending', transfers.pending],
			['failed', transfers.failed],
			['pool', transfers.pool],
		] as const
	)
		.flatMap(([direction, rows]) => (
			(rows ?? []).map((transfer) => {
				const txHash = assertTransactionHash(transfer.txid)
				const transferIndex = transferIndexByTxHash.get(txHash) ?? 0
				transferIndexByTxHash.set(txHash, transferIndex + 1)
				return transferFields(transfer, direction, transferIndex, timestampMs)
			})
		))
}

const stateReference = <_State extends {
	walletId: string
	txHash: string
}>(
	state: _State,
	entityType: EntityType.BlockheadMoneroOutputState | EntityType.BlockheadMoneroTransferState,
	indexField: 'outputIndex' | 'transferIndex',
	index: number
) => ({
	[EntityMetaKey.Selector]: {
		walletId: state.walletId,
		txHash: state.txHash,
		[indexField]: index,
	},
	[EntityMetaKey.Fields]: Object.fromEntries(Object.entries(state).flatMap(([fieldName, value]) => (
		fieldName === 'walletId' || fieldName === 'txHash' || fieldName === indexField ?
			[]
		:
			[[
				entityFieldAddressKey(entityType, [], fieldName),
				value,
			]]
	))),
})

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

						const {
							getAccounts,
							getAddress,
							getBalance,
							getHeight,
							getKeyStatus,
							getOutputs,
							getTransfers,
						} = await loadMoneroWalletQueries()
						const timestampMs = Date.now()
						const [
							accounts,
							balance,
							height,
							keyStatus,
							outputs,
							transfers,
						] = await Promise.all([
							getAccounts(),
							getBalance(),
							getHeight(),
							getKeyStatus(),
							getOutputs(),
							getTransfers(),
						])
						const addressesByAccount = await Promise.all(accounts.subaddress_accounts.map((account) => (
							getAddress(account.account_index)
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
							viewOnly: !keyStatus.spendKeyAvailable,
							viewKeyFingerprint: keyStatus.viewKeyFingerprint,
							spendKeyAvailable: keyStatus.spendKeyAvailable,
							$$subaddresses: subaddresses
								.slice(0, resolverContextRowLimit(context))
								.map(subaddressReference),
							$$outputs: outputs.outputs
								.map((output) => outputFields(output, timestampMs))
								.slice(0, resolverContextRowLimit(context))
								.map((output) => stateReference(
									output,
									EntityType.BlockheadMoneroOutputState,
									'outputIndex',
									output.outputIndex
								)),
							$$transfers: transferRows(transfers, timestampMs)
								.slice(0, resolverContextRowLimit(context))
								.map((transfer) => stateReference(
									transfer,
									EntityType.BlockheadMoneroTransferState,
									'transferIndex',
									transfer.transferIndex
								)),
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
			resolveLive: {
				walletSynchronization: {
					facetPath: [],
					publishes: {
						'$$timestamps': true,
					},
					start: ({
						fields,
						parentEntitySelector,
						signal,
					}) => {
						if (parentEntitySelector.walletId !== walletId)
							throw new Error(`MoneroWalletRpc_JsonRpc: unknown local wallet ${parentEntitySelector.walletId}`)

						let timeout: ReturnType<typeof setTimeout> | undefined
						const poll = async () => {
							const {
								getBalance,
								getHeight,
							} = await loadMoneroWalletQueries()
							const [
								balance,
								height,
							] = await Promise.all([
								getBalance(),
								getHeight(),
							])
							if (signal.aborted)
								return

							const timestampMs = Date.now()
							fields.$$timestamps.replaceRows([{
								source: Source.MoneroWalletRpc_JsonRpc,
								value: [{
									[EntityMetaKey.Selector]: {
										$walletState: parentEntitySelector,
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
							}])
							timeout = setTimeout(() => { void poll() }, 10_000)
						}
						const abort = () => {
							if (timeout != null)
								clearTimeout(timeout)
						}
						signal.addEventListener('abort', abort, { once: true })
						void poll()
						return () => {
							signal.removeEventListener('abort', abort)
							abort()
						}
					},
				},
			},
		})({
			walletId: (wallet) => wallet.walletId,
			$network: (wallet) => wallet.$network,
			primaryAddress: (wallet) => wallet.primaryAddress,
			viewOnly: (wallet) => wallet.viewOnly,
			viewKeyFingerprint: (wallet) => wallet.viewKeyFingerprint,
			spendKeyAvailable: (wallet) => wallet.spendKeyAvailable,
			$$subaddresses: (wallet) => wallet.$$subaddresses,
			$$outputs: (wallet) => wallet.$$outputs,
			$$transfers: (wallet) => wallet.$$transfers,
			$$timestamps: {
				select: (wallet) => wallet.$$timestamps,
				resolveCount: (wallet) => wallet.$$timestamps.length,
			},
		}),

		defineResolver({
			entityType: EntityType.BlockheadMoneroSubaddressState,
			resolve: {
				WalletIdAccountIndexAddressIndex: {
					resolve: async ({ walletId: requestedWalletId, accountIndex, addressIndex }) => {
						if (requestedWalletId !== walletId)
							throw new Error(`MoneroWalletRpc_JsonRpc: unknown local wallet ${requestedWalletId}`)

						const { getAddress, getBalance } = await loadMoneroWalletQueries()
						const [addresses, balance] = await Promise.all([
							getAddress(accountIndex),
							getBalance(),
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

		defineResolver({
			entityType: EntityType.BlockheadMoneroOutputState,
			resolve: {
				WalletIdTxHashOutputIndex: {
					resolve: async ({ walletId: requestedWalletId, txHash: requestedTxHash, outputIndex }) => {
						if (requestedWalletId !== walletId)
							throw new Error(`MoneroWalletRpc_JsonRpc: unknown local wallet ${requestedWalletId}`)

						const { getOutputs } = await loadMoneroWalletQueries()
						const output = (await getOutputs()).outputs.find((candidate) => (
							assertTransactionHash(candidate.txid) === assertTransactionHash(requestedTxHash)
							&& candidate.amount_index === outputIndex
						))
						if (output == null)
							throw new Error('MoneroWalletRpc_JsonRpc: output not found')

						return outputFields(output, Date.now())
					},
				},
			},
		})({
			walletId: (output) => output.walletId,
			$network: (output) => output.$network,
			$transaction: (output) => output.$transaction,
			txHash: (output) => output.txHash,
			outputIndex: (output) => output.outputIndex,
			accountIndex: (output) => output.accountIndex,
			addressIndex: (output) => output.addressIndex,
			amountAtomicUnits: (output) => output.amountAtomicUnits,
			keyImage: (output) => output.keyImage,
			globalOutputIndex: (output) => output.globalOutputIndex,
			$$timestamps: (output) => output.$$timestamps,
		}),

		defineResolver({
			entityType: EntityType.BlockheadMoneroTransferState,
			resolve: {
				WalletIdTxHashTransferIndex: {
					resolve: async ({ walletId: requestedWalletId, txHash: requestedTxHash, transferIndex }) => {
						if (requestedWalletId !== walletId)
							throw new Error(`MoneroWalletRpc_JsonRpc: unknown local wallet ${requestedWalletId}`)

						const { getTransfers } = await loadMoneroWalletQueries()
						const transfer = transferRows(
							await getTransfers(),
							Date.now()
						).find((candidate) => (
							candidate.txHash === assertTransactionHash(requestedTxHash)
							&& candidate.transferIndex === transferIndex
						))
						if (transfer == null)
							throw new Error('MoneroWalletRpc_JsonRpc: transfer not found')

						return transfer
					},
				},
			},
		})({
			walletId: (transfer) => transfer.walletId,
			$network: (transfer) => transfer.$network,
			$transaction: (transfer) => transfer.$transaction,
			txHash: (transfer) => transfer.txHash,
			transferIndex: (transfer) => transfer.transferIndex,
			direction: (transfer) => transfer.direction,
			accountIndex: (transfer) => transfer.accountIndex,
			addressIndex: (transfer) => transfer.addressIndex,
			amountAtomicUnits: (transfer) => transfer.amountAtomicUnits,
			feeAtomicUnits: (transfer) => transfer.feeAtomicUnits,
			paymentId: (transfer) => transfer.paymentId,
			note: (transfer) => transfer.note,
			keyImage: (transfer) => transfer.keyImage,
			timestampMs: (transfer) => transfer.timestampMs,
			$$timestamps: (transfer) => transfer.$$timestamps,
		}),
	],
} satisfies RegisteredSourceResolverModule

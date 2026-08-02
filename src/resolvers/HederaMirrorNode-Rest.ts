import { networkBySlug } from '$/constants/Network.ts'
import { resolverContextRowLimit } from '$/resolvers/$resolvers.ts'
import { defineResolver, type RegisteredSourceResolverModule } from '$/resolvers/defineResolver.ts'
import {
	entityFieldAddressKey,
	EntityMetaKey,
	type EntitySelector,
} from '$/schema/$schema.ts'
import { EntityType } from '$/schema/EntityType.ts'
import { schema } from '$/schema/index.ts'
import { Source } from '$/sources/Source.ts'
import type {
	HederaMirrorNodeBlock,
	HederaMirrorNodeTransaction,
} from '$/sources/HederaMirrorNode/Rest/types.ts'

const assertHederaMainnet = (
	network: EntitySelector<typeof schema, EntityType.Network>
) => {
	if (
		!(
			'slug' in network
			&& network.slug === networkBySlug.hedera.slug
		)
		&& !(
			'caip2' in network
			&& network.caip2.namespace === networkBySlug.hedera.caip2.namespace
			&& network.caip2.reference === networkBySlug.hedera.caip2.reference
		)
	)
		throw new Error('HederaMirrorNode_Rest: unsupported network')
}

const nonnegativeSafeInteger = (
	value: number,
	fieldName: string
): number => {
	if (!Number.isSafeInteger(value) || value < 0)
		throw new Error(`HederaMirrorNode_Rest: malformed ${fieldName}`)

	return value
}

const nonnegativeBigInt = (
	value: string,
	fieldName: string
) => {
	if (!/^\d+$/.test(value))
		throw new Error(`HederaMirrorNode_Rest: malformed ${fieldName}`)

	return BigInt(value)
}

const signedBigInt = (
	value: string,
	fieldName: string
) => {
	if (!/^-?\d+$/.test(value))
		throw new Error(`HederaMirrorNode_Rest: malformed ${fieldName}`)

	return BigInt(value)
}

const hederaEntityId = (
	value: string,
	fieldName: string
) => {
	if (!/^\d{1,10}\.\d{1,10}\.\d{1,10}$/.test(value))
		throw new Error(`HederaMirrorNode_Rest: malformed ${fieldName}`)

	return value
}

const timestampMs = (
	value: string,
	fieldName: string
) => {
	const match = /^(\d{1,10})(?:\.(\d{1,9}))?$/.exec(value)
	if (match == null)
		throw new Error(`HederaMirrorNode_Rest: malformed ${fieldName}`)
	const [, seconds, nanoseconds = ''] = match

	return nonnegativeSafeInteger(
		Number(seconds) * 1_000
		+ Number(nanoseconds.padEnd(9, '0').slice(0, 3)),
		fieldName
	)
}

const hederaContinuation = (
	next: string | null,
	current: string | undefined,
	operation: string,
	target: string
) => {
	if (next != null && next === current)
		throw new Error(`HederaMirrorNode_Rest: ${operation} continuation did not advance`)

	return next == null ?
		{
			operation,
			target,
			terminal: true as const,
		}
	:
		{
			operation,
			target,
			terminal: false as const,
			token: next,
		}
}

const blockFields = (
	block: HederaMirrorNodeBlock
) => ({
	blockNumber: BigInt(nonnegativeSafeInteger(block.number, 'block number')),
	blockHash: block.hash,
	consensusStartTimestamp: block.timestamp.from,
	consensusEndTimestamp: block.timestamp.to,
	...(block.gas_used != null && {
		gasUsed: BigInt(nonnegativeSafeInteger(block.gas_used, 'gas used')),
	}),
	recordFileName: block.name,
	transactionCount: nonnegativeSafeInteger(block.count, 'transaction count'),
})

const transactionSnapshot = (
	network: EntitySelector<typeof schema, EntityType.Network>,
	transaction: HederaMirrorNodeTransaction
) => {
	timestampMs(transaction.consensus_timestamp, 'transaction consensus timestamp')
	const payerAccount = /^(\d{1,10}\.\d{1,10}\.\d{1,10})-\d{1,10}-\d{1,9}$/.exec(
		transaction.transaction_id
	)?.[1]
	if (payerAccount == null)
		throw new Error('HederaMirrorNode_Rest: malformed transaction ID')
	if (transaction.name.length === 0)
		throw new Error('HederaMirrorNode_Rest: malformed transaction type')
	if (transaction.node != null)
		hederaEntityId(transaction.node, 'transaction node account')

	const transactionSelector = {
		$network: network,
		consensusTimestamp: transaction.consensus_timestamp,
	}
	const hbarTransfers = transaction.transfers.map((transfer, transferIndex) => {
		if (transfer.account == null)
			throw new Error('HederaMirrorNode_Rest: HBAR transfer account is missing')
		const accountId = hederaEntityId(transfer.account, 'HBAR transfer account')

		return {
			[EntityMetaKey.Selector]: {
				$transaction: transactionSelector,
				accountId,
				transferIndex,
			},
			[EntityMetaKey.Fields]: {
				[entityFieldAddressKey(EntityType.HederaHbarTransfer, [], 'amountTinybar')]: signedBigInt(transfer.amount, 'HBAR transfer amount'),
				[entityFieldAddressKey(EntityType.HederaHbarTransfer, [], 'isApproval')]: transfer.is_approval,
				[entityFieldAddressKey(EntityType.HederaHbarTransfer, [], '$account')]: {
					[EntityMetaKey.Selector]: {
						$network: network,
						accountId,
					},
				},
			},
		}
	})
	const fungibleTokenTransfers = transaction.token_transfers.map((transfer, transferIndex) => {
		if (transfer.account == null)
			throw new Error('HederaMirrorNode_Rest: token transfer account is missing')
		const accountId = hederaEntityId(transfer.account, 'token transfer account')
		const tokenId = hederaEntityId(transfer.token_id, 'token transfer token ID')

		return {
			[EntityMetaKey.Selector]: {
				$transaction: transactionSelector,
				tokenId,
				accountId,
				transferIndex,
			},
			[EntityMetaKey.Fields]: {
				[entityFieldAddressKey(EntityType.HederaTokenTransfer, [], 'amount')]: signedBigInt(transfer.amount, 'token transfer amount'),
				[entityFieldAddressKey(EntityType.HederaTokenTransfer, [], 'isApproval')]: transfer.is_approval,
				[entityFieldAddressKey(EntityType.HederaTokenTransfer, [], '$token')]: {
					[EntityMetaKey.Selector]: {
						$network: network,
						tokenId,
					},
				},
				[entityFieldAddressKey(EntityType.HederaTokenTransfer, [], '$account')]: {
					[EntityMetaKey.Selector]: {
						$network: network,
						accountId,
					},
				},
			},
		}
	})
	const nftTokenTransfers = transaction.nft_transfers.flatMap((transfer, nftTransferIndex) => {
		const tokenId = hederaEntityId(transfer.token_id, 'NFT transfer token ID')
		const serialNumber = nonnegativeBigInt(transfer.serial_number, 'NFT transfer serial number')
		const accounts = [
			transfer.sender_account_id,
			transfer.receiver_account_id,
		].filter((accountId): accountId is string => accountId != null)
		if (accounts.length === 0)
			throw new Error('HederaMirrorNode_Rest: NFT transfer has no account')

		return accounts.map((rawAccountId, accountIndex) => {
			const accountId = hederaEntityId(rawAccountId, 'NFT transfer account')
			const transferIndex = (
				fungibleTokenTransfers.length
				+ nftTransferIndex * 2
				+ accountIndex
			)

			return {
				[EntityMetaKey.Selector]: {
					$transaction: transactionSelector,
					tokenId,
					accountId,
					transferIndex,
				},
				[EntityMetaKey.Fields]: {
					[entityFieldAddressKey(EntityType.HederaTokenTransfer, [], 'serialNumber')]: serialNumber,
					[entityFieldAddressKey(EntityType.HederaTokenTransfer, [], 'isApproval')]: transfer.is_approval,
					[entityFieldAddressKey(EntityType.HederaTokenTransfer, [], '$token')]: {
						[EntityMetaKey.Selector]: {
							$network: network,
							tokenId,
						},
					},
					[entityFieldAddressKey(EntityType.HederaTokenTransfer, [], '$account')]: {
						[EntityMetaKey.Selector]: {
							$network: network,
							accountId,
						},
					},
					[entityFieldAddressKey(EntityType.HederaTokenTransfer, [], '$nft')]: {
						[EntityMetaKey.Selector]: {
							$token: {
								$network: network,
								tokenId,
							},
							serialNumber,
						},
					},
				},
			}
		})
	})

	return {
		consensusTimestamp: transaction.consensus_timestamp,
		transactionId: transaction.transaction_id,
		nonce: nonnegativeSafeInteger(transaction.nonce, 'transaction nonce'),
		transactionType: transaction.name,
		payerAccount,
		result: transaction.result,
		chargedTxFeeTinybar: nonnegativeBigInt(transaction.charged_tx_fee, 'charged transaction fee'),
		validStartTimestamp: transaction.valid_start_timestamp ?? undefined,
		nodeAccountId: transaction.node ?? undefined,
		scheduled: transaction.scheduled,
		$$hbarTransfers: hbarTransfers,
		$$tokenTransfers: [
			...fungibleTokenTransfers,
			...nftTokenTransfers,
		],
	}
}

export default {
	source: Source.HederaMirrorNode_Rest,

	resolvers: [
		defineResolver({
			entityType: EntityType.HederaAccount,
			resolve: {
				NetworkAccountId: {
					resolve: async (hederaAccount) => {
						const { $network, accountId } = hederaAccount
						assertHederaMainnet($network)
						const { getAccount } = await import('$/sources/HederaMirrorNode/Rest/queries.ts')
						const account = await getAccount(accountId)
						if (account.account !== accountId)
							throw new Error('HederaMirrorNode_Rest: response account does not match request')
						const accountTimestampMs = timestampMs(account.balance.timestamp, 'account balance timestamp')
						const evmAddress = account.evm_address == null ?
							undefined
						:
							account.evm_address.startsWith('0x') ?
								account.evm_address.toLowerCase()
							:
								`0x${account.evm_address.toLowerCase()}`
						if (evmAddress != null && !/^0x[0-9a-f]{40}$/.test(evmAddress))
							throw new Error('HederaMirrorNode_Rest: malformed EVM address')

						return {
							accountId: account.account,
							$$timestamps: [
								{
									[EntityMetaKey.Selector]: {
										$account: hederaAccount,
										timestampMs: accountTimestampMs,
										source: Source.HederaMirrorNode_Rest,
									},
									[EntityMetaKey.Fields]: {
										...(account.alias != null && {
											[entityFieldAddressKey(EntityType.HederaAccount_Timestamp, [], 'alias')]: account.alias,
										}),
										...(evmAddress != null && {
											[entityFieldAddressKey(EntityType.HederaAccount_Timestamp, [], 'evmAddress')]: evmAddress,
										}),
										...(account.key != null && {
											[entityFieldAddressKey(EntityType.HederaAccount_Timestamp, [], 'key')]: account.key,
										}),
										...(account.receiver_sig_required != null && {
											[entityFieldAddressKey(EntityType.HederaAccount_Timestamp, [], 'receiverSigRequired')]: account.receiver_sig_required,
										}),
										...(account.memo != null && {
											[entityFieldAddressKey(EntityType.HederaAccount_Timestamp, [], 'memo')]: account.memo,
										}),
										[entityFieldAddressKey(EntityType.HederaAccount_Timestamp, [], 'balanceTinybar')]: nonnegativeBigInt(account.balance.balance, 'account balance'),
										...(account.deleted != null && {
											[entityFieldAddressKey(EntityType.HederaAccount_Timestamp, [], 'deleted')]: account.deleted,
										}),
										...(account.auto_renew_period != null && {
											[entityFieldAddressKey(EntityType.HederaAccount_Timestamp, [], 'autoRenewPeriodSeconds')]: nonnegativeSafeInteger(account.auto_renew_period, 'auto renew period'),
										}),
										...(account.expiry_timestamp != null && {
											[entityFieldAddressKey(EntityType.HederaAccount_Timestamp, [], 'expiryTimestamp')]: account.expiry_timestamp,
										}),
										...(account.staked_node_id != null && {
											[entityFieldAddressKey(EntityType.HederaAccount_Timestamp, [], 'stakedNodeId')]: nonnegativeSafeInteger(account.staked_node_id, 'staked node ID'),
										}),
										...(account.staked_account_id != null && {
											[entityFieldAddressKey(EntityType.HederaAccount_Timestamp, [], 'stakedAccountId')]: account.staked_account_id,
										}),
										[entityFieldAddressKey(EntityType.HederaAccount_Timestamp, [], 'declineReward')]: account.decline_reward,
										[entityFieldAddressKey(EntityType.HederaAccount_Timestamp, [], 'pendingRewardTinybar')]: nonnegativeBigInt(account.pending_reward, 'pending reward'),
									},
								},
							],
						}
					},
				},
			},
		})({
			accountId: (account) => account.accountId,
			$$timestamps: (account) => account.$$timestamps,
		}),

		defineResolver({
			entityType: EntityType.Network,
			resolve: {
				Caip2: {
					resolve: async (network, context) => {
						assertHederaMainnet(network)
						const { getBlocks } = await import('$/sources/HederaMirrorNode/Rest/queries.ts')

						return (await getBlocks(
							Math.min(resolverContextRowLimit(context), 100)
						)).blocks.map((block) => ({
							[EntityMetaKey.Selector]: {
								$network: network,
								blockNumber: BigInt(nonnegativeSafeInteger(block.number, 'block number')),
							},
							...blockFields(block),
						}))
					},
				},
			},
		})({
			Hedera: {
				$$blocks: (blocks) => blocks,
			},
		}),

		defineResolver({
			entityType: EntityType.HederaBlock,
			resolve: {
				NetworkBlockNumber: {
					resolve: async ({ $network, blockNumber: requestedBlockNumber }) => {
						assertHederaMainnet($network)
						const { getBlock } = await import('$/sources/HederaMirrorNode/Rest/queries.ts')
						const block = await getBlock(requestedBlockNumber.toString())
						if (BigInt(nonnegativeSafeInteger(block.number, 'block number')) !== requestedBlockNumber)
							throw new Error('HederaMirrorNode_Rest: response block does not match request')

						return blockFields(block)
					},
				},
				NetworkBlockHash: {
					resolve: async ({ $network, blockHash: requestedBlockHash }) => {
						assertHederaMainnet($network)
						const { getBlock } = await import('$/sources/HederaMirrorNode/Rest/queries.ts')
						const block = await getBlock(requestedBlockHash)
						if (
							block.hash.replace(/^0x/i, '').toLowerCase()
							!== requestedBlockHash.replace(/^0x/i, '').toLowerCase()
						)
							throw new Error('HederaMirrorNode_Rest: response block does not match request')

						return blockFields(block)
					},
				},
			},
		})({
			blockNumber: (block) => block.blockNumber,
			blockHash: (block) => block.blockHash,
			consensusStartTimestamp: (block) => block.consensusStartTimestamp,
			consensusEndTimestamp: (block) => block.consensusEndTimestamp,
			gasUsed: (block) => block.gasUsed,
			recordFileName: (block) => block.recordFileName,
			transactionCount: (block) => block.transactionCount,
		}),

		defineResolver({
			entityType: EntityType.HederaAccount,
			resolve: {
				NetworkAccountId: {
					resolve: async (hederaAccount, context) => {
						assertHederaMainnet(hederaAccount.$network)
						const { getTransactions } = await import('$/sources/HederaMirrorNode/Rest/queries.ts')

						return getTransactions({
							accountId: hederaAccount.accountId,
							continuationToken: context.providerContinuationToken,
							limit: Math.min(resolverContextRowLimit(context), 100),
						})
					},
				},
			},
		})({
			$$transactions: {
				select: (page, hederaAccount) => page.transactions.map((transaction) => {
					const payerAccount = /^(\d{1,10}\.\d{1,10}\.\d{1,10})-/.exec(transaction.transaction_id)?.[1]
					if (payerAccount == null)
						throw new Error('HederaMirrorNode_Rest: malformed transaction ID')
					if (
						payerAccount !== hederaAccount.accountId
						&& transaction.entity_id !== hederaAccount.accountId
						&& !transaction.max_custom_fees.some(({ account_id }) => (
							account_id === hederaAccount.accountId
						))
						&& !transaction.staking_reward_transfers.some(({ account }) => (
							`0.0.${nonnegativeSafeInteger(account, 'staking reward account').toString()}`
							=== hederaAccount.accountId
						))
						&& !transaction.transfers.some(({ account }) => account === hederaAccount.accountId)
						&& !transaction.token_transfers.some(({ account }) => account === hederaAccount.accountId)
						&& !transaction.nft_transfers.some(({ receiver_account_id, sender_account_id }) => (
							receiver_account_id === hederaAccount.accountId
							|| sender_account_id === hederaAccount.accountId
						))
					)
						throw new Error('HederaMirrorNode_Rest: response transaction does not match request')
					timestampMs(transaction.consensus_timestamp, 'transaction consensus timestamp')
					if (transaction.name.length === 0)
						throw new Error('HederaMirrorNode_Rest: malformed transaction type')

					return {
						[EntityMetaKey.Selector]: {
							$network: hederaAccount.$network,
							consensusTimestamp: transaction.consensus_timestamp,
						},
						[EntityMetaKey.Fields]: {
							[entityFieldAddressKey(EntityType.HederaTransaction, [], 'transactionId')]: transaction.transaction_id,
							[entityFieldAddressKey(EntityType.HederaTransaction, [], 'nonce')]: nonnegativeSafeInteger(transaction.nonce, 'transaction nonce'),
							[entityFieldAddressKey(EntityType.HederaTransaction, [], 'transactionType')]: transaction.name,
							[entityFieldAddressKey(EntityType.HederaTransaction, [], 'payerAccount')]: payerAccount,
							[entityFieldAddressKey(EntityType.HederaTransaction, [], 'result')]: transaction.result,
							[entityFieldAddressKey(EntityType.HederaTransaction, [], 'chargedTxFeeTinybar')]: nonnegativeBigInt(transaction.charged_tx_fee, 'charged transaction fee'),
							...(transaction.valid_start_timestamp != null && {
								[entityFieldAddressKey(EntityType.HederaTransaction, [], 'validStartTimestamp')]: transaction.valid_start_timestamp,
							}),
							...(transaction.node != null && {
								[entityFieldAddressKey(EntityType.HederaTransaction, [], 'nodeAccountId')]: transaction.node,
							}),
							[entityFieldAddressKey(EntityType.HederaTransaction, [], 'scheduled')]: transaction.scheduled,
						},
					}
				}),
				continuation: (page, hederaAccount, context) => (
					hederaContinuation(
						page.links.next,
						context.providerContinuationToken,
						'account-transactions',
						hederaAccount.accountId
					)
				),
			},
		}),

		defineResolver({
			entityType: EntityType.Network,
			resolve: {
				Caip2: {
					resolve: async (network, context) => {
						assertHederaMainnet(network)
						const { getAccounts } = await import('$/sources/HederaMirrorNode/Rest/queries.ts')

						return getAccounts(
							Math.min(resolverContextRowLimit(context), 100),
							context.providerContinuationToken
						)
					},
				},
			},
		})({
			Hedera: {
				$$accounts: {
					select: (page, network) => page.accounts.map((account) => {
						if (account.account == null || !/^\d{1,10}\.\d{1,10}\.\d{1,10}$/.test(account.account))
							throw new Error('HederaMirrorNode_Rest: malformed account identity')

						return {
							[EntityMetaKey.Selector]: {
								$network: network,
								accountId: account.account,
							},
						}
					}),
					continuation: (page, _network, context) => (
						hederaContinuation(
							page.links.next,
							context.providerContinuationToken,
							'network-accounts',
							'hedera:mainnet'
						)
					),
				},
			},
		}),

		defineResolver({
			entityType: EntityType.HederaAccount,
			resolve: {
				NetworkAccountId: {
					resolve: async (hederaAccount, context) => {
						assertHederaMainnet(hederaAccount.$network)
						const { getAccountAllowances } = await import('$/sources/HederaMirrorNode/Rest/queries.ts')

						return getAccountAllowances(
							hederaAccount.accountId,
							Math.min(resolverContextRowLimit(context), 100),
							context.providerContinuationToken
						)
					},
				},
			},
		})({
			$$allowances: {
				select: (snapshot, hederaAccount) => snapshot.page.allowances.map((allowance) => {
					if (allowance.owner !== hederaAccount.accountId)
						throw new Error('HederaMirrorNode_Rest: response allowance does not match request')
					const spenderAccountId = hederaEntityId(allowance.spender, 'allowance spender')
					const tokenId = snapshot.allowanceKind === 'crypto' ?
						undefined
					:
						hederaEntityId(allowance.token_id, 'allowance token ID')
					const allowanceSelector = {
						$owner: hederaAccount,
						$spender: {
							$network: hederaAccount.$network,
							accountId: spenderAccountId,
						},
						allowanceKind: snapshot.allowanceKind,
						...(tokenId != null && {
							tokenId,
						}),
					}
					const allowanceTimestampMs = timestampMs(allowance.timestamp.to, 'allowance timestamp')
					timestampMs(allowance.timestamp.from, 'allowance timestamp')
					if ('amount_granted' in allowance)
						nonnegativeBigInt(allowance.amount_granted, 'granted allowance amount')
					if ('payer_account_id' in allowance)
						hederaEntityId(allowance.payer_account_id, 'allowance payer')

					return {
						[EntityMetaKey.Selector]: allowanceSelector,
						[EntityMetaKey.Fields]: {
							...(tokenId != null && {
								[entityFieldAddressKey(EntityType.HederaAllowance, [], '$token')]: {
									[EntityMetaKey.Selector]: {
										$network: hederaAccount.$network,
										tokenId,
									},
								},
							}),
							[entityFieldAddressKey(EntityType.HederaAllowance, [], '$$timestamps')]: [
								{
									[EntityMetaKey.Selector]: {
										$allowance: allowanceSelector,
										timestampMs: allowanceTimestampMs,
										source: Source.HederaMirrorNode_Rest,
									},
									[EntityMetaKey.Fields]: {
										...('amount' in allowance && {
											[entityFieldAddressKey(EntityType.HederaAllowance_Timestamp, [], 'amount')]: nonnegativeBigInt(allowance.amount, 'allowance amount'),
										}),
										...('approved_for_all' in allowance && {
											[entityFieldAddressKey(EntityType.HederaAllowance_Timestamp, [], 'approvedForAll')]: allowance.approved_for_all,
										}),
									},
								},
							],
						},
					}
				}),
				continuation: (snapshot, hederaAccount, context) => {
					const token = snapshot.page.links.next ?? (
						snapshot.allowanceKind === 'crypto' ?
							`/api/v1/accounts/${encodeURIComponent(hederaAccount.accountId)}/allowances/tokens`
						: snapshot.allowanceKind === 'token' ?
							`/api/v1/accounts/${encodeURIComponent(hederaAccount.accountId)}/allowances/nfts`
						:
							undefined
					)

					return hederaContinuation(
						token,
						context.providerContinuationToken,
						'account-allowances',
						hederaAccount.accountId
					)
				},
			},
		}),

		defineResolver({
			entityType: EntityType.HederaAccount,
			resolve: {
				NetworkAccountId: {
					resolve: async (hederaAccount, context) => {
						assertHederaMainnet(hederaAccount.$network)
						const { getAccountTokens } = await import('$/sources/HederaMirrorNode/Rest/queries.ts')

						return {
							page: await getAccountTokens(
								hederaAccount.accountId,
								Math.min(resolverContextRowLimit(context), 100),
								context.providerContinuationToken
							),
							resolvedAtMs: Date.now(),
						}
					},
				},
			},
		})({
			$$tokens: {
				select: (snapshot, hederaAccount) => snapshot.page.tokens.map((token) => {
					const tokenId = hederaEntityId(token.token_id, 'token ID')
					const tokenSelector = {
						$network: hederaAccount.$network,
						tokenId,
					}
					const associationSelector = {
						$account: hederaAccount,
						$token: tokenSelector,
					}
					timestampMs(token.created_timestamp, 'token association creation timestamp')
					if (token.freeze_status.length === 0 || token.kyc_status.length === 0)
						throw new Error('HederaMirrorNode_Rest: malformed token relationship status')

					return {
						[EntityMetaKey.Selector]: associationSelector,
						[EntityMetaKey.Fields]: {
							[entityFieldAddressKey(EntityType.HederaTokenAssociation, [], '$token')]: {
								[EntityMetaKey.Selector]: tokenSelector,
								[EntityMetaKey.Fields]: {
									[entityFieldAddressKey(EntityType.HederaToken, [], 'decimals')]: nonnegativeSafeInteger(token.decimals, 'token decimals'),
								},
							},
							[entityFieldAddressKey(EntityType.HederaTokenAssociation, [], '$$timestamps')]: [
								{
									[EntityMetaKey.Selector]: {
										$association: associationSelector,
										timestampMs: snapshot.resolvedAtMs,
										source: Source.HederaMirrorNode_Rest,
									},
									[EntityMetaKey.Fields]: {
										[entityFieldAddressKey(EntityType.HederaTokenAssociation_Timestamp, [], 'associationStatus')]: token.automatic_association ? 'automatic' : 'manual',
										[entityFieldAddressKey(EntityType.HederaTokenAssociation_Timestamp, [], 'balance')]: nonnegativeBigInt(token.balance, 'token relationship balance'),
										[entityFieldAddressKey(EntityType.HederaTokenAssociation_Timestamp, [], 'kycStatus')]: token.kyc_status,
										[entityFieldAddressKey(EntityType.HederaTokenAssociation_Timestamp, [], 'freezeStatus')]: token.freeze_status,
									},
								},
							],
						},
					}
				}),
				continuation: (snapshot, hederaAccount, context) => (
					hederaContinuation(
						snapshot.page.links.next,
						context.providerContinuationToken,
						'account-tokens',
						hederaAccount.accountId
					)
				),
			},
		}),

		defineResolver({
			entityType: EntityType.HederaAccount,
			resolve: {
				NetworkAccountId: {
					resolve: async (hederaAccount, context) => {
						assertHederaMainnet(hederaAccount.$network)
						const { getAccountNfts } = await import('$/sources/HederaMirrorNode/Rest/queries.ts')

						return getAccountNfts(
							hederaAccount.accountId,
							Math.min(resolverContextRowLimit(context), 100),
							context.providerContinuationToken
						)
					},
				},
			},
		})({
			$$nfts: {
				select: (page, hederaAccount) => page.nfts.map((nft) => {
					if (nft.account_id !== hederaAccount.accountId)
						throw new Error('HederaMirrorNode_Rest: response NFT does not match request')
					const tokenSelector = {
						$network: hederaAccount.$network,
						tokenId: hederaEntityId(nft.token_id, 'NFT token ID'),
					}
					const nftSelector = {
						$token: tokenSelector,
						serialNumber: nonnegativeBigInt(nft.serial_number, 'NFT serial number'),
					}
					const modifiedTimestampMs = timestampMs(nft.modified_timestamp, 'NFT modified timestamp')
					timestampMs(nft.created_timestamp, 'NFT creation timestamp')
					if (nft.delegating_spender != null)
						hederaEntityId(nft.delegating_spender, 'NFT delegating spender')
					if (nft.spender_id != null)
						hederaEntityId(nft.spender_id, 'NFT spender')

					return {
						[EntityMetaKey.Selector]: nftSelector,
						[EntityMetaKey.Fields]: {
							[entityFieldAddressKey(EntityType.HederaNft, [], 'metadata')]: nft.metadata,
							[entityFieldAddressKey(EntityType.HederaNft, [], 'createdTimestamp')]: nft.created_timestamp,
							[entityFieldAddressKey(EntityType.HederaNft, [], '$$timestamps')]: [
								{
									[EntityMetaKey.Selector]: {
										$nft: nftSelector,
										timestampMs: modifiedTimestampMs,
										source: Source.HederaMirrorNode_Rest,
									},
									[EntityMetaKey.Fields]: {
										[entityFieldAddressKey(EntityType.HederaNft_Timestamp, [], '$owner')]: {
											[EntityMetaKey.Selector]: hederaAccount,
										},
										[entityFieldAddressKey(EntityType.HederaNft_Timestamp, [], 'ownerAccountId')]: nft.account_id,
										[entityFieldAddressKey(EntityType.HederaNft_Timestamp, [], 'deleted')]: nft.deleted,
										...(nft.spender_id != null && {
											[entityFieldAddressKey(EntityType.HederaNft_Timestamp, [], 'spenderAccountId')]: nft.spender_id,
										}),
										[entityFieldAddressKey(EntityType.HederaNft_Timestamp, [], 'modifiedTimestamp')]: nft.modified_timestamp,
									},
								},
							],
						},
					}
				}),
				continuation: (page, hederaAccount, context) => (
					hederaContinuation(
						page.links.next,
						context.providerContinuationToken,
						'account-nfts',
						hederaAccount.accountId
					)
				),
			},
		}),

		defineResolver({
			entityType: EntityType.HederaTransaction,
			resolve: {
				NetworkConsensusTimestamp: {
					resolve: async ({ $network, consensusTimestamp }) => {
						assertHederaMainnet($network)
						const { getTransactions } = await import('$/sources/HederaMirrorNode/Rest/queries.ts')
						const response = await getTransactions({
							consensusTimestamp,
						})
						if (
							response.transactions.length !== 1
							|| response.transactions[0].consensus_timestamp !== consensusTimestamp
						)
							throw new Error('HederaMirrorNode_Rest: transaction response does not match consensus timestamp')

						return transactionSnapshot($network, response.transactions[0])
					},
				},
				NetworkTransactionIdNonce: {
					resolve: async ({
						$network,
						transactionId,
						nonce,
					}) => {
						assertHederaMainnet($network)
						const { getTransactionByIdNonce } = await import('$/sources/HederaMirrorNode/Rest/queries.ts')
						const response = await getTransactionByIdNonce(
							transactionId,
							nonce
						)
						if (
							response.transactions.length !== 1
							|| response.transactions[0].transaction_id !== transactionId
							|| response.transactions[0].nonce !== nonce
						)
							throw new Error('HederaMirrorNode_Rest: transaction response does not match transaction ID and nonce')

						return transactionSnapshot($network, response.transactions[0])
					},
				},
			},
		})({
			consensusTimestamp: (transaction) => transaction.consensusTimestamp,
			transactionId: (transaction) => transaction.transactionId,
			nonce: (transaction) => transaction.nonce,
			transactionType: (transaction) => transaction.transactionType,
			payerAccount: (transaction) => transaction.payerAccount,
			result: (transaction) => transaction.result,
			chargedTxFeeTinybar: (transaction) => transaction.chargedTxFeeTinybar,
			validStartTimestamp: (transaction) => transaction.validStartTimestamp,
			nodeAccountId: (transaction) => transaction.nodeAccountId,
			scheduled: (transaction) => transaction.scheduled,
			$$hbarTransfers: (transaction) => transaction.$$hbarTransfers,
			$$tokenTransfers: (transaction) => transaction.$$tokenTransfers,
		}),
	],
} satisfies RegisteredSourceResolverModule

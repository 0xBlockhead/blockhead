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
	HederaMirrorNodeAccountToken,
	HederaMirrorNodeBlock,
	HederaMirrorNodeContract,
	HederaMirrorNodeContractLog,
	HederaMirrorNodeContractResult,
	HederaMirrorNodeCustomFees,
	HederaMirrorNodeNetworkExchangeRate,
	HederaMirrorNodeNetworkFees,
	HederaMirrorNodeNetworkStake,
	HederaMirrorNodeNetworkSupply,
	HederaMirrorNodeNode,
	HederaMirrorNodeNftAllowance,
	HederaMirrorNodeTokenAllowance,
	HederaMirrorNodeCryptoAllowance,
	HederaMirrorNodeSchedule,
	HederaMirrorNodeNft,
	HederaMirrorNodeTopic,
	HederaMirrorNodeTopicMessage,
	HederaMirrorNodeToken,
	HederaMirrorNodeTransaction,
} from '$/sources/HederaMirrorNode/Rest/types.ts'

type HederaAllowanceSelector = EntitySelector<typeof schema, EntityType.HederaAllowance>

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

const contractSnapshot = (
	$network: EntitySelector<typeof schema, EntityType.Network>,
	contract: HederaMirrorNodeContract
) => ({
	contractId: hederaEntityId(contract.contract_id, 'contract ID'),
	...(contract.evm_address != null && {
		evmAddress: (
			contract.evm_address.startsWith('0x') ?
				contract.evm_address.toLowerCase()
			:
				`0x${contract.evm_address.toLowerCase()}`
		),
	}),
	...(contract.created_timestamp != null && {
		createdTimestamp: contract.created_timestamp,
	}),
	$$timestamps: [{
		[EntityMetaKey.Selector]: {
			$contract: {
				$network,
				contractId: contract.contract_id,
			},
			timestampMs: timestampMs(contract.timestamp.from, 'contract valid-from timestamp'),
			source: Source.HederaMirrorNode_Rest,
		},
		[EntityMetaKey.Fields]: {
			[entityFieldAddressKey(EntityType.HederaContract_Timestamp, [], 'deleted')]: contract.deleted ?? false,
			...(contract.memo != null && {
				[entityFieldAddressKey(EntityType.HederaContract_Timestamp, [], 'memo')]: contract.memo,
			}),
			...(contract.expiration_timestamp != null && {
				[entityFieldAddressKey(EntityType.HederaContract_Timestamp, [], 'expirationTimestamp')]: contract.expiration_timestamp,
			}),
		},
	}],
})

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
) => {
	timestampMs(block.timestamp.from, 'block consensus start')
	timestampMs(block.timestamp.to, 'block consensus end')
	if (block.hash.length === 0)
		throw new Error('HederaMirrorNode_Rest: malformed block hash')
	if (block.previous_hash.length === 0)
		throw new Error('HederaMirrorNode_Rest: malformed previous block hash')
	if (block.name.length === 0)
		throw new Error('HederaMirrorNode_Rest: malformed record file name')
	// Transport leftovers: hapi_version / logs_bloom / size / previous_hash — unenrolled on HederaBlock.
	if (block.hapi_version != null && block.hapi_version.length === 0)
		throw new Error('HederaMirrorNode_Rest: malformed hapi version')
	if (block.logs_bloom != null && block.logs_bloom.length === 0)
		throw new Error('HederaMirrorNode_Rest: malformed logs bloom')
	if (block.size != null)
		nonnegativeSafeInteger(block.size, 'block size')

	return {
		blockNumber: BigInt(nonnegativeSafeInteger(block.number, 'block number')),
		blockHash: block.hash,
		consensusStartTimestamp: block.timestamp.from,
		consensusEndTimestamp: block.timestamp.to,
		...(block.gas_used != null && {
			gasUsed: BigInt(nonnegativeSafeInteger(block.gas_used, 'gas used')),
		}),
		recordFileName: block.name,
		transactionCount: nonnegativeSafeInteger(block.count, 'transaction count'),
	}
}

const assertHederaMirrorSource = (
	source: string
) => {
	if (source !== Source.HederaMirrorNode_Rest)
		throw new Error(`HederaMirrorNode_Rest: unsupported network timestamp source ${source}`)
}

const networkSupplyFields = (
	supply: HederaMirrorNodeNetworkSupply
) => {
	timestampMs(supply.timestamp, 'network supply timestamp')

	return {
		releasedSupplyTinybar: nonnegativeBigInt(supply.released_supply, 'released supply'),
		totalSupplyTinybar: nonnegativeBigInt(supply.total_supply, 'total supply'),
	}
}

const networkStakeFields = (
	stake: HederaMirrorNodeNetworkStake
) => {
	timestampMs(stake.staking_period.from, 'network stake period')
	if (stake.staking_period.to != null)
		timestampMs(stake.staking_period.to, 'network stake period')
	if (
		!Number.isFinite(stake.max_staking_reward_rate_per_hbar)
		|| stake.max_staking_reward_rate_per_hbar < 0
		|| !Number.isFinite(stake.node_reward_fee_fraction)
		|| stake.node_reward_fee_fraction < 0
		|| !Number.isFinite(stake.staking_reward_fee_fraction)
		|| stake.staking_reward_fee_fraction < 0
		|| !Number.isSafeInteger(stake.staking_period_duration)
		|| stake.staking_period_duration < 0
		|| !Number.isSafeInteger(stake.staking_periods_stored)
		|| stake.staking_periods_stored < 0
		|| !Number.isSafeInteger(stake.staking_reward_rate)
		|| stake.staking_reward_rate < 0
	)
		throw new Error('HederaMirrorNode_Rest: malformed network stake')

	return {
		maxStakeRewardedTinybar: nonnegativeBigInt(stake.max_stake_rewarded, 'max stake rewarded'),
		maxStakingRewardRatePerHbar: stake.max_staking_reward_rate_per_hbar,
		maxTotalRewardTinybar: nonnegativeBigInt(stake.max_total_reward, 'max total reward'),
		nodeRewardFeeFraction: stake.node_reward_fee_fraction,
		reservedStakingRewardsTinybar: nonnegativeBigInt(stake.reserved_staking_rewards, 'reserved staking rewards'),
		rewardBalanceTinybar: nonnegativeBigInt(stake.reward_balance_threshold, 'reward balance threshold'),
		stakeTotalTinybar: nonnegativeBigInt(stake.stake_total, 'stake total'),
		stakingPeriod: stake.staking_period,
		stakingPeriodsStored: stake.staking_periods_stored,
		stakingRewardFeeFraction: stake.staking_reward_fee_fraction,
		stakingStartThresholdTinybar: nonnegativeBigInt(stake.staking_reward_start_threshold, 'staking reward start threshold'),
		unreservedStakingRewardBalanceTinybar: nonnegativeBigInt(stake.unreserved_staking_reward_balance, 'unreserved staking reward balance'),
	}
}

const networkExchangeRateFields = (
	exchangeRate: HederaMirrorNodeNetworkExchangeRate
) => {
	timestampMs(exchangeRate.timestamp, 'network exchange rate timestamp')
	if (
		!Number.isSafeInteger(exchangeRate.current_rate.cent_equivalent)
		|| exchangeRate.current_rate.cent_equivalent < 0
		|| !Number.isSafeInteger(exchangeRate.current_rate.hbar_equivalent)
		|| exchangeRate.current_rate.hbar_equivalent < 0
		|| !Number.isSafeInteger(exchangeRate.current_rate.expiration_time)
		|| exchangeRate.current_rate.expiration_time < 0
		|| !Number.isSafeInteger(exchangeRate.next_rate.cent_equivalent)
		|| exchangeRate.next_rate.cent_equivalent < 0
		|| !Number.isSafeInteger(exchangeRate.next_rate.hbar_equivalent)
		|| exchangeRate.next_rate.hbar_equivalent < 0
		|| !Number.isSafeInteger(exchangeRate.next_rate.expiration_time)
		|| exchangeRate.next_rate.expiration_time < 0
	)
		throw new Error('HederaMirrorNode_Rest: malformed network exchange rate')

	return {
		currentRateCentEquivalent: BigInt(exchangeRate.current_rate.cent_equivalent),
		currentRateHbarEquivalent: BigInt(exchangeRate.current_rate.hbar_equivalent),
		currentRateExpirationTime: String(exchangeRate.current_rate.expiration_time),
		nextRateCentEquivalent: BigInt(exchangeRate.next_rate.cent_equivalent),
		nextRateHbarEquivalent: BigInt(exchangeRate.next_rate.hbar_equivalent),
		nextRateExpirationTime: String(exchangeRate.next_rate.expiration_time),
	}
}

const networkFeeFields = (
	fees: HederaMirrorNodeNetworkFees,
	transactionType: string
) => {
	timestampMs(fees.timestamp, 'network fees timestamp')
	if (transactionType.length === 0)
		throw new Error('HederaMirrorNode_Rest: malformed fee transaction type')
	const fee = fees.fees.find((row) => row.transaction_type === transactionType)
	if (fee == null)
		throw new Error('HederaMirrorNode_Rest: fee transaction type not found')
	if (fee.transaction_type !== transactionType)
		throw new Error('HederaMirrorNode_Rest: response fee does not match request')

	return {
		transactionType,
		...(
			fee.gas != null
			&& Number.isSafeInteger(fee.gas)
			&& fee.gas >= 0
			&& {
				gasTinybar: BigInt(fee.gas),
			}
		),
		...(
			fee.fees?.base != null
			&& Number.isSafeInteger(fee.fees.base)
			&& fee.fees.base >= 0
			&& {
				baseTinycent: BigInt(fee.fees.base),
			}
		),
		...(
			fee.fees?.node != null
			&& Number.isSafeInteger(fee.fees.node)
			&& fee.fees.node >= 0
			&& {
				nodeTinycent: BigInt(fee.fees.node),
			}
		),
		...(
			fee.fees?.network != null
			&& Number.isSafeInteger(fee.fees.network)
			&& fee.fees.network >= 0
			&& {
				networkTinycent: BigInt(fee.fees.network),
			}
		),
		...(
			fee.fees?.service != null
			&& Number.isSafeInteger(fee.fees.service)
			&& fee.fees.service >= 0
			&& {
				serviceTinycent: BigInt(fee.fees.service),
			}
		),
		...(
			fee.fees?.total != null
			&& Number.isSafeInteger(fee.fees.total)
			&& fee.fees.total >= 0
			&& {
				totalTinycent: BigInt(fee.fees.total),
			}
		),
	}
}

const nodeSnapshot = (
	network: EntitySelector<typeof schema, EntityType.Network>,
	node: HederaMirrorNodeNode
) => {
	const nodeId = nonnegativeSafeInteger(Number(node.node_id), 'node ID')
	if (String(nodeId) !== node.node_id)
		throw new Error('HederaMirrorNode_Rest: malformed node ID')
	const nodeAccountId = hederaEntityId(node.node_account_id, 'node account ID')
	hederaEntityId(node.file_id, 'node file ID')
	const nodeTimestampMs = timestampMs(node.timestamp.from, 'node timestamp')
	if (node.timestamp.to != null)
		timestampMs(node.timestamp.to, 'node timestamp')
	timestampMs(node.staking_period.from, 'node staking period')
	if (node.staking_period.to != null)
		timestampMs(node.staking_period.to, 'node staking period')
	if (node.description.length === 0)
		throw new Error('HederaMirrorNode_Rest: malformed node description')
	// Transport leftovers: decline_reward / reward_rate_start / associated_registered_nodes / admin_key —
	// unenrolled on HederaNode_Timestamp (deleted remains enrolled but absent from Mirror Node wire).
	nonnegativeBigInt(node.reward_rate_start, 'node reward rate start')
	for (const associatedNodeId of node.associated_registered_nodes)
		nonnegativeSafeInteger(Number(associatedNodeId), 'associated registered node ID')

	const nodeSelector = {
		$network: network,
		nodeId,
	}

	return {
		nodeId,
		$$timestamps: [
			{
				[EntityMetaKey.Selector]: {
					$node: nodeSelector,
					timestampMs: nodeTimestampMs,
					source: Source.HederaMirrorNode_Rest,
				},
				[EntityMetaKey.Fields]: {
					[entityFieldAddressKey(EntityType.HederaNode_Timestamp, [], 'nodeAccountId')]: nodeAccountId,
					[entityFieldAddressKey(EntityType.HederaNode_Timestamp, [], '$account')]: {
						[EntityMetaKey.Selector]: {
							$network: network,
							accountId: nodeAccountId,
						},
					},
					[entityFieldAddressKey(EntityType.HederaNode_Timestamp, [], 'description')]: node.description,
					[entityFieldAddressKey(EntityType.HederaNode_Timestamp, [], 'fileId')]: node.file_id,
					[entityFieldAddressKey(EntityType.HederaNode_Timestamp, [], 'memo')]: node.memo,
					[entityFieldAddressKey(EntityType.HederaNode_Timestamp, [], 'publicKey')]: node.public_key,
					[entityFieldAddressKey(EntityType.HederaNode_Timestamp, [], 'nodeCertHash')]: node.node_cert_hash,
					[entityFieldAddressKey(EntityType.HederaNode_Timestamp, [], 'serviceEndpoints')]: node.service_endpoints,
					[entityFieldAddressKey(EntityType.HederaNode_Timestamp, [], 'stakeTinybar')]: nonnegativeBigInt(node.stake, 'node stake'),
					[entityFieldAddressKey(EntityType.HederaNode_Timestamp, [], 'stakeRewardedTinybar')]: nonnegativeBigInt(node.stake_rewarded, 'node stake rewarded'),
					[entityFieldAddressKey(EntityType.HederaNode_Timestamp, [], 'stakeNotRewardedTinybar')]: nonnegativeBigInt(node.stake_not_rewarded, 'node stake not rewarded'),
					[entityFieldAddressKey(EntityType.HederaNode_Timestamp, [], 'minStakeTinybar')]: nonnegativeBigInt(node.min_stake, 'node min stake'),
					[entityFieldAddressKey(EntityType.HederaNode_Timestamp, [], 'maxStakeTinybar')]: nonnegativeBigInt(node.max_stake, 'node max stake'),
				},
			},
		],
	}
}

const hederaTimestampOrderKey = (
	value: string,
	fieldName: string
) => {
	const match = /^(\d{1,10})(?:\.(\d{1,9}))?$/.exec(value)
	if (match == null)
		throw new Error(`HederaMirrorNode_Rest: malformed ${fieldName}`)

	return (
		BigInt(match[1]) * 1_000_000_000n
		+ BigInt((
			value.includes('.') ?
				value.slice(value.indexOf('.') + 1)
			:
				''
		).padEnd(9, '0'))
	)
}

const blockContainsConsensusTimestamp = (
	block: HederaMirrorNodeBlock,
	consensusTimestamp: string
) => {
	const consensusKey = hederaTimestampOrderKey(consensusTimestamp, 'transaction consensus timestamp')
	const fromKey = hederaTimestampOrderKey(block.timestamp.from, 'block consensus start')
	if (consensusKey < fromKey)
		return false
	if (block.timestamp.to == null)
		return true

	return consensusKey < hederaTimestampOrderKey(block.timestamp.to, 'block consensus end')
}

const hederaAllowanceSnapshot = (
	allowanceSelector: HederaAllowanceSelector,
	allowance:
		| HederaMirrorNodeCryptoAllowance
		| HederaMirrorNodeTokenAllowance
		| HederaMirrorNodeNftAllowance
) => {
	const allowanceTimestampMs = timestampMs(allowance.timestamp.to, 'allowance timestamp')
	timestampMs(allowance.timestamp.from, 'allowance timestamp')

	return {
		...(allowanceSelector.tokenId != null && {
			$token: {
				[EntityMetaKey.Selector]: {
					$network: allowanceSelector.$owner.$network,
					tokenId: allowanceSelector.tokenId,
				},
			},
		}),
		$$timestamps: [{
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
		}],
	}
}

const resolveHederaAllowance = async (
	allowanceSelector: HederaAllowanceSelector
) => {
	assertHederaMainnet(allowanceSelector.$owner.$network)
	assertHederaMainnet(allowanceSelector.$spender.$network)
	if (allowanceSelector.serialNumber != null)
		throw new Error('HederaMirrorNode_Rest: serial-specific NFT allowances are unsupported')

	const { getAccountAllowance } = await import('$/sources/HederaMirrorNode/Rest/queries.ts')
	const snapshot = await getAccountAllowance({
		accountId: allowanceSelector.$owner.accountId,
		spenderAccountId: allowanceSelector.$spender.accountId,
		allowanceKind: allowanceSelector.allowanceKind === 'crypto' ? 'crypto'
		: allowanceSelector.allowanceKind === 'token' ? 'token'
		: allowanceSelector.allowanceKind === 'nft' ? 'nft'
		:
			(() => {
				throw new Error('HederaMirrorNode_Rest: unsupported allowance kind')
			})(),
		tokenId: allowanceSelector.tokenId,
	})

	return hederaAllowanceSnapshot(allowanceSelector, snapshot.allowance)
}

const hederaTokenAssociationSnapshot = (
	associationSelector: EntitySelector<typeof schema, EntityType.HederaTokenAssociation>,
	token: HederaMirrorNodeAccountToken,
	resolvedAtMs: number
) => {
	timestampMs(token.created_timestamp, 'token association creation timestamp')
	if (token.freeze_status.length === 0 || token.kyc_status.length === 0)
		throw new Error('HederaMirrorNode_Rest: malformed token relationship status')

	return {
		$token: {
			[EntityMetaKey.Selector]: associationSelector.$token,
			[EntityMetaKey.Fields]: {
				[entityFieldAddressKey(EntityType.HederaToken, [], 'decimals')]: nonnegativeSafeInteger(token.decimals, 'token decimals'),
			},
		},
		$$timestamps: [{
			[EntityMetaKey.Selector]: {
				$association: associationSelector,
				timestampMs: resolvedAtMs,
				source: Source.HederaMirrorNode_Rest,
			},
			[EntityMetaKey.Fields]: {
				[entityFieldAddressKey(EntityType.HederaTokenAssociation_Timestamp, [], 'associationStatus')]: token.automatic_association ? 'automatic' : 'manual',
				[entityFieldAddressKey(EntityType.HederaTokenAssociation_Timestamp, [], 'balance')]: nonnegativeBigInt(token.balance, 'token relationship balance'),
				[entityFieldAddressKey(EntityType.HederaTokenAssociation_Timestamp, [], 'kycStatus')]: token.kyc_status,
				[entityFieldAddressKey(EntityType.HederaTokenAssociation_Timestamp, [], 'freezeStatus')]: token.freeze_status,
			},
		}],
	}
}

const normalizeEvmAddress = (
	value: string,
	fieldName: string
) => {
	const evmAddress = value.startsWith('0x') ?
		value.toLowerCase()
	:
		`0x${value.toLowerCase()}`
	if (!/^0x[0-9a-f]{40}$/.test(evmAddress))
		throw new Error(`HederaMirrorNode_Rest: malformed ${fieldName}`)

	return evmAddress
}

const contractResultRow = (
	network: EntitySelector<typeof schema, EntityType.Network>,
	transactionSelector: EntitySelector<typeof schema, EntityType.HederaTransaction>,
	result: HederaMirrorNodeContractResult
) => {
	timestampMs(result.timestamp, 'contract result timestamp')
	if (
		'consensusTimestamp' in transactionSelector
		&& result.timestamp !== transactionSelector.consensusTimestamp
	)
		throw new Error('HederaMirrorNode_Rest: response contract result does not match request')
	if (result.status.length === 0)
		throw new Error('HederaMirrorNode_Rest: malformed contract result status')
	if (result.result.length === 0)
		throw new Error('HederaMirrorNode_Rest: malformed contract result')
	if (result.hash.length === 0)
		throw new Error('HederaMirrorNode_Rest: malformed contract result hash')
	nonnegativeSafeInteger(result.gas_limit, 'contract gas limit')
	if (result.gas_used != null)
		nonnegativeSafeInteger(result.gas_used, 'contract gas used')
	if (result.gas_consumed != null)
		nonnegativeSafeInteger(result.gas_consumed, 'contract gas consumed')
	if (result.block_number != null)
		nonnegativeSafeInteger(result.block_number, 'contract result block number')
	if (result.block_gas_used != null)
		nonnegativeSafeInteger(result.block_gas_used, 'contract result block gas used')
	if (result.transaction_index != null)
		nonnegativeSafeInteger(result.transaction_index, 'contract result transaction index')
	if (result.nonce != null)
		nonnegativeSafeInteger(result.nonce, 'contract result nonce')
	if (result.type != null)
		nonnegativeSafeInteger(result.type, 'contract result type')
	if (result.v != null)
		nonnegativeSafeInteger(result.v, 'contract result v')
	if (result.bloom != null && result.bloom.length === 0)
		throw new Error('HederaMirrorNode_Rest: malformed contract result bloom')
	if (result.function_parameters != null && result.function_parameters.length === 0)
		throw new Error('HederaMirrorNode_Rest: malformed contract function parameters')
	if (result.error_message != null && result.error_message.length === 0)
		throw new Error('HederaMirrorNode_Rest: malformed contract error message')
	if (result.block_hash != null && result.block_hash.length === 0)
		throw new Error('HederaMirrorNode_Rest: malformed contract result block hash')
	if (result.call_result != null && result.call_result.length === 0)
		throw new Error('HederaMirrorNode_Rest: malformed contract call result')
	if (result.failed_initcode != null && result.failed_initcode.length === 0)
		throw new Error('HederaMirrorNode_Rest: malformed failed initcode')
	if (result.created_contract_ids != null) {
		for (const createdContractId of result.created_contract_ids)
			hederaEntityId(createdContractId, 'created contract ID')
	}
	if (result.from != null)
		normalizeEvmAddress(result.from, 'contract result from address')
	if (result.to != null)
		normalizeEvmAddress(result.to, 'contract result to address')
	const contractId = result.contract_id == null ?
		undefined
	:
		hederaEntityId(result.contract_id, 'contract ID')
	const evmAddress = result.address == null ?
		undefined
	:
		normalizeEvmAddress(result.address, 'contract EVM address')

	return {
		[EntityMetaKey.Selector]: {
			$transaction: transactionSelector,
		},
		[EntityMetaKey.Fields]: {
			...(contractId != null && {
				[entityFieldAddressKey(EntityType.HederaContractResult, [], '$contract')]: {
					[EntityMetaKey.Selector]: {
						$network: network,
						contractId,
					},
				},
				[entityFieldAddressKey(EntityType.HederaContractResult, [], 'contractId')]: contractId,
			}),
			...(evmAddress != null && {
				[entityFieldAddressKey(EntityType.HederaContractResult, [], 'evmAddress')]: evmAddress,
			}),
			...(
				/^0x[0-9a-fA-F]{64}$/.test(result.hash)
				&& {
					[entityFieldAddressKey(EntityType.HederaContractResult, [], 'ethereumHash')]: result.hash.toLowerCase(),
				}
			),
			...(result.function_parameters != null && {
				[entityFieldAddressKey(EntityType.HederaContractResult, [], 'functionParameters')]: result.function_parameters,
			}),
			[entityFieldAddressKey(EntityType.HederaContractResult, [], 'gasLimit')]: BigInt(result.gas_limit),
			...(result.gas_used != null && {
				[entityFieldAddressKey(EntityType.HederaContractResult, [], 'gasUsed')]: BigInt(result.gas_used),
			}),
			...(result.amount != null && {
				[entityFieldAddressKey(EntityType.HederaContractResult, [], 'amountTinybar')]: nonnegativeBigInt(result.amount, 'contract result amount'),
			}),
			[entityFieldAddressKey(EntityType.HederaContractResult, [], 'status')]: result.status,
			...(result.error_message != null && {
				[entityFieldAddressKey(EntityType.HederaContractResult, [], 'errorMessage')]: result.error_message,
			}),
			...(result.bloom != null && {
				[entityFieldAddressKey(EntityType.HederaContractResult, [], 'bloom')]: result.bloom,
			}),
		},
	}
}

const contractResultRef = (
	network: EntitySelector<typeof schema, EntityType.Network>,
	contract: EntitySelector<typeof schema, EntityType.HederaContract>,
	result: HederaMirrorNodeContractResult
) => {
	if (
		result.contract_id != null
		&& result.contract_id !== contract.contractId
	)
		throw new Error('HederaMirrorNode_Rest: response contract result does not match request')

	const transactionSelector = {
		$network: network,
		consensusTimestamp: result.timestamp,
	}

	return contractResultRow(
		network,
		transactionSelector,
		result
	)
}

const contractLogRef = (
	network: EntitySelector<typeof schema, EntityType.Network>,
	contract: EntitySelector<typeof schema, EntityType.HederaContract>,
	log: HederaMirrorNodeContractLog
) => {
	if (log.contract_id !== contract.contractId)
		throw new Error('HederaMirrorNode_Rest: response contract log does not match request')

	timestampMs(log.timestamp, 'contract log timestamp')
	nonnegativeSafeInteger(log.index, 'contract log index')
	if (log.block_hash.length === 0)
		throw new Error('HederaMirrorNode_Rest: malformed contract log block hash')
	nonnegativeSafeInteger(log.block_number, 'contract log block number')
	if (log.transaction_hash.length === 0)
		throw new Error('HederaMirrorNode_Rest: malformed contract log transaction hash')
	if (log.transaction_index != null)
		nonnegativeSafeInteger(log.transaction_index, 'contract log transaction index')
	if (log.bloom != null && log.bloom.length === 0)
		throw new Error('HederaMirrorNode_Rest: malformed contract log bloom')
	if (log.data != null && log.data.length === 0)
		throw new Error('HederaMirrorNode_Rest: malformed contract log data')

	const contractSelector = {
		$network: network,
		contractId: contract.contractId,
	}
	const transactionSelector = {
		$network: network,
		consensusTimestamp: log.timestamp,
	}

	return {
		[EntityMetaKey.Selector]: {
			$contract: contractSelector,
			consensusTimestamp: log.timestamp,
			logIndex: log.index,
		},
		[EntityMetaKey.Fields]: {
			[entityFieldAddressKey(EntityType.HederaContractLog, [], '$result')]: {
				[EntityMetaKey.Selector]: {
					$transaction: transactionSelector,
				},
			},
			[entityFieldAddressKey(EntityType.HederaContractLog, [], '$contract')]: {
				[EntityMetaKey.Selector]: contractSelector,
			},
			...(log.address != null && {
				[entityFieldAddressKey(EntityType.HederaContractLog, [], 'address')]: normalizeEvmAddress(log.address, 'contract log address'),
			}),
			...(log.bloom != null && {
				[entityFieldAddressKey(EntityType.HederaContractLog, [], 'bloom')]: log.bloom,
			}),
			...(log.data != null && {
				[entityFieldAddressKey(EntityType.HederaContractLog, [], 'data')]: log.data,
			}),
			[entityFieldAddressKey(EntityType.HederaContractLog, [], 'topics')]: log.topics,
		},
	}
}

const transactionJoins = async (
	network: EntitySelector<typeof schema, EntityType.Network>,
	transaction: HederaMirrorNodeTransaction
) => {
	const {
		getBlockByConsensusTimestamp,
		getContractResultByTransactionIdNonce,
		getSchedule,
		getTransactionByIdNonce,
	} = await import('$/sources/HederaMirrorNode/Rest/queries.ts')

	const scheduleId = (
		transaction.name === 'SCHEDULECREATE'
		&& transaction.entity_id != null
	) ?
		hederaEntityId(transaction.entity_id, 'schedule ID')
	: transaction.scheduled ?
		await (async () => {
			const siblings = await getTransactionByIdNonce(
				transaction.transaction_id,
				transaction.nonce,
				false
			)
			const scheduleCreate = siblings.transactions.find((sibling) => (
				sibling.name === 'SCHEDULECREATE'
				&& sibling.entity_id != null
			))
			if (scheduleCreate?.entity_id == null)
				throw new Error('HederaMirrorNode_Rest: scheduled transaction missing schedule create sibling')

			return hederaEntityId(scheduleCreate.entity_id, 'schedule ID')
		})()
	:
		undefined

	const [
		block,
		schedule,
		contractResult,
	] = await Promise.all([
		getBlockByConsensusTimestamp(transaction.consensus_timestamp),
		scheduleId == null ?
			Promise.resolve(undefined)
		:
			getSchedule(scheduleId).then((row) => {
				if (row.schedule_id !== scheduleId)
					throw new Error('HederaMirrorNode_Rest: response schedule does not match request')
				if (
					transaction.scheduled
					&& row.executed_timestamp !== transaction.consensus_timestamp
				)
					throw new Error('HederaMirrorNode_Rest: schedule execution timestamp does not match request')
				timestampMs(row.consensus_timestamp, 'schedule consensus timestamp')
				if (row.executed_timestamp != null)
					timestampMs(row.executed_timestamp, 'schedule executed timestamp')
				if (row.expiration_time != null)
					timestampMs(row.expiration_time, 'schedule expiration time')
				if (row.creator_account_id != null)
					hederaEntityId(row.creator_account_id, 'schedule creator')
				if (row.payer_account_id != null)
					hederaEntityId(row.payer_account_id, 'schedule payer')
				for (const signature of row.signatures)
					timestampMs(signature.consensus_timestamp, 'schedule signature timestamp')

				return row
			}),
		getContractResultByTransactionIdNonce(
			transaction.transaction_id,
			transaction.nonce
		),
	])

	if (block != null && !blockContainsConsensusTimestamp(block, transaction.consensus_timestamp))
		throw new Error('HederaMirrorNode_Rest: response block does not contain transaction')

	if (
		contractResult != null
		&& contractResult.timestamp !== transaction.consensus_timestamp
	)
		throw new Error('HederaMirrorNode_Rest: response contract result does not match request')

	return {
		block,
		schedule,
		contractResult,
	}
}

const topicObservation = (
	network: EntitySelector<typeof schema, EntityType.Network>,
	topic: HederaMirrorNodeTopic
) => {
	const topicId = hederaEntityId(topic.topic_id ?? '', 'topic ID')
	const topicTimestampMs = timestampMs(topic.timestamp.from, 'topic timestamp')
	if (topic.timestamp.to != null)
		timestampMs(topic.timestamp.to, 'topic timestamp')
	if (topic.auto_renew_account != null)
		hederaEntityId(topic.auto_renew_account, 'topic auto renew account')
	if (topic.auto_renew_period != null)
		nonnegativeSafeInteger(topic.auto_renew_period, 'topic auto renew period')
	if (topic.sequence_number != null)
		nonnegativeBigInt(topic.sequence_number, 'topic sequence number')

	return {
		$topic: {
			[EntityMetaKey.Selector]: {
				$network: network,
				topicId,
			},
		},
		timestampMs: topicTimestampMs,
		source: Source.HederaMirrorNode_Rest,
		memo: topic.memo,
		...(topic.admin_key != null && {
			adminKey: topic.admin_key,
		}),
		...(topic.submit_key != null && {
			submitKey: topic.submit_key,
		}),
		...(topic.auto_renew_account != null && {
			autoRenewAccountId: topic.auto_renew_account,
		}),
		...(topic.auto_renew_period != null && {
			autoRenewPeriodSeconds: topic.auto_renew_period,
		}),
		...(topic.fee_schedule_key != null && {
			feeScheduleKey: topic.fee_schedule_key,
		}),
		feeExemptKeys: topic.fee_exempt_key_list,
		...(topic.custom_fees != null && {
			customFees: topic.custom_fees,
		}),
		...(topic.deleted != null && {
			deleted: topic.deleted,
		}),
		...(topic.sequence_number != null && {
			sequenceNumber: nonnegativeBigInt(topic.sequence_number, 'topic sequence number'),
		}),
		...(topic.running_hash != null && {
			runningHash: topic.running_hash,
		}),
	}
}

const topicSnapshot = (
	network: EntitySelector<typeof schema, EntityType.Network>,
	topic: HederaMirrorNodeTopic
) => {
	const observation = topicObservation(network, topic)
	const topicSelector = observation.$topic[EntityMetaKey.Selector]

	return {
		topicId: topicSelector.topicId,
		$$timestamps: [{
			[EntityMetaKey.Selector]: {
				$topic: topicSelector,
				timestampMs: observation.timestampMs,
				source: observation.source,
			},
			[EntityMetaKey.Fields]: {
				[entityFieldAddressKey(EntityType.HederaTopic_Timestamp, [], 'memo')]: observation.memo,
				...(observation.adminKey != null && {
					[entityFieldAddressKey(EntityType.HederaTopic_Timestamp, [], 'adminKey')]: observation.adminKey,
				}),
				...(observation.submitKey != null && {
					[entityFieldAddressKey(EntityType.HederaTopic_Timestamp, [], 'submitKey')]: observation.submitKey,
				}),
				...(observation.autoRenewAccountId != null && {
					[entityFieldAddressKey(EntityType.HederaTopic_Timestamp, [], 'autoRenewAccountId')]: observation.autoRenewAccountId,
				}),
				...(observation.autoRenewPeriodSeconds != null && {
					[entityFieldAddressKey(EntityType.HederaTopic_Timestamp, [], 'autoRenewPeriodSeconds')]: observation.autoRenewPeriodSeconds,
				}),
				...(observation.feeScheduleKey != null && {
					[entityFieldAddressKey(EntityType.HederaTopic_Timestamp, [], 'feeScheduleKey')]: observation.feeScheduleKey,
				}),
				[entityFieldAddressKey(EntityType.HederaTopic_Timestamp, [], 'feeExemptKeys')]: observation.feeExemptKeys,
				...(observation.customFees != null && {
					[entityFieldAddressKey(EntityType.HederaTopic_Timestamp, [], 'customFees')]: observation.customFees,
				}),
				...(observation.deleted != null && {
					[entityFieldAddressKey(EntityType.HederaTopic_Timestamp, [], 'deleted')]: observation.deleted,
				}),
				...(observation.sequenceNumber != null && {
					[entityFieldAddressKey(EntityType.HederaTopic_Timestamp, [], 'sequenceNumber')]: observation.sequenceNumber,
				}),
				...(observation.runningHash != null && {
					[entityFieldAddressKey(EntityType.HederaTopic_Timestamp, [], 'runningHash')]: observation.runningHash,
				}),
			},
		}],
	}
}

const topicMessageFields = (
	topic: {
		$network: EntitySelector<typeof schema, EntityType.Network>
		topicId: string
	},
	message: HederaMirrorNodeTopicMessage
) => {
	if (message.topic_id !== topic.topicId)
		throw new Error('HederaMirrorNode_Rest: topic message does not match subject')
	const sequenceNumber = nonnegativeBigInt(message.sequence_number, 'topic message sequence number')
	timestampMs(message.consensus_timestamp, 'topic message consensus timestamp')
	if (message.payer_account_id != null)
		hederaEntityId(message.payer_account_id, 'topic message payer account')

	return {
		[EntityMetaKey.Selector]: {
			$topic: topic,
			sequenceNumber,
		},
		[EntityMetaKey.Fields]: {
			[entityFieldAddressKey(EntityType.HederaTopicMessage, [], 'consensusTimestamp')]: message.consensus_timestamp,
			[entityFieldAddressKey(EntityType.HederaTopicMessage, [], 'runningHash')]: message.running_hash,
			...(message.payer_account_id != null && {
				[entityFieldAddressKey(EntityType.HederaTopicMessage, [], 'payerAccount')]: message.payer_account_id,
			}),
			[entityFieldAddressKey(EntityType.HederaTopicMessage, [], 'message')]: message.message,
			...(message.chunk_info != null && {
				[entityFieldAddressKey(EntityType.HederaTopicMessage, [], 'chunkInfo')]: message.chunk_info,
			}),
		},
	}
}

const tokenCustomFeeRows = (
	network: EntitySelector<typeof schema, EntityType.Network>,
	tokenTimestamp: {
		$token: {
			$network: EntitySelector<typeof schema, EntityType.Network>
			tokenId: string
		}
		timestampMs: number
		source: Source.HederaMirrorNode_Rest
	},
	customFees: HederaMirrorNodeCustomFees
) => [
	...customFees.fixed_fees.map((fee) => {
		if (fee.collector_account_id != null)
			hederaEntityId(fee.collector_account_id, 'custom fee collector account')
		if (fee.denominating_token_id != null)
			hederaEntityId(fee.denominating_token_id, 'custom fee denominating token')
		return {
			feeKind: 'fixed',
			...(fee.collector_account_id != null && {
				collectorAccountId: fee.collector_account_id,
				$collector: {
					[EntityMetaKey.Selector]: {
						$network: network,
						accountId: fee.collector_account_id,
					},
				},
			}),
			...(fee.denominating_token_id != null && {
				denominatingTokenId: fee.denominating_token_id,
				$denominatingToken: {
					[EntityMetaKey.Selector]: {
						$network: network,
						tokenId: fee.denominating_token_id,
					},
				},
			}),
			amount: nonnegativeBigInt(String(fee.amount), 'custom fixed fee amount'),
			...(fee.all_collectors_are_exempt != null && {
				allCollectorsAreExempt: fee.all_collectors_are_exempt,
			}),
		}
	}),
	...(customFees.fractional_fees ?? []).map((fee) => {
		if (fee.collector_account_id != null)
			hederaEntityId(fee.collector_account_id, 'custom fee collector account')
		if (fee.denominating_token_id != null)
			hederaEntityId(fee.denominating_token_id, 'custom fee denominating token')
		return {
			feeKind: 'fractional',
			...(fee.collector_account_id != null && {
				collectorAccountId: fee.collector_account_id,
				$collector: {
					[EntityMetaKey.Selector]: {
						$network: network,
						accountId: fee.collector_account_id,
					},
				},
			}),
			...(fee.denominating_token_id != null && {
				denominatingTokenId: fee.denominating_token_id,
				$denominatingToken: {
					[EntityMetaKey.Selector]: {
						$network: network,
						tokenId: fee.denominating_token_id,
					},
				},
			}),
			numerator: nonnegativeBigInt(String(fee.amount.numerator), 'custom fractional fee numerator'),
			denominator: nonnegativeBigInt(String(fee.amount.denominator), 'custom fractional fee denominator'),
			minimumAmount: nonnegativeBigInt(String(fee.minimum), 'custom fractional fee minimum'),
			maximumAmount: nonnegativeBigInt(String(fee.maximum), 'custom fractional fee maximum'),
			netOfTransfers: fee.net_of_transfers,
			...(fee.all_collectors_are_exempt != null && {
				allCollectorsAreExempt: fee.all_collectors_are_exempt,
			}),
		}
	}),
	...(customFees.royalty_fees ?? []).map((fee) => {
		if (fee.collector_account_id != null)
			hederaEntityId(fee.collector_account_id, 'custom fee collector account')
		if (fee.fallback_fee?.denominating_token_id != null)
			hederaEntityId(fee.fallback_fee.denominating_token_id, 'custom fee denominating token')
		return {
			feeKind: 'royalty',
			...(fee.collector_account_id != null && {
				collectorAccountId: fee.collector_account_id,
				$collector: {
					[EntityMetaKey.Selector]: {
						$network: network,
						accountId: fee.collector_account_id,
					},
				},
			}),
			numerator: nonnegativeBigInt(String(fee.amount.numerator), 'custom royalty fee numerator'),
			denominator: nonnegativeBigInt(String(fee.amount.denominator), 'custom royalty fee denominator'),
			...(fee.fallback_fee != null && {
				amount: nonnegativeBigInt(String(fee.fallback_fee.amount), 'custom royalty fallback fee amount'),
				...(fee.fallback_fee.denominating_token_id != null && {
					denominatingTokenId: fee.fallback_fee.denominating_token_id,
					$denominatingToken: {
						[EntityMetaKey.Selector]: {
							$network: network,
							tokenId: fee.fallback_fee.denominating_token_id,
						},
					},
				}),
			}),
			...(fee.all_collectors_are_exempt != null && {
				allCollectorsAreExempt: fee.all_collectors_are_exempt,
			}),
		}
	}),
].map((fields, feeIndex) => ({
	[EntityMetaKey.Selector]: {
		$tokenTimestamp: tokenTimestamp,
		feeIndex,
	},
	[EntityMetaKey.Fields]: Object.fromEntries(Object.entries(fields).map(([field, value]) => [
		entityFieldAddressKey(EntityType.HederaTokenCustomFee, [], field),
		value,
	])),
}))

const tokenSnapshot = (
	network: EntitySelector<typeof schema, EntityType.Network>,
	token: HederaMirrorNodeToken
) => {
	const tokenId = hederaEntityId(token.token_id ?? '', 'token ID')
	const tokenTimestampMs = timestampMs(token.modified_timestamp, 'token modification timestamp')
	timestampMs(token.created_timestamp, 'token creation timestamp')
	if (token.decimals != null)
		nonnegativeSafeInteger(token.decimals, 'token decimals')
	if (token.max_supply != null)
		nonnegativeBigInt(token.max_supply, 'token maximum supply')
	nonnegativeBigInt(token.total_supply, 'token total supply')
	if (token.treasury_account_id != null)
		hederaEntityId(token.treasury_account_id, 'token treasury account')
	if (token.auto_renew_account != null)
		hederaEntityId(token.auto_renew_account, 'token auto renew account')
	if (token.auto_renew_period != null)
		nonnegativeSafeInteger(token.auto_renew_period, 'token auto renew period')
	if (token.expiry_timestamp != null)
		timestampMs(token.expiry_timestamp, 'token expiry timestamp')
	if (token.type.length === 0)
		throw new Error('HederaMirrorNode_Rest: malformed token type')

	const tokenSelector = {
		$network: network,
		tokenId,
	}
	return {
		tokenId,
		tokenType: token.type,
		...(token.supply_type != null && {
			supplyType: token.supply_type,
		}),
		...(token.decimals != null && {
			decimals: token.decimals,
		}),
		$$timestamps: [{
			[EntityMetaKey.Selector]: {
				$token: tokenSelector,
				timestampMs: tokenTimestampMs,
				source: Source.HederaMirrorNode_Rest,
			},
			[EntityMetaKey.Fields]: {
				[entityFieldAddressKey(EntityType.HederaToken_Timestamp, [], 'name')]: token.name,
				[entityFieldAddressKey(EntityType.HederaToken_Timestamp, [], 'symbol')]: token.symbol,
				[entityFieldAddressKey(EntityType.HederaToken_Timestamp, [], 'totalSupply')]: nonnegativeBigInt(token.total_supply, 'token total supply'),
				...(token.max_supply != null && {
					[entityFieldAddressKey(EntityType.HederaToken_Timestamp, [], 'maxSupply')]: nonnegativeBigInt(token.max_supply, 'token maximum supply'),
				}),
				...(token.treasury_account_id != null && {
					[entityFieldAddressKey(EntityType.HederaToken_Timestamp, [], 'treasuryAccount')]: token.treasury_account_id,
				}),
				...(token.supply_key != null && {
					[entityFieldAddressKey(EntityType.HederaToken_Timestamp, [], 'supplyKey')]: token.supply_key,
				}),
				...(token.admin_key != null && {
					[entityFieldAddressKey(EntityType.HederaToken_Timestamp, [], 'adminKey')]: token.admin_key,
				}),
				...(token.freeze_key != null && {
					[entityFieldAddressKey(EntityType.HederaToken_Timestamp, [], 'freezeKey')]: token.freeze_key,
				}),
				...(token.wipe_key != null && {
					[entityFieldAddressKey(EntityType.HederaToken_Timestamp, [], 'wipeKey')]: token.wipe_key,
				}),
				...(token.kyc_key != null && {
					[entityFieldAddressKey(EntityType.HederaToken_Timestamp, [], 'kycKey')]: token.kyc_key,
				}),
				...(token.pause_key != null && {
					[entityFieldAddressKey(EntityType.HederaToken_Timestamp, [], 'pauseKey')]: token.pause_key,
				}),
				...(token.fee_schedule_key != null && {
					[entityFieldAddressKey(EntityType.HederaToken_Timestamp, [], 'feeScheduleKey')]: token.fee_schedule_key,
				}),
				...(token.deleted != null && {
					[entityFieldAddressKey(EntityType.HederaToken_Timestamp, [], 'deleted')]: token.deleted,
				}),
				...(token.pause_status != null && {
					[entityFieldAddressKey(EntityType.HederaToken_Timestamp, [], 'paused')]: token.pause_status === 'PAUSED',
				}),
				...(token.custom_fees != null && {
					[entityFieldAddressKey(EntityType.HederaToken_Timestamp, [], 'customFees')]: token.custom_fees,
					[entityFieldAddressKey(EntityType.HederaToken_Timestamp, [], '$$customFees')]: tokenCustomFeeRows(
						network,
						{
							$token: tokenSelector,
							timestampMs: tokenTimestampMs,
							source: Source.HederaMirrorNode_Rest,
						},
						token.custom_fees
					),
				}),
				...(token.expiry_timestamp != null && {
					[entityFieldAddressKey(EntityType.HederaToken_Timestamp, [], 'expiryTimestamp')]: token.expiry_timestamp,
				}),
			},
		}],
	}
}

const nftFields = (
	token: {
		$network: EntitySelector<typeof schema, EntityType.Network>
		tokenId: string
	},
	nft: HederaMirrorNodeNft
) => {
	if (nft.token_id !== token.tokenId)
		throw new Error('HederaMirrorNode_Rest: NFT does not match token subject')
	const serialNumber = nonnegativeBigInt(nft.serial_number, 'NFT serial number')
	const modifiedTimestampMs = timestampMs(nft.modified_timestamp, 'NFT modified timestamp')
	timestampMs(nft.created_timestamp, 'NFT creation timestamp')
	hederaEntityId(nft.account_id, 'NFT owner account')
	if (nft.delegating_spender != null)
		hederaEntityId(nft.delegating_spender, 'NFT delegating spender')
	if (nft.spender_id != null)
		hederaEntityId(nft.spender_id, 'NFT spender')

	const nftSelector = {
		$token: token,
		serialNumber,
	}
	return {
		[EntityMetaKey.Selector]: nftSelector,
		[EntityMetaKey.Fields]: {
			...(nft.metadata.length > 0 && {
				[entityFieldAddressKey(EntityType.HederaNft, [], 'metadata')]: nft.metadata,
			}),
			[entityFieldAddressKey(EntityType.HederaNft, [], 'createdTimestamp')]: nft.created_timestamp,
			[entityFieldAddressKey(EntityType.HederaNft, [], '$$timestamps')]: [{
				[EntityMetaKey.Selector]: {
					$nft: nftSelector,
					timestampMs: modifiedTimestampMs,
					source: Source.HederaMirrorNode_Rest,
				},
				[EntityMetaKey.Fields]: {
					[entityFieldAddressKey(EntityType.HederaNft_Timestamp, [], '$owner')]: {
						[EntityMetaKey.Selector]: {
							$network: token.$network,
							accountId: nft.account_id,
						},
					},
					[entityFieldAddressKey(EntityType.HederaNft_Timestamp, [], 'ownerAccountId')]: nft.account_id,
					[entityFieldAddressKey(EntityType.HederaNft_Timestamp, [], 'deleted')]: nft.deleted,
					...(nft.spender_id != null && {
						[entityFieldAddressKey(EntityType.HederaNft_Timestamp, [], 'spenderAccountId')]: nft.spender_id,
					}),
					[entityFieldAddressKey(EntityType.HederaNft_Timestamp, [], 'modifiedTimestamp')]: nft.modified_timestamp,
				},
			}],
		},
	}
}

const scheduleObservation = (
	network: EntitySelector<typeof schema, EntityType.Network>,
	schedule: HederaMirrorNodeSchedule
) => {
	const scheduleId = hederaEntityId(schedule.schedule_id, 'schedule ID')
	const scheduleTimestampMs = timestampMs(schedule.consensus_timestamp, 'schedule consensus timestamp')
	const executedTimestampMs = (
		schedule.executed_timestamp == null ?
			undefined
		:
			timestampMs(schedule.executed_timestamp, 'schedule executed timestamp')
	)
	const expirationTimestampMs = (
		schedule.expiration_time == null ?
			undefined
		:
			timestampMs(schedule.expiration_time, 'schedule expiration time')
	)
	if (
		(executedTimestampMs != null && executedTimestampMs < scheduleTimestampMs)
		|| (expirationTimestampMs != null && expirationTimestampMs < scheduleTimestampMs)
		|| (
			executedTimestampMs != null
			&& expirationTimestampMs != null
			&& executedTimestampMs > expirationTimestampMs
		)
	)
		throw new Error('HederaMirrorNode_Rest: reversed schedule lifecycle')

	return {
		$schedule: {
			[EntityMetaKey.Selector]: {
				$network: network,
				scheduleId,
			},
		},
		timestampMs: scheduleTimestampMs,
		source: Source.HederaMirrorNode_Rest,
		...(schedule.executed_timestamp != null && {
			executedTimestamp: schedule.executed_timestamp,
			$executionTransaction: {
				[EntityMetaKey.Selector]: {
					$network: network,
					consensusTimestamp: schedule.executed_timestamp,
				},
			},
		}),
		deleted: schedule.deleted,
		...(schedule.expiration_time != null && {
			expirationTime: schedule.expiration_time,
		}),
		waitForExpiry: schedule.wait_for_expiry,
		signatureCount: schedule.signatures.length,
	}
}

const scheduleSnapshot = (
	network: EntitySelector<typeof schema, EntityType.Network>,
	schedule: HederaMirrorNodeSchedule
) => {
	const scheduleId = hederaEntityId(schedule.schedule_id, 'schedule ID')
	if (schedule.creator_account_id != null)
		hederaEntityId(schedule.creator_account_id, 'schedule creator')
	if (schedule.payer_account_id != null)
		hederaEntityId(schedule.payer_account_id, 'schedule payer')
	if (schedule.transaction_body.length === 0)
		throw new Error('HederaMirrorNode_Rest: malformed schedule transaction body')

	const scheduleSelector = {
		$network: network,
		scheduleId,
	}
	const observation = scheduleObservation(network, schedule)
	const signaturePublicKeyPrefixes = new Set<string>()

	return {
		scheduleId,
		...(schedule.creator_account_id != null && {
			creatorAccountId: schedule.creator_account_id,
		}),
		...(schedule.payer_account_id != null && {
			payerAccountId: schedule.payer_account_id,
		}),
		transactionBody: schedule.transaction_body,
		$$timestamps: [{
			[EntityMetaKey.Selector]: {
				$schedule: scheduleSelector,
				timestampMs: observation.timestampMs,
				source: observation.source,
			},
			[EntityMetaKey.Fields]: {
				...(observation.executedTimestamp != null && {
					[entityFieldAddressKey(EntityType.HederaSchedule_Timestamp, [], 'executedTimestamp')]: observation.executedTimestamp,
					[entityFieldAddressKey(EntityType.HederaSchedule_Timestamp, [], '$executionTransaction')]: observation.$executionTransaction,
				}),
				[entityFieldAddressKey(EntityType.HederaSchedule_Timestamp, [], 'deleted')]: observation.deleted,
				...(observation.expirationTime != null && {
					[entityFieldAddressKey(EntityType.HederaSchedule_Timestamp, [], 'expirationTime')]: observation.expirationTime,
				}),
				[entityFieldAddressKey(EntityType.HederaSchedule_Timestamp, [], 'waitForExpiry')]: observation.waitForExpiry,
				[entityFieldAddressKey(EntityType.HederaSchedule_Timestamp, [], 'signatureCount')]: observation.signatureCount,
			},
		}],
		$$signatures: schedule.signatures.map((signature) => {
			if (signature.public_key_prefix.length === 0)
				throw new Error('HederaMirrorNode_Rest: malformed schedule signature public key prefix')
			const publicKeyPrefix = signature.public_key_prefix
			if (signaturePublicKeyPrefixes.has(publicKeyPrefix))
				throw new Error('HederaMirrorNode_Rest: duplicate schedule signer')

			signaturePublicKeyPrefixes.add(publicKeyPrefix)
			if (signature.consensus_timestamp.length > 0) {
				const signatureTimestampMs = timestampMs(signature.consensus_timestamp, 'schedule signature timestamp')
				if (
					signatureTimestampMs < observation.timestampMs
					|| (
						observation.executedTimestamp != null
						&& signatureTimestampMs > timestampMs(observation.executedTimestamp, 'schedule executed timestamp')
					)
					|| (
						observation.executedTimestamp == null
						&& observation.expirationTime != null
						&& signatureTimestampMs > timestampMs(observation.expirationTime, 'schedule expiration time')
					)
				)
					throw new Error('HederaMirrorNode_Rest: schedule signature lies outside the lifecycle')
			}

			return {
				[EntityMetaKey.Selector]: {
					$schedule: scheduleSelector,
					publicKeyPrefix: signature.public_key_prefix,
				},
				[EntityMetaKey.Fields]: {
					...(signature.consensus_timestamp.length > 0 && {
						[entityFieldAddressKey(EntityType.HederaScheduleSignature, [], 'consensusTimestamp')]: signature.consensus_timestamp,
					}),
					...(signature.signature.length > 0 && {
						[entityFieldAddressKey(EntityType.HederaScheduleSignature, [], 'signature')]: signature.signature,
					}),
				},
			}
		}),
	}
}

const transactionSnapshot = (
	network: EntitySelector<typeof schema, EntityType.Network>,
	transaction: HederaMirrorNodeTransaction,
	joins?: {
		block?: HederaMirrorNodeBlock
		schedule?: {
			schedule_id: string
			creator_account_id: string | null
			payer_account_id: string | null
			transaction_body: string
		}
		contractResult?: HederaMirrorNodeContractResult
	}
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
	// Transport leftovers: bytes / memo_base64 / max_fee / valid_duration_seconds / parent_consensus_timestamp /
	// high_volume* / staking_reward_transfers / batch_key — unenrolled beside projected HederaTransaction fields.
	if (transaction.valid_duration_seconds != null)
		nonnegativeBigInt(transaction.valid_duration_seconds, 'valid duration seconds')
	if (transaction.parent_consensus_timestamp != null)
		timestampMs(transaction.parent_consensus_timestamp, 'parent consensus timestamp')
	if (transaction.max_fee.length === 0)
		throw new Error('HederaMirrorNode_Rest: malformed max fee')
	nonnegativeBigInt(transaction.max_fee, 'max fee')
	if (
		!Number.isFinite(transaction.high_volume_pricing_multiplier)
		|| transaction.high_volume_pricing_multiplier < 0
	)
		throw new Error('HederaMirrorNode_Rest: malformed high volume pricing multiplier')

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
		$block: joins?.block == null ?
			undefined
		:
			((block) => ({
				[EntityMetaKey.Selector]: {
					$network: network,
					blockNumber: block.blockNumber,
				},
				[EntityMetaKey.Fields]: {
					[entityFieldAddressKey(EntityType.HederaBlock, [], 'blockHash')]: block.blockHash,
					[entityFieldAddressKey(EntityType.HederaBlock, [], 'consensusStartTimestamp')]: block.consensusStartTimestamp,
					[entityFieldAddressKey(EntityType.HederaBlock, [], 'consensusEndTimestamp')]: block.consensusEndTimestamp,
					...(block.gasUsed != null && {
						[entityFieldAddressKey(EntityType.HederaBlock, [], 'gasUsed')]: block.gasUsed,
					}),
					[entityFieldAddressKey(EntityType.HederaBlock, [], 'recordFileName')]: block.recordFileName,
					[entityFieldAddressKey(EntityType.HederaBlock, [], 'transactionCount')]: block.transactionCount,
				},
			}))(blockFields(joins.block)),
		$schedule: joins?.schedule == null ?
			undefined
		:
			{
				[EntityMetaKey.Selector]: {
					$network: network,
					scheduleId: joins.schedule.schedule_id,
				},
				[EntityMetaKey.Fields]: {
					...(joins.schedule.creator_account_id != null && {
						[entityFieldAddressKey(EntityType.HederaSchedule, [], 'creatorAccountId')]: joins.schedule.creator_account_id,
					}),
					...(joins.schedule.payer_account_id != null && {
						[entityFieldAddressKey(EntityType.HederaSchedule, [], 'payerAccountId')]: joins.schedule.payer_account_id,
					}),
					[entityFieldAddressKey(EntityType.HederaSchedule, [], 'transactionBody')]: joins.schedule.transaction_body,
				},
			},
		$$hbarTransfers: hbarTransfers,
		$$tokenTransfers: [
			...fungibleTokenTransfers,
			...nftTokenTransfers,
		],
		$$contractResults: joins?.contractResult == null ?
			[]
		:
			[
				contractResultRow(
					network,
					transactionSelector,
					joins.contractResult
				),
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
						// Transport leftovers: created_timestamp / ethereum_nonce / max_automatic_token_associations /
						// stake_period_start / balance.tokens — unenrolled on HederaAccount_Timestamp.
						if (account.created_timestamp != null)
							timestampMs(account.created_timestamp, 'account created timestamp')
						if (account.stake_period_start != null)
							timestampMs(account.stake_period_start, 'account stake period start')
						if (account.ethereum_nonce != null)
							nonnegativeSafeInteger(account.ethereum_nonce, 'ethereum nonce')
						if (account.max_automatic_token_associations != null)
							nonnegativeSafeInteger(account.max_automatic_token_associations, 'max automatic token associations')
						for (const tokenBalance of account.balance.tokens) {
							hederaEntityId(tokenBalance.token_id, 'account token balance token ID')
							nonnegativeBigInt(tokenBalance.balance, 'account token balance')
						}
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
						)).blocks.map((block) => {
							const fields = blockFields(block)

							return {
								[EntityMetaKey.Selector]: {
									$network: network,
									blockNumber: fields.blockNumber,
								},
								[EntityMetaKey.Fields]: {
									[entityFieldAddressKey(EntityType.HederaBlock, [], 'blockHash')]: fields.blockHash,
									[entityFieldAddressKey(EntityType.HederaBlock, [], 'consensusStartTimestamp')]: fields.consensusStartTimestamp,
									[entityFieldAddressKey(EntityType.HederaBlock, [], 'consensusEndTimestamp')]: fields.consensusEndTimestamp,
									...(fields.gasUsed != null && {
										[entityFieldAddressKey(EntityType.HederaBlock, [], 'gasUsed')]: fields.gasUsed,
									}),
									[entityFieldAddressKey(EntityType.HederaBlock, [], 'recordFileName')]: fields.recordFileName,
									[entityFieldAddressKey(EntityType.HederaBlock, [], 'transactionCount')]: fields.transactionCount,
								},
							}
						})
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
						const {
							getAccount,
							getAccountTokens,
						} = await import('$/sources/HederaMirrorNode/Rest/queries.ts')
						const [
							page,
							account,
						] = await Promise.all([
							getAccountTokens(
								hederaAccount.accountId,
								Math.min(resolverContextRowLimit(context), 100),
								context.providerContinuationToken
							),
							getAccount(hederaAccount.accountId),
						])

						return {
							page,
							resolvedAtMs: timestampMs(account.balance.timestamp, 'account balance timestamp'),
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

						const transaction = response.transactions[0]
						return transactionSnapshot(
							$network,
							transaction,
							await transactionJoins($network, transaction)
						)
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

						const transaction = response.transactions[0]
						return transactionSnapshot(
							$network,
							transaction,
							await transactionJoins($network, transaction)
						)
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
			$block: (transaction) => transaction.$block,
			$schedule: (transaction) => transaction.$schedule,
			$$hbarTransfers: {
				select: (transaction) => transaction.$$hbarTransfers,
				resolveCount: (transaction) => transaction.$$hbarTransfers.length,
			},
			$$tokenTransfers: {
				select: (transaction) => transaction.$$tokenTransfers,
				resolveCount: (transaction) => transaction.$$tokenTransfers.length,
			},
			$$contractResults: {
				select: (transaction) => transaction.$$contractResults,
				resolveCount: (transaction) => transaction.$$contractResults.length,
			},
		}),

		defineResolver({
			entityType: EntityType.HederaNode,
			resolve: {
				NetworkNodeId: {
					resolve: async ({ $network, nodeId }) => {
						assertHederaMainnet($network)
						const { getNode } = await import('$/sources/HederaMirrorNode/Rest/queries.ts')
						const node = await getNode(nodeId)
						const snapshot = nodeSnapshot($network, node)
						if (snapshot.nodeId !== nodeId)
							throw new Error('HederaMirrorNode_Rest: response node does not match request')

						return snapshot
					},
				},
			},
		})({
			nodeId: (node) => node.nodeId,
			$$timestamps: (node) => node.$$timestamps,
		}),

		defineResolver({
			entityType: EntityType.HederaNetworkSupply_Timestamp,
			resolve: {
				NetworkTimestampMsSource: {
					resolve: async ({
						$network,
						timestampMs: requestedTimestampMs,
						source,
					}) => {
						assertHederaMainnet($network)
						assertHederaMirrorSource(source)
						const { getNetworkSupply } = await import('$/sources/HederaMirrorNode/Rest/queries.ts')
						const supply = await getNetworkSupply()
						const observationTimestampMs = timestampMs(supply.timestamp, 'network supply timestamp')
						if (observationTimestampMs !== requestedTimestampMs)
							throw new Error('HederaMirrorNode_Rest: response supply does not match request')

						return {
							$network: {
								[EntityMetaKey.Selector]: $network,
							},
							timestampMs: requestedTimestampMs,
							source,
							...networkSupplyFields(supply),
						}
					},
				},
			},
		})({
			$network: (observation) => observation.$network,
			timestampMs: (observation) => observation.timestampMs,
			source: (observation) => observation.source,
			releasedSupplyTinybar: (observation) => observation.releasedSupplyTinybar,
			totalSupplyTinybar: (observation) => observation.totalSupplyTinybar,
		}),

		defineResolver({
			entityType: EntityType.HederaNetworkStake_Timestamp,
			resolve: {
				NetworkTimestampMsSource: {
					resolve: async ({
						$network,
						timestampMs: requestedTimestampMs,
						source,
					}) => {
						assertHederaMainnet($network)
						assertHederaMirrorSource(source)
						const { getNetworkStake } = await import('$/sources/HederaMirrorNode/Rest/queries.ts')
						const stake = await getNetworkStake()
						const observationTimestampMs = timestampMs(stake.staking_period.from, 'network stake period')
						if (observationTimestampMs !== requestedTimestampMs)
							throw new Error('HederaMirrorNode_Rest: response stake does not match request')

						return {
							$network: {
								[EntityMetaKey.Selector]: $network,
							},
							timestampMs: requestedTimestampMs,
							source,
							...networkStakeFields(stake),
						}
					},
				},
			},
		})({
			$network: (observation) => observation.$network,
			timestampMs: (observation) => observation.timestampMs,
			source: (observation) => observation.source,
			maxStakeRewardedTinybar: (observation) => observation.maxStakeRewardedTinybar,
			maxStakingRewardRatePerHbar: (observation) => observation.maxStakingRewardRatePerHbar,
			maxTotalRewardTinybar: (observation) => observation.maxTotalRewardTinybar,
			nodeRewardFeeFraction: (observation) => observation.nodeRewardFeeFraction,
			reservedStakingRewardsTinybar: (observation) => observation.reservedStakingRewardsTinybar,
			rewardBalanceTinybar: (observation) => observation.rewardBalanceTinybar,
			stakeTotalTinybar: (observation) => observation.stakeTotalTinybar,
			stakingPeriod: (observation) => observation.stakingPeriod,
			stakingPeriodsStored: (observation) => observation.stakingPeriodsStored,
			stakingRewardFeeFraction: (observation) => observation.stakingRewardFeeFraction,
			stakingStartThresholdTinybar: (observation) => observation.stakingStartThresholdTinybar,
			unreservedStakingRewardBalanceTinybar: (observation) => observation.unreservedStakingRewardBalanceTinybar,
		}),

		defineResolver({
			entityType: EntityType.HederaNetworkExchangeRate_Timestamp,
			resolve: {
				NetworkTimestampMsSource: {
					resolve: async ({
						$network,
						timestampMs: requestedTimestampMs,
						source,
					}) => {
						assertHederaMainnet($network)
						assertHederaMirrorSource(source)
						const { getNetworkExchangeRate } = await import('$/sources/HederaMirrorNode/Rest/queries.ts')
						const exchangeRate = await getNetworkExchangeRate()
						const observationTimestampMs = timestampMs(exchangeRate.timestamp, 'network exchange rate timestamp')
						if (observationTimestampMs !== requestedTimestampMs)
							throw new Error('HederaMirrorNode_Rest: response exchange rate does not match request')

						return {
							$network: {
								[EntityMetaKey.Selector]: $network,
							},
							timestampMs: requestedTimestampMs,
							source,
							...networkExchangeRateFields(exchangeRate),
						}
					},
				},
			},
		})({
			$network: (observation) => observation.$network,
			timestampMs: (observation) => observation.timestampMs,
			source: (observation) => observation.source,
			currentRateCentEquivalent: (observation) => observation.currentRateCentEquivalent,
			currentRateHbarEquivalent: (observation) => observation.currentRateHbarEquivalent,
			currentRateExpirationTime: (observation) => observation.currentRateExpirationTime,
			nextRateCentEquivalent: (observation) => observation.nextRateCentEquivalent,
			nextRateHbarEquivalent: (observation) => observation.nextRateHbarEquivalent,
			nextRateExpirationTime: (observation) => observation.nextRateExpirationTime,
		}),

		defineResolver({
			entityType: EntityType.HederaNetworkFee_Timestamp,
			resolve: {
				NetworkTransactionTypeTimestampMsSource: {
					resolve: async ({
						$network,
						transactionType,
						timestampMs: requestedTimestampMs,
						source,
					}) => {
						assertHederaMainnet($network)
						assertHederaMirrorSource(source)
						const { getNetworkFees } = await import('$/sources/HederaMirrorNode/Rest/queries.ts')
						const fees = await getNetworkFees()
						const observationTimestampMs = timestampMs(fees.timestamp, 'network fees timestamp')
						if (observationTimestampMs !== requestedTimestampMs)
							throw new Error('HederaMirrorNode_Rest: response fees do not match request')

						return {
							$network: {
								[EntityMetaKey.Selector]: $network,
							},
							timestampMs: requestedTimestampMs,
							source,
							...networkFeeFields(fees, transactionType),
						}
					},
				},
			},
		})({
			$network: (observation) => observation.$network,
			transactionType: (observation) => observation.transactionType,
			timestampMs: (observation) => observation.timestampMs,
			source: (observation) => observation.source,
			gasTinybar: (observation) => observation.gasTinybar,
			baseTinycent: (observation) => observation.baseTinycent,
			nodeTinycent: (observation) => observation.nodeTinycent,
			networkTinycent: (observation) => observation.networkTinycent,
			serviceTinycent: (observation) => observation.serviceTinycent,
			totalTinycent: (observation) => observation.totalTinycent,
		}),

		defineResolver({
			entityType: EntityType.HederaContractResult,
			resolve: {
				Transaction: {
					resolve: async ({ $transaction }) => {
						assertHederaMainnet($transaction.$network)
						const {
							getContractResultByTransactionIdNonce,
							getTransactions,
						} = await import('$/sources/HederaMirrorNode/Rest/queries.ts')
						const transactionIdentity = 'consensusTimestamp' in $transaction ?
							await (async () => {
								const response = await getTransactions({
									consensusTimestamp: $transaction.consensusTimestamp,
								})
								if (
									response.transactions.length !== 1
									|| response.transactions[0].consensus_timestamp !== $transaction.consensusTimestamp
								)
									throw new Error('HederaMirrorNode_Rest: transaction response does not match request')

								return {
									transactionId: response.transactions[0].transaction_id,
									nonce: response.transactions[0].nonce,
								}
							})()
						:
							{
								transactionId: $transaction.transactionId,
								nonce: $transaction.nonce,
							}
						const result = await getContractResultByTransactionIdNonce(
							transactionIdentity.transactionId,
							transactionIdentity.nonce
						)
						if (result == null)
							throw new Error('HederaMirrorNode_Rest: contract result not found')

						return contractResultRow(
							$transaction.$network,
							$transaction,
							result
						)[EntityMetaKey.Fields]
					},
				},
			},
		})({
			$contract: (result) => result[entityFieldAddressKey(EntityType.HederaContractResult, [], '$contract')],
			contractId: (result) => result[entityFieldAddressKey(EntityType.HederaContractResult, [], 'contractId')],
			evmAddress: (result) => result[entityFieldAddressKey(EntityType.HederaContractResult, [], 'evmAddress')],
			ethereumHash: (result) => result[entityFieldAddressKey(EntityType.HederaContractResult, [], 'ethereumHash')],
			functionParameters: (result) => result[entityFieldAddressKey(EntityType.HederaContractResult, [], 'functionParameters')],
			gasLimit: (result) => result[entityFieldAddressKey(EntityType.HederaContractResult, [], 'gasLimit')],
			gasUsed: (result) => result[entityFieldAddressKey(EntityType.HederaContractResult, [], 'gasUsed')],
			amountTinybar: (result) => result[entityFieldAddressKey(EntityType.HederaContractResult, [], 'amountTinybar')],
			status: (result) => result[entityFieldAddressKey(EntityType.HederaContractResult, [], 'status')],
			errorMessage: (result) => result[entityFieldAddressKey(EntityType.HederaContractResult, [], 'errorMessage')],
			bloom: (result) => result[entityFieldAddressKey(EntityType.HederaContractResult, [], 'bloom')],
		}),

		defineResolver({
			entityType: EntityType.HederaSchedule,
			resolve: {
				NetworkScheduleId: {
					resolve: async ({ $network, scheduleId }) => {
						assertHederaMainnet($network)
						const { getSchedule } = await import('$/sources/HederaMirrorNode/Rest/queries.ts')
						const schedule = await getSchedule(scheduleId)
						const snapshot = scheduleSnapshot($network, schedule)
						if (snapshot.scheduleId !== scheduleId)
							throw new Error('HederaMirrorNode_Rest: response schedule does not match request')

						return snapshot
					},
				},
			},
		})({
			scheduleId: (schedule) => schedule.scheduleId,
			creatorAccountId: (schedule) => schedule.creatorAccountId,
			payerAccountId: (schedule) => schedule.payerAccountId,
			transactionBody: (schedule) => schedule.transactionBody,
			$$timestamps: (schedule) => schedule.$$timestamps,
			$$signatures: (schedule) => schedule.$$signatures,
		}),

		defineResolver({
			entityType: EntityType.HederaTopic,
			resolve: {
				NetworkTopicId: {
					resolve: async ({ $network, topicId }) => {
						assertHederaMainnet($network)
						const { getTopic } = await import('$/sources/HederaMirrorNode/Rest/queries.ts')
						return topicSnapshot(
							$network,
							await getTopic(topicId)
						)
					},
				},
			},
		})({
			topicId: (topic) => topic.topicId,
			$$timestamps: (topic) => topic.$$timestamps,
		}),

		defineResolver({
			entityType: EntityType.HederaTopic,
			resolve: {
				NetworkTopicId: {
					resolve: async (topic, context) => {
						assertHederaMainnet(topic.$network)
						const { getTopicMessages } = await import('$/sources/HederaMirrorNode/Rest/queries.ts')
						return getTopicMessages(
							topic.topicId,
							resolverContextRowLimit(context),
							context.providerContinuationToken
						)
					},
				},
			},
		})({
			$$messages: {
				select: (page, topic) => page.messages.map((message) => (
					topicMessageFields(topic, message)
				)),
				continuation: (page, topic, context) => hederaContinuation(
					page.links.next,
					context.providerContinuationToken,
					'topic-messages',
					topic.topicId
				),
			},
		}),

		defineResolver({
			entityType: EntityType.HederaTopic_Timestamp,
			resolve: {
				TopicTimestampMsSource: {
					resolve: async ({
						$topic,
						timestampMs: requestedTimestampMs,
						source,
					}) => {
						assertHederaMainnet($topic.$network)
						assertHederaMirrorSource(source)
						const { getTopic } = await import('$/sources/HederaMirrorNode/Rest/queries.ts')
						const observation = topicObservation(
							$topic.$network,
							await getTopic($topic.topicId)
						)
						if (observation.timestampMs !== requestedTimestampMs)
							throw new Error('HederaMirrorNode_Rest: topic observation clock mismatch')
						return observation
					},
				},
			},
		})({
			$topic: (observation) => observation.$topic,
			timestampMs: (observation) => observation.timestampMs,
			source: (observation) => observation.source,
			memo: (observation) => observation.memo,
			adminKey: (observation) => observation.adminKey,
			submitKey: (observation) => observation.submitKey,
			autoRenewAccountId: (observation) => observation.autoRenewAccountId,
			autoRenewPeriodSeconds: (observation) => observation.autoRenewPeriodSeconds,
			feeScheduleKey: (observation) => observation.feeScheduleKey,
			feeExemptKeys: (observation) => observation.feeExemptKeys,
			customFees: (observation) => observation.customFees,
			deleted: (observation) => observation.deleted,
			sequenceNumber: (observation) => observation.sequenceNumber,
			runningHash: (observation) => observation.runningHash,
		}),

		defineResolver({
			entityType: EntityType.HederaTopicMessage,
			resolve: {
				TopicSequenceNumber: {
					resolve: async ({ $topic, sequenceNumber }) => {
						assertHederaMainnet($topic.$network)
						const { getTopicMessage } = await import('$/sources/HederaMirrorNode/Rest/queries.ts')
						return topicMessageFields(
							$topic,
							await getTopicMessage(
								$topic.topicId,
								sequenceNumber
							)
						)[EntityMetaKey.Fields]
					},
				},
			},
		})({
			consensusTimestamp: (message) => message[entityFieldAddressKey(EntityType.HederaTopicMessage, [], 'consensusTimestamp')],
			runningHash: (message) => message[entityFieldAddressKey(EntityType.HederaTopicMessage, [], 'runningHash')],
			payerAccount: (message) => message[entityFieldAddressKey(EntityType.HederaTopicMessage, [], 'payerAccount')],
			message: (message) => message[entityFieldAddressKey(EntityType.HederaTopicMessage, [], 'message')],
			chunkInfo: (message) => message[entityFieldAddressKey(EntityType.HederaTopicMessage, [], 'chunkInfo')],
		}),

		defineResolver({
			entityType: EntityType.HederaToken,
			resolve: {
				NetworkTokenId: {
					resolve: async ({ $network, tokenId }) => {
						assertHederaMainnet($network)
						const { getToken } = await import('$/sources/HederaMirrorNode/Rest/queries.ts')
						return tokenSnapshot(
							$network,
							await getToken(tokenId)
						)
					},
				},
			},
		})({
			tokenType: (token) => token.tokenType,
			supplyType: (token) => token.supplyType,
			decimals: (token) => token.decimals,
			$$timestamps: (token) => token.$$timestamps,
		}),

		defineResolver({
			entityType: EntityType.HederaToken,
			resolve: {
				NetworkTokenId: {
					resolve: async (token, context) => {
						assertHederaMainnet(token.$network)
						const { getTokenNfts } = await import('$/sources/HederaMirrorNode/Rest/queries.ts')
						return getTokenNfts(
							token.tokenId,
							Math.min(resolverContextRowLimit(context), 100),
							context.providerContinuationToken
						)
					},
				},
			},
		})({
			$$nfts: {
				select: (page, token) => page.nfts.map((nft) => (
					nftFields(token, nft)
				)),
				continuation: (page, token, context) => hederaContinuation(
					page.links.next,
					context.providerContinuationToken,
					'token-nfts',
					token.tokenId
				),
			},
		}),

		defineResolver({
			entityType: EntityType.HederaToken_Timestamp,
			resolve: {
				TokenTimestampMsSource: {
					resolve: async ({
						$token,
						timestampMs: requestedTimestampMs,
						source,
					}) => {
						assertHederaMainnet($token.$network)
						assertHederaMirrorSource(source)
						const { getToken } = await import('$/sources/HederaMirrorNode/Rest/queries.ts')
						const snapshot = tokenSnapshot(
							$token.$network,
							await getToken($token.tokenId)
						)
						const observation = snapshot.$$timestamps[0]
						if (observation[EntityMetaKey.Selector].timestampMs !== requestedTimestampMs)
							throw new Error('HederaMirrorNode_Rest: token observation clock mismatch')
						return observation[EntityMetaKey.Fields]
					},
				},
			},
		})({
			name: (observation) => observation[entityFieldAddressKey(EntityType.HederaToken_Timestamp, [], 'name')],
			symbol: (observation) => observation[entityFieldAddressKey(EntityType.HederaToken_Timestamp, [], 'symbol')],
			totalSupply: (observation) => observation[entityFieldAddressKey(EntityType.HederaToken_Timestamp, [], 'totalSupply')],
			maxSupply: (observation) => observation[entityFieldAddressKey(EntityType.HederaToken_Timestamp, [], 'maxSupply')],
			treasuryAccount: (observation) => observation[entityFieldAddressKey(EntityType.HederaToken_Timestamp, [], 'treasuryAccount')],
			supplyKey: (observation) => observation[entityFieldAddressKey(EntityType.HederaToken_Timestamp, [], 'supplyKey')],
			adminKey: (observation) => observation[entityFieldAddressKey(EntityType.HederaToken_Timestamp, [], 'adminKey')],
			freezeKey: (observation) => observation[entityFieldAddressKey(EntityType.HederaToken_Timestamp, [], 'freezeKey')],
			wipeKey: (observation) => observation[entityFieldAddressKey(EntityType.HederaToken_Timestamp, [], 'wipeKey')],
			kycKey: (observation) => observation[entityFieldAddressKey(EntityType.HederaToken_Timestamp, [], 'kycKey')],
			pauseKey: (observation) => observation[entityFieldAddressKey(EntityType.HederaToken_Timestamp, [], 'pauseKey')],
			feeScheduleKey: (observation) => observation[entityFieldAddressKey(EntityType.HederaToken_Timestamp, [], 'feeScheduleKey')],
			deleted: (observation) => observation[entityFieldAddressKey(EntityType.HederaToken_Timestamp, [], 'deleted')],
			paused: (observation) => observation[entityFieldAddressKey(EntityType.HederaToken_Timestamp, [], 'paused')],
			customFees: (observation) => observation[entityFieldAddressKey(EntityType.HederaToken_Timestamp, [], 'customFees')],
			expiryTimestamp: (observation) => observation[entityFieldAddressKey(EntityType.HederaToken_Timestamp, [], 'expiryTimestamp')],
			$$customFees: (observation) => observation[entityFieldAddressKey(EntityType.HederaToken_Timestamp, [], '$$customFees')],
		}),

		defineResolver({
			entityType: EntityType.HederaTokenCustomFee,
			resolve: {
				TokenTimestampFeeIndex: {
					resolve: async ({ $tokenTimestamp, feeIndex }) => {
						assertHederaMainnet($tokenTimestamp.$token.$network)
						assertHederaMirrorSource($tokenTimestamp.source)
						const { getToken } = await import('$/sources/HederaMirrorNode/Rest/queries.ts')
						const snapshot = tokenSnapshot(
							$tokenTimestamp.$token.$network,
							await getToken($tokenTimestamp.$token.tokenId)
						)
						const observation = snapshot.$$timestamps[0]
						if (observation[EntityMetaKey.Selector].timestampMs !== $tokenTimestamp.timestampMs)
							throw new Error('HederaMirrorNode_Rest: custom fee observation clock mismatch')
						const fee = observation[EntityMetaKey.Fields][entityFieldAddressKey(EntityType.HederaToken_Timestamp, [], '$$customFees')]
							.find((row) => row[EntityMetaKey.Selector].feeIndex === feeIndex)
						if (fee == null)
							throw new Error(`HederaMirrorNode_Rest: custom fee ${feeIndex.toString()} not found`)
						return fee[EntityMetaKey.Fields]
					},
				},
			},
		})({
			feeKind: (fee) => fee[entityFieldAddressKey(EntityType.HederaTokenCustomFee, [], 'feeKind')],
			collectorAccountId: (fee) => fee[entityFieldAddressKey(EntityType.HederaTokenCustomFee, [], 'collectorAccountId')],
			denominatingTokenId: (fee) => fee[entityFieldAddressKey(EntityType.HederaTokenCustomFee, [], 'denominatingTokenId')],
			amount: (fee) => fee[entityFieldAddressKey(EntityType.HederaTokenCustomFee, [], 'amount')],
			numerator: (fee) => fee[entityFieldAddressKey(EntityType.HederaTokenCustomFee, [], 'numerator')],
			denominator: (fee) => fee[entityFieldAddressKey(EntityType.HederaTokenCustomFee, [], 'denominator')],
			minimumAmount: (fee) => fee[entityFieldAddressKey(EntityType.HederaTokenCustomFee, [], 'minimumAmount')],
			maximumAmount: (fee) => fee[entityFieldAddressKey(EntityType.HederaTokenCustomFee, [], 'maximumAmount')],
			netOfTransfers: (fee) => fee[entityFieldAddressKey(EntityType.HederaTokenCustomFee, [], 'netOfTransfers')],
			allCollectorsAreExempt: (fee) => fee[entityFieldAddressKey(EntityType.HederaTokenCustomFee, [], 'allCollectorsAreExempt')],
			$collector: (fee) => fee[entityFieldAddressKey(EntityType.HederaTokenCustomFee, [], '$collector')],
			$denominatingToken: (fee) => fee[entityFieldAddressKey(EntityType.HederaTokenCustomFee, [], '$denominatingToken')],
		}),

		defineResolver({
			entityType: EntityType.HederaNft,
			resolve: {
				TokenSerialNumber: {
					resolve: async ({ $token, serialNumber }) => {
						assertHederaMainnet($token.$network)
						const { getTokenNft } = await import('$/sources/HederaMirrorNode/Rest/queries.ts')
						return nftFields(
							$token,
							await getTokenNft(
								$token.tokenId,
								serialNumber
							)
						)[EntityMetaKey.Fields]
					},
				},
			},
		})({
			metadata: (nft) => nft[entityFieldAddressKey(EntityType.HederaNft, [], 'metadata')],
			createdTimestamp: (nft) => nft[entityFieldAddressKey(EntityType.HederaNft, [], 'createdTimestamp')],
			$$timestamps: (nft) => nft[entityFieldAddressKey(EntityType.HederaNft, [], '$$timestamps')],
		}),

		defineResolver({
			entityType: EntityType.HederaNft_Timestamp,
			resolve: {
				NftTimestampMsSource: {
					resolve: async ({
						$nft,
						timestampMs: requestedTimestampMs,
						source,
					}) => {
						assertHederaMainnet($nft.$token.$network)
						assertHederaMirrorSource(source)
						const { getTokenNft } = await import('$/sources/HederaMirrorNode/Rest/queries.ts')
						const snapshot = nftFields(
							$nft.$token,
							await getTokenNft(
								$nft.$token.tokenId,
								$nft.serialNumber
							)
						)
						const observation = snapshot[EntityMetaKey.Fields][entityFieldAddressKey(EntityType.HederaNft, [], '$$timestamps')][0]
						if (observation[EntityMetaKey.Selector].timestampMs !== requestedTimestampMs)
							throw new Error('HederaMirrorNode_Rest: NFT observation clock mismatch')
						return observation[EntityMetaKey.Fields]
					},
				},
			},
		})({
			$owner: (observation) => observation[entityFieldAddressKey(EntityType.HederaNft_Timestamp, [], '$owner')],
			ownerAccountId: (observation) => observation[entityFieldAddressKey(EntityType.HederaNft_Timestamp, [], 'ownerAccountId')],
			deleted: (observation) => observation[entityFieldAddressKey(EntityType.HederaNft_Timestamp, [], 'deleted')],
			spenderAccountId: (observation) => observation[entityFieldAddressKey(EntityType.HederaNft_Timestamp, [], 'spenderAccountId')],
			modifiedTimestamp: (observation) => observation[entityFieldAddressKey(EntityType.HederaNft_Timestamp, [], 'modifiedTimestamp')],
		}),

		defineResolver({
			entityType: EntityType.HederaSchedule_Timestamp,
			resolve: {
				ScheduleTimestampMsSource: {
					resolve: async ({
						$schedule,
						timestampMs: requestedTimestampMs,
						source,
					}) => {
						assertHederaMainnet($schedule.$network)
						assertHederaMirrorSource(source)
						const { getSchedule } = await import('$/sources/HederaMirrorNode/Rest/queries.ts')
						const schedule = await getSchedule($schedule.scheduleId)
						if (schedule.schedule_id !== $schedule.scheduleId)
							throw new Error('HederaMirrorNode_Rest: response schedule does not match request')

						const observation = scheduleObservation($schedule.$network, schedule)
						if (observation.timestampMs !== requestedTimestampMs)
							throw new Error('HederaMirrorNode_Rest: schedule lifecycle clock mismatch')

						return observation
					},
				},
			},
		})({
			$schedule: (observation) => observation.$schedule,
			timestampMs: (observation) => observation.timestampMs,
			source: (observation) => observation.source,
			executedTimestamp: (observation) => observation.executedTimestamp,
			deleted: (observation) => observation.deleted,
			expirationTime: (observation) => observation.expirationTime,
			waitForExpiry: (observation) => observation.waitForExpiry,
			signatureCount: (observation) => observation.signatureCount,
			$executionTransaction: (observation) => observation.$executionTransaction,
		}),

		defineResolver({
			entityType: EntityType.HederaContract,
			resolve: {
				NetworkContractId: {
					resolve: async ({ $network, contractId }) => {
						assertHederaMainnet($network)
						const { getContract } = await import('$/sources/HederaMirrorNode/Rest/queries.ts')
						return contractSnapshot($network, await getContract(contractId))
					},
				},
			},
		})({
			contractId: (contract) => contract.contractId,
			evmAddress: (contract) => contract.evmAddress,
			createdTimestamp: (contract) => contract.createdTimestamp,
			$$timestamps: (contract) => contract.$$timestamps,
		}),

		defineResolver({
			entityType: EntityType.HederaContract,
			resolve: {
				NetworkContractId: {
					resolve: async (contract, context) => {
						assertHederaMainnet(contract.$network)
						const { getContractResults } = await import('$/sources/HederaMirrorNode/Rest/queries.ts')
						return getContractResults(
							contract.contractId,
							resolverContextRowLimit(context),
							context.providerContinuationToken
						)
					},
				},
			},
		})({
			$$results: {
				select: (page, contract) => page.results.map((result) => (
					contractResultRef(
						contract.$network,
						contract,
						result
					)
				)),
				continuation: (page, contract, context) => hederaContinuation(
					page.links.next,
					context.providerContinuationToken,
					'contract-results',
					contract.contractId
				),
			},
		}),

		defineResolver({
			entityType: EntityType.HederaContract,
			resolve: {
				NetworkContractId: {
					resolve: async (contract, context) => {
						assertHederaMainnet(contract.$network)
						const { getContractLogs } = await import('$/sources/HederaMirrorNode/Rest/queries.ts')
						return getContractLogs(
							contract.contractId,
							resolverContextRowLimit(context),
							context.providerContinuationToken
						)
					},
				},
			},
		})({
			$$logs: {
				select: (page, contract) => page.logs.map((log) => (
					contractLogRef(
						contract.$network,
						contract,
						log
					)
				)),
				continuation: (page, contract, context) => hederaContinuation(
					page.links.next,
					context.providerContinuationToken,
					'contract-logs',
					contract.contractId
				),
			},
		}),

		defineResolver({
			entityType: EntityType.HederaAllowance,
			resolve: {
				OwnerSpenderAllowanceKind: {
					resolve: resolveHederaAllowance,
				},
				OwnerSpenderAllowanceKindTokenId: {
					resolve: resolveHederaAllowance,
				},
				OwnerSpenderAllowanceKindTokenIdSerialNumber: {
					resolve: resolveHederaAllowance,
				},
			},
		})({
			$token: (snapshot) => snapshot.$token,
			$$timestamps: (snapshot) => snapshot.$$timestamps,
		}),

		defineResolver({
			entityType: EntityType.HederaTokenAssociation,
			resolve: {
				AccountToken: {
					resolve: async (associationSelector) => {
						assertHederaMainnet(associationSelector.$account.$network)
						assertHederaMainnet(associationSelector.$token.$network)
						const {
							getAccount,
							getAccountToken,
						} = await import('$/sources/HederaMirrorNode/Rest/queries.ts')
						const [
							token,
							account,
						] = await Promise.all([
							getAccountToken(
								associationSelector.$account.accountId,
								associationSelector.$token.tokenId
							),
							getAccount(associationSelector.$account.accountId),
						])
						return hederaTokenAssociationSnapshot(
							associationSelector,
							token,
							timestampMs(account.balance.timestamp, 'account balance timestamp')
						)
					},
				},
			},
		})({
			$token: (snapshot) => snapshot.$token,
			$$timestamps: (snapshot) => snapshot.$$timestamps,
		}),
	],
} satisfies RegisteredSourceResolverModule

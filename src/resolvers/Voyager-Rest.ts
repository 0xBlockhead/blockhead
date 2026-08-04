import { networkBySlug } from '$/constants/Network.ts'
import { defineResolver, type RegisteredSourceResolverModule } from '$/resolvers/defineResolver.ts'
import {
	entityFieldAddressKey,
	EntityMetaKey,
	type EntitySelector,
} from '$/schema/$schema.ts'
import { EntityType } from '$/schema/EntityType.ts'
import { schema } from '$/schema/index.ts'
import { Source } from '$/sources/Source.ts'

type NetworkIdentity = EntitySelector<typeof schema, EntityType.Network>

const starknetNetworkApplicability = [
	{
		$network: {
			caip2: networkBySlug.starknet.caip2,
		},
	},
	{
		$network: {
			slug: networkBySlug.starknet.slug,
		},
	},
] as const

const starknetNestedNetworkApplicability = [
	{
		$network: starknetNetworkApplicability[0],
	},
	{
		$network: starknetNetworkApplicability[1],
	},
] as const

const assertStarknetMainnet = (network: NetworkIdentity) => {
	if (
		(
			'slug' in network
			&& network.slug === networkBySlug.starknet.slug
		)
		|| (
			'caip2' in network
			&& network.caip2.namespace === networkBySlug.starknet.caip2.namespace
			&& network.caip2.reference === networkBySlug.starknet.caip2.reference
		)
	)
		return

	throw new Error('Voyager_Rest: unsupported network')
}

const canonicalFelt = (
	value: string,
	label: string
) => {
	if (!/^0[xX][\da-fA-F]{1,64}$/.test(value) || BigInt(value) >= 2n ** 251n)
		throw new Error(`Voyager_Rest: malformed ${label}`)

	return `0x${BigInt(value).toString(16)}`
}

const assertMatchingFelt = (
	requested: string,
	observed: string,
	label: string
) => {
	if (BigInt(canonicalFelt(requested, label)) !== BigInt(canonicalFelt(observed, label)))
		throw new Error(`Voyager_Rest: ${label} mismatch`)
}

const unixSecondsToMs = (
	value: number,
	label: string
) => {
	if (!Number.isSafeInteger(value) || value < 0)
		throw new Error(`Voyager_Rest: malformed ${label}`)

	return value * 1000
}

const optionalHexFee = (
	value: string | null | undefined
) => {
	if (value == null)
		return undefined

	if (!/^0[xX][\da-fA-F]+$/.test(value) && !/^\d+$/.test(value))
		throw new Error(`Voyager_Rest: malformed fee ${value}`)

	return BigInt(value)
}

export default {
	source: Source.Voyager,

	resolvers: [
		defineResolver({
			entityType: EntityType.StarknetTransaction,
			resolve: {
				NetworkTransactionHash: {
					appliesTo: starknetNestedNetworkApplicability,
					resolve: async (transaction) => {
						assertStarknetMainnet(transaction.$network.$network)
						const transactionHash = canonicalFelt(transaction.transactionHash, 'transaction hash')
						const { getTransactionByHash } = await import('$/sources/Voyager/Rest/queries.ts')
						const details = await getTransactionByHash({
							txnHash: transactionHash,
						})
						assertMatchingFelt(transactionHash, details.hash, 'transaction hash')
						if (!Number.isSafeInteger(details.blockNumber) || details.blockNumber < 0)
							throw new Error('Voyager_Rest: malformed transaction block number')
						if (!Number.isSafeInteger(details.timestamp) || details.timestamp < 0)
							throw new Error('Voyager_Rest: malformed transaction timestamp')

						const senderAddress = (
							details.senderAddress == null ?
								undefined
							:
								canonicalFelt(details.senderAddress, 'sender address')
						)

						return {
							transactionKind: details.type,
							$block: {
								[EntityMetaKey.Selector]: {
									$network: transaction.$network,
									blockNumber: BigInt(details.blockNumber),
								},
							},
							senderAddress,
							$senderContract: (
								senderAddress == null ?
									undefined
								:
									{
										[EntityMetaKey.Selector]: {
											$network: transaction.$network,
											address: senderAddress,
										},
									}
							),
							nonce: details.nonce ?? undefined,
							version: details.version ?? undefined,
							maxFee: optionalHexFee(details.maxFee),
							calldata: details.calldata ?? [],
							signature: details.signature.flatMap((value) => (
								value == null ? [] : [canonicalFelt(value, 'signature limb')]
							)),
							$$timestamps: [{
								[EntityMetaKey.Selector]: {
									$transaction: {
										$network: transaction.$network,
										transactionHash,
									},
									timestampMs: unixSecondsToMs(details.timestamp, 'transaction timestamp'),
									source: Source.Voyager,
								},
								[EntityMetaKey.Fields]: {
									[entityFieldAddressKey(EntityType.StarknetTransaction_Timestamp, [], 'blockNumber')]: BigInt(details.blockNumber),
									[entityFieldAddressKey(EntityType.StarknetTransaction_Timestamp, [], 'finalityStatus')]: details.status,
									[entityFieldAddressKey(EntityType.StarknetTransaction_Timestamp, [], 'executionStatus')]: details.executionStatus,
									...(
										details.actualFee != null && {
											[entityFieldAddressKey(EntityType.StarknetTransaction_Timestamp, [], 'actualFee')]: BigInt(details.actualFee),
										}
									),
									...(
										details.revertError != null && {
											[entityFieldAddressKey(EntityType.StarknetTransaction_Timestamp, [], 'revertReason')]: details.revertError,
										}
									),
									[entityFieldAddressKey(EntityType.StarknetTransaction_Timestamp, [], 'eventsCount')]: details.receipt.events.length,
								},
							}],
						}
					},
				},
			},
		})({
			transactionKind: (snapshot) => snapshot.transactionKind,
			$block: (snapshot) => snapshot.$block,
			senderAddress: (snapshot) => snapshot.senderAddress,
			$senderContract: (snapshot) => snapshot.$senderContract,
			nonce: (snapshot) => snapshot.nonce,
			version: (snapshot) => snapshot.version,
			maxFee: (snapshot) => snapshot.maxFee,
			calldata: (snapshot) => snapshot.calldata,
			signature: (snapshot) => snapshot.signature,
			$$timestamps: (snapshot) => snapshot.$$timestamps,
		}),

		defineResolver({
			entityType: EntityType.StarknetBlock,
			resolve: {
				NetworkBlockHash: {
					appliesTo: starknetNestedNetworkApplicability,
					resolve: async (block) => {
						assertStarknetMainnet(block.$network.$network)
						const blockHash = canonicalFelt(block.blockHash, 'block hash')
						const { getBlockByHash } = await import('$/sources/Voyager/Rest/queries.ts')
						const details = await getBlockByHash({
							blockHash,
						})
						if (details.hash == null)
							throw new Error('Voyager_Rest: block response missing hash')
						assertMatchingFelt(blockHash, details.hash, 'block hash')
						if (details.blockNumber == null || !Number.isSafeInteger(details.blockNumber) || details.blockNumber < 0)
							throw new Error('Voyager_Rest: malformed block number')

						return {
							blockNumber: BigInt(details.blockNumber),
							blockHash: canonicalFelt(details.hash, 'block hash'),
							parentHash: (
								details.prevBlockHash == null ?
									undefined
								:
									canonicalFelt(details.prevBlockHash, 'parent hash')
							),
							newRoot: (
								details.stateRoot == null ?
									undefined
								:
									canonicalFelt(details.stateRoot, 'state root')
							),
							timestampMs: (
								details.timestamp == null ?
									undefined
								:
									unixSecondsToMs(details.timestamp, 'block timestamp')
							),
							sequencerAddress: (
								details.sequencerAddress == null ?
									undefined
								:
									canonicalFelt(details.sequencerAddress, 'sequencer address')
							),
							l1GasPrice: details.ethGasPrice ?? undefined,
							l1DataGasPrice: details.strkGasPrice ?? undefined,
							status: details.status ?? undefined,
						}
					},
				},
			},
		})({
			blockNumber: (snapshot) => snapshot.blockNumber,
			blockHash: (snapshot) => snapshot.blockHash,
			parentHash: (snapshot) => snapshot.parentHash,
			newRoot: (snapshot) => snapshot.newRoot,
			timestampMs: (snapshot) => snapshot.timestampMs,
			sequencerAddress: (snapshot) => snapshot.sequencerAddress,
			l1GasPrice: (snapshot) => snapshot.l1GasPrice,
			l1DataGasPrice: (snapshot) => snapshot.l1DataGasPrice,
			status: (snapshot) => snapshot.status,
		}),

		defineResolver({
			entityType: EntityType.StarknetContract,
			resolve: {
				NetworkAddress: {
					appliesTo: starknetNestedNetworkApplicability,
					resolve: async (contract) => {
						assertStarknetMainnet(contract.$network.$network)
						const address = canonicalFelt(contract.address, 'contract address')
						const { getContractByAddress } = await import('$/sources/Voyager/Rest/queries.ts')
						const details = await getContractByAddress({
							contractAddress: address,
						})
						assertMatchingFelt(address, details.address, 'contract address')
						if (!Number.isSafeInteger(details.blockNumber) || details.blockNumber < 0)
							throw new Error('Voyager_Rest: malformed contract block number')
						if (!Number.isSafeInteger(details.nonce) || details.nonce < 0)
							throw new Error('Voyager_Rest: malformed contract nonce')

						return {
							$$accountStates: [{
								[EntityMetaKey.Selector]: {
									$contract: {
										$network: contract.$network,
										address,
									},
									blockNumber: BigInt(details.blockNumber),
									source: Source.Voyager,
								},
								[EntityMetaKey.Fields]: {
									[entityFieldAddressKey(EntityType.StarknetAccount_Timestamp, [], 'classHash')]: (
										canonicalFelt(details.classHash, 'class hash')
									),
									[entityFieldAddressKey(EntityType.StarknetAccount_Timestamp, [], 'nonce')]: (
										`0x${BigInt(details.nonce).toString(16)}`
									),
									[entityFieldAddressKey(EntityType.StarknetAccount_Timestamp, [], 'found')]: true,
								},
							}],
						}
					},
				},
			},
		})({
			$$accountStates: (snapshot) => snapshot.$$accountStates,
		}),

		defineResolver({
			entityType: EntityType.StarknetClass,
			resolve: {
				NetworkClassHash: {
					appliesTo: starknetNestedNetworkApplicability,
					resolve: async (klass) => {
						assertStarknetMainnet(klass.$network.$network)
						const classHash = canonicalFelt(klass.classHash, 'class hash')
						const { getClassByHash } = await import('$/sources/Voyager/Rest/queries.ts')
						const details = await getClassByHash({
							classHash,
						})
						assertMatchingFelt(classHash, details.hash, 'class hash')

						return {
							classHash: canonicalFelt(details.hash, 'class hash'),
							contractClassVersion: details.version ?? undefined,
							declaredByTransactionHash: canonicalFelt(details.transactionHash, 'declare transaction hash'),
						}
					},
				},
			},
		})({
			classHash: (snapshot) => snapshot.classHash,
			contractClassVersion: (snapshot) => snapshot.contractClassVersion,
			declaredByTransactionHash: (snapshot) => snapshot.declaredByTransactionHash,
		}),

		defineResolver({
			entityType: EntityType.StarknetNetwork,
			resolve: {
				Network: {
					appliesTo: starknetNetworkApplicability,
					resolve: async (starknetNetwork) => {
						assertStarknetMainnet(starknetNetwork.$network)
						const {
							getApiStatus,
							getNetworkStats,
						} = await import('$/sources/Voyager/Rest/queries.ts')
						const [
							stats,
							apiStatus,
						] = await Promise.all([
							getNetworkStats(),
							getApiStatus(),
						])
						if (!/^\d+$/.test(stats.blocksCount))
							throw new Error('Voyager_Rest: malformed blocksCount')
						if (!Number.isSafeInteger(apiStatus.timestamp) || apiStatus.timestamp < 0)
							throw new Error('Voyager_Rest: malformed api status timestamp')

						const coreStatus = apiStatus.apis.core
						const blocksCount = BigInt(stats.blocksCount)

						return {
							$$timestamps: [{
								[EntityMetaKey.Selector]: {
									$network: starknetNetwork,
									timestampMs: apiStatus.timestamp,
									source: Source.Voyager,
								},
								[EntityMetaKey.Fields]: {
									...(
										blocksCount > 0n && {
											[entityFieldAddressKey(EntityType.StarknetNetwork_Timestamp, [], 'latestBlockNumber')]: blocksCount - 1n,
										}
									),
									[entityFieldAddressKey(EntityType.StarknetNetwork_Timestamp, [], 'latestBlockHash')]: (
										canonicalFelt(stats.tpsAtBlockHash, 'tps block hash')
									),
									...(
										coreStatus != null && {
											[entityFieldAddressKey(EntityType.StarknetNetwork_Timestamp, [], 'syncing')]: coreStatus.status !== 'ok',
										}
									),
								},
							}],
						}
					},
				},
			},
		})({
			$$timestamps: (snapshot) => snapshot.$$timestamps,
		}),
	],
} satisfies RegisteredSourceResolverModule

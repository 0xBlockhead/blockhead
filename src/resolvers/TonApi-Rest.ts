import {
	Caip2Namespace,
	Caip2Reference,
	networkBySlug,
} from '$/constants/Network.ts'
import { defineResolver, type RegisteredSourceResolverModule } from '$/resolvers/defineResolver.ts'
import {
	entityFieldAddressKey,
	EntityMetaKey,
	type EntitySelector,
} from '$/schema/$schema.ts'
import { EntityType } from '$/schema/EntityType.ts'
import { schema } from '$/schema/index.ts'
import { Source } from '$/sources/Source.ts'

const tonMainnetCaip2 = {
	namespace: Caip2Namespace.Ton,
	reference: Caip2Reference.TonMainnet,
} as const

const tonNetworkApplicability = [
	{
		caip2: tonMainnetCaip2,
	},
	{
		slug: networkBySlug.ton.slug,
	},
] as const

const tonTransactionApplicability = [
	{
		$account: {
			$network: tonNetworkApplicability[0],
		},
	},
	{
		$account: {
			$network: tonNetworkApplicability[1],
		},
	},
] as const

const assertTonNetwork = ($network: {
	slug: string
} | {
	caip2: {
		namespace: string
		reference: string
	}
}) => {
	if (
		!(
			'slug' in $network
			&& $network.slug === networkBySlug.ton.slug
		)
		&& !(
			'caip2' in $network
			&& $network.caip2.namespace === networkBySlug.ton.caip2.namespace
			&& $network.caip2.reference === networkBySlug.ton.caip2.reference
		)
	)
		throw new Error('TonApi_Rest: unsupported network')
}

const tonRawAddressCoordinates = (address: string) => {
	const addressParts = /^(-?\d+):([0-9a-fA-F]{64})$/.exec(address)
	if (addressParts == null)
		throw new Error('TonApi_Rest: account response has a malformed raw address')

	const workchain = Number(addressParts[1])
	if (!Number.isSafeInteger(workchain))
		throw new Error('TonApi_Rest: account response has a malformed workchain')

	return {
		workchain,
		addressHash: addressParts[2].toLowerCase(),
	}
}

const tonNetworkTimestamps = async (network: Parameters<typeof assertTonNetwork>[0]) => {
	assertTonNetwork(network)
	const { getBlockchainMasterchainHead } = await import('$/sources/TonApi/Rest/queries.ts')
	const masterchainHead = await getBlockchainMasterchainHead()
	const timestampMs = Date.now()

	return [{
		[EntityMetaKey.Selector]: {
			$network: network,
			timestampMs,
			source: Source.TonApi_Rest,
		},
		[EntityMetaKey.Fields]: {
			[entityFieldAddressKey(EntityType.TonNetwork_Timestamp, [], 'timestampMs')]: timestampMs,
			[entityFieldAddressKey(EntityType.TonNetwork_Timestamp, [], 'masterchainSeqno')]: BigInt(masterchainHead.seqno),
			[entityFieldAddressKey(EntityType.TonNetwork_Timestamp, [], 'latestBlockUtimeMs')]: masterchainHead.gen_utime * 1_000,
		},
	}]
}

const resolveTonTransaction = async (
	transactionSelector: EntitySelector<typeof schema, EntityType.TonTransaction>
) => {
	assertTonNetwork(transactionSelector.$account.$network)
	const {
		getAccount,
		getBlockchainAccountTransaction,
	} = await import('$/sources/TonApi/Rest/queries.ts')
	const account = await getAccount(transactionSelector.$account.address)
	tonRawAddressCoordinates(account.address)
	const transaction = await getBlockchainAccountTransaction({
		accountId: account.address,
		lt: transactionSelector.lt,
		...('hash' in transactionSelector && {
			hash: transactionSelector.hash,
		}),
	})

	return {
		hash: transaction.hash,
		nowMs: transaction.utime * 1_000,
		transactionKind: transaction.transactionType,
		totalFeesNano: transaction.totalFeesNano,
	}
}

export default {
	source: Source.TonApi_Rest,

	resolvers: [
		defineResolver({
			entityType: EntityType.Network,
			resolve: {
				Caip2: {
					appliesTo: [tonNetworkApplicability[0]],
					resolve: tonNetworkTimestamps,
				},
				Slug: {
					appliesTo: [tonNetworkApplicability[1]],
					resolve: tonNetworkTimestamps,
				},
			},
		})({
			Ton: {
				$$timestamps: (timestamps) => timestamps,
			},
		}),

		defineResolver({
			entityType: EntityType.TonAccount,
			resolve: {
				NetworkAddress: {
					resolve: async ({ $network, address }) => {
						assertTonNetwork($network)

						const {
							getAccount,
							getBlockchainRawAccount,
						} = await import('$/sources/TonApi/Rest/queries.ts')
						const [
							account,
							rawAccount,
						] = await Promise.all([
							getAccount(address),
							getBlockchainRawAccount(address),
						])
						const coordinates = tonRawAddressCoordinates(account.address)
						if (
							coordinates.workchain !== tonRawAddressCoordinates(rawAccount.address).workchain
							|| coordinates.addressHash !== tonRawAddressCoordinates(rawAccount.address).addressHash
						)
							throw new Error('TonApi_Rest: account and raw account identities diverge')

						return {
							...coordinates,
							$$timestamps: [
								{
									[EntityMetaKey.Selector]: {
										$account: {
											$network,
											address,
										},
										timestampMs: Date.now(),
										source: Source.TonApi_Rest,
									},
									[EntityMetaKey.Fields]: {
										[entityFieldAddressKey(EntityType.TonAccount_Timestamp, [], 'balanceNano')]: BigInt(account.balance),
										[entityFieldAddressKey(EntityType.TonAccount_Timestamp, [], 'status')]: account.status,
										[entityFieldAddressKey(EntityType.TonAccount_Timestamp, [], 'lastActivityTimestampMs')]: account.last_activity * 1_000,
										[entityFieldAddressKey(EntityType.TonAccount_Timestamp, [], 'lastTransactionLt')]: BigInt(rawAccount.last_transaction_lt),
										...(rawAccount.last_transaction_hash != null && {
											[entityFieldAddressKey(EntityType.TonAccount_Timestamp, [], 'lastTransactionHash')]: rawAccount.last_transaction_hash,
										}),
										...(rawAccount.frozen_hash != null && {
											[entityFieldAddressKey(EntityType.TonAccount_Timestamp, [], 'frozenHash')]: rawAccount.frozen_hash,
										}),
									},
								},
							],
						}
					},
				},
			},
		})({
			workchain: (account) => account.workchain,
			addressHash: (account) => account.addressHash,
			$$timestamps: (account) => account.$$timestamps,
		}),

		defineResolver({
			entityType: EntityType.TonTransaction,
			resolve: {
				AccountLt: {
					appliesTo: tonTransactionApplicability,
					resolve: resolveTonTransaction,
				},
				AccountLtHash: {
					appliesTo: tonTransactionApplicability,
					resolve: resolveTonTransaction,
				},
			},
		})({
			hash: (transaction) => transaction.hash,
			nowMs: (transaction) => transaction.nowMs,
			transactionKind: (transaction) => transaction.transactionKind,
			totalFeesNano: (transaction) => transaction.totalFeesNano,
		}),

		defineResolver({
			entityType: EntityType.TonJetton,
			resolve: {
				NetworkMasterAddress: {
					resolve: async ({ $network, masterAddress }) => {
						assertTonNetwork($network)

						const { getAccount } = await import('$/sources/TonApi/Rest/queries.ts')
						const account = await getAccount(masterAddress)
						tonRawAddressCoordinates(account.address)

						return {
							$masterAccount: {
								[EntityMetaKey.Selector]: {
									$network,
									address: account.address,
								},
							},
						}
					},
				},
			},
		})({
			$masterAccount: (jetton) => jetton.$masterAccount,
		}),
	],
} satisfies RegisteredSourceResolverModule

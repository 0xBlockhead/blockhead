import {
	Caip2Namespace,
	Caip2Reference,
	networkBySlug,
} from '$/constants/Network.ts'
import { defineResolver } from '$/resolvers/defineResolver.ts'
import {
	entityFieldAddressKey,
	EntityMetaKey,
} from '$/schema/$schema.ts'
import { EntityType } from '$/schema/EntityType.ts'
import { NetworkSelector } from '$/schema/Network.ts'
import { TonAccountSelector } from '$/schema/TonAccount.ts'
import { TonJettonSelector } from '$/schema/TonJetton.ts'
import { sourceProviderDefinitions } from '$/sources/$sourceProviders.ts'
import { Source } from '$/sources/Source.ts'
import { SourceTargetKind } from '$/sources/SourceBinding.ts'

const tonMainnetCaip2 = {
	namespace: Caip2Namespace.Ton,
	reference: Caip2Reference.TonMainnet,
} as const

const tonApiBindings = sourceProviderDefinitions
	.flatMap((provider) => provider.bindings)
	.filter((binding) => (
		binding.source === Source.TonApi_Rest
		&& binding.target.kind === SourceTargetKind.Caip2Network
		&& binding.target.key === `${tonMainnetCaip2.namespace}:${tonMainnetCaip2.reference}`
	))

if (tonApiBindings.length !== 1)
	throw new Error('TonApi_Rest: canonical TON mainnet source binding is missing or ambiguous')

const tonApiBinding = tonApiBindings[0]

const tonNetworkApplicability = [
	{
		caip2: tonMainnetCaip2,
	},
	{
		slug: networkBySlug.ton.slug,
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
	const masterchainHead = await getBlockchainMasterchainHead(tonApiBinding)
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

export default {
	source: Source.TonApi_Rest,

	resolvers: [
		defineResolver(Source.TonApi_Rest, {
			entityType: EntityType.Network,
			resolve: {
				[NetworkSelector.Caip2]: {
					appliesTo: [tonNetworkApplicability[0]],
					resolve: tonNetworkTimestamps,
				},
				[NetworkSelector.Slug]: {
					appliesTo: [tonNetworkApplicability[1]],
					resolve: tonNetworkTimestamps,
				},
			},
		})({
			Ton: {
				$$timestamps: (timestamps) => timestamps,
			},
		}),

		defineResolver(Source.TonApi_Rest, {
			entityType: EntityType.TonAccount,
			resolve: {
				[TonAccountSelector.NetworkAddress]: {
					resolve: async ({ $network, address }) => {
						assertTonNetwork($network)

						const { getAccount } = await import('$/sources/TonApi/Rest/queries.ts')
						const account = await getAccount(tonApiBinding, address)

						return {
							...tonRawAddressCoordinates(account.address),
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

		defineResolver(Source.TonApi_Rest, {
			entityType: EntityType.TonJetton,
			resolve: {
				[TonJettonSelector.NetworkMasterAddress]: {
					resolve: async ({ $network, masterAddress }) => {
						assertTonNetwork($network)

						const { getAccount } = await import('$/sources/TonApi/Rest/queries.ts')
						const account = await getAccount(tonApiBinding, masterAddress)
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
}

import { networkBySlug } from '$/constants/Network.ts'
import { defineResolver } from '$/resolvers/defineResolver.ts'
import {
	entityFieldAddressKey,
	EntityMetaKey,
} from '$/schema/$schema.ts'
import { EntityType } from '$/schema/EntityType.ts'
import { TonAccountSelector } from '$/schema/TonAccount.ts'
import { TonJettonSelector } from '$/schema/TonJetton.ts'
import { sourceProviderDefinitions } from '$/sources/$sourceProviders.ts'
import { Source } from '$/sources/Source.ts'

const tonApiBinding = sourceProviderDefinitions
	.flatMap((provider) => provider.bindings)
	.find((binding) => binding.source === Source.TonApi_Rest)

if (tonApiBinding == null)
	throw new Error('TonApi_Rest: source binding is missing')

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

export default {
	source: Source.TonApi_Rest,

	resolvers: [
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

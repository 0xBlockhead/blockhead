import { networkBySlug } from '$/constants/Network.ts'
import {
	defineResolver,
	type RegisteredSourceResolverModule,
} from '$/resolvers/defineResolver.ts'
import {
	EntityMetaKey,
	entityFieldAddressKey,
} from '$/schema/$schema.ts'
import { EntityType } from '$/schema/EntityType.ts'
import { Source } from '$/sources/Source.ts'
import type { GetBlockYellowstoneAccountUpdate } from '$/sources/GetBlock/Yellowstone/types.ts'

const assertSolanaMainnet = (network: {
	caip2: {
		namespace: string
		reference: string
	}
}) => {
	if (
		network.caip2.namespace !== networkBySlug.solana.caip2.namespace
		|| network.caip2.reference !== networkBySlug.solana.caip2.reference
	)
		throw new Error('GetBlockYellowstone_Grpc: unsupported network')
}

const yellowstoneAccountTimestampFields = (
	account: {
		$network: {
			caip2: {
				namespace: string
				reference: string
			}
		}
		pubkey: string
	},
	update: GetBlockYellowstoneAccountUpdate,
	slot: bigint
) => ({
	$account: {
		[EntityMetaKey.Selector]: account,
	},
	slot,
	source: Source.GetBlockYellowstone_Grpc,
	timestampMs: update.timestampMs,
	lamports: BigInt(update.lamports),
	$ownerProgram: {
		[EntityMetaKey.Selector]: {
			$network: account.$network,
			programId: update.ownerProgramId,
		},
	},
	executable: update.executable,
	rentEpoch: BigInt(update.rentEpoch),
	spaceBytes: update.spaceBytes,
	dataEncoding: update.dataEncoding,
})

const firstAccountUpdate = async (
	binding: NonNullable<import('$/resolvers/$resolvers.ts').ResolverContext['sourceBinding']>,
	pubkey: string,
	signal?: AbortSignal
) => {
	const { subscribeSolanaAccountUpdates } = await import('$/sources/GetBlock/Yellowstone/queries.ts')
	for await (const update of subscribeSolanaAccountUpdates(binding, {
		accounts: [pubkey],
		commitment: 'confirmed',
	}, signal)) {
		if (update.account === pubkey)
			return update
	}
	throw new Error(`GetBlockYellowstone_Grpc: account update not found for ${pubkey}`)
}

export default {
	source: Source.GetBlockYellowstone_Grpc,

	resolvers: [
		defineResolver({
			entityType: EntityType.SolanaAccount,
			resolve: {
				NetworkPubkey: {
					resolve: async ({ $network, pubkey }, context) => {
						assertSolanaMainnet($network)
						if (context.sourceBinding == null)
							throw new Error('GetBlockYellowstone_Grpc: invocation binding is missing')

						const update = await firstAccountUpdate(context.sourceBinding, pubkey)
						const slot = BigInt(update.slot)
						const timestamp = yellowstoneAccountTimestampFields(
							{
								$network,
								pubkey,
							},
							update,
							slot
						)
						return {
							$$timestamps: [
								{
									[EntityMetaKey.Selector]: {
										$account: {
											$network,
											pubkey,
										},
										slot,
										source: Source.GetBlockYellowstone_Grpc,
									},
									[EntityMetaKey.Fields]: {
										[entityFieldAddressKey(EntityType.SolanaAccount_Timestamp, [], 'timestampMs')]: timestamp.timestampMs,
										[entityFieldAddressKey(EntityType.SolanaAccount_Timestamp, [], 'lamports')]: timestamp.lamports,
										[entityFieldAddressKey(EntityType.SolanaAccount_Timestamp, [], '$ownerProgram')]: timestamp.$ownerProgram,
										[entityFieldAddressKey(EntityType.SolanaAccount_Timestamp, [], 'executable')]: timestamp.executable,
										[entityFieldAddressKey(EntityType.SolanaAccount_Timestamp, [], 'rentEpoch')]: timestamp.rentEpoch,
										[entityFieldAddressKey(EntityType.SolanaAccount_Timestamp, [], 'spaceBytes')]: timestamp.spaceBytes,
										[entityFieldAddressKey(EntityType.SolanaAccount_Timestamp, [], 'dataEncoding')]: timestamp.dataEncoding,
									},
								},
							],
						}
					},
				},
			},
		})({
			$$timestamps: (account) => account.$$timestamps,
		}),

		defineResolver({
			entityType: EntityType.SolanaAccount_Timestamp,
			resolve: {
				AccountSlotSource: {
					resolve: async ({ $account, slot, source }, context) => {
						if (source !== Source.GetBlockYellowstone_Grpc)
							throw new Error(`GetBlockYellowstone_Grpc: unsupported source ${source}`)

						assertSolanaMainnet($account.$network)
						if (context.sourceBinding == null)
							throw new Error('GetBlockYellowstone_Grpc: invocation binding is missing')

						const { subscribeSolanaAccountUpdates } = await import('$/sources/GetBlock/Yellowstone/queries.ts')
						for await (const update of subscribeSolanaAccountUpdates(context.sourceBinding, {
							accounts: [$account.pubkey],
							commitment: 'confirmed',
						})) {
							if (update.account !== $account.pubkey || BigInt(update.slot) !== slot)
								continue

							return yellowstoneAccountTimestampFields($account, update, slot)
						}

						throw new Error(`GetBlockYellowstone_Grpc: account update not found at slot ${slot.toString()}`)
					},
				},
			},
			resolveLive: {
				accountUpdates: {
					facetPath: [],
					publishes: {
						timestampMs: true,
						lamports: true,
						'$ownerProgram': true,
						executable: true,
						rentEpoch: true,
						spaceBytes: true,
						dataEncoding: true,
					},
					start: async ({
						fields,
						parentEntitySelector,
						signal,
						trigger,
					}) => {
						assertSolanaMainnet(parentEntitySelector.$account.$network)

						const { subscribeSolanaAccountUpdates } = await import('$/sources/GetBlock/Yellowstone/queries.ts')
						for await (const update of subscribeSolanaAccountUpdates(trigger.sourceBinding, {
							accounts: [parentEntitySelector.$account.pubkey],
							commitment: 'confirmed',
						}, signal)) {
							if (signal.aborted)
								break
							if (update.account !== parentEntitySelector.$account.pubkey)
								continue

							fields.timestampMs.replaceRows([{
								source: Source.GetBlockYellowstone_Grpc,
								value: update.timestampMs,
							}])
							fields.lamports.replaceRows([{
								source: Source.GetBlockYellowstone_Grpc,
								value: BigInt(update.lamports),
							}])
							fields.$ownerProgram.replaceRows([{
								source: Source.GetBlockYellowstone_Grpc,
								value: {
									[EntityMetaKey.Selector]: {
										$network: parentEntitySelector.$account.$network,
										programId: update.ownerProgramId,
									},
								},
							}])
							fields.executable.replaceRows([{
								source: Source.GetBlockYellowstone_Grpc,
								value: update.executable,
							}])
							fields.rentEpoch.replaceRows([{
								source: Source.GetBlockYellowstone_Grpc,
								value: BigInt(update.rentEpoch),
							}])
							fields.spaceBytes.replaceRows([{
								source: Source.GetBlockYellowstone_Grpc,
								value: update.spaceBytes,
							}])
							fields.dataEncoding.replaceRows([{
								source: Source.GetBlockYellowstone_Grpc,
								value: update.dataEncoding,
							}])
						}
					},
				},
			},
		})({
			$account: (update) => update.$account,
			slot: (update) => update.slot,
			source: (update) => update.source,
			timestampMs: (update) => update.timestampMs,
			lamports: (update) => update.lamports,
			$ownerProgram: (update) => update.$ownerProgram,
			executable: (update) => update.executable,
			rentEpoch: (update) => update.rentEpoch,
			spaceBytes: (update) => update.spaceBytes,
			dataEncoding: (update) => update.dataEncoding,
		}),
	],
} satisfies RegisteredSourceResolverModule

import { networkBySlug } from '$/constants/Network.ts'
import { defineResolver } from '$/resolvers/defineResolver.ts'
import { EntityMetaKey } from '$/schema/$schema.ts'
import { EntityType } from '$/schema/EntityType.ts'
import { Source } from '$/sources/Source.ts'

export default {
	source: Source.GetBlockYellowstone_Grpc,

	resolvers: [
		defineResolver(Source.GetBlockYellowstone_Grpc, {
			entityType: EntityType.SolanaAccount_Timestamp,
			resolve: {
				AccountSlotSource: {
					resolve: async ({ $account, slot, source }) => {
						if (source !== Source.GetBlockYellowstone_Grpc)
							throw new Error(`GetBlockYellowstone_Grpc: unsupported source ${source}`)

						if (
							$account.$network.caip2.namespace !== networkBySlug.solana.caip2.namespace
							|| $account.$network.caip2.reference !== networkBySlug.solana.caip2.reference
						)
							throw new Error('GetBlockYellowstone_Grpc: unsupported network')

						const { subscribeSolanaAccountUpdates } = await import('$/sources/GetBlock/Yellowstone/queries.ts')
						for await (const update of subscribeSolanaAccountUpdates({
							accounts: [$account.pubkey],
							commitment: 'confirmed',
						})) {
							if (update.account !== $account.pubkey || BigInt(update.slot) !== slot)
								continue

							return {
								timestampMs: update.timestampMs,
								lamports: BigInt(update.lamports),
								$ownerProgram: {
									[EntityMetaKey.Selector]: {
										$network: $account.$network,
										programId: update.ownerProgramId,
									},
								},
								executable: update.executable,
								rentEpoch: BigInt(update.rentEpoch),
								spaceBytes: update.spaceBytes,
								dataEncoding: update.dataEncoding,
							}
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
					}) => {
						if (
							parentEntitySelector.$account.$network.caip2.namespace !== networkBySlug.solana.caip2.namespace
							|| parentEntitySelector.$account.$network.caip2.reference !== networkBySlug.solana.caip2.reference
						)
							throw new Error('GetBlockYellowstone_Grpc: unsupported live network')

						const { subscribeSolanaAccountUpdates } = await import('$/sources/GetBlock/Yellowstone/queries.ts')
						for await (const update of subscribeSolanaAccountUpdates({
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
			timestampMs: (update) => update.timestampMs,
			lamports: (update) => update.lamports,
			$ownerProgram: (update) => update.$ownerProgram,
			executable: (update) => update.executable,
			rentEpoch: (update) => update.rentEpoch,
			spaceBytes: (update) => update.spaceBytes,
			dataEncoding: (update) => update.dataEncoding,
		}),
	],
}

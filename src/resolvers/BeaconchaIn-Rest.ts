import {
	defineResolver,
} from '$/resolvers/defineResolver.ts'
import { EntityType } from '$/schema/EntityType.ts'
import { Source } from '$/sources/Source.ts'
import { BeaconEpochSelector } from '$/schema/BeaconEpoch.ts'

export default {
	source: Source.BeaconchaIn_Rest,

	resolvers: [
		defineResolver(Source.BeaconchaIn_Rest, {
			entityType: EntityType.BeaconEpoch,
			resolve: {
				[BeaconEpochSelector.EvmNetworkEpoch]: async ({ $network, epoch: epochSelector }, context) => {
				const {
					beaconchaInApiBaseByExecutionChainId,
				} = await import('$/sources/BeaconchaIn/Rest/constants.ts')
				const {
					getEpoch,
				} = await import('$/sources/BeaconchaIn/Rest/queries.ts')
				const epoch = await getEpoch(
					context.publicEnv,
					{
						apiBase: beaconchaInApiBaseByExecutionChainId[Number($network.caip2.reference)],
						epoch: epochSelector,
					}
				)
				if (epoch == null) {
					throw new Error(`BeaconchaIn_Rest: epoch ${String(epoch)} not found`)
				}
				return {
					...(epoch.finalized != null && { finalized: epoch.finalized }),
					...(epoch.globalparticipationrate != null && { globalParticipationRate: epoch.globalparticipationrate }),
					...(epoch.validatorscount != null && { validatorsCount: epoch.validatorscount }),
					...(epoch.attestationscount != null && { attestationsCount: epoch.attestationscount }),
					...(epoch.attesterslashingscount != null && { attesterSlashingsCount: epoch.attesterslashingscount }),
					...(epoch.proposerslashingscount != null && { proposerSlashingsCount: epoch.proposerslashingscount }),
					...(epoch.withdrawalcount != null && { withdrawalsCount: epoch.withdrawalcount }),
				}
			}
			}
		})({
				fields: {
			finalized: (snapshot) => snapshot.finalized,
			globalParticipationRate: (snapshot) => snapshot.globalParticipationRate,
			validatorsCount: (snapshot) => snapshot.validatorsCount,
			attestationsCount: (snapshot) => snapshot.attestationsCount,
			attesterSlashingsCount: (snapshot) => snapshot.attesterSlashingsCount,
			proposerSlashingsCount: (snapshot) => snapshot.proposerSlashingsCount,
			withdrawalsCount: (snapshot) => snapshot.withdrawalsCount,
		},
			}),
	],
}

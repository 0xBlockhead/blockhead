import { singleFlight } from '$/lib/singleFlight.ts'
import {
	defineResolver,
} from '$/resolvers/$resolvers.ts'
import { EntityType } from '$/schema/$EntityType.ts'
import { EntityIdProjection } from '$/schema/$EntityDefinition.ts'
import { Source } from '$/sources/$Source.ts'

export default {
	source: Source.BeaconchaIn_Rest,

	resolvers: [
		defineResolver(Source.BeaconchaIn_Rest, {
			entityType: EntityType.BeaconEpoch,
			resolve: {
				[EntityIdProjection.Identity]: async (entityId, context) => {
				const {
					beaconchaInApiBaseByExecutionChainId,
				} = await import('$/sources/BeaconchaIn/Rest/constants.ts')
				const {
					getEpoch,
				} = await import('$/sources/BeaconchaIn/Rest/queries.ts')
				const epoch = await singleFlight(getEpoch)(
					context.publicEnv,
					{
						apiBase: beaconchaInApiBaseByExecutionChainId[Number(entityId.$network.caip2.reference)],
						epoch: entityId.epoch,
					},
				)
				if (epoch == null) {
					throw new Error(`BeaconchaIn_Rest: epoch ${String(entityId.epoch)} not found`)
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
			},
			fields: {
			finalized: (snapshot) => snapshot.finalized,
			globalParticipationRate: (snapshot) => snapshot.globalParticipationRate,
			validatorsCount: (snapshot) => snapshot.validatorsCount,
			attestationsCount: (snapshot) => snapshot.attestationsCount,
			attesterSlashingsCount: (snapshot) => snapshot.attesterSlashingsCount,
			proposerSlashingsCount: (snapshot) => snapshot.proposerSlashingsCount,
			withdrawalsCount: (snapshot) => snapshot.withdrawalsCount,
		}
		}),
	],
}

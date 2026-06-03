import { singleFlight } from '$/lib/singleFlight.ts'
import {
	defineEntityResolver,
	sourcePublicEnv,
} from '$/resolvers/$resolvers.ts'
import { EntityType } from '$/schema/$EntityType.ts'
import { Source } from '$/sources/$Source.ts'

export default {
	source: Source.BeaconchaIn_Rest,

	entityResolvers: [
		defineEntityResolver({
			entityType: EntityType.BeaconEpoch,
			resolve: async (entityId, context) => {
				const {
					beaconchaInApiBaseByExecutionChainId,
				} = await import('$/sources/BeaconchaIn/Rest/constants.ts')
				const {
					getEpoch,
				} = await import('$/sources/BeaconchaIn/Rest/queries.ts')
				const epoch = await singleFlight(getEpoch)(
					sourcePublicEnv(context, Source.BeaconchaIn_Rest),
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
			},
		}),
	],

	entityFieldResolvers: [],
}

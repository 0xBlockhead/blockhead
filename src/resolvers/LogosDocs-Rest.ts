import {
	defineEntityResolver,
} from '$/resolvers/$resolvers.ts'
import { EntityType } from '$/schema/$EntityType.ts'
import { Source } from '$/sources/$Source.ts'

type NetworkId = { caip2: { namespace: string; reference: string } } | { networkSlug: string }

const assertLogosStack = (network: NetworkId) => {
	if (!('networkSlug' in network) || network.networkSlug !== 'logos-testnet') {
		throw new Error('LogosDocs_Rest: unsupported network')
	}
}

export default {
	source: Source.LogosDocs_Rest,

	entityResolvers: [
		defineEntityResolver({
			entityType: EntityType.LogosZone,
			resolve: async (entityId) => {
				assertLogosStack(entityId.$network)
				const { getNetworkSummary } = await import('$/sources/LogosDocs/Rest/queries.ts')
				return {
					...(getNetworkSummary.primaryComponents.some((component) => component === entityId.zoneId) && {
						zoneKind: (
							entityId.zoneId === 'Logos Chain' ?
								'blockchain'
							: entityId.zoneId === 'DVCI' ?
								'distributed-virtual-computing-infrastructure'
							: entityId.zoneId === 'Network Gatekeeper' ?
								'access-control'
							:
								'computation-distribution-regulator'
						),
					}),
				}
			},
		}),

		defineEntityResolver({
			entityType: EntityType.LogosAccount,
			resolve: async (entityId) => {
				assertLogosStack(entityId.$network)
				return {}
			},
		}),

		defineEntityResolver({
			entityType: EntityType.LogosTransaction,
			resolve: async (entityId) => {
				assertLogosStack(entityId.$network)
				return {}
			},
		}),
	],

	entityFieldResolvers: [],
}

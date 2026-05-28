import {
	defineEntityResolver,
} from '$/resolvers/$resolvers.ts'
import { NetworkNamespace } from '$/constants/Network.ts'
import { EntityType } from '$/schema/$EntityType.ts'
import { Source } from '$/sources/$Source.ts'

const assertLogosStack = (network: { namespace: string; reference: string }) => {
	if (network.namespace !== NetworkNamespace.Logos || network.reference !== 'stack') {
		throw new Error(`LogosDocs_Rest: unsupported network ${network.namespace}:${network.reference}`)
	}
}

export default {
	source: Source.LogosDocs_Rest,

	entityResolvers: [
		defineEntityResolver({
			entityType: EntityType.LogosZone,
			resolve: async (entityId) => {
				assertLogosStack(entityId.$network)
				const { logosDocsNetworkSummary } = await import('$/sources/LogosDocs/Rest/queries.ts')
				return {
					...(logosDocsNetworkSummary.primaryComponents.some((component) => component === entityId.zoneId) && {
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

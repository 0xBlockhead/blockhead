import {
	defineResolver,
} from '$/resolvers/defineResolver.ts'
import { EntityType } from '$/schema/EntityType.ts'
import { EntityIdProjection } from '$/schema/$schema.ts'
import { Source } from '$/sources/Source.ts'

type NetworkId = { caip2: { namespace: string; reference: string } } | { networkSlug: string }

const assertLogosStack = (network: NetworkId) => {
	if (!('networkSlug' in network) || network.networkSlug !== 'logos-testnet') {
		throw new Error('LogosDocs_Rest: unsupported network')
	}
}

export default {
	source: Source.LogosDocs_Rest,

	resolvers: [
		defineResolver(Source.LogosDocs_Rest, {
			entityType: EntityType.LogosZone,
			resolve: {
				[EntityIdProjection.Identity]: async (entityId) => {
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
			}
			}
		})({
				fields: {
			zoneKind: (snapshot) => snapshot.zoneKind,
		},
			}),

		defineResolver(Source.LogosDocs_Rest, {
			entityType: EntityType.LogosAccount,
			resolve: {
				[EntityIdProjection.Identity]: async (entityId) => {
				assertLogosStack(entityId.$network)
				return {}
			}
			}
		})({
				fields: {
		},
			}),

		defineResolver(Source.LogosDocs_Rest, {
			entityType: EntityType.LogosTransaction,
			resolve: {
				[EntityIdProjection.Identity]: async (entityId) => {
				assertLogosStack(entityId.$network)
				return {}
			}
			}
		})({
				fields: {
		},
			}),
	],
}

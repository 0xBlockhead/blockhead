import {
	defineResolver,
} from '$/resolvers/defineResolver.ts'
import { EntityType } from '$/schema/EntityType.ts'
import { Source } from '$/sources/Source.ts'
import { LogosZoneSelector } from '$/schema/LogosZone.ts'

type NetworkId = { caip2: { namespace: string; reference: string } } | { networkSlug: string } | { slug: string }

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
				[LogosZoneSelector.NetworkZoneId]: async ({ $network, zoneId }) => {
					assertLogosStack($network)
					const { getNetworkSummary } = await import('$/sources/LogosDocs/Rest/queries.ts')
					return {
						...(getNetworkSummary.primaryComponents.some((component) => component === zoneId) && {
							zoneKind: (
								zoneId === 'Logos Chain' ?
									'blockchain'
								: zoneId === 'DVCI' ?
									'distributed-virtual-computing-infrastructure'
								: zoneId === 'Network Gatekeeper' ?
									'access-control'
								:
									'computation-distribution-regulator'
							),
						}),
					}
				},
			},
		})({
			fields: {
				zoneKind: (snapshot) => snapshot.zoneKind,
			},
		}),
	],
}

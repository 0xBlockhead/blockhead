import {
	defineResolver,
} from '$/resolvers/defineResolver.ts'
import { EntityType } from '$/schema/EntityType.ts'
import { Source } from '$/sources/Source.ts'
import { LogosZoneSelector } from '$/schema/LogosZone.ts'
import { LogosAccountSelector } from '$/schema/LogosAccount.ts'
import { LogosTransactionSelector } from '$/schema/LogosTransaction.ts'

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
				[LogosZoneSelector.NetworkZoneId]: async ({ $network, zoneId }) => {
				assertLogosStack($network)
				const { getNetworkSummary } = await import('$/sources/LogosDocs/Rest/queries.ts')
				return {
					...(getNetworkSummary.primaryComponents.some((component) => component === entitySelector.zoneId) && {
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
				[LogosAccountSelector.NetworkAccountAddress]: async ({ $network }) => {
				assertLogosStack($network)
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
				[LogosTransactionSelector.NetworkTransactionHash]: async ({ $network }) => {
				assertLogosStack($network)
				return {}
			}
			}
		})({
				fields: {
		},
			}),
	],
}

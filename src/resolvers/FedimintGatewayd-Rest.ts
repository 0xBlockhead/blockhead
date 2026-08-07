/**
 * Local Fedimint gatewayd REST — operator observation surface.
 *
 * Projects enrolled `FedimintGateway` / `FedimintFederation` rows from admin
 * `/v1/info` + `/v1/balances` (+ channels / payment summary). Does not project
 * spend/receive ecash or other wallet-key-gated mutations.
 */
import { resolverContextRowLimit } from '$/resolvers/$resolvers.ts'
import {
	defineResolver,
	type RegisteredSourceResolverModule,
} from '$/resolvers/defineResolver.ts'
import {
	EntityMetaKey,
} from '$/schema/$schema.ts'
import { EntityType } from '$/schema/EntityType.ts'
import { Source } from '$/sources/Source.ts'
import type { SourcePublicEnv } from '$/sources/$sources.ts'
import type {
	FedimintFederationInfoWire,
	FedimintGatewayBalancesWire,
	FedimintGatewayInfoWire,
} from '$/sources/FedimintGatewayd/Rest/types.ts'

const assertLocalGateway = async (
	gatewayId: string,
	publicEnv: SourcePublicEnv
) => {
	const { getGatewayId } = await import('$/sources/FedimintGatewayd/Rest/queries.ts')
	const remoteGatewayId = await getGatewayId({
		publicEnv,
	})
	if (gatewayId !== remoteGatewayId)
		throw new Error(`FedimintGatewayd_Rest: gateway id mismatch (requested ${gatewayId}, remote ${remoteGatewayId})`)

	return remoteGatewayId
}

const nodePubkeyFromInfo = (
	info: FedimintGatewayInfoWire
) => (
	typeof info.lightning_info === 'object'
	&& info.lightning_info !== null
	&& 'connected' in info.lightning_info ?
		info.lightning_info.connected.public_key
	:
		undefined
)

const lightningAliasFromInfo = (
	info: FedimintGatewayInfoWire
) => (
	typeof info.lightning_info === 'object'
	&& info.lightning_info !== null
	&& 'connected' in info.lightning_info ?
		info.lightning_info.connected.alias
	:
		undefined
)

const onlineFromInfo = (
	info: FedimintGatewayInfoWire
) => (
	typeof info.lightning_info === 'object'
	&& info.lightning_info !== null
	&& 'connected' in info.lightning_info
)

const routingFeesFromFederations = (
	federations: FedimintFederationInfoWire[]
) => (
	JSON.stringify(
		federations.map((federation) => ({
			federationId: federation.federation_id,
			lightningFee: federation.config.lightning_fee,
			transactionFee: federation.config.transaction_fee,
		}))
	)
)

const totalEcashBalanceMsat = (
	balances: FedimintGatewayBalancesWire
) => (
	balances.ecash_balances.reduce(
		(sum, row) => (
			sum + BigInt(row.ecash_balance_msats)
		),
		0n
	)
)

export default {
	source: Source.FedimintGatewayd_Rest,

	resolvers: [
		defineResolver({
			entityType: EntityType.FedimintGateway,
			resolve: {
				GatewayId: {
					resolve: async ({ gatewayId }, context) => {
						await assertLocalGateway(gatewayId, context.publicEnv)
						const {
							getGatewayInfo,
							resolvedGatewayApiUrl,
						} = await import('$/sources/FedimintGatewayd/Rest/queries.ts')
						const info = await getGatewayInfo({
							publicEnv: context.publicEnv,
						})
						const timestampMs = Date.now()
						const nodePubkey = nodePubkeyFromInfo(info)

						return {
							gatewayId,
							apiUrl: resolvedGatewayApiUrl(context.publicEnv),
							...(nodePubkey != null && {
								nodePubkey,
							}),
							$$federations: info.federations
								.slice(0, resolverContextRowLimit(context))
								.map((federation) => ({
									[EntityMetaKey.Selector]: {
										federationId: federation.federation_id,
									},
								})),
							$$timestamps: [{
								[EntityMetaKey.Selector]: {
									$gateway: { gatewayId },
									timestampMs,
									source: Source.FedimintGatewayd_Rest,
								},
							}],
						}
					},
				},
			},
		})({
			gatewayId: (snapshot) => snapshot.gatewayId,
			apiUrl: (snapshot) => snapshot.apiUrl,
			nodePubkey: (snapshot) => snapshot.nodePubkey,
			$$federations: (snapshot) => snapshot.$$federations,
			$$timestamps: (snapshot) => snapshot.$$timestamps,
		}),

		defineResolver({
			entityType: EntityType.FedimintGateway_Timestamp,
			resolve: {
				GatewayTimestampMsSource: {
					resolve: async ({ $gateway, timestampMs, source }, context) => {
						if (source !== Source.FedimintGatewayd_Rest)
							throw new Error(`FedimintGatewayd_Rest: unsupported source ${source}`)

						await assertLocalGateway($gateway.gatewayId, context.publicEnv)
						const {
							getGatewayBalances,
							getGatewayInfo,
							getPaymentSummary,
							listChannels,
						} = await import('$/sources/FedimintGatewayd/Rest/queries.ts')
						const [info, balances, channels, paymentSummary] = await Promise.all([
							getGatewayInfo({
								publicEnv: context.publicEnv,
							}),
							getGatewayBalances({
								publicEnv: context.publicEnv,
							}),
							listChannels({
								publicEnv: context.publicEnv,
							}),
							getPaymentSummary({
								publicEnv: context.publicEnv,
								startMs: timestampMs - 30 * 24 * 60 * 60 * 1000,
								endMs: timestampMs,
							}),
						])
						const lightningAlias = lightningAliasFromInfo(info)

						return {
							$gateway: { [EntityMetaKey.Selector]: $gateway },
							timestampMs,
							source,
							reachable: true,
							online: onlineFromInfo(info),
							version: info.version_hash,
							...(lightningAlias != null && lightningAlias !== '' && {
								lightningAlias,
							}),
							routingFeesJson: routingFeesFromFederations(info.federations),
							federationsCount: info.federations.length,
							lightningBalanceMsat: BigInt(balances.lightning_balance_msats),
							ecashBalanceMsat: totalEcashBalanceMsat(balances),
							onchainBalanceSats: BigInt(balances.onchain_balance_sats),
							channelsJson: JSON.stringify(channels),
							paymentSummaryJson: JSON.stringify(paymentSummary),
						}
					},
				},
			},
		})({
			$gateway: (snapshot) => snapshot.$gateway,
			timestampMs: (snapshot) => snapshot.timestampMs,
			source: (snapshot) => snapshot.source,
			reachable: (snapshot) => snapshot.reachable,
			online: (snapshot) => snapshot.online,
			version: (snapshot) => snapshot.version,
			lightningAlias: (snapshot) => snapshot.lightningAlias,
			routingFeesJson: (snapshot) => snapshot.routingFeesJson,
			federationsCount: (snapshot) => snapshot.federationsCount,
			lightningBalanceMsat: (snapshot) => snapshot.lightningBalanceMsat,
			ecashBalanceMsat: (snapshot) => snapshot.ecashBalanceMsat,
			onchainBalanceSats: (snapshot) => snapshot.onchainBalanceSats,
			channelsJson: (snapshot) => snapshot.channelsJson,
			paymentSummaryJson: (snapshot) => snapshot.paymentSummaryJson,
		}),

		defineResolver({
			entityType: EntityType.FedimintFederation,
			resolve: {
				FederationId: {
					resolve: async ({ federationId }, context) => {
						const {
							getGatewayId,
							getGatewayInfo,
						} = await import('$/sources/FedimintGatewayd/Rest/queries.ts')
						const info = await getGatewayInfo({
							publicEnv: context.publicEnv,
						})
						const federation = info.federations.find((row) => row.federation_id === federationId)
						if (federation == null)
							throw new Error(`FedimintGatewayd_Rest: federation not found for ${federationId}`)

						const gatewayId = await getGatewayId({
							publicEnv: context.publicEnv,
						})
						const timestampMs = Date.now()
						return {
							federationId,
							...(federation.federation_name != null && {
								name: federation.federation_name,
							}),
							$$gateways: [{
								[EntityMetaKey.Selector]: {
									gatewayId,
								},
							}],
							$$timestamps: [{
								[EntityMetaKey.Selector]: {
									$federation: { federationId },
									timestampMs,
									source: Source.FedimintGatewayd_Rest,
								},
							}],
						}
					},
				},
			},
		})({
			federationId: (snapshot) => snapshot.federationId,
			name: (snapshot) => snapshot.name,
			$$gateways: (snapshot) => snapshot.$$gateways,
			$$timestamps: (snapshot) => snapshot.$$timestamps,
		}),

		defineResolver({
			entityType: EntityType.FedimintFederation_Timestamp,
			resolve: {
				FederationTimestampMsSource: {
					resolve: async ({ $federation, timestampMs, source }, context) => {
						if (source !== Source.FedimintGatewayd_Rest)
							throw new Error(`FedimintGatewayd_Rest: unsupported source ${source}`)

						const { getGatewayInfo } = await import('$/sources/FedimintGatewayd/Rest/queries.ts')
						const info = await getGatewayInfo({
							publicEnv: context.publicEnv,
						})
						const federation = info.federations.find((row) => row.federation_id === $federation.federationId)
						if (federation == null)
							throw new Error(`FedimintGatewayd_Rest: federation not found for ${$federation.federationId}`)

						return {
							$federation: { [EntityMetaKey.Selector]: $federation },
							timestampMs,
							source,
							reachable: true,
							health: info.gateway_state,
							gatewayCount: 1,
							inviteCodeObserved: federation.config.invite_code.length > 0,
							metaJson: JSON.stringify({
								federationIndex: federation.config.federation_index,
								balanceMsat: federation.balance_msat,
							}),
						}
					},
				},
			},
		})({
			$federation: (snapshot) => snapshot.$federation,
			timestampMs: (snapshot) => snapshot.timestampMs,
			source: (snapshot) => snapshot.source,
			reachable: (snapshot) => snapshot.reachable,
			health: (snapshot) => snapshot.health,
			gatewayCount: (snapshot) => snapshot.gatewayCount,
			inviteCodeObserved: (snapshot) => snapshot.inviteCodeObserved,
			metaJson: (snapshot) => snapshot.metaJson,
		}),
	],
} satisfies RegisteredSourceResolverModule

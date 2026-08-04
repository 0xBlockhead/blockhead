import { defineResolver, type RegisteredSourceResolverModule } from '$/resolvers/defineResolver.ts'
import {
	entityFieldAddressKey,
	EntityMetaKey,
	type EntitySelector,
} from '$/schema/$schema.ts'
import { EntityType } from '$/schema/EntityType.ts'
import { schema } from '$/schema/index.ts'
import { OptimisticProviderResult } from '$/schema/OptimisticProviderResult.ts'
import { Source } from '$/sources/Source.ts'

const millisecondsPerUtcDay = 86_400_000

export const resolveNetworkActivityDay = async ({
	network,
	dayStartTimestampMs,
	nowMs = Date.now(),
}: {
	network: EntitySelector<typeof schema, EntityType.Network>
	dayStartTimestampMs: number
	nowMs?: number
}) => {
	if (!('caip2' in network))
		throw new Error('SpaceAndTime_MakeInfinite: network must use a CAIP-2 selector')
	if (network.caip2.namespace !== 'eip155' || network.caip2.reference !== '1')
		throw new Error(`SpaceAndTime_MakeInfinite: unsupported network ${network.caip2.namespace}:${network.caip2.reference}`)
	if (!Number.isSafeInteger(dayStartTimestampMs) || dayStartTimestampMs < 0 || dayStartTimestampMs % millisecondsPerUtcDay !== 0)
		throw new Error(`SpaceAndTime_MakeInfinite: invalid UTC day ${dayStartTimestampMs}`)

	const dayEndTimestampMs = dayStartTimestampMs + millisecondsPerUtcDay
	if (dayEndTimestampMs > Math.floor(nowMs / millisecondsPerUtcDay) * millisecondsPerUtcDay)
		throw new Error('SpaceAndTime_MakeInfinite: incomplete UTC day')

	const { getActivityDay } = await import('$/sources/SpaceAndTime/MakeInfinite/queries.ts')
	const aggregate = await getActivityDay({
		dayStartTimestampMs,
	})
	if (aggregate == null)
		return undefined
	if (aggregate.indexedThroughTimestampMs < dayEndTimestampMs)
		throw new Error('SpaceAndTime_MakeInfinite: stale indexed cursor')

	return {
		$network: network,
		dayStartTimestampMs,
		source: Source.SpaceAndTime_MakeInfinite,
		...aggregate,
		resolvedAtMs: nowMs,
		trustModel: OptimisticProviderResult.OptimisticProviderResult,
	}
}

export default {
	source: Source.SpaceAndTime_MakeInfinite,

	resolvers: [
		defineResolver({
			entityType: EntityType.Network,
			resolve: {
				Caip2: {
					resolve: async (network) => {
						const activityDay = await resolveNetworkActivityDay({
							network,
							dayStartTimestampMs: Math.floor(Date.now() / millisecondsPerUtcDay) * millisecondsPerUtcDay - millisecondsPerUtcDay,
						})
						if (activityDay == null)
							return []

						return [{
							[EntityMetaKey.Selector]: {
								$network: activityDay.$network,
								dayStartTimestampMs: activityDay.dayStartTimestampMs,
								source: activityDay.source,
							},
							[EntityMetaKey.Fields]: {
								[entityFieldAddressKey(EntityType.Network_Activity_Day, [], 'blockCount')]: activityDay.blockCount,
								[entityFieldAddressKey(EntityType.Network_Activity_Day, [], 'transactionCount')]: activityDay.transactionCount,
								[entityFieldAddressKey(EntityType.Network_Activity_Day, [], 'endBlockNumber')]: activityDay.endBlockNumber,
								[entityFieldAddressKey(EntityType.Network_Activity_Day, [], 'indexedThroughTimestampMs')]: activityDay.indexedThroughTimestampMs,
								[entityFieldAddressKey(EntityType.Network_Activity_Day, [], 'resolvedAtMs')]: activityDay.resolvedAtMs,
								[entityFieldAddressKey(EntityType.Network_Activity_Day, [], 'trustModel')]: activityDay.trustModel,
							},
						}]
					},
				},
			},
		})({
			Evm: {
				$$activityDays: (activityDays) => activityDays,
			},
		}),

		defineResolver({
			entityType: EntityType.Network_Activity_Day,
			resolve: {
				NetworkDayStartTimestampMsSource: {
					resolve: async ({ $network, dayStartTimestampMs, source }) => {
						if (source !== Source.SpaceAndTime_MakeInfinite)
							throw new Error(`SpaceAndTime_MakeInfinite: unsupported source ${source}`)

						return resolveNetworkActivityDay({
							network: $network,
							dayStartTimestampMs,
						})
					},
				},
			},
		})({
			blockCount: (activityDay) => activityDay?.blockCount,
			transactionCount: (activityDay) => activityDay?.transactionCount,
			endBlockNumber: (activityDay) => activityDay?.endBlockNumber,
			indexedThroughTimestampMs: (activityDay) => activityDay?.indexedThroughTimestampMs,
			resolvedAtMs: (activityDay) => activityDay?.resolvedAtMs,
			trustModel: (activityDay) => activityDay?.trustModel,
		}),
	],
} satisfies RegisteredSourceResolverModule

import { networkBySlug } from '$/constants/Network.ts'
import { resolverContextRowLimit } from '$/resolvers/$resolvers.ts'
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

const assertEthereumMainnet = (
	network: EntitySelector<typeof schema, EntityType.Network>
) => {
	if (
		(
			'caip2' in network
			&& network.caip2.namespace === networkBySlug.ethereum.caip2.namespace
			&& network.caip2.reference === networkBySlug.ethereum.caip2.reference
		)
		|| (
			'slug' in network
			&& network.slug === networkBySlug.ethereum.slug
		)
	)
		return

	throw new Error(
		'caip2' in network ?
			`SpaceAndTime_MakeInfinite: unsupported network ${network.caip2.namespace}:${network.caip2.reference}`
		:
			`SpaceAndTime_MakeInfinite: unsupported network ${network.slug}`
	)
}

export const resolveNetworkActivityDay = async ({
	network,
	dayStartTimestampMs,
	nowMs = Date.now(),
}: {
	network: EntitySelector<typeof schema, EntityType.Network>
	dayStartTimestampMs: number
	nowMs?: number
}) => {
	assertEthereumMainnet(network)
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

const activityDayEntityFields = (
	activityDay: NonNullable<Awaited<ReturnType<typeof resolveNetworkActivityDay>>>
) => ({
	[entityFieldAddressKey(EntityType.Network_Activity_Day, [], 'blockCount')]: activityDay.blockCount,
	[entityFieldAddressKey(EntityType.Network_Activity_Day, [], 'transactionCount')]: activityDay.transactionCount,
	[entityFieldAddressKey(EntityType.Network_Activity_Day, [], 'endBlockNumber')]: activityDay.endBlockNumber,
	[entityFieldAddressKey(EntityType.Network_Activity_Day, [], 'indexedThroughTimestampMs')]: activityDay.indexedThroughTimestampMs,
	[entityFieldAddressKey(EntityType.Network_Activity_Day, [], 'resolvedAtMs')]: activityDay.resolvedAtMs,
	[entityFieldAddressKey(EntityType.Network_Activity_Day, [], 'trustModel')]: activityDay.trustModel,
})

const recentCompletedActivityDays = async (
	network: EntitySelector<typeof schema, EntityType.Network>,
	context: Parameters<typeof resolverContextRowLimit>[0]
) => {
	assertEthereumMainnet(network)
	const limit = Math.max(1, resolverContextRowLimit(context))
	const nowMs = Date.now()
	const latestCompletedDayStartTimestampMs = (
		Math.floor(nowMs / millisecondsPerUtcDay) * millisecondsPerUtcDay
		- millisecondsPerUtcDay
	)

	const activityDays = []
	for (let dayOffset = 0; dayOffset < limit; dayOffset++) {
		const activityDay = await resolveNetworkActivityDay({
			network,
			dayStartTimestampMs: latestCompletedDayStartTimestampMs - dayOffset * millisecondsPerUtcDay,
			nowMs,
		})
		if (activityDay == null)
			continue

		activityDays.push({
			[EntityMetaKey.Selector]: {
				$network: activityDay.$network,
				dayStartTimestampMs: activityDay.dayStartTimestampMs,
				source: activityDay.source,
			},
			[EntityMetaKey.Fields]: activityDayEntityFields(activityDay),
		})
	}

	return activityDays
}

const networkActivityDaysResolvers = {
	Caip2: {
		resolve: recentCompletedActivityDays,
	},
	Slug: {
		resolve: recentCompletedActivityDays,
	},
} as const

export default {
	source: Source.SpaceAndTime_MakeInfinite,

	resolvers: [
		defineResolver({
			entityType: EntityType.Network,
			resolve: networkActivityDaysResolvers,
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

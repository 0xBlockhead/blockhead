<!-- Generated from APP.ts. -->

<script lang="ts">
	// Types/constants
	import { resolve } from '$app/paths'
	import EntitiesList, { type EntityListViewProps } from '$/components/EntitiesList.svelte'
	import { EntityMetaKey } from '$/schema/$schema.ts'
	import { EntityType } from '$/schema/EntityType.ts'
	import { caip2StringFromValue } from '$/lib/caip2.ts'


	// State
	let {
		selection,
		open = $bindable(true),
		...EntitiesListProps
	}: EntityListViewProps<EntityType.HederaSchedule_Timestamp> = $props()


	// Components
	import EntityView from '$/components/EntityView.svelte'
</script>


<EntitiesList
	{...EntitiesListProps}
	entityType={EntityType.HederaSchedule_Timestamp}
	bind:open
	resource={selection()}
>
	{#snippet Item({ item: hederaScheduleTimestamp })}
		{@const hederaScheduleTimestampSelector = hederaScheduleTimestamp[EntityMetaKey.Selector]}
		{@const schedule = hederaScheduleTimestampSelector.$schedule}
		<EntityView
			entityType={EntityType.HederaSchedule_Timestamp}
			entitySelector={hederaScheduleTimestampSelector}
			href={
				resolve(
					'/(explore)/(networks)/network/[network=networkCaip2OrNetworkSlug]/(network)/schedule/[scheduleId=stringSegment]/(hederaSchedule)/observations/[timestampMs=nonNegativeInteger]/[source=stringSegment]',
					{
						network: (
							'caip2' in schedule.$network ?
								caip2StringFromValue(schedule.$network.caip2)
							:
								schedule.$network.slug
						),
						scheduleId: schedule.scheduleId,
						timestampMs: String(hederaScheduleTimestampSelector.timestampMs),
						source: hederaScheduleTimestampSelector.source,
					}
				)
			}
		/>
	{/snippet}
</EntitiesList>

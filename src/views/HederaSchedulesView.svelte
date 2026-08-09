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
	}: EntityListViewProps<EntityType.HederaSchedule> = $props()


	// Components
	import EntityView from '$/components/EntityView.svelte'
</script>


<EntitiesList
	{...EntitiesListProps}
	entityType={EntityType.HederaSchedule}
	bind:open
	resource={selection()}
>
	{#snippet Item({ item: hederaSchedule })}
		{@const hederaScheduleSelector = hederaSchedule[EntityMetaKey.Selector]}
		{@const network = hederaScheduleSelector.$network}
		<EntityView
			entityType={EntityType.HederaSchedule}
			entitySelector={hederaScheduleSelector}
			href={
				resolve(
					'/(explore)/(networks)/network/[network=networkCaip2OrNetworkSlug]/(network)/schedule/[scheduleId=stringSegment]',
					{
						network: (
							'caip2' in network ?
								caip2StringFromValue(network.caip2)
							:
								network.slug
						),
						scheduleId: hederaScheduleSelector.scheduleId,
					}
				)
			}
		/>
	{/snippet}
</EntitiesList>

<!-- Generated from APP.ts. -->

<script lang="ts">
	// Types/constants
	import { resolve } from '$app/paths'
	import EntitiesList, { type EntityListViewProps } from '$/components/EntitiesList.svelte'
	import { EntityMetaKey } from '$/schema/$schema.ts'
	import { EntityType } from '$/schema/EntityType.ts'


	// State
	let {
		selection,
		open = $bindable(true),
		...EntitiesListProps
	}: EntityListViewProps<EntityType.UsageRight_Timestamp> = $props()


	// Components
	import EntityView from '$/components/EntityView.svelte'
</script>


<EntitiesList
	{...EntitiesListProps}
	entityType={EntityType.UsageRight_Timestamp}
	bind:open
	resource={selection()}
>
	{#snippet Item({ item: usageRightTimestamp })}
		{@const usageRightTimestampSelector = usageRightTimestamp[EntityMetaKey.Selector]}
		<EntityView
			entityType={EntityType.UsageRight_Timestamp}
			entitySelector={usageRightTimestampSelector}
			href={
				resolve(
					'/usage-right/[subjectKey=stringSegment]/[rightKey=stringSegment]/observations/[timestampMs=nonNegativeInteger]/[source=stringSegment]',
					{
						subjectKey: usageRightTimestampSelector.subjectKey,
						rightKey: usageRightTimestampSelector.rightKey,
						timestampMs: String(usageRightTimestampSelector.timestampMs),
						source: usageRightTimestampSelector.source,
					}
				)
			}
		/>
	{/snippet}
</EntitiesList>

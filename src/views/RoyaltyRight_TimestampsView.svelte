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
	}: EntityListViewProps<EntityType.RoyaltyRight_Timestamp> = $props()


	// Components
	import EntityView from '$/components/EntityView.svelte'
</script>


<EntitiesList
	{...EntitiesListProps}
	entityType={EntityType.RoyaltyRight_Timestamp}
	bind:open
	resource={selection()}
>
	{#snippet Item({ item: royaltyRightTimestamp })}
		{@const royaltyRightTimestampSelector = royaltyRightTimestamp[EntityMetaKey.Selector]}
		<EntityView
			entityType={EntityType.RoyaltyRight_Timestamp}
			entitySelector={royaltyRightTimestampSelector}
			href={
				resolve(
					'/royalty/[targetKey=stringSegment]/[rightKey=stringSegment]/observations/[timestampMs=nonNegativeInteger]/[source=stringSegment]',
					{
						targetKey: royaltyRightTimestampSelector.targetKey,
						rightKey: royaltyRightTimestampSelector.rightKey,
						timestampMs: String(royaltyRightTimestampSelector.timestampMs),
						source: royaltyRightTimestampSelector.source,
					}
				)
			}
		/>
	{/snippet}
</EntitiesList>

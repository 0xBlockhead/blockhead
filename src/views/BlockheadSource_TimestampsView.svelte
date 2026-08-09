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
		title = 'Source observations',
		open = $bindable(true),
		...EntitiesListProps
	}: EntityListViewProps<EntityType.BlockheadSource_Timestamp> = $props()


	// Components
	import EntityView from '$/components/EntityView.svelte'
</script>


<EntitiesList
	{...EntitiesListProps}
	entityType={EntityType.BlockheadSource_Timestamp}
	{title}
	bind:open
	resource={
		selection({
			...{
				fields: {
					timestampMs: true,
					health: true,
					enabled: true,
					latencyMs: true,
				},
			},
		})
	}
>
	{#snippet Item({ item: blockheadSourceTimestamp })}
		{@const blockheadSourceTimestampSelector = blockheadSourceTimestamp[EntityMetaKey.Selector]}
		<EntityView
			entityType={EntityType.BlockheadSource_Timestamp}
			entitySelector={blockheadSourceTimestampSelector}
			href={
				resolve(
					'/~/manage/source/[sourceId=stringSegment]/(blockheadSource)/observations/[timestampMs=nonNegativeInteger]',
					{
						sourceId: blockheadSourceTimestampSelector.$source.id,
						timestampMs: String(blockheadSourceTimestampSelector.timestampMs),
					}
				)
			}
		>
			{#snippet Title()}
				{blockheadSourceTimestampSelector.timestampMs}
			{/snippet}

			{#snippet Value()}
				{[(blockheadSourceTimestamp.health ?? ''), String(blockheadSourceTimestamp.enabled ?? '')].filter(Boolean).join(' ')}
			{/snippet}

			{#snippet HeadingAfter()}
				<span data-text="annotation">{blockheadSourceTimestamp.latencyMs ?? ''}</span>
			{/snippet}
		</EntityView>
	{/snippet}
</EntitiesList>

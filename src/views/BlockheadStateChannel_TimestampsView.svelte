<!-- Generated from APP.ts. -->

<script lang="ts">
	// Types/constants
	import EntitiesList, { type EntityListViewProps } from '$/components/EntitiesList.svelte'
	import { EntityMetaKey } from '$/schema/$schema.ts'
	import { EntityType } from '$/schema/EntityType.ts'


	// State
	let {
		selection,
		title = 'State channel observations',
		open = $bindable(true),
		...EntitiesListProps
	}: EntityListViewProps<EntityType.BlockheadStateChannel_Timestamp> = $props()


	// Components
	import EntityView from '$/components/EntityView.svelte'
</script>


<EntitiesList
	{...EntitiesListProps}
	entityType={EntityType.BlockheadStateChannel_Timestamp}
	{title}
	bind:open
	resource={
		selection({
			fields: {
				timestampMs: true,
				status: true,
				source: true,
			},
		})
	}
>
	{#snippet Item({ item: blockheadStateChannelTimestamp })}
		{@const blockheadStateChannelTimestampSelector = blockheadStateChannelTimestamp[EntityMetaKey.Selector]}
		<EntityView
			entityType={EntityType.BlockheadStateChannel_Timestamp}
			entitySelector={blockheadStateChannelTimestampSelector}
		>
			{#snippet Title()}
				{blockheadStateChannelTimestampSelector.timestampMs}
			{/snippet}

			{#snippet Value()}
				{blockheadStateChannelTimestamp.status}
			{/snippet}

			{#snippet HeadingAfter()}
				<span data-text="annotation">{blockheadStateChannelTimestampSelector.source}</span>
			{/snippet}
		</EntityView>
	{/snippet}
</EntitiesList>

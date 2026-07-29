<!-- Generated from APP.ts. Do not edit by hand. -->

<script lang="ts">
	// Types/constants
	import EntitiesList, { type EntityListViewProps } from '$/components/EntitiesList.svelte'
	import { EntityMetaKey } from '$/schema/$schema.ts'
	import { EntityType } from '$/schema/EntityType.ts'


	// State
	let {
		selection,
		open = $bindable(true),
		id = 'GlobalYoutubeNetwork_Timestamps-list',
		...EntitiesListProps
	}: EntityListViewProps<EntityType._GlobalYoutubeNetwork_Timestamp> = $props()


	// Components
	import EntityView from '$/components/EntityView.svelte'
</script>


<EntitiesList
	{...EntitiesListProps}
	entityType={EntityType._GlobalYoutubeNetwork_Timestamp}
	{id}
	bind:open
	resource={
		selection({
			fields: {
				timestampMs: true,
				source: true,
			},
		})
	}
>
	{#snippet Item({ item: globalYoutubeNetworkTimestamp })}
		{@const globalYoutubeNetworkTimestampSelector = globalYoutubeNetworkTimestamp[EntityMetaKey.Selector]}
		<EntityView
			entityType={EntityType._GlobalYoutubeNetwork_Timestamp}
			entitySelector={globalYoutubeNetworkTimestampSelector}
		>
			{#snippet Title()}
				{globalYoutubeNetworkTimestampSelector.timestampMs}
			{/snippet}

			{#snippet HeadingAfter()}
				<span data-text="annotation">{globalYoutubeNetworkTimestampSelector.source}</span>
			{/snippet}
		</EntityView>
	{/snippet}
</EntitiesList>

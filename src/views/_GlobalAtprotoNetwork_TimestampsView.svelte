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
		id = 'GlobalAtprotoNetwork_Timestamps-list',
		...EntitiesListProps
	}: EntityListViewProps<EntityType._GlobalAtprotoNetwork_Timestamp> = $props()


	// Components
	import EntityView from '$/components/EntityView.svelte'
</script>


<EntitiesList
	{...EntitiesListProps}
	entityType={EntityType._GlobalAtprotoNetwork_Timestamp}
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
	{#snippet Item({ item: globalAtprotoNetworkTimestamp })}
		{@const globalAtprotoNetworkTimestampSelector = globalAtprotoNetworkTimestamp[EntityMetaKey.Selector]}
		<EntityView
			entityType={EntityType._GlobalAtprotoNetwork_Timestamp}
			entitySelector={globalAtprotoNetworkTimestampSelector}
		>
			{#snippet Title()}
				{globalAtprotoNetworkTimestampSelector.timestampMs}
			{/snippet}

			{#snippet HeadingAfter()}
				<span data-text="annotation">{globalAtprotoNetworkTimestampSelector.source}</span>
			{/snippet}
		</EntityView>
	{/snippet}
</EntitiesList>

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
		...EntitiesListProps
	}: EntityListViewProps<EntityType.AvailNetwork_Timestamp> = $props()


	// Components
	import EntityView from '$/components/EntityView.svelte'
</script>


<EntitiesList
	{...EntitiesListProps}
	entityType={EntityType.AvailNetwork_Timestamp}
	bind:open
	resource={
		selection({
			fields: {
				timestampMs: true,
				latestBlockNumber: true,
				source: true,
				health: true,
			},
		})
	}
>
	{#snippet Item({ item: availNetworkTimestamp })}
		{@const availNetworkTimestampSelector = availNetworkTimestamp[EntityMetaKey.Selector]}
		<EntityView
			entityType={EntityType.AvailNetwork_Timestamp}
			entitySelector={availNetworkTimestampSelector}
		>
			{#snippet Title()}
				{availNetworkTimestampSelector.timestampMs}
			{/snippet}

			{#snippet Value()}
				{availNetworkTimestamp.latestBlockNumber ?? ''}
			{/snippet}

			{#snippet HeadingAfter()}
				<span data-text="annotation">{[availNetworkTimestampSelector.source, (availNetworkTimestamp.health ?? '')].filter(Boolean).join(' ')}</span>
			{/snippet}
		</EntityView>
	{/snippet}
</EntitiesList>

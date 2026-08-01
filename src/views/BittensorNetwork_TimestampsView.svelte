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
	}: EntityListViewProps<EntityType.BittensorNetwork_Timestamp> = $props()


	// Components
	import EntityView from '$/components/EntityView.svelte'
</script>


<EntitiesList
	{...EntitiesListProps}
	entityType={EntityType.BittensorNetwork_Timestamp}
	bind:open
	resource={
		selection({
			fields: {
				timestampMs: true,
				finalizedBlockNumber: true,
				runtimeSpecName: true,
			},
		})
	}
>
	{#snippet Item({ item: bittensorNetworkTimestamp })}
		{@const bittensorNetworkTimestampSelector = bittensorNetworkTimestamp[EntityMetaKey.Selector]}
		<EntityView
			entityType={EntityType.BittensorNetwork_Timestamp}
			entitySelector={bittensorNetworkTimestampSelector}
		>
			{#snippet Title()}
				{bittensorNetworkTimestampSelector.timestampMs}
			{/snippet}

			{#snippet Value()}
				{bittensorNetworkTimestamp.finalizedBlockNumber ?? ''}
			{/snippet}

			{#snippet HeadingAfter()}
				<span data-text="annotation">{bittensorNetworkTimestamp.runtimeSpecName ?? ''}</span>
			{/snippet}
		</EntityView>
	{/snippet}
</EntitiesList>

<!-- Generated from APP.ts. Do not edit by hand. -->

<script lang="ts">
	// Types/constants
	import EntitiesList, { type EntityListViewProps } from '$/components/EntitiesList.svelte'
	import { EntityMetaKey } from '$/schema/$schema.ts'
	import { EntityType } from '$/schema/EntityType.ts'


	// State
	let {
		selection,
		title = 'dYdX chain network observations',
		open = $bindable(true),
		...EntitiesListProps
	}: EntityListViewProps<EntityType.DydxChainNetwork_Timestamp> = $props()


	// Components
	import EntityView from '$/components/EntityView.svelte'
</script>


<EntitiesList
	{...EntitiesListProps}
	entityType={EntityType.DydxChainNetwork_Timestamp}
	{title}
	bind:open
	resource={
		selection({
			fields: {
				timestampMs: true,
				health: true,
			},
		})
	}
>
	{#snippet Item({ item: dydxChainNetworkTimestamp })}
		{@const dydxChainNetworkTimestampSelector = dydxChainNetworkTimestamp[EntityMetaKey.Selector]}
		<EntityView
			entityType={EntityType.DydxChainNetwork_Timestamp}
			entitySelector={dydxChainNetworkTimestampSelector}
		>
			{#snippet Title()}
				{dydxChainNetworkTimestampSelector.timestampMs}
			{/snippet}

			{#snippet Value()}
				{dydxChainNetworkTimestamp.health ?? ''}
			{/snippet}
		</EntityView>
	{/snippet}
</EntitiesList>

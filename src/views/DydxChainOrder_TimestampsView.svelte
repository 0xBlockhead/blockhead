<!-- Generated from APP.ts. Do not edit by hand. -->

<script lang="ts">
	// Types/constants
	import EntitiesList, { type EntityListViewProps } from '$/components/EntitiesList.svelte'
	import { EntityMetaKey } from '$/schema/$schema.ts'
	import { EntityType } from '$/schema/EntityType.ts'


	// State
	let {
		selection,
		title = 'dYdX chain order observations',
		open = $bindable(true),
		...EntitiesListProps
	}: EntityListViewProps<EntityType.DydxChainOrder_Timestamp> = $props()


	// Components
	import EntityView from '$/components/EntityView.svelte'
</script>


<EntitiesList
	{...EntitiesListProps}
	entityType={EntityType.DydxChainOrder_Timestamp}
	{title}
	bind:open
	resource={
		selection({
			fields: {
				timestampMs: true,
				status: true,
			},
		})
	}
>
	{#snippet Item({ item: dydxChainOrderTimestamp })}
		{@const dydxChainOrderTimestampSelector = dydxChainOrderTimestamp[EntityMetaKey.Selector]}
		<EntityView
			entityType={EntityType.DydxChainOrder_Timestamp}
			entitySelector={dydxChainOrderTimestampSelector}
		>
			{#snippet Title()}
				{dydxChainOrderTimestampSelector.timestampMs}
			{/snippet}

			{#snippet Value()}
				{dydxChainOrderTimestamp.status ?? ''}
			{/snippet}
		</EntityView>
	{/snippet}
</EntitiesList>

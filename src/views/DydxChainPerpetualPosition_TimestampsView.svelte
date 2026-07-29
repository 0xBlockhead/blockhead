<!-- Generated from APP.ts. Do not edit by hand. -->

<script lang="ts">
	// Types/constants
	import EntitiesList, { type EntityListViewProps } from '$/components/EntitiesList.svelte'
	import { EntityMetaKey } from '$/schema/$schema.ts'
	import { EntityType } from '$/schema/EntityType.ts'


	// State
	let {
		selection,
		title = 'dYdX chain perpetual position observations',
		open = $bindable(true),
		...EntitiesListProps
	}: EntityListViewProps<EntityType.DydxChainPerpetualPosition_Timestamp> = $props()


	// Components
	import EntityView from '$/components/EntityView.svelte'
</script>


<EntitiesList
	{...EntitiesListProps}
	entityType={EntityType.DydxChainPerpetualPosition_Timestamp}
	{title}
	bind:open
	resource={
		selection({
			fields: {
				timestampMs: true,
				side: true,
			},
		})
	}
>
	{#snippet Item({ item: dydxChainPerpetualPositionTimestamp })}
		{@const dydxChainPerpetualPositionTimestampSelector = dydxChainPerpetualPositionTimestamp[EntityMetaKey.Selector]}
		<EntityView
			entityType={EntityType.DydxChainPerpetualPosition_Timestamp}
			entitySelector={dydxChainPerpetualPositionTimestampSelector}
		>
			{#snippet Title()}
				{dydxChainPerpetualPositionTimestampSelector.timestampMs}
			{/snippet}

			{#snippet Value()}
				{dydxChainPerpetualPositionTimestamp.side ?? ''}
			{/snippet}
		</EntityView>
	{/snippet}
</EntitiesList>

<!-- Generated from APP.ts. -->

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
	}: EntityListViewProps<EntityType.PendlePosition> = $props()


	// Components
	import EntityView from '$/components/EntityView.svelte'
</script>


<EntitiesList
	{...EntitiesListProps}
	entityType={EntityType.PendlePosition}
	bind:open
	resource={
		selection({
			fields: {
				$market: true,
				ptBalance: true,
				ytBalance: true,
				syBalance: true,
				lpBalance: true,
			},
		})
	}
>
	{#snippet Item({ item: pendlePosition })}
		<EntityView
			entityType={EntityType.PendlePosition}
			entitySelector={pendlePosition[EntityMetaKey.Selector]}
		>
			{#snippet Title()}
				{pendlePosition.$market.name || 'Pendle market'}
			{/snippet}

			{#snippet Value()}
				{[(pendlePosition.ptBalance ?? ''), (pendlePosition.ytBalance ?? ''), (pendlePosition.syBalance ?? ''), (pendlePosition.lpBalance ?? '')].filter(Boolean).join(' ')}
			{/snippet}
		</EntityView>
	{/snippet}
</EntitiesList>

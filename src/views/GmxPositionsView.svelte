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
	}: EntityListViewProps<EntityType.GmxPosition> = $props()


	// Components
	import EntityView from '$/components/EntityView.svelte'
</script>


<EntitiesList
	{...EntitiesListProps}
	entityType={EntityType.GmxPosition}
	bind:open
	resource={
		selection({
			fields: {
				indexName: true,
				poolName: true,
				sizeInUsd: true,
				pnl: true,
			},
		})
	}
>
	{#snippet Item({ item: gmxPosition })}
		<EntityView
			entityType={EntityType.GmxPosition}
			entitySelector={gmxPosition[EntityMetaKey.Selector]}
		>
			{#snippet Title()}
				{[(gmxPosition.indexName ?? ''), (gmxPosition.poolName ?? '')].filter(Boolean).join(' ') || 'GMX position'}
			{/snippet}

			{#snippet Value()}
				{[gmxPosition.sizeInUsd, (gmxPosition.pnl ?? '')].filter(Boolean).join(' ')}
			{/snippet}
		</EntityView>
	{/snippet}
</EntitiesList>

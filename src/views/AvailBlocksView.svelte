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
	}: EntityListViewProps<EntityType.AvailBlock> = $props()


	// Components
	import EntityView from '$/components/EntityView.svelte'
</script>


<EntitiesList
	{...EntitiesListProps}
	entityType={EntityType.AvailBlock}
	bind:open
	resource={
		selection({
			fields: {
				blockNumber: true,
				timestampMs: true,
				blockHash: true,
			},
		})
	}
>
	{#snippet Item({ item: availBlock })}
		{@const availBlockSelector = availBlock[EntityMetaKey.Selector]}
		<EntityView
			entityType={EntityType.AvailBlock}
			entitySelector={availBlockSelector}
		>
			{#snippet Title()}
				{availBlockSelector.blockNumber}
			{/snippet}

			{#snippet Value()}
				{availBlock.timestampMs ?? ''}
			{/snippet}
		</EntityView>
	{/snippet}
</EntitiesList>

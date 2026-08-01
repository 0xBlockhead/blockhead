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
	}: EntityListViewProps<EntityType.AvalanchePChainBlock> = $props()


	// Components
	import EntityView from '$/components/EntityView.svelte'
</script>


<EntitiesList
	{...EntitiesListProps}
	entityType={EntityType.AvalanchePChainBlock}
	bind:open
	resource={
		selection({
			fields: {
				height: true,
				timestampMs: true,
				blockId: true,
			},
		})
	}
>
	{#snippet Item({ item: avalanchePChainBlock })}
		{@const avalanchePChainBlockSelector = avalanchePChainBlock[EntityMetaKey.Selector]}
		<EntityView
			entityType={EntityType.AvalanchePChainBlock}
			entitySelector={avalanchePChainBlockSelector}
		>
			{#snippet Title()}
				{avalanchePChainBlockSelector.height}
			{/snippet}

			{#snippet Value()}
				{avalanchePChainBlock.timestampMs ?? ''}
			{/snippet}
		</EntityView>
	{/snippet}
</EntitiesList>

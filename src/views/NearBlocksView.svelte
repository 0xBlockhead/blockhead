<!-- Generated from APP.ts. -->

<script lang="ts">
	// Types/constants
	import EntitiesList, { type EntityListViewProps } from '$/components/EntitiesList.svelte'
	import { EntityMetaKey } from '$/schema/$schema.ts'
	import { EntityType } from '$/schema/EntityType.ts'
	import { Source } from '$/sources/Source.ts'


	// State
	let {
		selection,
		open = $bindable(true),
		...EntitiesListProps
	}: EntityListViewProps<EntityType.NearBlock> = $props()


	// Components
	import EntityView from '$/components/EntityView.svelte'
</script>


<EntitiesList
	{...EntitiesListProps}
	entityType={EntityType.NearBlock}
	bind:open
	resource={
		selection({
			sources: selection.sources ?? [
				Source.NearRpc_JsonRpc,
				Source.NearBlocks_Rest,
				Source.ThreeXpl_Rest,
			],
			fields: {
				height: true,
				hash: true,
				timestampMs: true,
			},
		})
	}
>
	{#snippet Item({ item: nearBlock })}
		{@const nearBlockSelector = nearBlock[EntityMetaKey.Selector]}
		<EntityView
			entityType={EntityType.NearBlock}
			entitySelector={nearBlockSelector}
		>
			{#snippet Title()}
				{nearBlockSelector.height}
			{/snippet}

			{#snippet Value()}
				{nearBlockSelector.hash}
			{/snippet}

			{#snippet HeadingAfter()}
				<span data-text="annotation">{nearBlock.timestampMs ?? ''}</span>
			{/snippet}
		</EntityView>
	{/snippet}
</EntitiesList>

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
	}: EntityListViewProps<EntityType.BittensorBlock> = $props()


	// Components
	import EntityView from '$/components/EntityView.svelte'
</script>


<EntitiesList
	{...EntitiesListProps}
	entityType={EntityType.BittensorBlock}
	bind:open
	resource={
		selection({
			fields: {
				blockNumber: true,
				hash: true,
				extrinsicCount: true,
			},
		})
	}
>
	{#snippet Item({ item: bittensorBlock })}
		{@const bittensorBlockSelector = bittensorBlock[EntityMetaKey.Selector]}
		<EntityView
			entityType={EntityType.BittensorBlock}
			entitySelector={bittensorBlockSelector}
		>
			{#snippet Title()}
				{bittensorBlockSelector.blockNumber}
			{/snippet}

			{#snippet Value()}
				{bittensorBlockSelector.hash}
			{/snippet}

			{#snippet HeadingAfter()}
				<span data-text="annotation">{bittensorBlock.extrinsicCount != null ? bittensorBlock.extrinsicCount + ' extrinsics' : ''}</span>
			{/snippet}
		</EntityView>
	{/snippet}
</EntitiesList>

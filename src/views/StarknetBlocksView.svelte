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
	}: EntityListViewProps<EntityType.StarknetBlock> = $props()


	// Components
	import EntityView from '$/components/EntityView.svelte'
</script>


<EntitiesList
	{...EntitiesListProps}
	entityType={EntityType.StarknetBlock}
	bind:open
	resource={
		selection({
			fields: {
				blockNumber: true,
				blockHash: true,
				status: true,
			},
		})
	}
>
	{#snippet Item({ item: starknetBlock })}
		{@const starknetBlockSelector = starknetBlock[EntityMetaKey.Selector]}
		<EntityView
			entityType={EntityType.StarknetBlock}
			entitySelector={starknetBlockSelector}
		>
			{#snippet Title()}
				{String(starknetBlockSelector.blockNumber) || 'starknet block'}
			{/snippet}

			{#snippet Value()}
				{starknetBlockSelector.blockHash}
			{/snippet}

			{#snippet HeadingAfter()}
				<span data-text="annotation">{(starknetBlock.status ?? '')}</span>
			{/snippet}
		</EntityView>
	{/snippet}
</EntitiesList>

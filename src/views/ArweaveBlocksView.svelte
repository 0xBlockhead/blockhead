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
	}: EntityListViewProps<EntityType.ArweaveBlock> = $props()


	// Components
	import EntityView from '$/components/EntityView.svelte'
</script>


<EntitiesList
	{...EntitiesListProps}
	entityType={EntityType.ArweaveBlock}
	bind:open
	resource={
		selection({
			fields: {
				height: true,
				timestampMs: true,
				indepHash: true,
			},
		})
	}
>
	{#snippet Item({ item: arweaveBlock })}
		{@const arweaveBlockSelector = arweaveBlock[EntityMetaKey.Selector]}
		<EntityView
			entityType={EntityType.ArweaveBlock}
			entitySelector={arweaveBlockSelector}
		>
			{#snippet Title()}
				{arweaveBlockSelector.height}
			{/snippet}

			{#snippet Value()}
				{arweaveBlock.timestampMs ?? ''}
			{/snippet}
		</EntityView>
	{/snippet}
</EntitiesList>

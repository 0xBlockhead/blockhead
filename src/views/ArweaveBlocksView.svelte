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
		<EntityView
			entityType={EntityType.ArweaveBlock}
			entitySelector={arweaveBlock[EntityMetaKey.Selector]}
		>
			{#snippet Title()}
				{arweaveBlock.height}
			{/snippet}

			{#snippet Value()}
				{arweaveBlock.timestampMs ?? ''}
			{/snippet}
		</EntityView>
	{/snippet}
</EntitiesList>

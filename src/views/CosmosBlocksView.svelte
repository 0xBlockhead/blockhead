<!-- Generated from APP.ts. -->

<script lang="ts">
	// Types/constants
	import EntitiesList, { type EntityListViewProps } from '$/components/EntitiesList.svelte'
	import { EntityMetaKey } from '$/schema/$schema.ts'
	import { EntityType } from '$/schema/EntityType.ts'


	// State
	let {
		selection,
		title = 'Blocks',
		open = $bindable(true),
		...EntitiesListProps
	}: EntityListViewProps<EntityType.CosmosBlock> = $props()


	// Components
	import EntityView from '$/components/EntityView.svelte'
</script>


<EntitiesList
	{...EntitiesListProps}
	entityType={EntityType.CosmosBlock}
	{title}
	bind:open
	resource={
		selection({
			fields: {
				height: true,
				hash: true,
				transactionCount: true,
			},
		})
	}
>
	{#snippet Item({ item: cosmosBlock })}
		<EntityView
			entityType={EntityType.CosmosBlock}
			entitySelector={cosmosBlock[EntityMetaKey.Selector]}
		>
			{#snippet Title()}
				{`Block #${cosmosBlock.height}`}
			{/snippet}

			{#snippet HeadingAfter()}
				<span data-text="annotation">{cosmosBlock.transactionCount ?? ''}</span>
			{/snippet}
		</EntityView>
	{/snippet}
</EntitiesList>

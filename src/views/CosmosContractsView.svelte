<!-- Generated from APP.ts. -->

<script lang="ts">
	// Types/constants
	import EntitiesList, { type EntityListViewProps } from '$/components/EntitiesList.svelte'
	import { EntityMetaKey } from '$/schema/$schema.ts'
	import { EntityType } from '$/schema/EntityType.ts'


	// State
	let {
		selection,
		title = 'Contracts',
		open = $bindable(true),
		...EntitiesListProps
	}: EntityListViewProps<EntityType.CosmosContract> = $props()


	// Components
	import EntityView from '$/components/EntityView.svelte'
</script>


<EntitiesList
	{...EntitiesListProps}
	entityType={EntityType.CosmosContract}
	{title}
	bind:open
	resource={
		selection({
			fields: {
				address: true,
				codeId: true,
			},
		})
	}
>
	{#snippet Item({ item: cosmosContract })}
		{@const cosmosContractSelector = cosmosContract[EntityMetaKey.Selector]}
		<EntityView
			entityType={EntityType.CosmosContract}
			entitySelector={cosmosContractSelector}
		>
			{#snippet Title()}
				{cosmosContractSelector.address || 'Cosmos contract'}
			{/snippet}

			{#snippet Value()}
				{cosmosContractSelector.address}
			{/snippet}

			{#snippet HeadingAfter()}
				<span data-text="annotation">{cosmosContract.codeId ?? ''}</span>
			{/snippet}
		</EntityView>
	{/snippet}
</EntitiesList>

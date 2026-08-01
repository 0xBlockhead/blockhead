<!-- Generated from APP.ts. -->

<script lang="ts">
	// Types/constants
	import EntitiesList, { type EntityListViewProps } from '$/components/EntitiesList.svelte'
	import { EntityMetaKey } from '$/schema/$schema.ts'
	import { EntityType } from '$/schema/EntityType.ts'


	// State
	let {
		selection,
		title = 'Modules',
		open = $bindable(true),
		...EntitiesListProps
	}: EntityListViewProps<EntityType.CosmosModule> = $props()


	// Components
	import EntityView from '$/components/EntityView.svelte'
</script>


<EntitiesList
	{...EntitiesListProps}
	entityType={EntityType.CosmosModule}
	{title}
	bind:open
	resource={
		selection({
			fields: {
				moduleName: true,
				$network: true,
			},
		})
	}
>
	{#snippet Item({ item: cosmosModule })}
		{@const cosmosModuleSelector = cosmosModule[EntityMetaKey.Selector]}
		<EntityView
			entityType={EntityType.CosmosModule}
			entitySelector={cosmosModuleSelector}
		>
			{#snippet Title()}
				{cosmosModuleSelector.moduleName || 'Cosmos module'}
			{/snippet}

			{#snippet Value()}
				{cosmosModuleSelector.moduleName}
			{/snippet}

			{#snippet HeadingAfter()}
				<span data-text="annotation">{cosmosModule.$network.name || (cosmosModuleSelector.$network.caip2 == null ? '' : `${cosmosModuleSelector.$network.caip2.namespace}:${cosmosModuleSelector.$network.caip2.reference}`) || 'Network'}</span>
			{/snippet}
		</EntityView>
	{/snippet}
</EntitiesList>

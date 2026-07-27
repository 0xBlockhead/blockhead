<!-- Generated from APP.ts. Do not edit by hand. -->

<script lang="ts">
	// Types/constants
	import EntitiesList, { type EntityListViewProps } from '$/components/EntitiesList.svelte'
	import { EntityMetaKey } from '$/schema/$schema.ts'
	import { EntityType } from '$/schema/EntityType.ts'


	// State
	let {
		selection,
		title = 'Messages',
		open = $bindable(true),
		...EntitiesListProps
	}: EntityListViewProps<EntityType.CosmosMessage> = $props()


	// Components
	import EntityView from '$/components/EntityView.svelte'
</script>


<EntitiesList
	{...EntitiesListProps}
	entityType={EntityType.CosmosMessage}
	{title}
	bind:open
	resource={
		selection({
			fields: {
				indexInTransaction: true,
				typeUrl: true,
			},
		})
	}
>
	{#snippet Item({ item: cosmosMessage })}
		{@const cosmosMessageSelector = cosmosMessage[EntityMetaKey.Selector]}
		<EntityView
			entityType={EntityType.CosmosMessage}
			entitySelector={cosmosMessageSelector}
		>
			{#snippet Title()}
				{(String(cosmosMessageSelector.indexInTransaction ?? '') ? 'Message #' + String(cosmosMessageSelector.indexInTransaction ?? '') : '') || 'Cosmos message'}
			{/snippet}

			{#snippet HeadingAfter()}
				<span data-text="annotation">{cosmosMessage.typeUrl}</span>
			{/snippet}
		</EntityView>
	{/snippet}
</EntitiesList>

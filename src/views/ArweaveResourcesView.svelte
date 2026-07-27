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
	}: EntityListViewProps<EntityType.ArweaveResource> = $props()


	// Components
	import EntityView from '$/components/EntityView.svelte'
</script>


<EntitiesList
	{...EntitiesListProps}
	entityType={EntityType.ArweaveResource}
	bind:open
	resource={
		selection({
			fields: {
				canonicalUri: true,
				contentPath: true,
				transactionId: true,
			},
		})
	}
>
	{#snippet Item({ item: arweaveResource })}
		{@const arweaveResourceSelector = arweaveResource[EntityMetaKey.Selector]}
		<EntityView
			entityType={EntityType.ArweaveResource}
			entitySelector={arweaveResourceSelector}
		>
			{#snippet Title()}
				{arweaveResource.canonicalUri || arweaveResourceSelector.transactionId || 'arweave resource'}
			{/snippet}

			{#snippet Value()}
				{arweaveResourceSelector.contentPath}
			{/snippet}
		</EntityView>
	{/snippet}
</EntitiesList>

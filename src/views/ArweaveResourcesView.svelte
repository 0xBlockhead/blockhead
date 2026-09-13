<!-- Generated from APP.ts. -->

<script lang="ts">
	// Types/constants
	import { resolve } from '$app/paths'
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
			href={
				arweaveResourceSelector.contentPath !== undefined ?
					resolve(
						'/(arweave)/arweave/resource/[transactionId=stringSegment]/(arweaveResource)/path/[...contentPath=stringSegment]',
						{
							transactionId: arweaveResourceSelector.transactionId,
							contentPath: arweaveResourceSelector.contentPath,
						}
					)
				:
					resolve(
						'/(arweave)/arweave/resource/[transactionId=stringSegment]',
						{
							transactionId: arweaveResourceSelector.transactionId,
						}
					)
			}
		>
			{#snippet Title()}
				{arweaveResource.canonicalUri || arweaveResourceSelector.transactionId || 'arweave resource'}
			{/snippet}

			{#snippet Value()}
				{arweaveResource.contentPath}
			{/snippet}
		</EntityView>
	{/snippet}
</EntitiesList>

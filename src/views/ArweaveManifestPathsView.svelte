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
	}: EntityListViewProps<EntityType.ArweaveManifestPath> = $props()


	// Components
	import EntityView from '$/components/EntityView.svelte'
</script>


<EntitiesList
	{...EntitiesListProps}
	entityType={EntityType.ArweaveManifestPath}
	bind:open
	resource={
		selection({
			...{
				fields: {
					path: true,
					targetTransactionId: true,
				},
			},
		})
	}
>
	{#snippet Item({ item: arweaveManifestPath })}
		{@const arweaveManifestPathSelector = arweaveManifestPath[EntityMetaKey.Selector]}
		{@const manifest = arweaveManifestPathSelector.$manifest}
		<EntityView
			entityType={EntityType.ArweaveManifestPath}
			entitySelector={arweaveManifestPathSelector}
			href={
				resolve(
					'/(arweave)/arweave/manifest-path/[transactionId=stringSegment]/[contentPath=stringSegment]/[path=stringSegment]',
					{
						transactionId: manifest.transactionId,
						contentPath: manifest.contentPath,
						path: arweaveManifestPathSelector.path,
					}
				)
			}
		>
			{#snippet Title()}
				{arweaveManifestPathSelector.path || 'Arweave manifest path'}
			{/snippet}

			{#snippet Value()}
				{arweaveManifestPath.targetTransactionId}
			{/snippet}
		</EntityView>
	{/snippet}
</EntitiesList>

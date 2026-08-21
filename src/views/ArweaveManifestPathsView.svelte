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
					$resource: {
						fields: {
							canonicalUri: true,
							contentPath: true,
						},
					},
				},
			},
		})
	}
>
	{#snippet Item({ item: arweaveManifestPath })}
		{@const arweaveManifestPathSelector = arweaveManifestPath[EntityMetaKey.Selector]}
		<EntityView
			entityType={EntityType.ArweaveManifestPath}
			entitySelector={arweaveManifestPathSelector}
			href={
				resolve(
					'/(arweave)/arweave/resource/[transactionId=stringSegment]/(arweaveResource)/manifest-path/[...path=stringSegment]',
					{
						transactionId: arweaveManifestPathSelector.$manifest.transactionId,
						path: arweaveManifestPathSelector.path,
					}
				)
			}
		>
			{#snippet Title()}
				{arweaveManifestPathSelector.path || 'Arweave manifest path'}
			{/snippet}

			{#snippet Value()}
				{arweaveManifestPath.$resource.canonicalUri || arweaveManifestPath.$resource.transactionId || 'arweave resource'}
			{/snippet}
		</EntityView>
	{/snippet}
</EntitiesList>

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
	}: EntityListViewProps<EntityType.BlockheadLocalMediaIngest> = $props()


	// Components
	import EntityView from '$/components/EntityView.svelte'
</script>


<EntitiesList
	{...EntitiesListProps}
	entityType={EntityType.BlockheadLocalMediaIngest}
	bind:open
	resource={
		selection({
			fields: {
				fileName: true,
				mimeType: true,
				ingestId: true,
				createdAt: true,
			},
		})
	}
>
	{#snippet Item({ item: blockheadLocalMediaIngest })}
		{@const blockheadLocalMediaIngestSelector = blockheadLocalMediaIngest[EntityMetaKey.Selector]}
		<EntityView
			entityType={EntityType.BlockheadLocalMediaIngest}
			entitySelector={blockheadLocalMediaIngestSelector}
		>
			{#snippet Title()}
				{(blockheadLocalMediaIngest.fileName ?? '') || blockheadLocalMediaIngestSelector.ingestId || 'local media ingest'}
			{/snippet}

			{#snippet Value()}
				{(blockheadLocalMediaIngest.mimeType ?? '')}
			{/snippet}

			{#snippet HeadingAfter()}
				<span data-text="annotation">{String(blockheadLocalMediaIngest.createdAt)}</span>
			{/snippet}
		</EntityView>
	{/snippet}
</EntitiesList>

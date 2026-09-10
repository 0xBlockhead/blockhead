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
	}: EntityListViewProps<EntityType.BlockheadLocalMediaIngest_Timestamp> = $props()


	// Components
	import EntityView from '$/components/EntityView.svelte'
</script>


<EntitiesList
	{...EntitiesListProps}
	entityType={EntityType.BlockheadLocalMediaIngest_Timestamp}
	bind:open
	resource={
		selection({
			fields: {
				status: true,
				timestampMs: true,
				source: true,
			},
		})
	}
>
	{#snippet Item({ item: blockheadLocalMediaIngestTimestamp })}
		{@const blockheadLocalMediaIngestTimestampSelector = blockheadLocalMediaIngestTimestamp[EntityMetaKey.Selector]}
		<EntityView
			entityType={EntityType.BlockheadLocalMediaIngest_Timestamp}
			entitySelector={blockheadLocalMediaIngestTimestampSelector}
			href={
				resolve(
					'/~/media/ingest/[ingestId=stringSegment]/(blockheadLocalMediaIngest)/observations/[timestampMs=nonNegativeInteger]/[source=stringSegment]',
					{
						ingestId: blockheadLocalMediaIngestTimestampSelector.$ingest.ingestId,
						timestampMs: String(blockheadLocalMediaIngestTimestampSelector.timestampMs),
						source: blockheadLocalMediaIngestTimestampSelector.source,
					}
				)
			}
		>
			{#snippet Title()}
				{blockheadLocalMediaIngestTimestamp.status || 'local media ingest timestamp'}
			{/snippet}

			{#snippet Value()}
				{blockheadLocalMediaIngestTimestampSelector.timestampMs}
			{/snippet}

			{#snippet HeadingAfter()}
				<span data-text="annotation">{blockheadLocalMediaIngestTimestampSelector.source}</span>
			{/snippet}
		</EntityView>
	{/snippet}
</EntitiesList>

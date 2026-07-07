<!-- Generated from APP.ts. Do not edit by hand. -->

<script lang="ts">
	// Types/constants
	import type { ComponentProps } from 'svelte'
	import type { SubscribeEntityReferenceResult } from '$/client/$client.svelte.ts'
	import type { EntityProxyEntitiesResource } from '$/client/$proxy.svelte.ts'
	import type { WithRest } from '$/typescript/WithRest.ts'
	import { EntityMetaKey } from '$/schema/$schema.ts'
	import { EntityType } from '$/schema/EntityType.ts'
	import { schema } from '$/schema/index.ts'


	// Context
	import { select } from '$/routes/+layout.svelte'


	// State
	let {
		selection,
		title = 'Blockhead Radicle node inventory observations',
		typeAnnotationParagraphs = [],
		placeholderText,
		emptyText = undefined,
		open = $bindable(true),
		collapsible = true,
		showTypeAnnotation = true,
		id = 'BlockheadRadicleNodeInventory_Timestamps-list',
		...EntitiesListProps
	}: WithRest<
		{
			selection: EntityProxyEntitiesResource<typeof schema, EntityType.BlockheadRadicleNodeInventory_Timestamp>
			title?: string
			typeAnnotationParagraphs?: string[]
			placeholderText?: string
			emptyText?: string
			open?: boolean
			collapsible?: boolean
			showTypeAnnotation?: boolean
			id?: string
		},
		Pick<
			ComponentProps<typeof EntitiesList>,
			| 'href'
			| 'CollapsibleProps'
		>
	> = $props()


	// Components
	import EntitiesList from '$/components/EntitiesList.svelte'
	import ResourceBoundary from '$/components/ResourceBoundary.svelte'
	import { EntityLayout } from '$/components/EntityView.svelte'
	import BlockheadRadicleNodeInventory_TimestampView from '$/views/BlockheadRadicleNodeInventory_TimestampView.svelte'
</script>


{#snippet TypeAnnotationParagraphs()}
	{#each typeAnnotationParagraphs as paragraph (paragraph)}
		<p>{paragraph}</p>
	{/each}
{/snippet}

{#if open}
	<ResourceBoundary
		resource={
			selection({
				fields: {
					status: true,
					timestampMs: true,
					repositoryCount: true,
				},
			})
		}
		{placeholderText}
	>
		{#snippet Pending()}
			<EntitiesList
				{...EntitiesListProps}
				entityType={EntityType.BlockheadRadicleNodeInventory_Timestamp}
				{id}
				{title}
				bind:open
				{collapsible}
				{showTypeAnnotation}
				TypeAnnotationTooltip={typeAnnotationParagraphs.length > 0 ? TypeAnnotationParagraphs : undefined}
				placeholderText={placeholderText}
			/>
		{/snippet}

		{#snippet children(blockheadRadicleNodeInventoryTimestamps)}
			{@const uniqueBlockheadRadicleNodeInventoryTimestamps = [...new Map(blockheadRadicleNodeInventoryTimestamps.values.map((blockheadRadicleNodeInventoryTimestamp) => [blockheadRadicleNodeInventoryTimestamp[EntityMetaKey.SelectorKey], blockheadRadicleNodeInventoryTimestamp])).values()]}
			<EntitiesList
				{...EntitiesListProps}
				entityType={EntityType.BlockheadRadicleNodeInventory_Timestamp}
				{id}
				{title}
				bind:open
				{collapsible}
				{showTypeAnnotation}
				TypeAnnotationTooltip={typeAnnotationParagraphs.length > 0 ? TypeAnnotationParagraphs : undefined}
				totalCount={blockheadRadicleNodeInventoryTimestamps.totalCount}
				getKey={(blockheadRadicleNodeInventoryTimestamp) => blockheadRadicleNodeInventoryTimestamp[EntityMetaKey.SelectorKey]}
				items={uniqueBlockheadRadicleNodeInventoryTimestamps}
			>
				{#snippet Empty()}
					{#if emptyText != null}
						<p data-text="muted">{emptyText}</p>
					{:else}
						<p data-text="muted">No Blockhead radicle node inventory observations yet.</p>
					{/if}
				{/snippet}

				{#snippet Item({ item: blockheadRadicleNodeInventoryTimestamp }: { item: SubscribeEntityReferenceResult<typeof schema, EntityType.BlockheadRadicleNodeInventory_Timestamp> })}
					{@const blockheadRadicleNodeInventoryTimestampFields = { ...blockheadRadicleNodeInventoryTimestamp[EntityMetaKey.Selector], ...blockheadRadicleNodeInventoryTimestamp }}
					<BlockheadRadicleNodeInventory_TimestampView
						selection={select(EntityType.BlockheadRadicleNodeInventory_Timestamp, blockheadRadicleNodeInventoryTimestamp[EntityMetaKey.Selector], { sources: selection.sources })}
						prefetched={blockheadRadicleNodeInventoryTimestampFields}
						layout={EntityLayout.Summary}
						open={false}
					/>
				{/snippet}
			</EntitiesList>
		{/snippet}
	</ResourceBoundary>
{:else}
	<EntitiesList
		{...EntitiesListProps}
		entityType={EntityType.BlockheadRadicleNodeInventory_Timestamp}
		{id}
		{title}
		bind:open
		{collapsible}
		{showTypeAnnotation}
		TypeAnnotationTooltip={typeAnnotationParagraphs.length > 0 ? TypeAnnotationParagraphs : undefined}
	/>
{/if}

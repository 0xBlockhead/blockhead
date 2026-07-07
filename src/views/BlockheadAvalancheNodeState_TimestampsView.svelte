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
		title = 'Blockhead Avalanche node state observations',
		typeAnnotationParagraphs = [],
		placeholderText,
		emptyText = undefined,
		open = $bindable(true),
		collapsible = true,
		showTypeAnnotation = true,
		id = 'BlockheadAvalancheNodeState_Timestamps-list',
		...EntitiesListProps
	}: WithRest<
		{
			selection: EntityProxyEntitiesResource<typeof schema, EntityType.BlockheadAvalancheNodeState_Timestamp>
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
	import BlockheadAvalancheNodeState_TimestampView from '$/views/BlockheadAvalancheNodeState_TimestampView.svelte'
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
					timestampMs: true,
					nodeVersion: true,
					networkName: true,
					connectedPeerCount: true,
				},
			})
		}
		{placeholderText}
	>
		{#snippet Pending()}
			<EntitiesList
				{...EntitiesListProps}
				entityType={EntityType.BlockheadAvalancheNodeState_Timestamp}
				{id}
				{title}
				bind:open
				{collapsible}
				{showTypeAnnotation}
				TypeAnnotationTooltip={typeAnnotationParagraphs.length > 0 ? TypeAnnotationParagraphs : undefined}
				placeholderText={placeholderText}
			/>
		{/snippet}

		{#snippet children(blockheadAvalancheNodeStateTimestamps)}
			{@const uniqueBlockheadAvalancheNodeStateTimestamps = [...new Map(blockheadAvalancheNodeStateTimestamps.values.map((blockheadAvalancheNodeStateTimestamp) => [blockheadAvalancheNodeStateTimestamp[EntityMetaKey.SelectorKey], blockheadAvalancheNodeStateTimestamp])).values()]}
			<EntitiesList
				{...EntitiesListProps}
				entityType={EntityType.BlockheadAvalancheNodeState_Timestamp}
				{id}
				{title}
				bind:open
				{collapsible}
				{showTypeAnnotation}
				TypeAnnotationTooltip={typeAnnotationParagraphs.length > 0 ? TypeAnnotationParagraphs : undefined}
				totalCount={blockheadAvalancheNodeStateTimestamps.totalCount}
				getKey={(blockheadAvalancheNodeStateTimestamp) => blockheadAvalancheNodeStateTimestamp[EntityMetaKey.SelectorKey]}
				items={uniqueBlockheadAvalancheNodeStateTimestamps}
			>
				{#snippet Empty()}
					{#if emptyText != null}
						<p data-text="muted">{emptyText}</p>
					{:else}
						<p data-text="muted">No Blockhead avalanche node state observations yet.</p>
					{/if}
				{/snippet}

				{#snippet Item({ item: blockheadAvalancheNodeStateTimestamp }: { item: SubscribeEntityReferenceResult<typeof schema, EntityType.BlockheadAvalancheNodeState_Timestamp> })}
					{@const blockheadAvalancheNodeStateTimestampFields = { ...blockheadAvalancheNodeStateTimestamp[EntityMetaKey.Selector], ...blockheadAvalancheNodeStateTimestamp }}
					<BlockheadAvalancheNodeState_TimestampView
						selection={select(EntityType.BlockheadAvalancheNodeState_Timestamp, blockheadAvalancheNodeStateTimestamp[EntityMetaKey.Selector], { sources: selection.sources })}
						prefetched={blockheadAvalancheNodeStateTimestampFields}
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
		entityType={EntityType.BlockheadAvalancheNodeState_Timestamp}
		{id}
		{title}
		bind:open
		{collapsible}
		{showTypeAnnotation}
		TypeAnnotationTooltip={typeAnnotationParagraphs.length > 0 ? TypeAnnotationParagraphs : undefined}
	/>
{/if}

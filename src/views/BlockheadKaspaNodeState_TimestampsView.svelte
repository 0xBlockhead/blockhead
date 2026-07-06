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
		title = 'Blockhead Kaspa node state observations',
		typeAnnotationParagraphs = [],
		placeholderText,
		emptyText = undefined,
		open = $bindable(true),
		collapsible = true,
		showTypeAnnotation = true,
		id = 'BlockheadKaspaNodeState_Timestamps-list',
		...EntitiesListProps
	}: WithRest<
		{
			selection: EntityProxyEntitiesResource<typeof schema, EntityType.BlockheadKaspaNodeState_Timestamp>
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
	import BlockheadKaspaNodeState_TimestampView from '$/views/BlockheadKaspaNodeState_TimestampView.svelte'
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
					isSynced: true,
					hasUtxoIndex: true,
					peerCount: true,
				},
			})
		}
		{placeholderText}
	>
		{#snippet Pending()}
			<EntitiesList
				{...EntitiesListProps}
				entityType={EntityType.BlockheadKaspaNodeState_Timestamp}
				{id}
				{title}
				bind:open
				{collapsible}
				{showTypeAnnotation}
				TypeAnnotationTooltip={typeAnnotationParagraphs.length > 0 ? TypeAnnotationParagraphs : undefined}
				placeholderText={placeholderText}
			/>
		{/snippet}

		{#snippet children(blockheadKaspaNodeStateTimestamps)}
			{@const uniqueBlockheadKaspaNodeStateTimestamps = [...new Map(blockheadKaspaNodeStateTimestamps.values.map((blockheadKaspaNodeStateTimestamp) => [blockheadKaspaNodeStateTimestamp[EntityMetaKey.SelectorKey], blockheadKaspaNodeStateTimestamp])).values()]}
			<EntitiesList
				{...EntitiesListProps}
				entityType={EntityType.BlockheadKaspaNodeState_Timestamp}
				{id}
				{title}
				bind:open
				{collapsible}
				{showTypeAnnotation}
				TypeAnnotationTooltip={typeAnnotationParagraphs.length > 0 ? TypeAnnotationParagraphs : undefined}
				totalCount={blockheadKaspaNodeStateTimestamps.totalCount}
				getKey={(blockheadKaspaNodeStateTimestamp) => blockheadKaspaNodeStateTimestamp[EntityMetaKey.SelectorKey]}
				items={uniqueBlockheadKaspaNodeStateTimestamps}
			>
				{#snippet Empty()}
					{#if emptyText != null}
						<p data-text="muted">{emptyText}</p>
					{:else}
						<p data-text="muted">No Blockhead kaspa node state observations yet.</p>
					{/if}
				{/snippet}

				{#snippet Item({ item: blockheadKaspaNodeStateTimestamp }: { item: SubscribeEntityReferenceResult<typeof schema, EntityType.BlockheadKaspaNodeState_Timestamp> })}
					{@const blockheadKaspaNodeStateTimestampFields = { ...blockheadKaspaNodeStateTimestamp[EntityMetaKey.Selector], ...blockheadKaspaNodeStateTimestamp }}
					<BlockheadKaspaNodeState_TimestampView
						selection={select(EntityType.BlockheadKaspaNodeState_Timestamp, blockheadKaspaNodeStateTimestamp[EntityMetaKey.Selector])}
						prefetched={blockheadKaspaNodeStateTimestampFields}
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
		entityType={EntityType.BlockheadKaspaNodeState_Timestamp}
		{id}
		{title}
		bind:open
		{collapsible}
		{showTypeAnnotation}
		TypeAnnotationTooltip={typeAnnotationParagraphs.length > 0 ? TypeAnnotationParagraphs : undefined}
	/>
{/if}

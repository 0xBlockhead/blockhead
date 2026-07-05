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
		title = 'Blockhead Logos blockchain node state observations',
		typeAnnotationParagraphs = [],
		placeholderText,
		emptyText = undefined,
		open = $bindable(true),
		collapsible = true,
		showTypeAnnotation = true,
		id = 'BlockheadLogosBlockchainNodeState_Timestamps-list',
		...EntitiesListProps
	}: WithRest<
		{
			selection: EntityProxyEntitiesResource<typeof schema, EntityType.BlockheadLogosBlockchainNodeState_Timestamp>
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
	import BlockheadLogosBlockchainNodeState_TimestampView from '$/views/BlockheadLogosBlockchainNodeState_TimestampView.svelte'
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
					peerCount: true,
					source: true,
				},
			})
		}
		{placeholderText}
	>
		{#snippet children(blockheadLogosBlockchainNodeStateTimestamps)}
			{@const uniqueBlockheadLogosBlockchainNodeStateTimestamps = [...new Map(blockheadLogosBlockchainNodeStateTimestamps.values.map((blockheadLogosBlockchainNodeStateTimestamp) => [blockheadLogosBlockchainNodeStateTimestamp[EntityMetaKey.SelectorKey], blockheadLogosBlockchainNodeStateTimestamp])).values()]}
			<EntitiesList
				{...EntitiesListProps}
				entityType={EntityType.BlockheadLogosBlockchainNodeState_Timestamp}
				{id}
				{title}
				bind:open
				{collapsible}
				{showTypeAnnotation}
				TypeAnnotationTooltip={typeAnnotationParagraphs.length > 0 ? TypeAnnotationParagraphs : undefined}
				totalCount={blockheadLogosBlockchainNodeStateTimestamps.totalCount}
				getKey={(blockheadLogosBlockchainNodeStateTimestamp) => blockheadLogosBlockchainNodeStateTimestamp[EntityMetaKey.SelectorKey]}
				items={uniqueBlockheadLogosBlockchainNodeStateTimestamps}
			>
				{#snippet Empty()}
					{#if emptyText != null}
						<p data-text="muted">{emptyText}</p>
					{:else}
						<p data-text="muted">No Blockhead Logos blockchain node state observations yet.</p>
					{/if}
				{/snippet}

				{#snippet Item({ item: blockheadLogosBlockchainNodeStateTimestamp }: { item: SubscribeEntityReferenceResult<typeof schema, EntityType.BlockheadLogosBlockchainNodeState_Timestamp> })}
					{@const blockheadLogosBlockchainNodeStateTimestampFields = { ...blockheadLogosBlockchainNodeStateTimestamp[EntityMetaKey.Selector], ...blockheadLogosBlockchainNodeStateTimestamp }}
					<BlockheadLogosBlockchainNodeState_TimestampView
						selection={select(EntityType.BlockheadLogosBlockchainNodeState_Timestamp, blockheadLogosBlockchainNodeStateTimestamp[EntityMetaKey.Selector])}
						prefetched={blockheadLogosBlockchainNodeStateTimestampFields}
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
		entityType={EntityType.BlockheadLogosBlockchainNodeState_Timestamp}
		{id}
		{title}
		bind:open
		{collapsible}
		{showTypeAnnotation}
		TypeAnnotationTooltip={typeAnnotationParagraphs.length > 0 ? TypeAnnotationParagraphs : undefined}
	/>
{/if}

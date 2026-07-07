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
		title = 'Blockhead Monero subaddress state observations',
		typeAnnotationParagraphs = [],
		placeholderText,
		emptyText = undefined,
		open = $bindable(true),
		collapsible = true,
		showTypeAnnotation = true,
		id = 'BlockheadMoneroSubaddressState_Timestamps-list',
		...EntitiesListProps
	}: WithRest<
		{
			selection: EntityProxyEntitiesResource<typeof schema, EntityType.BlockheadMoneroSubaddressState_Timestamp>
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
	import BlockheadMoneroSubaddressState_TimestampView from '$/views/BlockheadMoneroSubaddressState_TimestampView.svelte'
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
					balanceAtomicUnits: true,
					used: true,
				},
			})
		}
		{placeholderText}
	>
		{#snippet Pending()}
			<EntitiesList
				{...EntitiesListProps}
				entityType={EntityType.BlockheadMoneroSubaddressState_Timestamp}
				{id}
				{title}
				bind:open
				{collapsible}
				{showTypeAnnotation}
				TypeAnnotationTooltip={typeAnnotationParagraphs.length > 0 ? TypeAnnotationParagraphs : undefined}
				placeholderText={placeholderText}
			/>
		{/snippet}

		{#snippet children(blockheadMoneroSubaddressStateTimestamps)}
			{@const uniqueBlockheadMoneroSubaddressStateTimestamps = [...new Map(blockheadMoneroSubaddressStateTimestamps.values.map((blockheadMoneroSubaddressStateTimestamp) => [blockheadMoneroSubaddressStateTimestamp[EntityMetaKey.SelectorKey], blockheadMoneroSubaddressStateTimestamp])).values()]}
			<EntitiesList
				{...EntitiesListProps}
				entityType={EntityType.BlockheadMoneroSubaddressState_Timestamp}
				{id}
				{title}
				bind:open
				{collapsible}
				{showTypeAnnotation}
				TypeAnnotationTooltip={typeAnnotationParagraphs.length > 0 ? TypeAnnotationParagraphs : undefined}
				totalCount={blockheadMoneroSubaddressStateTimestamps.totalCount}
				getKey={(blockheadMoneroSubaddressStateTimestamp) => blockheadMoneroSubaddressStateTimestamp[EntityMetaKey.SelectorKey]}
				items={uniqueBlockheadMoneroSubaddressStateTimestamps}
			>
				{#snippet Empty()}
					{#if emptyText != null}
						<p data-text="muted">{emptyText}</p>
					{:else}
						<p data-text="muted">No Blockhead monero subaddress state observations yet.</p>
					{/if}
				{/snippet}

				{#snippet Item({ item: blockheadMoneroSubaddressStateTimestamp }: { item: SubscribeEntityReferenceResult<typeof schema, EntityType.BlockheadMoneroSubaddressState_Timestamp> })}
					{@const blockheadMoneroSubaddressStateTimestampFields = { ...blockheadMoneroSubaddressStateTimestamp[EntityMetaKey.Selector], ...blockheadMoneroSubaddressStateTimestamp }}
					<BlockheadMoneroSubaddressState_TimestampView
						selection={select(EntityType.BlockheadMoneroSubaddressState_Timestamp, blockheadMoneroSubaddressStateTimestamp[EntityMetaKey.Selector], { sources: selection.sources })}
						prefetched={blockheadMoneroSubaddressStateTimestampFields}
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
		entityType={EntityType.BlockheadMoneroSubaddressState_Timestamp}
		{id}
		{title}
		bind:open
		{collapsible}
		{showTypeAnnotation}
		TypeAnnotationTooltip={typeAnnotationParagraphs.length > 0 ? TypeAnnotationParagraphs : undefined}
	/>
{/if}

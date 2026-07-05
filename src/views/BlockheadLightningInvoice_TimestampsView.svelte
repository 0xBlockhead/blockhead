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
		title = 'Lightning invoice observations',
		typeAnnotationParagraphs = [],
		placeholderText,
		emptyText = undefined,
		open = $bindable(true),
		collapsible = true,
		showTypeAnnotation = true,
		id = 'BlockheadLightningInvoice_Timestamps-list',
		...EntitiesListProps
	}: WithRest<
		{
			selection: EntityProxyEntitiesResource<typeof schema, EntityType.BlockheadLightningInvoice_Timestamp>
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
	import BlockheadLightningInvoice_TimestampView from '$/views/BlockheadLightningInvoice_TimestampView.svelte'
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
					state: true,
					amountPaidMsat: true,
				},
			})
		}
		{placeholderText}
	>
		{#snippet children(blockheadLightningInvoiceTimestamps)}
			{@const uniqueBlockheadLightningInvoiceTimestamps = [...new Map(blockheadLightningInvoiceTimestamps.values.map((blockheadLightningInvoiceTimestamp) => [blockheadLightningInvoiceTimestamp[EntityMetaKey.SelectorKey], blockheadLightningInvoiceTimestamp])).values()]}
			<EntitiesList
				{...EntitiesListProps}
				entityType={EntityType.BlockheadLightningInvoice_Timestamp}
				{id}
				{title}
				bind:open
				{collapsible}
				{showTypeAnnotation}
				TypeAnnotationTooltip={typeAnnotationParagraphs.length > 0 ? TypeAnnotationParagraphs : undefined}
				totalCount={blockheadLightningInvoiceTimestamps.totalCount}
				getKey={(blockheadLightningInvoiceTimestamp) => blockheadLightningInvoiceTimestamp[EntityMetaKey.SelectorKey]}
				items={uniqueBlockheadLightningInvoiceTimestamps}
			>
				{#snippet Empty()}
					{#if emptyText != null}
						<p data-text="muted">{emptyText}</p>
					{:else}
						<p data-text="muted">No Lightning invoice observations yet.</p>
					{/if}
				{/snippet}

				{#snippet Item({ item: blockheadLightningInvoiceTimestamp }: { item: SubscribeEntityReferenceResult<typeof schema, EntityType.BlockheadLightningInvoice_Timestamp> })}
					{@const blockheadLightningInvoiceTimestampFields = { ...blockheadLightningInvoiceTimestamp[EntityMetaKey.Selector], ...blockheadLightningInvoiceTimestamp }}
					<BlockheadLightningInvoice_TimestampView
						selection={select(EntityType.BlockheadLightningInvoice_Timestamp, blockheadLightningInvoiceTimestamp[EntityMetaKey.Selector])}
						prefetched={blockheadLightningInvoiceTimestampFields}
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
		entityType={EntityType.BlockheadLightningInvoice_Timestamp}
		{id}
		{title}
		bind:open
		{collapsible}
		{showTypeAnnotation}
		TypeAnnotationTooltip={typeAnnotationParagraphs.length > 0 ? TypeAnnotationParagraphs : undefined}
	/>
{/if}
